import { useMemo, useState } from 'react';
import { ArrowUpDown, Plus, Search, X } from 'lucide-react';
import { DemoImage } from '../components/DemoImage';
import { useStore } from '../context/StoreContext';
import {
  formatInr,
  getFefoActiveBatch,
  getNearestValidExpiryTimestamp,
} from '../lib/inventoryUtils';
import { MEDICINE_CATEGORIES, MEDICINE_SCHEDULES } from '../lib/validation';
import type {
  DemoMedicine,
  MedicineCategory,
  MedicineSchedule,
  SortOption,
} from '../types/pharmacy';

interface CataloguePageProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  selectedCategory: MedicineCategory | 'All';
  onSelectCategory: (cat: MedicineCategory | 'All') => void;
  onOpenProduct: (medicine: DemoMedicine) => void;
}

export function CataloguePage({
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onSelectCategory,
  onOpenProduct,
}: CataloguePageProps) {
  const { catalogueMedicines, addToDemoCart } = useStore();
  const [selectedSchedule, setSelectedSchedule] = useState<
    MedicineSchedule | 'All'
  >('All');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = catalogueMedicines.filter((med) => {
      if (selectedCategory !== 'All' && med.category !== selectedCategory) {
        return false;
      }
      if (selectedSchedule !== 'All' && med.schedule !== selectedSchedule) {
        return false;
      }
      if (!q) return true;

      const batchHit = med.batches.some((b) =>
        b.batchNumber.toLowerCase().includes(q),
      );
      return (
        med.brandName.toLowerCase().includes(q) ||
        med.genericComposition.toLowerCase().includes(q) ||
        med.manufacturer.toLowerCase().includes(q) ||
        batchHit
      );
    });

    const sorted = [...matches];
    if (sortBy === 'mrp-asc') {
      sorted.sort((a, b) => a.mrpInr - b.mrpInr);
    } else if (sortBy === 'mrp-desc') {
      sorted.sort((a, b) => b.mrpInr - a.mrpInr);
    } else if (sortBy === 'nearest-expiry') {
      sorted.sort(
        (a, b) =>
          getNearestValidExpiryTimestamp(a) - getNearestValidExpiryTimestamp(b),
      );
    }
    return sorted;
  }, [
    catalogueMedicines,
    searchQuery,
    selectedCategory,
    selectedSchedule,
    sortBy,
  ]);

  const handleAdd = (med: DemoMedicine) => {
    const res = addToDemoCart(med);
    setFeedback(res.message);
    window.setTimeout(() => {
      setFeedback((curr) => (curr === res.message ? null : curr));
    }, 3000);
  };

  const resetFilters = () => {
    onSearchQueryChange('');
    onSelectCategory('All');
    setSelectedSchedule('All');
    setSortBy('relevance');
  };

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Catalogue Header & Search Controls */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#0B6E4F]">
                Sample Data Only · Sales &amp; Dispensing Disabled
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Medicine &amp; Wellness Catalogue
              </h1>
            </div>
            {feedback && (
              <p
                role="status"
                className="text-xs font-medium text-[#0B6E4F] bg-white border border-emerald-200 px-3.5 py-2 rounded-lg"
              >
                {feedback}
              </p>
            )}
          </div>

          {/* Search & Sort Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-8 relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search by brand name, generic salt composition, manufacturer, or batch number..."
                aria-label="Search medicine catalogue"
                className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchQueryChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="lg:col-span-4 relative flex items-center">
              <ArrowUpDown
                className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort medicines"
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0B6E4F] cursor-pointer"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="mrp-asc">Sort: MRP Low-to-High</option>
                <option value="mrp-desc">Sort: MRP High-to-Low</option>
                <option value="nearest-expiry">Sort: Nearest Valid Expiry</option>
              </select>
            </div>
          </div>

          {/* Interactive Filter Controls */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-[#0B6E4F] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                All Categories
              </button>
              {MEDICINE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0B6E4F] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500 mr-1">
                Schedule:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSchedule('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSchedule === 'All'
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                All Schedules
              </button>
              {MEDICINE_SCHEDULES.map((sched) => (
                <button
                  key={sched}
                  type="button"
                  onClick={() => setSelectedSchedule(sched)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSchedule === sched
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {sched}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 text-sm text-slate-600">
          <span>
            Showing{' '}
            <strong className="font-mono tabular-nums text-slate-900">
              {filteredMedicines.length}
            </strong>{' '}
            sample demo items
          </span>
          {(searchQuery ||
            selectedCategory !== 'All' ||
            selectedSchedule !== 'All') && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-[#0B6E4F] hover:text-[#064E3B] cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-10 text-center max-w-xl mx-auto">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              No matching demo products found
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Try searching a different generic salt, manufacturer, or batch
              number, or clear the active category and schedule filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 px-4 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors cursor-pointer"
            >
              Show All Demo Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((med) => {
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
                      alt={`${med.brandName} sample`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  </button>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-500 truncate">
                        {med.category} · {med.schedule}
                      </p>
                      <h2 className="font-display text-base font-semibold text-slate-900">
                        <button
                          type="button"
                          onClick={() => onOpenProduct(med)}
                          className="text-left hover:text-[#0B6E4F] transition-colors cursor-pointer"
                        >
                          {med.brandName}
                        </button>
                      </h2>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {med.genericComposition}
                      </p>
                      <p className="text-xs text-slate-500">
                        {med.manufacturer}
                      </p>
                      <p className="text-xs font-mono tabular-nums text-slate-600 pt-1">
                        {fefo
                          ? `FEFO ${fefo.batchNumber} · Exp ${fefo.expiryMonthYear}`
                          : 'Out of valid demo stock'}
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
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenProduct(med)}
                          className="min-h-[38px] px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          disabled={!fefo}
                          onClick={() => handleAdd(med)}
                          className="min-h-[38px] px-3 py-2 rounded-lg bg-[#0B6E4F] text-white text-xs font-medium hover:bg-[#064E3B] disabled:bg-slate-200 disabled:text-slate-500 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
