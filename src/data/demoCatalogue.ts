import type { DemoMedicine, DemoRxDraft } from '../types/pharmacy';

export const HERO_BANNER_IMAGE =
  '/src/assets/images/hero_medikart_pharmacy_1794864522606.jpg';
export const AYURVEDA_PROMO_IMAGE =
  '/src/assets/images/promo_ayurveda_herbal_1794864522010.jpg';

const IMG_BLISTER =
  '/src/assets/images/product_medicine_blister_1794864522279.jpg';
const IMG_SUPPLEMENT =
  '/src/assets/images/product_supplement_bottle_1794864521948.jpg';
const IMG_AYURVEDA =
  '/src/assets/images/promo_ayurveda_herbal_1794864522010.jpg';
const IMG_DERMA =
  '/src/assets/images/product_derma_serum_1794864522030.jpg';
const IMG_DEVICE =
  '/src/assets/images/product_medical_device_1794864522836.jpg';

export const INITIAL_DEMO_MEDICINES: DemoMedicine[] = [
  {
    skuId: 'mk-cardio-tel40',
    brandName: 'CardioTel-40 Demo',
    genericComposition: 'Telmisartan IP 40 mg',
    manufacturer: 'Arogya Lifesciences Ltd (Sample)',
    category: 'Chronic & Cardiac',
    schedule: 'Schedule H Rx Required',
    mrpInr: 148.5,
    packSize: 'Strip of 15 Tablets',
    imageUrl: IMG_BLISTER,
    clinicalSummary:
      'Sample angiotensin II receptor blocker entry displayed for hypertension catalogue demonstration. Dispensing is disabled.',
    storageInstructions: 'Store below 30°C in a dry place, protected from light and moisture.',
    featured: true,
    batches: [
      {
        batchId: 'b-tel40-old',
        batchNumber: 'MK-TEL-2408',
        expiryMonthYear: '08/2026',
        quantity: 12,
        quarantined: false,
      },
      {
        batchId: 'b-tel40-near',
        batchNumber: 'MK-TEL-2501',
        expiryMonthYear: '01/2027',
        quantity: 22,
        quarantined: false,
      },
      {
        batchId: 'b-tel40-main',
        batchNumber: 'MK-TEL-2609',
        expiryMonthYear: '09/2028',
        quantity: 140,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-cardio-met500',
    brandName: 'GlycoNorm-SR 500 Demo',
    genericComposition: 'Metformin Hydrochloride (Sustained Release) IP 500 mg',
    manufacturer: 'Deccan Pharma Formulations (Sample)',
    category: 'Chronic & Cardiac',
    schedule: 'Schedule H Rx Required',
    mrpInr: 86.0,
    packSize: 'Strip of 20 Tablets',
    imageUrl: IMG_BLISTER,
    clinicalSummary:
      'Sample sustained-release biguanide formulation for Type 2 diabetes catalogue demonstration.',
    storageInstructions: 'Store in cool, dry conditions away from direct sunlight.',
    featured: true,
    batches: [
      {
        batchId: 'b-met-1',
        batchNumber: 'MK-GLY-2502',
        expiryMonthYear: '02/2027',
        quantity: 18,
        quarantined: false,
      },
      {
        batchId: 'b-met-2',
        batchNumber: 'MK-GLY-2611',
        expiryMonthYear: '11/2028',
        quantity: 210,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-pain-dolo650',
    brandName: 'PyroCalm 650 Demo',
    genericComposition: 'Paracetamol IP 650 mg',
    manufacturer: 'Kaveri MedTech Remedies (Sample)',
    category: 'Pain/Fever & Cold',
    schedule: 'OTC',
    mrpInr: 34.0,
    packSize: 'Strip of 15 Tablets',
    imageUrl: IMG_BLISTER,
    clinicalSummary:
      'Sample antipyretic and analgesic tablet entry for fever and mild-to-moderate pain catalogue preview.',
    storageInstructions: 'Store below 25°C. Keep out of reach of children.',
    featured: true,
    batches: [
      {
        batchId: 'b-pyr-q',
        batchNumber: 'MK-PYR-2505Q',
        expiryMonthYear: '10/2027',
        quantity: 35,
        quarantined: true,
      },
      {
        batchId: 'b-pyr-1',
        batchNumber: 'MK-PYR-2607',
        expiryMonthYear: '07/2028',
        quantity: 320,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-pain-coldclear',
    brandName: 'SinoEase Relief Demo',
    genericComposition: 'Cetirizine 5 mg + Phenylephrine 10 mg + Paracetamol 325 mg',
    manufacturer: 'Kaveri MedTech Remedies (Sample)',
    category: 'Pain/Fever & Cold',
    schedule: 'OTC',
    mrpInr: 68.0,
    packSize: 'Strip of 10 Tablets',
    imageUrl: IMG_BLISTER,
    clinicalSummary:
      'Sample multi-symptom nasal congestion and seasonal cold relief formulation for demo browsing.',
    storageInstructions: 'Keep blister sealed until use. Store below 30°C.',
    featured: false,
    batches: [
      {
        batchId: 'b-sino-1',
        batchNumber: 'MK-SIN-2605',
        expiryMonthYear: '05/2028',
        quantity: 95,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-vit-d360k',
    brandName: 'Solaris-D3 60K Demo',
    genericComposition: 'Cholecalciferol (Vitamin D3) IP 60,000 IU Softgel',
    manufacturer: 'VedaNutra Labs Pvt Ltd (Sample)',
    category: 'Vitamins & Immunity',
    schedule: 'OTC',
    mrpInr: 195.0,
    packSize: 'Bottle of 8 Softgels',
    imageUrl: IMG_SUPPLEMENT,
    clinicalSummary:
      'Sample high-strength Vitamin D3 softgel capsule entry demonstrating supplement packaging and batch tracking.',
    storageInstructions: 'Store in a cool, dry place below 25°C. Do not freeze.',
    featured: true,
    batches: [
      {
        batchId: 'b-d3-1',
        batchNumber: 'MK-SOL-2501',
        expiryMonthYear: '01/2027',
        quantity: 14,
        quarantined: false,
      },
      {
        batchId: 'b-d3-2',
        batchNumber: 'MK-SOL-2610',
        expiryMonthYear: '10/2028',
        quantity: 110,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-vit-zincc',
    brandName: 'ImmunoZinc-C Demo',
    genericComposition: 'Ascorbic Acid 500 mg + Elemental Zinc 17 mg',
    manufacturer: 'VedaNutra Labs Pvt Ltd (Sample)',
    category: 'Vitamins & Immunity',
    schedule: 'OTC',
    mrpInr: 124.0,
    packSize: 'Bottle of 30 Chewable Tablets',
    imageUrl: IMG_SUPPLEMENT,
    clinicalSummary:
      'Sample antioxidant Vitamin C and Zinc daily immunity supplement for showcase browsing.',
    storageInstructions: 'Keep bottle tightly capped after each use. Store below 30°C.',
    featured: false,
    batches: [
      {
        batchId: 'b-zc-1',
        batchNumber: 'MK-ZNC-2608',
        expiryMonthYear: '08/2028',
        quantity: 84,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-ayur-ashwa',
    brandName: 'AshwaVeda Forte Demo',
    genericComposition: 'Withania somnifera (Ashwagandha) Standardized Root Extract 500 mg',
    manufacturer: 'Sahyadri Botanicals India (Sample)',
    category: 'Ayurveda & Herbal',
    schedule: 'OTC',
    mrpInr: 299.0,
    packSize: 'Amber Jar of 60 Capsules',
    imageUrl: IMG_AYURVEDA,
    clinicalSummary:
      'Sample classical Ayurvedic adaptogen formulation listed for botanical wellness catalogue demonstration.',
    storageInstructions: 'Store away from humidity and direct sunlight at room temperature.',
    featured: true,
    batches: [
      {
        batchId: 'b-ash-1',
        batchNumber: 'MK-AYU-2606',
        expiryMonthYear: '06/2028',
        quantity: 62,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-ayur-tulsi',
    brandName: 'TulsiGiloy Ark Drops Demo',
    genericComposition: 'Ocimum sanctum + Tinospora cordifolia Aqueous Extract',
    manufacturer: 'Sahyadri Botanicals India (Sample)',
    category: 'Ayurveda & Herbal',
    schedule: 'OTC',
    mrpInr: 165.0,
    packSize: '30 ml Amber Dropper Bottle',
    imageUrl: IMG_AYURVEDA,
    clinicalSummary:
      'Sample herbal distillate drops in amber apothecary glass for Ayurvedic seasonal care preview.',
    storageInstructions: 'Keep dropper sealed. Shake well before use.',
    featured: false,
    batches: [
      {
        batchId: 'b-tul-1',
        batchNumber: 'MK-TUL-2604',
        expiryMonthYear: '04/2028',
        quantity: 20,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-gut-pantodsr',
    brandName: 'Pantacid-DSR Demo',
    genericComposition: 'Pantoprazole Sodium 40 mg + Domperidone 30 mg (SR)',
    manufacturer: 'Arogya Lifesciences Ltd (Sample)',
    category: 'Digestive & Gut',
    schedule: 'Schedule H Rx Required',
    mrpInr: 156.0,
    packSize: 'Strip of 15 Capsules',
    imageUrl: IMG_BLISTER,
    clinicalSummary:
      'Sample gastro-oesophageal reflux and acid suppression capsule formulation requiring prescription under Schedule H.',
    storageInstructions: 'Store below 25°C in moisture-resistant blister packaging.',
    featured: false,
    batches: [
      {
        batchId: 'b-pan-1',
        batchNumber: 'MK-PAN-2612',
        expiryMonthYear: '12/2028',
        quantity: 128,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-gut-probio',
    brandName: 'FloraGut Synbiotic Demo',
    genericComposition: 'Lactobacillus acidophilus + Bifidobacterium + Fructo-oligosaccharides',
    manufacturer: 'Deccan Pharma Formulations (Sample)',
    category: 'Digestive & Gut',
    schedule: 'OTC',
    mrpInr: 220.0,
    packSize: 'Bottle of 20 Capsules',
    imageUrl: IMG_SUPPLEMENT,
    clinicalSummary:
      'Sample prebiotic and probiotic gut flora support supplement for digestive wellness demonstration.',
    storageInstructions: 'Store in a cool, dry place below 25°C.',
    featured: false,
    batches: [
      {
        batchId: 'b-pro-exp',
        batchNumber: 'MK-PRO-2409',
        expiryMonthYear: '09/2026',
        quantity: 9,
        quarantined: false,
      },
      {
        batchId: 'b-pro-2',
        batchNumber: 'MK-PRO-2609',
        expiryMonthYear: '09/2028',
        quantity: 54,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-derm-niaclear',
    brandName: 'NiaClear 10% Serum Demo',
    genericComposition: 'Niacinamide 10% + Zinc PCA 1% Dermatological Solution',
    manufacturer: 'ZestDerma Clinicals (Sample)',
    category: 'Skin & Derma Care',
    schedule: 'OTC',
    mrpInr: 449.0,
    packSize: '30 ml Frosted Dropper Bottle',
    imageUrl: IMG_DERMA,
    clinicalSummary:
      'Sample topical barrier-balancing dermatological serum for skincare category demonstration.',
    storageInstructions: 'Store upright in a cool place away from heat.',
    featured: true,
    batches: [
      {
        batchId: 'b-nia-1',
        batchNumber: 'MK-NIA-2607',
        expiryMonthYear: '07/2028',
        quantity: 48,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-derm-ceracalm',
    brandName: 'CeraCalm Barrier Cream Demo',
    genericComposition: 'Ceramide NP + Colloidal Oatmeal 1% + Panthenol 2%',
    manufacturer: 'ZestDerma Clinicals (Sample)',
    category: 'Skin & Derma Care',
    schedule: 'OTC',
    mrpInr: 360.0,
    packSize: '100 g Clinical Tube',
    imageUrl: IMG_DERMA,
    clinicalSummary:
      'Sample fragrance-free moisturizing barrier repair cream for sensitive skin demonstration.',
    storageInstructions: 'Replace cap firmly after use. Store below 30°C.',
    featured: false,
    batches: [
      {
        batchId: 'b-cer-1',
        batchNumber: 'MK-CER-2603',
        expiryMonthYear: '03/2028',
        quantity: 74,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-dev-bpmonitor',
    brandName: 'MedCheck Digital BP Monitor Demo',
    genericComposition: 'Oscillometric Automatic Upper-Arm Blood Pressure Unit (22–42 cm Cuff)',
    manufacturer: 'Bharat Precision Diagnostics (Sample)',
    category: 'Devices & First Aid',
    schedule: 'Medical Device',
    mrpInr: 1890.0,
    packSize: '1 Unit + Wide-Range Arm Cuff',
    imageUrl: IMG_DEVICE,
    clinicalSummary:
      'Sample home blood pressure monitoring medical device entry with cuff-fit indicator.',
    storageInstructions: 'Store in dry protective pouch between 10°C and 40°C.',
    featured: true,
    batches: [
      {
        batchId: 'b-bpm-1',
        batchNumber: 'MK-BPM-2701',
        expiryMonthYear: '12/2029',
        quantity: 19,
        quarantined: false,
      },
    ],
  },
  {
    skuId: 'mk-dev-oximeter',
    brandName: 'OxiPulse SpO2 Fingertip Oximeter Demo',
    genericComposition: 'Dual-Wavelength LED Pulse Rate & Oxygen Saturation Sensor',
    manufacturer: 'Bharat Precision Diagnostics (Sample)',
    category: 'Devices & First Aid',
    schedule: 'Medical Device',
    mrpInr: 999.0,
    packSize: '1 Unit + Lanyard',
    imageUrl: IMG_DEVICE,
    clinicalSummary:
      'Sample portable fingertip pulse oximeter medical device for first-aid and home vitals showcase.',
    storageInstructions: 'Avoid moisture ingress and direct heat. Remove batteries during long storage.',
    featured: false,
    batches: [
      {
        batchId: 'b-oxi-1',
        batchNumber: 'MK-OXI-2704',
        expiryMonthYear: '10/2029',
        quantity: 42,
        quarantined: false,
      },
    ],
  },
];

export const INITIAL_SAMPLE_RX_DRAFTS: DemoRxDraft[] = [
  {
    draftId: 'sample-draft-cardiac',
    title: 'Sample Cardiac Maintenance Rx (Fictional)',
    sampleType: 'sample_cardiac',
    city: 'Bengaluru',
    note: 'Sample Demo Prescription • Telmisartan 40 mg + Metformin SR 500 mg',
    createdAtLabel: 'Sample Preset',
  },
  {
    draftId: 'sample-draft-fever',
    title: 'Sample Fever & Cold Consultation Rx (Fictional)',
    sampleType: 'sample_fever',
    city: 'Mumbai',
    note: 'Sample Demo Prescription • Paracetamol 650 mg SOS',
    createdAtLabel: 'Sample Preset',
  },
];
