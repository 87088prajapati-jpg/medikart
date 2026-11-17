import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Package,
  Plus,
  ShieldAlert,
  ThermometerSnowflake,
} from 'lucide-react';
import { DemoImage } from '../components/DemoImage';
import { useStore } from '../context/StoreContext';
import {
  formatInr,
  getBatchStatus,
  getFefoActiveBatch,
  parseExpiryEndOfMonth,
} from '../lib/inventoryUtils';
import type { DemoMedicine } from '../types/pharmacy';

interface ProductDetailPageProps {
  medicine: DemoMedicine;
  onBack: () => void;
  onGoToCart: () => void;
}

export function ProductDetailPage({
  medicine,
  onBack,
  onGoToCart,
}: ProductDetailPageProps) {
  const { addToDemoCart } = useStore();
  const [addedMsg, setAddedMsg] = useState<string | null>(null);

  const fefoBatch = getFefoActiveBatch(medicine.batches);

  const sortedBatches = [...medicine.batches].sort(
    (a, b) =>
      parseExpiryEndOfMonth(a.expiryMonthYear).getTime() -
      parseExpiryEndOfMonth(b.expiryMonthYear).getTime(),
  );

  const handleAdd = () => {
    const res = addToDemoCart(medicine);
    setAddedMsg(res.message);
  };

  const renderStatusLabel = (
    status: ReturnType<typeof getBatchStatus>,
    isFefo: boolean,
  ) => {
    if (isFefo) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6E4F]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          FEFO Active
        </span>
      );
    }
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid Reserve
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Expiring &le;90d
          </span>
        );
      case 'quarantined':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            Quarantined
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            Expired
          </span>
        );
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B6E4F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>

        {/* Contiguous Product Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Image */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-[#F6FBF8]">
              <DemoImage
                src={medicine.imageUrl}
                alt={`${medicine.brandName} (${medicine.genericComposition}) — ${medicine.packSize} sample packaging`}
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Sample product visualization for MediKart demo catalogue only.
            </p>
          </div>

          {/* Core Specs & Purchase Module */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2 border-b border-slate-200 pb-6">
              <p className="text-xs font-medium text-[#0B6E4F]">
                Sample Demo SKU · {medicine.category} · {medicine.schedule}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {medicine.brandName}
              </h1>
              <p className="text-base text-slate-700 font-medium">
                {medicine.genericComposition}
              </p>
              <p className="text-sm text-slate-500">
                Manufacturer: {medicine.manufacturer} · Pack Size:{' '}
                {medicine.packSize}
              </p>
            </div>

            {/* Pricing & FEFO Active Batch */}
            <div className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Sample MRP (Inclusive of illustrative taxes)
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                    {formatInr(medicine.mrpInr)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">
                    FEFO Active Demo Batch
                  </span>
                  {fefoBatch ? (
                    <span className="font-mono text-sm font-semibold text-[#0B6E4F] tabular-nums">
                      {fefoBatch.batchNumber} · Exp {fefoBatch.expiryMonthYear} (
                      {fefoBatch.quantity} demo units)
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-red-700">
                      No valid active demo batch
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={!fefoBatch}
                  onClick={handleAdd}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] disabled:bg-slate-200 disabled:text-slate-500 transition-colors inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Demo Item to Cart</span>
                </button>
                {addedMsg && (
                  <button
                    type="button"
                    onClick={onGoToCart}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#0B6E4F] text-[#0B6E4F] text-sm font-medium hover:bg-white transition-colors cursor-pointer"
                  >
                    View Demo Cart
                  </button>
                )}
              </div>

              {addedMsg && (
                <p role="status" className="text-xs font-medium text-[#0B6E4F]">
                  {addedMsg}
                </p>
              )}

              <p className="text-xs text-slate-500 pt-1">
                Notice: Demo mode only. Adding to cart previews line items and
                illustrative calculations; checkout and dispensing are disabled.
              </p>
            </div>

            {/* Clinical Summary & Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Package className="w-4 h-4 text-[#0B6E4F]" />
                  <span>Clinical Summary (Demo)</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {medicine.clinicalSummary}
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ThermometerSnowflake className="w-4 h-4 text-[#0B6E4F]" />
                  <span>Storage Instructions</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {medicine.storageInstructions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Batch & Expiry History */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Batch &amp; Expiry History (Sample FEFO Ledger)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              First-Expired, First-Out (FEFO) automatically selects the earliest
              non-expired, non-quarantined batch with available demo stock.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F6FBF8] border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4">Batch Number</th>
                  <th className="py-3.5 px-4">Expiry (MM/YYYY)</th>
                  <th className="py-3.5 px-4 text-right">Demo Qty</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sortedBatches.map((batch) => {
                  const status = getBatchStatus(batch);
                  const isFefo = fefoBatch?.batchId === batch.batchId;
                  return (
                    <tr
                      key={batch.batchId}
                      className={isFefo ? 'bg-emerald-50/40' : 'bg-white'}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs sm:text-sm font-medium text-slate-900">
                        {batch.batchNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                        {batch.expiryMonthYear}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-right text-slate-900">
                        {batch.quantity}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatusLabel(status, isFefo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
