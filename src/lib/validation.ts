import type {
  DemoCity,
  MedicineCategory,
  MedicineSchedule,
  RxSampleType,
} from '../types/pharmacy';

export const DEMO_CITIES: readonly DemoCity[] = [
  'Bengaluru',
  'Mumbai',
  'New Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
] as const;

export const MEDICINE_CATEGORIES: readonly MedicineCategory[] = [
  'Chronic & Cardiac',
  'Pain/Fever & Cold',
  'Vitamins & Immunity',
  'Ayurveda & Herbal',
  'Digestive & Gut',
  'Skin & Derma Care',
  'Devices & First Aid',
] as const;

export const MEDICINE_SCHEDULES: readonly MedicineSchedule[] = [
  'OTC',
  'Schedule H Rx Required',
  'Medical Device',
] as const;

// Synchronized verbatim with firebase-blueprint.json and firestore.rules
export const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
export const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/[0-9]{4}$/;

export const SCHEMA_LIMITS = {
  fullNameMax: 80,
  phoneMax: 20,
  addressLineMax: 200,
  emailMax: 120,
  brandNameMax: 100,
  genericCompositionMax: 160,
  manufacturerMax: 100,
  batchNumberMax: 32,
  draftTitleMax: 80,
  draftNoteMax: 160,
  maxCartQuantity: 20,
  maxStockQuantity: 100000,
  maxMrpInr: 100000,
} as const;

export function sanitizeId(raw: string, fallback = 'item'): string {
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  return cleaned.length > 0 && ID_PATTERN.test(cleaned) ? cleaned : fallback;
}

export function isValidDemoCity(value: string): value is DemoCity {
  return (DEMO_CITIES as readonly string[]).includes(value);
}

export function validateProfileFields(input: {
  fullName: string;
  phone: string;
  city: DemoCity;
  addressLine: string;
}): { valid: boolean; error?: string; sanitized: typeof input } {
  const fullName = input.fullName.trim().slice(0, SCHEMA_LIMITS.fullNameMax);
  const phone = input.phone.trim().slice(0, SCHEMA_LIMITS.phoneMax);
  const addressLine = input.addressLine
    .trim()
    .slice(0, SCHEMA_LIMITS.addressLineMax);

  if (fullName.length < 1) {
    return {
      valid: false,
      error: 'Full name is required (1–80 characters).',
      sanitized: { ...input, fullName, phone, addressLine },
    };
  }
  if (!isValidDemoCity(input.city)) {
    return {
      valid: false,
      error: 'Please select a supported demo city.',
      sanitized: { ...input, fullName, phone, addressLine },
    };
  }
  return {
    valid: true,
    sanitized: {
      fullName,
      phone,
      city: input.city,
      addressLine,
    },
  };
}

export function validateRxDraftFields(input: {
  title: string;
  sampleType: RxSampleType;
  city: DemoCity;
  note: string;
}): { valid: boolean; error?: string; sanitized: typeof input } {
  const title = input.title.trim().slice(0, SCHEMA_LIMITS.draftTitleMax);
  const note = input.note.trim().slice(0, SCHEMA_LIMITS.draftNoteMax);
  if (title.length < 1) {
    return {
      valid: false,
      error: 'Draft label must be 1–80 characters.',
      sanitized: { ...input, title, note },
    };
  }
  return {
    valid: true,
    sanitized: { ...input, title, note },
  };
}

export function validateBatchFields(input: {
  batchNumber: string;
  expiryMonthYear: string;
  quantity: number;
}): { valid: boolean; error?: string } {
  const batchNumber = input.batchNumber.trim();
  if (
    batchNumber.length < 1 ||
    batchNumber.length > SCHEMA_LIMITS.batchNumberMax ||
    !ID_PATTERN.test(batchNumber)
  ) {
    return {
      valid: false,
      error:
        'Batch number must be 1–32 characters using letters, numbers, hyphens, or underscores.',
    };
  }
  if (!EXPIRY_PATTERN.test(input.expiryMonthYear.trim())) {
    return {
      valid: false,
      error: 'Expiry date must follow MM/YYYY format (e.g. 08/2027).',
    };
  }
  if (
    !Number.isInteger(input.quantity) ||
    input.quantity < 0 ||
    input.quantity > SCHEMA_LIMITS.maxStockQuantity
  ) {
    return {
      valid: false,
      error: 'Quantity must be a whole number between 0 and 100,000.',
    };
  }
  return { valid: true };
}
