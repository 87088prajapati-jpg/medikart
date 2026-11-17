import { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { StoreProvider, useStore } from './context/StoreContext';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CartPage } from './pages/CartPage';
import { CataloguePage } from './pages/CataloguePage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { RxUploadPage } from './pages/RxUploadPage';
import { StaffLoginPage } from './pages/StaffLoginPage';
import type {
  AppRoute,
  DemoMedicine,
  MedicineCategory,
} from './types/pharmacy';

const VALID_CATEGORIES: readonly MedicineCategory[] = [
  'Chronic & Cardiac',
  'Pain/Fever & Cold',
  'Vitamins & Immunity',
  'Ayurveda & Herbal',
  'Digestive & Gut',
  'Skin & Derma Care',
  'Devices & First Aid',
];

interface ParsedHashState {
  route: AppRoute;
  category: MedicineCategory | 'All';
  searchQuery: string;
  medicine: DemoMedicine | null;
}

function buildCatalogueHash(
  category: MedicineCategory | 'All',
  q: string,
): string {
  const params = new URLSearchParams();
  if (category !== 'All') params.set('category', category);
  if (q.trim()) params.set('q', q.trim());
  const qs = params.toString();
  return qs ? `#/catalogue?${qs}` : '#/catalogue';
}

function buildRouteHash(
  route: AppRoute,
  opts?: {
    category?: MedicineCategory | 'All';
    q?: string;
    skuId?: string;
  },
): string {
  switch (route) {
    case 'home':
      return '#/home';
    case 'catalogue':
      return buildCatalogueHash(opts?.category ?? 'All', opts?.q ?? '');
    case 'product-detail':
      return opts?.skuId
        ? `#/product/${encodeURIComponent(opts.skuId)}`
        : '#/catalogue';
    case 'rx-upload':
      return '#/rx-upload';
    case 'cart':
      return '#/cart';
    case 'account':
      return '#/account';
    case 'staff-login':
      return '#/staff-login';
    case 'admin':
      return '#/admin';
  }
}

function parseHashLocation(
  rawHash: string,
  medicines: DemoMedicine[],
): ParsedHashState {
  const cleaned = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  const [rawPath, rawQuery = ''] = cleaned.split('?');
  const normalizedPath = (rawPath || '/').replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(rawQuery);

  if (normalizedPath === '/' || normalizedPath === '/home') {
    return {
      route: 'home',
      category: 'All',
      searchQuery: '',
      medicine: null,
    };
  }

  if (normalizedPath === '/catalogue') {
    const rawCat = params.get('category');
    const validCat = VALID_CATEGORIES.includes(rawCat as MedicineCategory)
      ? (rawCat as MedicineCategory)
      : 'All';
    const rawQ = params.get('q') ?? '';
    return {
      route: 'catalogue',
      category: validCat,
      searchQuery: rawQ,
      medicine: null,
    };
  }

  if (normalizedPath.startsWith('/product/')) {
    const rawSku = normalizedPath.slice('/product/'.length);
    let skuId = rawSku;
    try {
      skuId = decodeURIComponent(rawSku);
    } catch {
      skuId = rawSku;
    }
    const found = medicines.find((m) => m.skuId === skuId) ?? null;
    if (found) {
      return {
        route: 'product-detail',
        category: 'All',
        searchQuery: '',
        medicine: found,
      };
    }
    return {
      route: 'catalogue',
      category: 'All',
      searchQuery: '',
      medicine: null,
    };
  }

  if (normalizedPath === '/rx-upload') {
    return { route: 'rx-upload', category: 'All', searchQuery: '', medicine: null };
  }
  if (normalizedPath === '/cart') {
    return { route: 'cart', category: 'All', searchQuery: '', medicine: null };
  }
  if (normalizedPath === '/account') {
    return { route: 'account', category: 'All', searchQuery: '', medicine: null };
  }
  if (normalizedPath === '/staff-login') {
    return { route: 'staff-login', category: 'All', searchQuery: '', medicine: null };
  }
  if (normalizedPath === '/admin') {
    return { route: 'admin', category: 'All', searchQuery: '', medicine: null };
  }

  return {
    route: 'home',
    category: 'All',
    searchQuery: '',
    medicine: null,
  };
}

