import type { AppRoute, DemoMedicine, MedicineCategory } from '../types/pharmacy';

export const CANONICAL_SITE_URL = 'https://medikart-india.netlify.app/';

interface PageSeoMetadata {
  title: string;
  description: string;
  robots: 'index, follow' | 'noindex, nofollow';
}

export function getSeoMetadataForRoute(
  route: AppRoute,
  options?: {
    category?: MedicineCategory | 'All';
    medicine?: DemoMedicine | null;
  },
): PageSeoMetadata {
  switch (route) {
    case 'home':
      return {
        title:
          'MediKart India – Online Pharmacy Catalogue & Medicine Information',
        description:
          "Explore MediKart India's demo pharmacy catalogue. Browse medicine categories, product information and a simple, mobile-friendly catalogue experience.",
        robots: 'index, follow',
      };
    case 'catalogue': {
      const cat = options?.category;
      if (cat && cat !== 'All') {
        return {
          title: `${cat} Demo Catalogue — MediKart`,
          description: `Explore sample ${cat} formulations, generic salt compositions, FEFO batches, and indicative INR MRP in the MediKart demo catalogue.`,
          robots: 'index, follow',
        };
      }
      return {
        title: 'Medicine & Wellness Catalogue — MediKart Demo',
        description:
          'Search MediKart demo medicines by product name, therapeutic category, generic salt composition, manufacturer, and FEFO batch expiry.',
        robots: 'index, follow',
      };
    }
    case 'product-detail': {
      const med = options?.medicine;
      if (med) {
        return {
          title: `${med.brandName} (${med.genericComposition}) — MediKart Demo`,
          description: `${med.brandName} (${med.genericComposition}) by ${med.manufacturer}. Sample ${med.category} SKU with FEFO batch tracking and storage details.`,
          robots: 'index, follow',
        };
      }
      return {
        title: 'Medicine Details — MediKart Demo Catalogue',
        description:
          'Inspect sample product compositions, FEFO batch records, indicative MRP, and storage instructions on MediKart.',
        robots: 'index, follow',
      };
    }
    case 'rx-upload':
      return {
        title: 'Local Prescription Preview Demo — MediKart',
        description:
          'Preview sample prescription workflows locally in browser memory. Verification, dispensing, and uploads are disabled in demo mode.',
        robots: 'noindex, nofollow',
      };
    case 'cart':
      return {
        title: 'Demo Shopping Cart — MediKart',
        description:
          'Preview sample cart items, FEFO batch numbers, and illustrative INR billing. Checkout and payments are permanently disabled.',
        robots: 'noindex, nofollow',
      };
    case 'account':
      return {
        title: 'Customer Account — MediKart Demo',
        description:
          'Manage your MediKart demo customer profile using Firebase Email and Password authentication.',
        robots: 'noindex, nofollow',
      };
    case 'about':
      return {
        title: 'About MediKart India — Demo Pharmacy Catalogue Showcase',
        description:
          'Learn about MediKart India, an online pharmacy catalogue and medicine information showcase in demo mode with sales and checkout disabled.',
        robots: 'index, follow',
      };
    case 'contact':
      return {
        title: 'Contact Us — MediKart India Demo Pharmacy Catalogue',
        description:
          "Preview MediKart India's local demo contact form. Messages are not sent, transmitted, or stored in demo mode.",
        robots: 'index, follow',
      };
    case 'staff-login':
    case 'admin':
      return {
        title: 'Staff Inventory Portal — MediKart Demo',
        description:
          'Role-restricted MediKart staff inventory showcase and FEFO batch status workspace.',
        robots: 'noindex, nofollow',
      };
  }
}

function upsertMetaTag(
  selector: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string,
) {
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function applyRouteSeoMetadata(
  route: AppRoute,
  options?: {
    category?: MedicineCategory | 'All';
    medicine?: DemoMedicine | null;
  },
): void {
  const meta = getSeoMetadataForRoute(route, options);
  document.title = meta.title;

  upsertMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  upsertMetaTag('meta[name="robots"]', 'name', 'robots', meta.robots);
  upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  upsertMetaTag(
    'meta[property="og:description"]',
    'property',
    'og:description',
    meta.description,
  );
  upsertMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  upsertMetaTag(
    'meta[name="twitter:description"]',
    'name',
    'twitter:description',
    meta.description,
  );
}
