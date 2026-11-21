import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  INITIAL_DEMO_MEDICINES,
  INITIAL_SAMPLE_RX_DRAFTS,
} from '../data/demoCatalogue';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { getFefoActiveBatch } from '../lib/inventoryUtils';
import {
  EXPIRY_PATTERN,
  ID_PATTERN,
  sanitizeId,
  SCHEMA_LIMITS,
  validateBatchFields,
  validateProfileFields,
  validateRxDraftFields,
} from '../lib/validation';
import type {
  DemoCartItem,
  DemoCity,
  DemoMedicine,
  DemoRxDraft,
  MedicineCategory,
  MedicineSchedule,
  RxSampleType,
  UserProfile,
} from '../types/pharmacy';

const GUEST_CART_STORAGE_KEY = 'medikart_guest_demo_cart_v1';

function sanitizeGuestCartItem(raw: unknown): DemoCartItem | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const item = raw as Record<string, unknown>;
  const skuId = typeof item.skuId === 'string' ? item.skuId.trim() : '';
  const brandName =
    typeof item.brandName === 'string' ? item.brandName.trim() : '';
  const genericComposition =
    typeof item.genericComposition === 'string'
      ? item.genericComposition.trim()
      : '';
  const batchNumber =
    typeof item.batchNumber === 'string' ? item.batchNumber.trim() : '';
  const expiryMonthYear =
    typeof item.expiryMonthYear === 'string'
      ? item.expiryMonthYear.trim()
      : '';
  const mrpInr = Number(item.mrpInr);
  const quantity = Number(item.quantity);

  if (
    !skuId ||
    skuId.length > 64 ||
    !ID_PATTERN.test(skuId) ||
    !brandName ||
    brandName.length > SCHEMA_LIMITS.brandNameMax ||
    !genericComposition ||
    genericComposition.length > SCHEMA_LIMITS.genericCompositionMax ||
    !batchNumber ||
    batchNumber.length > SCHEMA_LIMITS.batchNumberMax ||
    !ID_PATTERN.test(batchNumber) ||
    !EXPIRY_PATTERN.test(expiryMonthYear) ||
    !Number.isFinite(mrpInr) ||
    mrpInr <= 0 ||
    mrpInr > SCHEMA_LIMITS.maxMrpInr ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > SCHEMA_LIMITS.maxCartQuantity
  ) {
    return null;
  }

  const rawImageUrl =
    typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '';
  const imageUrl =
    rawImageUrl &&
    rawImageUrl.length <= 512 &&
    (rawImageUrl.startsWith('/') || rawImageUrl.startsWith('https://'))
      ? rawImageUrl
      : INITIAL_DEMO_MEDICINES.find((m) => m.skuId === skuId)?.imageUrl;

  return {
    skuId,
    brandName,
    genericComposition,
    batchNumber,
    expiryMonthYear,
    mrpInr,
    quantity,
    ...(imageUrl ? { imageUrl } : {}),
  };
}

function loadStoredGuestCart(): DemoCartItem[] {
  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeGuestCartItem)
      .filter((item): item is DemoCartItem => item !== null)
      .slice(0, 50);
  } catch {
    return [];
  }
}

function persistGuestCart(items: DemoCartItem[]): void {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        GUEST_CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    }
  } catch {
    // Ignore storage quota or private-browsing errors
  }
}

interface StoreContextValue {
  // Navigation & Global Demo City
  selectedCity: DemoCity;
  setSelectedCity: (city: DemoCity) => void;

