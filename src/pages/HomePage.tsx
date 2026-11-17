import { useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Droplets,
  FileText,
  HeartPulse,
  Leaf,
  Plus,
  Search,
  Sparkles,
  Stethoscope,
  Thermometer,
  X,
} from 'lucide-react';
import { DemoImage } from '../components/DemoImage';
import {
  AYURVEDA_PROMO_IMAGE,
  HERO_BANNER_IMAGE,
} from '../data/demoCatalogue';
import { useStore } from '../context/StoreContext';
import {
  formatInr,
  getFefoActiveBatch,
  matchesProductSearch,
} from '../lib/inventoryUtils';
import type { DemoMedicine, MedicineCategory } from '../types/pharmacy';

interface HomePageProps {
  onSearchToCatalogue: (query: string) => void;
  onSelectCategory: (category: MedicineCategory) => void;
  onOpenRxUpload: () => void;
  onOpenProduct: (medicine: DemoMedicine) => void;
}

const CATEGORY_CARDS: {
  name: MedicineCategory;
  subtitle: string;
  icon: typeof HeartPulse;
}[] = [
  {
    name: 'Chronic & Cardiac',
    subtitle: 'BP, diabetes & daily care',
    icon: HeartPulse,
  },
  {
    name: 'Pain/Fever & Cold',
    subtitle: 'Analgesics & seasonal relief',
    icon: Thermometer,
  },
  {
    name: 'Vitamins & Immunity',
    subtitle: 'D3, Zinc & daily micronutrients',
    icon: Sparkles,
  },
  {
    name: 'Ayurveda & Herbal',
    subtitle: 'Classical botanical extracts',
    icon: Leaf,
  },
  {
    name: 'Digestive & Gut',
    subtitle: 'Acidity & probiotic support',
    icon: Droplets,
  },
  {
    name: 'Skin & Derma Care',
    subtitle: 'Clinical serums & barrier care',
    icon: Activity,
  },
  {
    name: 'Devices & First Aid',
    subtitle: 'Monitors, oximeters & care',
    icon: Stethoscope,
  },
];

