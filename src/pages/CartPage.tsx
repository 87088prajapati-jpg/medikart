import {
  ArrowRight,
  Lock,
  Minus,
  Plus,
  ShieldAlert,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { DemoImage } from '../components/DemoImage';
import { useStore } from '../context/StoreContext';
import { formatInr } from '../lib/inventoryUtils';

interface CartPageProps {
  onBrowseCatalogue: () => void;
}

export function CartPage({ onBrowseCatalogue }: CartPageProps) {
  const {
    cartItems,
    updateCartQuantity,
    removeCartItem,
    selectedCity,
    catalogueMedicines,
    addToDemoCart,
  } = useStore();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.mrpInr * item.quantity,
    0,
  );
  // Illustrative 12% GST estimate (example only — not an actual tax calculation)
  const illustrativeGst = subtotal * 0.12;
  const illustrativeTotal = subtotal + illustrativeGst;

  const handleLoadSampleCartItem = () => {
    const sample = catalogueMedicines[0];
    if (sample) {
      addToDemoCart(sample);
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Demo Cart Only · Hub: {selectedCity} · Orders &amp; Payments Disabled
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Demo Shopping Cart
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cartItems.length === 0 ? (
          <div className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 text-[#0B6E4F] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Your Demo Cart is Empty
            </h2>
            <p className="text-sm text-slate-600">
              Add sample medicines from the catalogue to preview batch numbers,
              expiry dates, quantity steppers, and illustrative INR billing.
              Checkout remains permanently disabled.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onBrowseCatalogue}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Demo Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleLoadSampleCartItem}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-[#0B6E4F] text-sm font-medium hover:border-[#0B6E4F] transition-colors cursor-pointer"
              >
                Add Sample Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Demo Line Items */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const matchedProduct = catalogueMedicines.find(
                    (med) => med.skuId === item.skuId,
                  );
                  const thumbnailSrc =
                    matchedProduct?.imageUrl || item.imageUrl || '';

                  return (
                    <div
                      key={item.skuId}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-emerald-100 bg-[#F6FBF8]">
                          <DemoImage
                            src={thumbnailSrc}
                            alt={`${item.brandName} product thumbnail`}
                            compact
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-xs text-[#0B6E4F] font-medium">
                            Sample Demo Item
                          </p>
                          <h2 className="font-display text-base font-semibold text-slate-900 leading-snug">
                            {item.brandName}
                          </h2>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {item.genericComposition}
                          </p>
                          <p className="text-xs font-mono tabular-nums text-slate-500 pt-0.5">
                            Batch {item.batchNumber} · Exp{' '}
                            {item.expiryMonthYear}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                        {/* Quantity Steppers */}
                        <div className="inline-flex items-center border border-slate-200 rounded-xl bg-[#F6FBF8]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.skuId, -1)}
                            aria-label={`Decrease quantity of ${item.brandName}`}
                            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#0B6E4F] cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-9 text-center font-mono text-sm font-semibold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.skuId, 1)}
                            aria-label={`Increase quantity of ${item.brandName}`}
                            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#0B6E4F] cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[88px]">
                          <div className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                            {formatInr(item.mrpInr * item.quantity)}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                            {formatInr(item.mrpInr)} each
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCartItem(item.skuId)}
                          aria-label={`Remove ${item.brandName}`}
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bill Summary & Permanently Disabled Checkout Actions */}
            <aside className="lg:col-span-5 bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Demo Bill Summary (₹ INR)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Illustrative price breakdown for showcase purposes only.
                </p>
              </div>

              <dl className="space-y-3 text-sm border-y border-emerald-200/70 py-4">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Demo Items MRP Subtotal</dt>
                  <dd className="font-mono font-medium text-slate-900 tabular-nums">
                    {formatInr(subtotal)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-600">
                    <span>Illustrative 12% GST Estimate</span>
                    <span className="block text-[11px] text-slate-500">
                      Example only — not an actual tax calculation
                    </span>
                  </dt>
                  <dd className="font-mono font-medium text-slate-900 tabular-nums shrink-0">
                    {formatInr(illustrativeGst)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-emerald-200/70 text-base font-bold text-slate-900">
                  <dt>Illustrative Demo Total</dt>
                  <dd className="font-mono tabular-nums">
                    {formatInr(illustrativeTotal)}
                  </dd>
                </div>
              </dl>

              <div className="bg-white border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Demo showcase only. Real orders, payments, checkout, and
                  medicine fulfilment are permanently disabled.
                </span>
              </div>

              {/* Permanently Disabled Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-slate-200 text-slate-500 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout (Disabled)</span>
                </button>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full min-h-[46px] px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-500 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay via UPI / Card / NetBanking (Locked)</span>
                </button>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