  // Auth & Profile
  firebaseUser: User | null;
  authReady: boolean;
  userProfile: UserProfile | null;
  profileLoading: boolean;
  isVerifiedAdmin: boolean;
  adminSandboxActive: boolean;
  setAdminSandboxActive: (active: boolean) => void;
  registerCustomer: (input: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    city: DemoCity;
    addressLine: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  loginCustomer: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  loginStaffAdmin: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateCustomerProfile: (input: {
    fullName: string;
    phone: string;
    city: DemoCity;
    addressLine: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  sendPasswordReset: (
    email: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  sendCustomerVerificationEmail: () => Promise<{
    ok: boolean;
    error?: string;
  }>;
  refreshEmailVerification: () => Promise<{
    verified: boolean;
    error?: string;
  }>;
  logoutUser: () => Promise<void>;

  // Catalogue & Cart
  catalogueMedicines: DemoMedicine[];
  cartItems: DemoCartItem[];
  cartCount: number;
  addToDemoCart: (medicine: DemoMedicine) => { ok: boolean; message: string };
  updateCartQuantity: (skuId: string, delta: number) => Promise<void>;
  removeCartItem: (skuId: string) => Promise<void>;

  // Demo Rx Drafts (non-PHI metadata only)
  rxDrafts: DemoRxDraft[];
  saveSampleRxDraft: (input: {
    title: string;
    sampleType: RxSampleType;
    note: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  deleteSampleRxDraft: (draftId: string) => Promise<void>;

  // Admin Inventory (strict RBAC or Local Sandbox)
  adminInventory: DemoMedicine[];
  adminAdjustBatchStock: (
    skuId: string,
    batchId: string,
    delta: number,
  ) => Promise<void>;
  adminToggleQuarantine: (skuId: string, batchId: string) => Promise<void>;
  adminAddBatch: (
    skuId: string,
    input: { batchNumber: string; expiryMonthYear: string; quantity: number },
  ) => Promise<{ ok: boolean; error?: string }>;
  adminAddDemoSku: (input: {
    brandName: string;
    genericComposition: string;
    manufacturer: string;
    category: MedicineCategory;
    schedule: MedicineSchedule;
    mrpInr: number;
    packSize: string;
    clinicalSummary: string;
    storageInstructions: string;
    batchNumber: string;
    expiryMonthYear: string;
    quantity: number;
  }) => Promise<{ ok: boolean; error?: string }>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function formatAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not yet enabled in the Firebase Console Authentication settings for project medikart-d1afe.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return error instanceof Error
        ? error.message
        : 'Authentication failed. Please try again.';
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<DemoCity>('Bengaluru');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);
  const [adminSandboxActiveState, setAdminSandboxActiveState] = useState(false);
  const adminSandboxActive = __ENABLE_ADMIN_SANDBOX__
    ? adminSandboxActiveState
    : false;

  const setAdminSandboxActive = useCallback((active: boolean) => {
    if (!__ENABLE_ADMIN_SANDBOX__) {
      setAdminSandboxActiveState(false);
      return;
    }
    setAdminSandboxActiveState(active);
  }, []);

  const [guestCart, setGuestCart] = useState<DemoCartItem[]>(() =>
    loadStoredGuestCart(),
  );
  const [firestoreCart, setFirestoreCart] = useState<DemoCartItem[]>([]);
  const [firestoreDrafts, setFirestoreDrafts] = useState<DemoRxDraft[]>([]);
  const mergedForUidRef = useRef<string | null>(null);

  const [adminInventory, setAdminInventory] = useState<DemoMedicine[]>(
    () => INITIAL_DEMO_MEDICINES,
  );

  // Persist guest demo cart locally whenever it changes
  useEffect(() => {
    persistGuestCart(guestCart);
  }, [guestCart]);

  // 1. Auth state observer & server-verified Admin check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        mergedForUidRef.current = null;
        setUserProfile(null);
        setIsVerifiedAdmin(false);
        setFirestoreCart([]);
        setFirestoreDrafts([]);
        setProfileLoading(false);
        setAuthReady(true);
        return;
      }

      setProfileLoading(true);
      try {
        // Strict server-verified Admin check (never trusts client userProfile.role)
        if (user.emailVerified) {
          try {
            const adminSnap = await getDoc(doc(db, 'admins', user.uid));
            if (
              adminSnap.exists() &&
              adminSnap.data().active === true &&
              adminSnap.data().role === 'admin'
            ) {
              setIsVerifiedAdmin(true);
              setAdminSandboxActive(false);
            } else {
              setIsVerifiedAdmin(false);
            }
          } catch {
            // Expected permission denial for non-admin customers
            setIsVerifiedAdmin(false);
          }
        } else {
          setIsVerifiedAdmin(false);
        }
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  // 1b. Observe authenticated user's profile at /users/{uid} (prevents registration setDoc race)
  useEffect(() => {
    if (!authReady || !firebaseUser) {
      return;
    }

    const profilePath = `users/${firebaseUser.uid}`;
    const unsubProfile = onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const cityVal = (data.city as DemoCity) || 'Bengaluru';
          setUserProfile({
            uid: firebaseUser.uid,
            email: String(data.email || firebaseUser.email || ''),
            fullName: String(data.fullName || 'MediKart Customer'),
            phone: String(data.phone || ''),
            city: cityVal,
            addressLine: String(data.addressLine || ''),
            role: 'customer',
          });
          setSelectedCity(cityVal);
        } else {
          setUserProfile(null);
        }
        setProfileLoading(false);
      },
      (err) => {
        setProfileLoading(false);
        handleFirestoreError(err, OperationType.GET, profilePath);
      },
    );

    return () => unsubProfile();
  }, [authReady, firebaseUser]);

  // 2. Attach user-scoped Firestore listeners only when authenticated & profile exists
  useEffect(() => {
    if (!authReady || !firebaseUser || !userProfile) {
      return;
    }

    const cartPath = `users/${firebaseUser.uid}/cartItems`;
    const cartQuery = query(
      collection(db, 'users', firebaseUser.uid, 'cartItems'),
      where('userId', '==', firebaseUser.uid),
    );
    const unsubCart = onSnapshot(
      cartQuery,
      (snapshot) => {
        const items: DemoCartItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          const itemSkuId = String(data.skuId);
          const catalogMatch = INITIAL_DEMO_MEDICINES.find(
            (m) => m.skuId === itemSkuId,
          );
          return {
            skuId: itemSkuId,
            userId: String(data.userId),
            brandName: String(data.brandName),
            genericComposition: String(data.genericComposition),
            batchNumber: String(data.batchNumber),
            expiryMonthYear: String(data.expiryMonthYear),
            mrpInr: Number(data.mrpInr),
            quantity: Number(data.quantity),
            ...(catalogMatch?.imageUrl ? { imageUrl: catalogMatch.imageUrl } : {}),
          };
        });
        setFirestoreCart(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, cartPath),
    );

    const draftsPath = `users/${firebaseUser.uid}/rxDrafts`;
    const draftsQuery = query(
      collection(db, 'users', firebaseUser.uid, 'rxDrafts'),
      where('userId', '==', firebaseUser.uid),
    );
    const unsubDrafts = onSnapshot(
      draftsQuery,
      (snapshot) => {
        const drafts: DemoRxDraft[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            draftId: String(data.draftId),
            userId: String(data.userId),
            title: String(data.title),
            sampleType: data.sampleType as RxSampleType,
            city: data.city as DemoCity,
            note: data.note ? String(data.note) : '',
            createdAtLabel: 'Saved Demo Marker',
          };
        });
        setFirestoreDrafts(drafts);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, draftsPath),
    );

    return () => {
      unsubCart();
      unsubDrafts();
    };
  }, [authReady, firebaseUser, userProfile]);

  // 3. Load live Firestore /inventory ONLY if isVerifiedAdmin === true
  useEffect(() => {
    if (!authReady || !firebaseUser || !isVerifiedAdmin) {
      return;
    }

    let cancelled = false;
    async function loadAdminInventory() {
      const invPath = 'inventory';
      try {
        const skuSnap = await getDocs(collection(db, 'inventory'));
        if (cancelled || skuSnap.empty) {
          return;
        }
        const loaded: DemoMedicine[] = [];
        for (const skuDoc of skuSnap.docs) {
          const s = skuDoc.data();
          const batchPath = `inventory/${skuDoc.id}/batches`;
          let batches: DemoMedicine['batches'] = [];
          try {
            const batchSnap = await getDocs(
              query(
                collection(db, 'inventory', skuDoc.id, 'batches'),
                where('skuId', '==', skuDoc.id),
              ),
            );
            batches = batchSnap.docs.map((b) => {
              const bd = b.data();
              return {
                batchId: String(bd.batchId),
                batchNumber: String(bd.batchNumber),
                expiryMonthYear: String(bd.expiryMonthYear),
                quantity: Number(bd.quantity),
                quarantined: Boolean(bd.quarantined),
              };
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, batchPath);
          }

          loaded.push({
            skuId: String(s.skuId),
            brandName: String(s.brandName),
            genericComposition: String(s.genericComposition),
            manufacturer: String(s.manufacturer),
            category: s.category as MedicineCategory,
            schedule: s.schedule as MedicineSchedule,
            mrpInr: Number(s.mrpInr),
            packSize: 'Standard Demo Pack',
            imageUrl: '/src/assets/images/product_medicine_blister_1794864522279.jpg',
            clinicalSummary: 'Verified Admin inventory SKU.',
            storageInstructions: 'Store in cool dry place below 25°C.',
            featured: false,
            batches,
          });
        }
        if (!cancelled && loaded.length > 0) {
          setAdminInventory(loaded);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, invPath);
      }
    }

    void loadAdminInventory();
    return () => {
      cancelled = true;
    };
  }, [authReady, firebaseUser, isVerifiedAdmin]);

  // Customer Registration (always assigns role: 'customer')
  const registerCustomer = useCallback(
    async (input: {
      email: string;
      password: string;
      fullName: string;
      phone: string;
      city: DemoCity;
      addressLine: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      const validated = validateProfileFields({
        fullName: input.fullName,
        phone: input.phone,
        city: input.city,
        addressLine: input.addressLine,
      });
      if (!validated.valid) {
        return { ok: false, error: validated.error };
      }

      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          input.email.trim(),
          input.password,
        );
        const uid = cred.user.uid;
        const email = (cred.user.email || input.email)
          .trim()
          .slice(0, SCHEMA_LIMITS.emailMax);
        const profileDoc = {
          uid,
          email,
          fullName: validated.sanitized.fullName,
          phone: validated.sanitized.phone,
          city: validated.sanitized.city,
          addressLine: validated.sanitized.addressLine,
          role: 'customer' as const,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        try {
          await setDoc(doc(db, 'users', uid), profileDoc);
          setUserProfile({
            uid,
            email,
            fullName: validated.sanitized.fullName,
            phone: validated.sanitized.phone,
            city: validated.sanitized.city,
            addressLine: validated.sanitized.addressLine,
            role: 'customer',
          });
          setSelectedCity(validated.sanitized.city);
        } catch (fsErr) {
          handleFirestoreError(fsErr, OperationType.CREATE, `users/${uid}`);
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: formatAuthError(err) };
      }
    },
    [],
  );

  // Customer Login
  const loginCustomer = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: formatAuthError(err) };
      }
    },
    [],
  );

  // Dedicated Staff Admin Login (strict server-side verification)
  const loginStaffAdmin = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        const cred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        if (!cred.user.emailVerified) {
          await signOut(auth);
          return {
            ok: false,
            error:
              'Access denied: Staff Admin login requires a verified email address and server-provisioned Admin authorization.',
          };
        }
        try {
          const adminSnap = await getDoc(doc(db, 'admins', cred.user.uid));
          if (
            adminSnap.exists() &&
            adminSnap.data().active === true &&
            adminSnap.data().role === 'admin'
          ) {
            setIsVerifiedAdmin(true);
            setAdminSandboxActive(false);
            return { ok: true };
          }
        } catch {
          // Permission denied on /admins/{uid}
        }
        await signOut(auth);
        return {
          ok: false,
          error:
            'Access denied: This account does not hold a server-provisioned Admin role. Customer accounts cannot access Admin operations.',
        };
      } catch (err) {
        return { ok: false, error: formatAuthError(err) };
      }
    },
    [],
  );

  // Profile Update (allowed fields only, never touches role)
  const updateCustomerProfile = useCallback(
    async (input: {
      fullName: string;
      phone: string;
      city: DemoCity;
      addressLine: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      if (!firebaseUser) {
        return { ok: false, error: 'Please sign in first.' };
      }
      const validated = validateProfileFields(input);
      if (!validated.valid) {
        return { ok: false, error: validated.error };
      }

      const path = `users/${firebaseUser.uid}`;
      try {
        if (!userProfile) {
          const email = (firebaseUser.email || 'customer@medikart.local')
            .trim()
            .slice(0, SCHEMA_LIMITS.emailMax);
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            uid: firebaseUser.uid,
            email,
            fullName: validated.sanitized.fullName,
            phone: validated.sanitized.phone,
            city: validated.sanitized.city,
            addressLine: validated.sanitized.addressLine,
            role: 'customer' as const,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            fullName: validated.sanitized.fullName,
            phone: validated.sanitized.phone,
            city: validated.sanitized.city,
            addressLine: validated.sanitized.addressLine,
            updatedAt: serverTimestamp(),
          });
        }
        setSelectedCity(validated.sanitized.city);
        return { ok: true };
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
    [firebaseUser, userProfile],
  );

  const sendPasswordReset = useCallback(
    async (email: string): Promise<{ ok: boolean; error?: string }> => {
      const trimmed = email.trim();
      if (!trimmed) {
        return { ok: false, error: 'Please enter your account email address.' };
      }
      try {
        await sendPasswordResetEmail(auth, trimmed);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: formatAuthError(err) };
      }
    },
    [],
  );

  const sendCustomerVerificationEmail = useCallback(async (): Promise<{
    ok: boolean;
    error?: string;
  }> => {
    if (!auth.currentUser) {
      return { ok: false, error: 'Please sign in first.' };
    }
    try {
      await sendEmailVerification(auth.currentUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: formatAuthError(err) };
    }
  }, []);

  const refreshEmailVerification = useCallback(async (): Promise<{
    verified: boolean;
    error?: string;
  }> => {
    if (!auth.currentUser) {
      return { verified: false, error: 'Please sign in first.' };
    }
    try {
      await auth.currentUser.reload();
      const refreshedUser = auth.currentUser;
      setFirebaseUser(refreshedUser);
      const verified = Boolean(refreshedUser?.emailVerified);
      if (verified && refreshedUser) {
        try {
          const adminSnap = await getDoc(
            doc(db, 'admins', refreshedUser.uid),
          );
          setIsVerifiedAdmin(
            adminSnap.exists() &&
              adminSnap.data().active === true &&
              adminSnap.data().role === 'admin',
          );
        } catch {
          setIsVerifiedAdmin(false);
        }
      }
      return { verified };
    } catch (err) {
      return { verified: false, error: formatAuthError(err) };
    }
  }, []);

  // Safely merge any persisted guest demo cart items into Firestore once customer logs in
  useEffect(() => {
    if (
      !authReady ||
      !firebaseUser ||
      !userProfile ||
      guestCart.length === 0 ||
      mergedForUidRef.current === firebaseUser.uid
    ) {
      return;
    }

    mergedForUidRef.current = firebaseUser.uid;
    const uid = firebaseUser.uid;
    const itemsToMerge = [...guestCart];

    async function mergeGuestCartToFirestore() {
      const cartPath = `users/${uid}/cartItems`;
      try {
        const existingSnap = await getDocs(
          query(
            collection(db, 'users', uid, 'cartItems'),
            where('userId', '==', uid),
          ),
        );
        const existingQtyMap = new Map<string, number>();
        for (const d of existingSnap.docs) {
          const qVal = Number(d.data().quantity);
          if (Number.isInteger(qVal) && qVal >= 1) {
            existingQtyMap.set(d.id, qVal);
          }
        }

        for (const rawItem of itemsToMerge) {
          const safeItem = sanitizeGuestCartItem(rawItem);
          if (!safeItem) continue;
          const prevQty = existingQtyMap.get(safeItem.skuId) ?? 0;
          const mergedQty = Math.min(
            SCHEMA_LIMITS.maxCartQuantity,
            prevQty + safeItem.quantity,
          );
          const itemPath = `users/${uid}/cartItems/${safeItem.skuId}`;
          try {
            await setDoc(doc(db, 'users', uid, 'cartItems', safeItem.skuId), {
              skuId: safeItem.skuId,
              userId: uid,
              brandName: safeItem.brandName,
              genericComposition: safeItem.genericComposition,
              batchNumber: safeItem.batchNumber,
              expiryMonthYear: safeItem.expiryMonthYear,
              mrpInr: safeItem.mrpInr,
              quantity: mergedQty,
              updatedAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, itemPath);
          }
        }

        setGuestCart([]);
        persistGuestCart([]);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, cartPath);
      }
    }

    void mergeGuestCartToFirestore();
  }, [authReady, firebaseUser, userProfile, guestCart]);

  const logoutUser = useCallback(async () => {
    mergedForUidRef.current = null;
    setAdminSandboxActive(false);
    setIsVerifiedAdmin(false);
    await signOut(auth);
  }, []);

  // Active Demo Cart (Firestore if signed in with profile, else local guest cart)
  const cartItems = firebaseUser && userProfile ? firestoreCart : guestCart;

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const addToDemoCart = useCallback(
    (medicine: DemoMedicine): { ok: boolean; message: string } => {
      const fefoBatch = getFefoActiveBatch(medicine.batches);
      if (!fefoBatch) {
        return {
          ok: false,
          message: 'No valid active demo batch is available for this item.',
        };
      }

      const skuId = sanitizeId(medicine.skuId);
      const existing = cartItems.find((i) => i.skuId === skuId);
      const nextQty = Math.min(
        SCHEMA_LIMITS.maxCartQuantity,
        (existing?.quantity ?? 0) + 1,
      );

      if (firebaseUser && userProfile) {
        const path = `users/${firebaseUser.uid}/cartItems/${skuId}`;
        const payload = {
          skuId,
          userId: firebaseUser.uid,
          brandName: medicine.brandName.slice(0, SCHEMA_LIMITS.brandNameMax),
          genericComposition: medicine.genericComposition.slice(
            0,
            SCHEMA_LIMITS.genericCompositionMax,
          ),
          batchNumber: sanitizeId(fefoBatch.batchNumber).slice(
            0,
            SCHEMA_LIMITS.batchNumberMax,
          ),
          expiryMonthYear: fefoBatch.expiryMonthYear,
          mrpInr: medicine.mrpInr,
          quantity: nextQty,
          updatedAt: serverTimestamp(),
        };
        void setDoc(
          doc(db, 'users', firebaseUser.uid, 'cartItems', skuId),
          payload,
        ).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, path),
        );
      } else {
        setGuestCart((prev) => {
          const found = prev.find((i) => i.skuId === skuId);
          if (found) {
            return prev.map((i) =>
              i.skuId === skuId
                ? {
                    ...i,
                    quantity: nextQty,
                    imageUrl: i.imageUrl || medicine.imageUrl,
                  }
                : i,
            );
          }
          return [
            ...prev,
            {
              skuId,
              brandName: medicine.brandName,
              genericComposition: medicine.genericComposition,
              batchNumber: fefoBatch.batchNumber,
              expiryMonthYear: fefoBatch.expiryMonthYear,
              mrpInr: medicine.mrpInr,
              quantity: 1,
              imageUrl: medicine.imageUrl,
            },
          ];
        });
      }

      return {
        ok: true,
        message: `Added ${medicine.brandName} (Batch ${fefoBatch.batchNumber}) to demo cart.`,
      };
    },
    [cartItems, firebaseUser, userProfile],
  );

  const updateCartQuantity = useCallback(
    async (skuId: string, delta: number) => {
      const target = cartItems.find((i) => i.skuId === skuId);
      if (!target) return;
      const nextQty = target.quantity + delta;

      if (firebaseUser && userProfile) {
        const path = `users/${firebaseUser.uid}/cartItems/${skuId}`;
        try {
          if (nextQty <= 0) {
            await deleteDoc(
              doc(db, 'users', firebaseUser.uid, 'cartItems', skuId),
            );
          } else {
            await updateDoc(
              doc(db, 'users', firebaseUser.uid, 'cartItems', skuId),
              {
                quantity: Math.min(SCHEMA_LIMITS.maxCartQuantity, nextQty),
                updatedAt: serverTimestamp(),
              },
            );
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, path);
        }
      } else {
        setGuestCart((prev) => {
          if (nextQty <= 0) return prev.filter((i) => i.skuId !== skuId);
          return prev.map((i) =>
            i.skuId === skuId
              ? {
                  ...i,
                  quantity: Math.min(SCHEMA_LIMITS.maxCartQuantity, nextQty),
                }
              : i,
          );
        });
      }
    },
    [cartItems, firebaseUser, userProfile],
  );

  const removeCartItem = useCallback(
    async (skuId: string) => {
      if (firebaseUser && userProfile) {
        const path = `users/${firebaseUser.uid}/cartItems/${skuId}`;
        try {
          await deleteDoc(
            doc(db, 'users', firebaseUser.uid, 'cartItems', skuId),
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, path);
        }
      } else {
        setGuestCart((prev) => prev.filter((i) => i.skuId !== skuId));
      }
    },
    [firebaseUser, userProfile],
  );

  // Sample Demo Rx Drafts (non-PHI metadata markers only)
  const rxDrafts = useMemo(
    () => [...INITIAL_SAMPLE_RX_DRAFTS, ...firestoreDrafts],
    [firestoreDrafts],
  );

  const saveSampleRxDraft = useCallback(
    async (input: {
      title: string;
      sampleType: RxSampleType;
      note: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      if (!firebaseUser || !userProfile) {
        return {
          ok: false,
          error:
            'Sign in to a customer account to save sample Rx draft markers, or preview locally below.',
        };
      }
      const validated = validateRxDraftFields({
        title: input.title,
        sampleType: input.sampleType,
        city: selectedCity,
        note: input.note,
      });
      if (!validated.valid) {
        return { ok: false, error: validated.error };
      }

      const draftId = `draft-${Date.now()}`;
      const path = `users/${firebaseUser.uid}/rxDrafts/${draftId}`;
      try {
        await setDoc(
          doc(db, 'users', firebaseUser.uid, 'rxDrafts', draftId),
          {
            draftId,
            userId: firebaseUser.uid,
            title: validated.sanitized.title,
            sampleType: validated.sanitized.sampleType,
            city: validated.sanitized.city,
            note: validated.sanitized.note,
            createdAt: serverTimestamp(),
          },
        );
        return { ok: true };
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
    [firebaseUser, userProfile, selectedCity],
  );

  const deleteSampleRxDraft = useCallback(
    async (draftId: string) => {
      if (!firebaseUser || !userProfile) return;
      const path = `users/${firebaseUser.uid}/rxDrafts/${draftId}`;
      try {
        await deleteDoc(
          doc(db, 'users', firebaseUser.uid, 'rxDrafts', draftId),
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    },
    [firebaseUser, userProfile],
  );

  // Admin Operations (Verified Admin writes to Firestore /inventory; Unverified Sandbox mutates local state only)
  const adminAdjustBatchStock = useCallback(
    async (skuId: string, batchId: string, delta: number) => {
      let nextQty = 0;
      setAdminInventory((prev) =>
        prev.map((med) => {
          if (med.skuId !== skuId) return med;
          return {
            ...med,
            batches: med.batches.map((b) => {
              if (b.batchId !== batchId) return b;
              nextQty = Math.max(
                0,
                Math.min(SCHEMA_LIMITS.maxStockQuantity, b.quantity + delta),
              );
              return { ...b, quantity: nextQty };
            }),
          };
        }),
      );

      if (isVerifiedAdmin && firebaseUser) {
        const path = `inventory/${skuId}/batches/${batchId}`;
        try {
          await updateDoc(
            doc(db, 'inventory', skuId, 'batches', batchId),
            {
              quantity: nextQty,
              updatedAt: serverTimestamp(),
            },
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, path);
        }
      }
    },
    [isVerifiedAdmin, firebaseUser],
  );

  const adminToggleQuarantine = useCallback(
    async (skuId: string, batchId: string) => {
      let nextQuarantined = false;
      setAdminInventory((prev) =>
        prev.map((med) => {
          if (med.skuId !== skuId) return med;
          return {
            ...med,
            batches: med.batches.map((b) => {
              if (b.batchId !== batchId) return b;
              nextQuarantined = !b.quarantined;
              return { ...b, quarantined: nextQuarantined };
            }),
          };
        }),
      );

      if (isVerifiedAdmin && firebaseUser) {
        const path = `inventory/${skuId}/batches/${batchId}`;
        try {
          await updateDoc(
            doc(db, 'inventory', skuId, 'batches', batchId),
            {
              quarantined: nextQuarantined,
              updatedAt: serverTimestamp(),
            },
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, path);
        }
      }
    },
    [isVerifiedAdmin, firebaseUser],
  );

  const adminAddBatch = useCallback(
    async (
      skuId: string,
      input: { batchNumber: string; expiryMonthYear: string; quantity: number },
    ): Promise<{ ok: boolean; error?: string }> => {
      const check = validateBatchFields(input);
      if (!check.valid) return { ok: false, error: check.error };

      const batchId = sanitizeId(`b-${input.batchNumber}-${Date.now()}`);
      const newBatch = {
        batchId,
        batchNumber: input.batchNumber.trim(),
        expiryMonthYear: input.expiryMonthYear.trim(),
        quantity: input.quantity,
        quarantined: false,
      };

      setAdminInventory((prev) =>
        prev.map((med) =>
          med.skuId === skuId
            ? { ...med, batches: [...med.batches, newBatch] }
            : med,
        ),
      );

      if (isVerifiedAdmin && firebaseUser) {
        const path = `inventory/${skuId}/batches/${batchId}`;
        try {
          await setDoc(doc(db, 'inventory', skuId, 'batches', batchId), {
            batchId,
            skuId,
            batchNumber: newBatch.batchNumber,
            expiryMonthYear: newBatch.expiryMonthYear,
            quantity: newBatch.quantity,
            quarantined: false,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }

      return { ok: true };
    },
    [isVerifiedAdmin, firebaseUser],
  );

  const adminAddDemoSku = useCallback(
    async (input: {
      brandName: string;
      genericComposition: string;
      manufacturer: string;
      category: MedicineCategory;
      schedule: MedicineSchedule;
      mrpInr: number;
      packSize: string;
      clinicalSummary: string;
      storageInstructions: string;
      batchNumber: string;
      expiryMonthYear: string;
      quantity: number;
    }): Promise<{ ok: boolean; error?: string }> => {
      const batchCheck = validateBatchFields({
        batchNumber: input.batchNumber,
        expiryMonthYear: input.expiryMonthYear,
        quantity: input.quantity,
      });
      if (!batchCheck.valid) return { ok: false, error: batchCheck.error };

      const brandName = input.brandName.trim().slice(0, SCHEMA_LIMITS.brandNameMax);
      const genericComposition = input.genericComposition
        .trim()
        .slice(0, SCHEMA_LIMITS.genericCompositionMax);
      const manufacturer = input.manufacturer
        .trim()
        .slice(0, SCHEMA_LIMITS.manufacturerMax);

      if (!brandName || !genericComposition || !manufacturer) {
        return {
          ok: false,
          error: 'Brand name, generic composition, and manufacturer are required.',
        };
      }
      if (!Number.isFinite(input.mrpInr) || input.mrpInr <= 0 || input.mrpInr > SCHEMA_LIMITS.maxMrpInr) {
        return {
          ok: false,
          error: 'MRP must be greater than ₹0 and at most ₹1,00,000.',
        };
      }

      const skuId = sanitizeId(`sku-${brandName.toLowerCase()}-${Date.now()}`);
      const batchId = sanitizeId(`b-${input.batchNumber}-${Date.now()}`);

      const newSku: DemoMedicine = {
        skuId,
        brandName,
        genericComposition,
        manufacturer,
        category: input.category,
        schedule: input.schedule,
        mrpInr: Number(input.mrpInr.toFixed(2)),
        packSize: input.packSize.trim() || 'Demo Pack',
        imageUrl: '/src/assets/images/product_medicine_blister_1794864522279.jpg',
        clinicalSummary:
          input.clinicalSummary.trim() ||
          'Sample demo SKU added in Admin inventory workspace.',
        storageInstructions:
          input.storageInstructions.trim() || 'Store below 30°C in a dry place.',
        featured: false,
        batches: [
          {
            batchId,
            batchNumber: input.batchNumber.trim(),
            expiryMonthYear: input.expiryMonthYear.trim(),
            quantity: input.quantity,
            quarantined: false,
          },
        ],
      };

      setAdminInventory((prev) => [newSku, ...prev]);

      if (isVerifiedAdmin && firebaseUser) {
        const skuPath = `inventory/${skuId}`;
        try {
          await setDoc(doc(db, 'inventory', skuId), {
            skuId,
            brandName,
            genericComposition,
            manufacturer,
            category: input.category,
            schedule: input.schedule,
            mrpInr: newSku.mrpInr,
            updatedAt: serverTimestamp(),
          });
          await setDoc(doc(db, 'inventory', skuId, 'batches', batchId), {
            batchId,
            skuId,
            batchNumber: input.batchNumber.trim(),
            expiryMonthYear: input.expiryMonthYear.trim(),
            quantity: input.quantity,
            quarantined: false,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, skuPath);
        }
      }

      return { ok: true };
    },
    [isVerifiedAdmin, firebaseUser],
  );

  // Customers only browse the public demo catalogue; never expose adminInventory mutations to non-admin customers
  const catalogueMedicines = isVerifiedAdmin
    ? adminInventory
    : INITIAL_DEMO_MEDICINES;

  const value: StoreContextValue = {
    selectedCity,
    setSelectedCity,
    firebaseUser,
    authReady,
    userProfile,
    profileLoading,
    isVerifiedAdmin,
    adminSandboxActive,
    setAdminSandboxActive,
    registerCustomer,
    loginCustomer,
    loginStaffAdmin,
    updateCustomerProfile,
    sendPasswordReset,
    sendCustomerVerificationEmail,
    refreshEmailVerification,
    logoutUser,
    catalogueMedicines,
    cartItems,
    cartCount,
    addToDemoCart,
    updateCartQuantity,
    removeCartItem,
    rxDrafts,
    saveSampleRxDraft,
    deleteSampleRxDraft,
    adminInventory,
    adminAdjustBatchStock,
    adminToggleQuarantine,
    adminAddBatch,
    adminAddDemoSku,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
