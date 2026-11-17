export type DemoCity =
  | 'Bengaluru'
  | 'Mumbai'
  | 'New Delhi'
  | 'Hyderabad'
  | 'Chennai'
  | 'Pune';

export type MedicineCategory =
  | 'Chronic & Cardiac'
  | 'Pain/Fever & Cold'
  | 'Vitamins & Immunity'
  | 'Ayurveda & Herbal'
  | 'Digestive & Gut'
  | 'Skin & Derma Care'
  | 'Devices & First Aid';

export type MedicineSchedule =
  | 'OTC'
  | 'Schedule H Rx Required'
  | 'Medical Device';

export interface MedicineBatch {
  batchId: string;
  batchNumber: string;
  expiryMonthYear: string; // MM/YYYY
  quantity: number;
  quarantined: boolean;
}

export interface DemoMedicine {
  skuId: string;
  brandName: string;
  genericComposition: string;
  manufacturer: string;
  category: MedicineCategory;
  schedule: MedicineSchedule;
  mrpInr: number;
  packSize: string;
  imageUrl: string;
  clinicalSummary: string;
  storageInstructions: string;
  featured: boolean;
  batches: MedicineBatch[];
}

export interface DemoCartItem {
  skuId: string;
  userId?: string;
  brandName: string;
  genericComposition: string;
  batchNumber: string;
  expiryMonthYear: string;
  mrpInr: number;
  quantity: number;
  imageUrl?: string;
}

export type RxSampleType = 'sample_cardiac' | 'sample_fever' | 'local_preview_marker';

export interface DemoRxDraft {
  draftId: string;
  userId?: string;
  title: string;
  sampleType: RxSampleType;
  city: DemoCity;
  note?: string;
  createdAtLabel: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  city: DemoCity;
  addressLine: string;
  role: 'customer';
}

export type AppRoute =
  | 'home'
  | 'catalogue'
  | 'product-detail'
  | 'rx-upload'
  | 'cart'
  | 'account'
  | 'staff-login'
  | 'admin';

export type SortOption =
  | 'relevance'
  | 'mrp-asc'
  | 'mrp-desc'
  | 'nearest-expiry';