function MediKartShell() {
  const { catalogueMedicines } = useStore();
  const initialParsed = parseHashLocation(
    window.location.hash,
    catalogueMedicines,
  );

  const [route, setRoute] = useState<AppRoute>(initialParsed.route);
  const [searchQuery, setSearchQuery] = useState(initialParsed.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<
    MedicineCategory | 'All'
  >(initialParsed.category);
  const [selectedMedicine, setSelectedMedicine] = useState<DemoMedicine | null>(
    initialParsed.medicine,
  );

  const syncFromHash = useCallback(() => {
    const parsed = parseHashLocation(window.location.hash, catalogueMedicines);
    setRoute(parsed.route);
    if (parsed.route === 'catalogue') {
      setSelectedCategory(parsed.category);
      setSearchQuery(parsed.searchQuery);
    }
    setSelectedMedicine(parsed.medicine);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [catalogueMedicines]);

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState(null, '', '#/home');
    }
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  const pushHashIfChanged = (nextHash: string) => {
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  const navigate = (next: AppRoute) => {
    setRoute(next);
    const nextHash = buildRouteHash(next, {
      category: next === 'catalogue' ? selectedCategory : 'All',
      q: next === 'catalogue' ? searchQuery : '',
      skuId: next === 'product-detail' ? selectedMedicine?.skuId : undefined,
    });
    pushHashIfChanged(nextHash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchToCatalogue = (q: string) => {
    setSearchQuery(q);
    setSelectedCategory('All');
    setRoute('catalogue');
    pushHashIfChanged(buildCatalogueHash('All', q));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: MedicineCategory) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setRoute('catalogue');
    pushHashIfChanged(buildCatalogueHash(cat, ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (med: DemoMedicine) => {
    setSelectedMedicine(med);
    setRoute('product-detail');
    pushHashIfChanged(buildRouteHash('product-detail', { skuId: med.skuId }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalogueSearchChange = (q: string) => {
    setSearchQuery(q);
    const nextHash = buildCatalogueHash(selectedCategory, q);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  };

  const handleCatalogueCategoryChange = (cat: MedicineCategory | 'All') => {
    setSelectedCategory(cat);
    const nextHash = buildCatalogueHash(cat, searchQuery);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route === 'home' && (
          <HomePage
            onSearchToCatalogue={handleSearchToCatalogue}
            onSelectCategory={handleSelectCategory}
            onOpenRxUpload={() => navigate('rx-upload')}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {route === 'catalogue' && (
          <CataloguePage
            searchQuery={searchQuery}
            onSearchQueryChange={handleCatalogueSearchChange}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCatalogueCategoryChange}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {route === 'product-detail' && selectedMedicine && (
          <ProductDetailPage
            medicine={selectedMedicine}
            onBack={() => navigate('catalogue')}
            onGoToCart={() => navigate('cart')}
          />
        )}

        {route === 'product-detail' && !selectedMedicine && (
          <CataloguePage
            searchQuery={searchQuery}
            onSearchQueryChange={handleCatalogueSearchChange}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCatalogueCategoryChange}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {route === 'rx-upload' && <RxUploadPage />}

        {route === 'cart' && (
          <CartPage onBrowseCatalogue={() => navigate('catalogue')} />
        )}

        {route === 'account' && <AccountPage />}

        {route === 'staff-login' && (
          <StaffLoginPage
            onVerifiedAdminSuccess={() => navigate('admin')}
            onEnterDemoSandbox={() => navigate('admin')}
            onBackHome={() => navigate('home')}
          />
        )}

        {route === 'admin' && (
          <AdminDashboardPage
            onExitSandbox={() => navigate('home')}
            onGoToStaffLogin={() => navigate('staff-login')}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MediKartShell />
      </StoreProvider>
    </ErrorBoundary>
  );
}
