# MediKart Firestore Security Specification

## 1. Data Invariants
1. **Default Deny**: All unauthenticated or unmatched paths are denied by default (`match /{document=**} { allow read, write: if false; }`).
2. **Customer Profile Isolation**: `/users/{userId}` can only be read, created, or updated by `request.auth.uid == userId`.
3. **Immutable Customer Role**: On create, `/users/{userId}.role` must equal `'customer'`. On update, `role`, `uid`, `email`, and `createdAt` are strictly immutable. Customers can never escalate privileges.
4. **Master Gate for Subcollections**: `/users/{userId}/cartItems/{skuId}` and `/users/{userId}/rxDrafts/{draftId}` require the parent `/users/{userId}` document to exist and strictly enforce `request.auth.uid == userId` plus `userId == resource/incoming.userId`.
5. **Server-Issued Admin Only**: `/admins/{adminUid}` is never writable from any client (`allow write: if false`). Only the matching verified user (`request.auth.uid == adminUid && request.auth.token.email_verified == true`) may `get` their own admin record; `list` is denied.
6. **Inventory Isolation**: `/inventory/{skuId}` and `/inventory/{skuId}/batches/{batchId}` are strictly restricted to verified admins (`isAdmin()`). Customers can never read, list, create, update, or delete inventory documents.
7. **Strict Timestamps & Schema**: `createdAt` and `updatedAt` must equal `request.time`. All strings enforce `.size()` bounds and IDs enforce `^[a-zA-Z0-9_\-]+$`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Self-Privilege Escalation on Create**: Customer writes `/users/{uid}` with `{ role: "admin", ... }`. -> Denied (`incoming().role == 'customer'`).
2. **Role Mutation on Update**: Customer updates `/users/{uid}` changing `role` from `"customer"` to `"admin"`. -> Denied (`affectedKeys().hasOnly(['fullName', 'phone', 'city', 'addressLine', 'updatedAt'])`).
3. **Cross-User Profile Read**: Customer A reads `/users/{customerB_uid}`. -> Denied (`request.auth.uid == userId`).
4. **Cross-User Profile List**: Customer A queries `collection(db, 'users')`. -> Denied (`allow list: if false;`).
5. **Shadow Field Injection on Profile**: Customer creates `/users/{uid}` with extra field `isVerifiedAdmin: true`. -> Denied (`keys().hasOnly(...)`).
6. **ID Poisoning**: Attacker writes `/users/{uid}/cartItems/` with a 500-char ID or invalid characters `$bad`. -> Denied (`isValidId(skuId)`).
7. **Client Admin Grant Attempt**: Customer attempts to create `/admins/{uid}` with `{ active: true, role: "admin" }`. -> Denied (`allow write: if false`).
8. **Customer Reading Admin Inventory**: Customer attempts `getDoc` or `getDocs` on `/inventory`. -> Denied (`isAdmin()`).
9. **Customer Modifying Admin Inventory**: Customer attempts `updateDoc` on `/inventory/sku1/batches/b1` to set `quantity: 999`. -> Denied (`isAdmin()`).
10. **Unverified Email Admin Spoof**: User with `email_verified: false` tries to access `/inventory` even if an `/admins/{uid}` doc existed. -> Denied (`request.auth.token.email_verified == true`).
11. **Timestamp Forgery**: Customer creates `/users/{uid}` with backdated `createdAt` instead of `request.time`. -> Denied (`incoming().createdAt == request.time`).
12. **Cart Ownership Spoof**: Customer A writes `/users/{uidA}/cartItems/sku1` with `userId: uidB` or negative `quantity: -5`. -> Denied (`isValidDemoCartItem`).
