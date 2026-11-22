import { Minus, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getFefoActiveBatch } from '../lib/inventoryUtils';
import { sanitizeId, SCHEMA_LIMITS } from '../lib/validation';
import type { DemoMedicine } from '../types/pharmacy';

interface ProductQuantityControlProps {
  medicine: DemoMedicine;
  zeroLabel?: string;
  onFeedback?: (message: string) => void;
}

export function ProductQuantityControl({
  medicine,
  zeroLabel = 'Demo',
  onFeedback,
}: ProductQuantityControlProps) {
  const { cartItems, addToDemoCart, updateCartQuantity } = useStore();

  const skuId = sanitizeId(medicine.skuId);
  const fefo = getFefoActiveBatch(medicine.batches);
  const cartItem = cartItems.find((item) => item.skuId === skuId);
  const quantity = cartItem?.quantity ?? 0;
  const maxReached = quantity >= SCHEMA_LIMITS.maxCartQuantity;

  const handleFirstAdd = () => {
    const res = addToDemoCart(medicine);
    onFeedback?.(res.message);
  };

  const handleIncrement = () => {
    if (!fefo || maxReached) return;
    const nextQty = quantity + 1;
    void updateCartQuantity(skuId, 1);
    onFeedback?.(`Updated ${medicine.brandName} demo quantity to ${nextQty}.`);
  };

  const handleDecrement = () => {
    if (quantity <= 0) return;
    const nextQty = quantity - 1;
    void updateCartQuantity(skuId, -1);
    onFeedback?.(
      nextQty === 0
        ? `Removed ${medicine.brandName} from demo cart.`
        : `Updated ${medicine.brandName} demo quantity to ${nextQty}.`,
    );
  };

  if (quantity <= 0) {
    return (
      <button
        type="button"
        disabled={!fefo}
        onClick={handleFirstAdd}
        className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#0B6E4F] text-white text-xs font-medium hover:bg-[#064E3B] disabled:bg-slate-200 disabled:text-slate-500 transition-colors inline-flex items-center justify-center gap-1 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{zeroLabel}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Demo quantity controls for ${medicine.brandName}`}
      className="inline-flex items-center h-[40px] rounded-lg border border-[#0B6E4F] bg-[#0B6E4F] overflow-hidden shrink-0"
    >
      <button
        type="button"
        onClick={handleDecrement}
        aria-label={`Decrease quantity of ${medicine.brandName}`}
        className="w-9 h-full flex items-center justify-center text-white hover:bg-[#064E3B] transition-colors cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        aria-label={`${medicine.brandName} quantity: ${quantity}`}
        className="min-w-[2rem] h-full px-1.5 flex items-center justify-center bg-white text-[#064E3B] font-mono text-xs sm:text-sm font-bold tabular-nums select-none"
      >
        {quantity}
      </span>
      <button
        type="button"
        disabled={!fefo || maxReached}
        onClick={handleIncrement}
        aria-label={`Increase quantity of ${medicine.brandName}`}
        title={
          maxReached
            ? `Maximum demo quantity (${SCHEMA_LIMITS.maxCartQuantity}) reached`
            : `Increase quantity of ${medicine.brandName}`
        }
        className="w-9 h-full flex items-center justify-center text-white hover:bg-[#064E3B] disabled:bg-slate-300 disabled:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