export function HomePage({
  onSearchToCatalogue,
  onSelectCategory,
  onOpenRxUpload,
  onOpenProduct,
}: HomePageProps) {
  const { selectedCity, catalogueMedicines, addToDemoCart } = useStore();
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const [heroQuery, setHeroQuery] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const featuredMedicines = catalogueMedicines.filter((m) => m.featured).slice(0, 6);

  const trimmedHeroQuery = heroQuery.trim();
  const liveHeroMatches = useMemo(() => {
    if (!trimmedHeroQuery) return [];
    return catalogueMedicines.filter((med) =>
      matchesProductSearch(med, trimmedHeroQuery),
    );
  }, [catalogueMedicines, trimmedHeroQuery]);

  const submitHeroSearch = () => {
    heroInputRef.current?.blur();
    onSearchToCatalogue(trimmedHeroQuery);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submitHeroSearch();
  };

  const handleHeroKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === 'Enter' || e.keyCode === 13) &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      submitHeroSearch();
    }
  };

  const handleQuickAdd = (med: DemoMedicine) => {
    const res = addToDemoCart(med);
    setFeedbackMsg(res.message);
    window.setTimeout(() => {
      setFeedbackMsg((curr) => (curr === res.message ? null : curr));
    }, 3000);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#0B6E4F] tracking-wide">
                  Sample Pharmacy Hub · {selectedCity} · Catalogue Showcase
                </p>
                <h1
                  className="font-display font-bold text-slate-900 tracking-tight leading-[1.12]"
                  style={{
                    fontSize: 'clamp(2rem, 3.6vw, 3.15rem)',
                    textWrap: 'balance',
                  }}
                >
                  Trusted Indian Pharmacy Catalogue &amp; FEFO Inventory Showcase
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  Browse clearly labelled sample medicines, inspect generic salt
                  compositions, verify batch expiry trails, and explore local
                  prescription preview workflows. Sales and checkout remain
                  disabled.
                </p>
              </div>

              {/* Search Trigger */}
              <div className="space-y-2.5 max-w-xl">
                <form
                  action="#"
                  onSubmit={handleHeroSearch}
                  role="search"
                  aria-label="Search demo medicines"
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      ref={heroInputRef}
                      type="search"
                      enterKeyHint="search"
                      inputMode="search"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      onKeyDown={handleHeroKeyDown}
                      placeholder="Search product name, category (e.g. Cardiac), salt, or batch..."
                      aria-label="Search demo medicines"
                      className="w-full min-h-[46px] pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20 [&::-webkit-search-cancel-button]:appearance-none"
                    />
                    {heroQuery && (
                      <button
                        type="button"
                        onClick={() => setHeroQuery('')}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Search Catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {trimmedHeroQuery && (
                  <div
                    role="region"
                    aria-live="polite"
                    aria-label="Instant search results"
                    className="bg-white border border-emerald-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    {liveHeroMatches.length === 0 ? (
                      <div className="px-4 py-3.5 text-sm text-slate-600 flex items-center justify-between gap-3">
                        <span>
                          <strong className="font-semibold text-slate-900">
                            No products found
                          </strong>{' '}
                          for &ldquo;{trimmedHeroQuery}&rdquo;.
                        </span>
                        <button
                          type="button"
                          onClick={() => setHeroQuery('')}
                          className="text-xs font-medium text-[#0B6E4F] hover:text-[#064E3B] whitespace-nowrap cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {liveHeroMatches.slice(0, 5).map((med) => (
                          <button
                            key={med.skuId}
                            type="button"
                            onClick={() => onOpenProduct(med)}
                            className="w-full px-4 py-2.5 text-left hover:bg-[#F6FBF8] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {med.brandName}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {med.category} · {med.genericComposition}
                              </p>
                            </div>
                            <span className="font-mono text-xs font-semibold text-[#0B6E4F] shrink-0 tabular-nums">
                              {formatInr(med.mrpInr)}
                            </span>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={submitHeroSearch}
                          className="w-full px-4 py-2.5 bg-[#F6FBF8] text-xs font-medium text-[#0B6E4F] hover:text-[#064E3B] flex items-center justify-between cursor-pointer"
                        >
                          <span>
                            View all {liveHeroMatches.length} matching demo{' '}
                            {liveHeroMatches.length === 1 ? 'product' : 'products'} in
                            Catalogue
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
                <button
                  type="button"
                  onClick={() => onSearchToCatalogue('')}
                  className="font-medium text-[#0B6E4F] hover:text-[#064E3B] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore all {catalogueMedicines.length} demo SKUs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-slate-300" aria-hidden="true">
                  |
                </span>
                <button
                  type="button"
                  onClick={onOpenRxUpload}
                  className="font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#0B6E4F]" />
                  <span>Open Rx Local Preview</span>
                </button>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-6">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
                <DemoImage
                  src={HERO_BANNER_IMAGE}
                  alt="MediKart modern clinical pharmacy showcase counter"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                  <p className="text-xs font-medium text-emerald-200 mb-1">
                    Clinical Showcase · FEFO Batch Tracking
                  </p>
                  <p className="text-sm sm:text-base font-medium text-white/95 max-w-md">
                    Every sample SKU displays active batch numbers, expiry dates,
                    and schedule classifications for transparent evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Healthcare Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              Healthcare Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a therapeutic category to inspect sample formulations and
              medical devices.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSearchToCatalogue('')}
            className="text-sm font-medium text-[#0B6E4F] hover:text-[#064E3B] inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className="group text-left p-4 rounded-xl bg-[#F6FBF8] border border-emerald-100 hover:border-[#0B6E4F] hover:bg-white transition-all duration-150 flex flex-col justify-between min-h-[124px] cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-emerald-100 text-[#0B6E4F] flex items-center justify-center group-hover:bg-[#0B6E4F] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold text-slate-900 leading-snug">
                    {cat.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Prescription Upload & Ayurveda Promotional Cards */}
      <section className="bg-[#F6FBF8] border-y border-emerald-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Rx Upload Demo Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#0B6E4F]">
                  Local Browser Preview Only · Zero Upload
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Prescription Preview Interface
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                  Inspect how customers select a prescription image or PDF locally,
                  view a synthetic sample demo prescription, and explore saved
                  sample draft markers. Prescription verification and dispensing
                  remain disabled.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenRxUpload}
                  className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Try Local Rx Preview</span>
                </button>
                <span className="text-xs text-slate-500">
                  No PHI transmitted or stored
                </span>
              </div>
            </div>

            {/* Ayurveda Promotional Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
              <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-[#0B6E4F]">
                    Classical Botanicals · Sample Collection
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    Ayurveda &amp; Herbal Care
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Explore standardized Ashwagandha capsules, Tulsi-Giloy
                    distillates, and herbal formulations with full batch and
                    storage metadata.
                  </p>
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => onSelectCategory('Ayurveda & Herbal')}
                    className="min-h-[42px] px-5 py-2.5 rounded-xl border border-[#0B6E4F] text-[#0B6E4F] text-sm font-medium hover:bg-[#F6FBF8] transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore Ayurveda</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-5 min-h-[200px]">
                <DemoImage
                  src={AYURVEDA_PROMO_IMAGE}
                  alt="Ayurveda botanical glass bottles and herbs"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Demo Medicines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              Featured Demo Medicines
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Sample catalogue entries with FEFO active demo batches and
              indicative MRP in ₹ INR.
            </p>
          </div>
          {feedbackMsg && (
            <p
              role="status"
              className="text-xs font-medium text-[#0B6E4F] bg-[#F6FBF8] border border-emerald-200 px-3 py-1.5 rounded-lg"
            >
              {feedbackMsg}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMedicines.map((med) => {
            const fefo = getFefoActiveBatch(med.batches);
            return (
              <article
                key={med.skuId}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all duration-150 flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => onOpenProduct(med)}
                  className="block w-full aspect-[4/3] bg-[#F6FBF8] overflow-hidden cursor-pointer text-left"
                >
                  <DemoImage
                    src={med.imageUrl}
                    alt={`${med.brandName} sample product`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />
                </button>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 truncate">
                      {med.category} · {med.schedule}
                    </p>
                    <h3 className="font-display text-base font-semibold text-slate-900 leading-snug">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(med)}
                        className="text-left hover:text-[#0B6E4F] transition-colors cursor-pointer"
                      >
                        {med.brandName}
                      </button>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {med.genericComposition}
                    </p>
                    <p className="text-xs text-slate-500 pt-1 font-mono tabular-nums">
                      {fefo
                        ? `FEFO ${fefo.batchNumber} · Exp ${fefo.expiryMonthYear}`
                        : 'No active demo batch'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-500">
                        Demo MRP ({med.packSize})
                      </span>
                      <span className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                        {formatInr(med.mrpInr)}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={!fefo}
                      onClick={() => handleQuickAdd(med)}
                      className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#0B6E4F] text-white text-xs font-medium hover:bg-[#064E3B] disabled:bg-slate-200 disabled:text-slate-500 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Demo</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
