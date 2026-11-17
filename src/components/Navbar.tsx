import {
  FileText,
  Home,
  LayoutGrid,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  User,
} from 'lucide-react';
import { DEMO_CITIES } from '../lib/validation';
import { useStore } from '../context/StoreContext';
import type { AppRoute, DemoCity } from '../types/pharmacy';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export function MediKartLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="8" fill="#0B6E4F" />
      <path
        d="M14 8H18V14H24V18H18V24H14V18H8V14H14V8Z"
        fill="#FFFFFF"
      />
      <circle cx="24" cy="8" r="2.5" fill="#A7F3D0" />
    </svg>
  );
}

export function Navbar({ currentRoute, onNavigate }: NavbarProps) {
  const { selectedCity, setSelectedCity, cartCount, isVerifiedAdmin } =
    useStore();

  const navItems: { id: AppRoute; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'catalogue', label: 'Catalogue', icon: LayoutGrid },
    { id: 'rx-upload', label: 'Rx Upload', icon: FileText },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'account', label: 'Account', icon: User },
  ];

  // Admin tab is rendered ONLY for authenticated users with a verified Admin role
  if (isVerifiedAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  const isRouteActive = (id: AppRoute) => {
    if (id === 'catalogue' && currentRoute === 'product-detail') return true;
    return currentRoute === id;
  };

  const getRouteHref = (id: AppRoute) => {
    switch (id) {
      case 'home':
        return '#/home';
      case 'catalogue':
        return '#/catalogue';
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
      default:
        return '#/home';
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: AppRoute,
  ) => {
    e.preventDefault();
    onNavigate(id);
  };

  return (
    <>
      {/* Mandatory visible demo notice strip */}
      <div className="sticky top-0 z-40 h-7 bg-[#064E3B] text-white flex items-center justify-center px-3 border-b border-emerald-900">
        <p className="text-[11px] font-medium tracking-wide truncate text-center">
          DEMO PRODUCTS ONLY • SALES &amp; CHECKOUT DISABLED
        </p>
      </div>

      {/* Desktop & Mobile Top Bar (3-zone contract on desktop) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 md:sticky md:top-7 md:z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <a
            href="#/home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6E4F] rounded-lg py-1"
          >
            <MediKartLogo />
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              MediKart
            </span>
          </a>

          {/* Zone 2: Clean single-line text links (Desktop) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6"
          >
            {navItems.map((item) => {
              const active = isRouteActive(item.id);
              const isPrivate =
                item.id === 'rx-upload' ||
                item.id === 'cart' ||
                item.id === 'account' ||
                item.id === 'admin';
              return (
                <a
                  key={item.id}
                  href={getRouteHref(item.id)}
                  rel={isPrivate ? 'nofollow' : undefined}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6E4F] ${
                    active
                      ? 'text-[#0B6E4F]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>
                    {item.id === 'cart' && cartCount > 0
                      ? `Cart (${cartCount})`
                      : item.label}
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B6E4F] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Contextual Action (Demo City Selector) */}
          <div className="flex items-center shrink-0">
            <label htmlFor="header-city-select" className="sr-only">
              Select demo city
            </label>
            <div className="relative flex items-center">
              <MapPin
                className="w-4 h-4 text-[#0B6E4F] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="header-city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as DemoCity)}
                className="min-h-[40px] pl-8 pr-7 py-1.5 text-xs sm:text-sm font-medium text-slate-800 bg-[#F6FBF8] border border-emerald-200 rounded-lg hover:border-[#0B6E4F] focus-visible:outline-2 focus-visible:outline-[#0B6E4F] cursor-pointer whitespace-nowrap"
              >
                {DEMO_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1"
      >
        <div
          className={`grid h-full items-center ${
            isVerifiedAdmin ? 'grid-cols-6' : 'grid-cols-5'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.id);
            const isPrivate =
              item.id === 'rx-upload' ||
              item.id === 'cart' ||
              item.id === 'account' ||
              item.id === 'admin';
            return (
              <a
                key={item.id}
                href={getRouteHref(item.id)}
                rel={isPrivate ? 'nofollow' : undefined}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium tracking-tight transition-colors cursor-pointer ${
                  active ? 'text-[#0B6E4F]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.25 : 1.75} />
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#0B6E4F] text-white text-[10px] font-mono tabular-nums flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 truncate max-w-full px-0.5">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
