import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  LogOut,
  Minus,
  PackagePlus,
  Plus,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  computeInventoryKpis,
  formatInr,
  getBatchStatus,
} from '../lib/inventoryUtils';
import {
  MEDICINE_CATEGORIES,
  MEDICINE_SCHEDULES,
  SCHEMA_LIMITS,
} from '../lib/validation';
import type { MedicineCategory, MedicineSchedule } from '../types/pharmacy';

interface AdminDashboardPageProps {
  onExitSandbox: () => void;
  onGoToStaffLogin: () => void;
}

const STATUTORY_LEGAL_GATE_ITEMS = [
  {
    title: 'Retail & Wholesale Drug Sale Licences (Forms 20, 21, 20B, 21B)',
    authority: 'State Drug Control Department / CDSCO',
    note: 'Mandatory under the Drugs and Cosmetics Act, 1940 & Rules, 1945 before stocking or selling any allopathic medicine.',
  },
  {
    title: 'Registered Pharmacist Supervision (Section 42)',
    authority: 'State Pharmacy Council',
    note: 'Dispensing of Schedule H / H1 / X formulations requires direct supervision and sign-off by a registered pharmacist.',
  },
  {
    title: 'Licensed Premises & Cold-Chain Storage Verification',
    authority: 'Drug Inspector Premises Inspection',
    note: 'Physical premises area, calibrated temperature logs (2°C–8°C / <25°C), and quarantine zones must be inspected and approved.',
  },
  {
    title: 'Schedule H / H1 Narcotic & Prescription Registers',
    authority: 'Drugs & Cosmetics Rules Compliance',
    note: 'Prescriber details, patient records, batch number, and expiry date registers must follow statutory retention formats.',
  },
  {
    title: 'FSSAI Registration (Nutraceuticals & Dietary Supplements Only)',
    authority: 'Food Safety and Standards Authority of India',
    note: 'Informational clarity: FSSAI applies strictly to health supplements/foods and NEVER authorizes sale of pharmaceutical drugs.',
  },
  {
    title: 'RBI Payment Aggregator / Merchant KYC',
    authority: 'Reserve Bank of India / Acquiring Bank',
    note: 'Informational clarity: Merchant KYC enables payment settlement only and NEVER authorizes pharmacy operations or medicine sales.',
  },
];

export function AdminDashboardPage({
  onExitSandbox,
  onGoToStaffLogin,
}: AdminDashboardPageProps) {
  const {
    isVerifiedAdmin,
    adminSandboxActive,
    setAdminSandboxActive,
    adminInventory,
    adminAdjustBatchStock,
    adminToggleQuarantine,
    adminAddBatch,
    adminAddDemoSku,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activePanel, setActivePanel] = useState<'none' | 'add-batch' | 'add-sku'>(
    'none',
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add Batch form state
  const [batchSkuId, setBatchSkuId] = useState(
    adminInventory[0]?.skuId || '',
  );
  const [batchNumber, setBatchNumber] = useState('');
  const [batchExpiry, setBatchExpiry] = useState('08/2028');
  const [batchQty, setBatchQty] = useState('50');

  // Add Demo SKU form state
  const [skuBrand, setSkuBrand] = useState('');
  const [skuSalt, setSkuSalt] = useState('');
  const [skuMfg, setSkuMfg] = useState('');
  const [skuCategory, setSkuCategory] =
    useState<MedicineCategory>('Chronic & Cardiac');
  const [skuSchedule, setSkuSchedule] =
    useState<MedicineSchedule>('Schedule H Rx Required');
  const [skuMrp, setSkuMrp] = useState('120');
  const [skuPack, setSkuPack] = useState('Strip of 10 Tablets');
  const [skuSummary, setSkuSummary] = useState('');
  const [skuStorage, setSkuStorage] = useState('Store below 25°C in a dry place.');
  const [skuBatchNo, setSkuBatchNo] = useState('');
  const [skuExpiry, setSkuExpiry] = useState('10/2028');
  const [skuQty, setSkuQty] = useState('40');

  const kpis = useMemo(
    () => computeInventoryKpis(adminInventory),
    [adminInventory],
  );

  const filteredSkus = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return adminInventory;
    return adminInventory.filter(
      (med) =>
        med.brandName.toLowerCase().includes(q) ||
        med.genericComposition.toLowerCase().includes(q) ||
        med.batches.some((b) => b.batchNumber.toLowerCase().includes(q)),
    );
  }, [adminInventory, searchTerm]);

  const allowDevSandbox = __ENABLE_ADMIN_SANDBOX__ && adminSandboxActive;

  // Strict Access Gate: Never render Admin dashboard if neither verified Admin nor DEV sandbox
  if (!isVerifiedAdmin && !allowDevSandbox) {
    return (
      <div className="bg-white min-h-[calc(100vh-140px)] py-16 px-4">
        <div className="max-w-lg mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-red-700 mx-auto" />
          <h1 className="font-display text-xl font-bold text-slate-900">
            Admin Authorization Required
          </h1>
          <p className="text-sm text-slate-600">
            Customer accounts cannot access Admin inventory or batch controls.
            Sign in through the Staff Portal with a server-provisioned Admin
            account.
          </p>
          <button
            type="button"
            onClick={onGoToStaffLogin}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] cursor-pointer"
          >
            Go to Staff Portal
          </button>
        </div>
      </div>
    );
  }

  const handleAddBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const res = await adminAddBatch(batchSkuId, {
      batchNumber,
      expiryMonthYear: batchExpiry,
      quantity: Number.parseInt(batchQty, 10),
    });

    if (!res.ok) {
      setErrorMessage(res.error || 'Failed to add batch.');
      return;
    }

    setStatusMessage(`Added batch ${batchNumber.trim()} (${batchExpiry}).`);
    setBatchNumber('');
    setActivePanel('none');
  };

  const handleAddSkuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const res = await adminAddDemoSku({
      brandName: skuBrand,
      genericComposition: skuSalt,
      manufacturer: skuMfg,
      category: skuCategory,
      schedule: skuSchedule,
      mrpInr: Number.parseFloat(skuMrp),
      packSize: skuPack,
      clinicalSummary: skuSummary,
      storageInstructions: skuStorage,
      batchNumber: skuBatchNo,
      expiryMonthYear: skuExpiry,
      quantity: Number.parseInt(skuQty, 10),
    });

    if (!res.ok) {
      setErrorMessage(res.error || 'Failed to add demo SKU.');
      return;
    }

    setStatusMessage(`Added demo SKU "${skuBrand.trim()}" with batch ${skuBatchNo.trim()}.`);
    setSkuBrand('');
    setSkuSalt('');
    setSkuMfg('');
    setSkuBatchNo('');
    setActivePanel('none');
  };

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-[#064E3B] text-white border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {__ENABLE_ADMIN_SANDBOX__ && !isVerifiedAdmin
                  ? 'DEMO MODE · Unverified Local Sandbox (No Firestore Admin Access)'
                  : 'Verified Admin Session · Firestore RBAC Active'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Pharmacy Inventory &amp; Batch Control
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setActivePanel(activePanel === 'add-batch' ? 'none' : 'add-batch')
              }
              className="min-h-[40px] px-4 py-2 rounded-xl bg-white text-[#064E3B] text-xs font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Batch</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setActivePanel(activePanel === 'add-sku' ? 'none' : 'add-sku')
              }
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0B6E4F] border border-emerald-500/40 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add Demo SKU</span>
            </button>
            {__ENABLE_ADMIN_SANDBOX__ && !isVerifiedAdmin && adminSandboxActive && (
              <button
                type="button"
                onClick={() => {
                  setAdminSandboxActive(false);
                  onExitSandbox();
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-emerald-600 text-xs font-medium text-emerald-100 hover:bg-emerald-900 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Sandbox</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 4 KPI Strip */}
        <section aria-label="Inventory KPIs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs font-medium text-[#0B6E4F]">
                <span>Valid Stock</span>
                <Boxes className="w-4 h-4" />
              </div>
              <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-2">
                {kpis.validStockUnits.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Active non-expired, non-quarantined units
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs font-medium text-amber-700">
                <span>Low Stock (&le;25)</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-2">
                {kpis.lowStockBatchCount}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Valid batches at or below 25 units
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs font-medium text-amber-700">
                <span>Expiring Stock (&le;90d)</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-2">
                {kpis.expiringStockUnits.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Units expiring within 90 days
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs font-medium text-red-700">
                <span>Expired or Quarantined</span>
                <ShieldAlert className="w-4 h-4" />
              </div>
              <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-2">
                {kpis.expiredOrQuarantinedUnits.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Blocked from FEFO catalogue dispatch
              </p>
            </div>
          </div>
        </section>

        {/* Feedback Banners */}
        {statusMessage && (
          <p
            role="status"
            className="text-xs font-medium text-[#0B6E4F] bg-[#F6FBF8] border border-emerald-200 rounded-xl px-4 py-3"
          >
            {statusMessage}
          </p>
        )}
        {errorMessage && (
          <p
            role="alert"
            className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >
            {errorMessage}
          </p>
        )}

        {/* Add Batch Form */}
        {activePanel === 'add-batch' && (
          <form
            onSubmit={handleAddBatchSubmit}
            className="bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Add New Demo Batch
              </h2>
              <button
                type="button"
                onClick={() => setActivePanel('none')}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="batch-sku-select"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Target Demo SKU
                </label>
                <select
                  id="batch-sku-select"
                  value={batchSkuId}
                  onChange={(e) => setBatchSkuId(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                >
                  {adminInventory.map((m) => (
                    <option key={m.skuId} value={m.skuId}>
                      {m.brandName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="new-batch-no"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Batch Number
                </label>
                <input
                  id="new-batch-no"
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.batchNumberMax}
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="MK-NEW-2706"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label
                  htmlFor="new-batch-exp"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Expiry (MM/YYYY)
                </label>
                <input
                  id="new-batch-exp"
                  type="text"
                  required
                  value={batchExpiry}
                  onChange={(e) => setBatchExpiry(e.target.value)}
                  placeholder="08/2028"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label
                  htmlFor="new-batch-qty"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Initial Quantity
                </label>
                <input
                  id="new-batch-qty"
                  type="number"
                  min={0}
                  max={SCHEMA_LIMITS.maxStockQuantity}
                  required
                  value={batchQty}
                  onChange={(e) => setBatchQty(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] cursor-pointer"
            >
              Save Batch Record
            </button>
          </form>
        )}

        {/* Add Demo SKU Form */}
        {activePanel === 'add-sku' && (
          <form
            onSubmit={handleAddSkuSubmit}
            className="bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Add New Demo SKU
              </h2>
              <button
                type="button"
                onClick={() => setActivePanel('none')}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Brand Name (Demo)
                </label>
                <input
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.brandNameMax}
                  value={skuBrand}
                  onChange={(e) => setSkuBrand(e.target.value)}
                  placeholder="AtorvaCare 10 Demo"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Generic Composition
                </label>
                <input
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.genericCompositionMax}
                  value={skuSalt}
                  onChange={(e) => setSkuSalt(e.target.value)}
                  placeholder="Atorvastatin IP 10 mg"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Manufacturer (Sample)
                </label>
                <input
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.manufacturerMax}
                  value={skuMfg}
                  onChange={(e) => setSkuMfg(e.target.value)}
                  placeholder="Deccan Pharma (Sample)"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={skuCategory}
                  onChange={(e) =>
                    setSkuCategory(e.target.value as MedicineCategory)
                  }
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                >
                  {MEDICINE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Schedule
                </label>
                <select
                  value={skuSchedule}
                  onChange={(e) =>
                    setSkuSchedule(e.target.value as MedicineSchedule)
                  }
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                >
                  {MEDICINE_SCHEDULES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Demo MRP (₹ INR)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  max={SCHEMA_LIMITS.maxMrpInr}
                  required
                  value={skuMrp}
                  onChange={(e) => setSkuMrp(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Initial Batch Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={SCHEMA_LIMITS.batchNumberMax}
                  value={skuBatchNo}
                  onChange={(e) => setSkuBatchNo(e.target.value)}
                  placeholder="MK-ATV-2701"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Expiry (MM/YYYY)
                </label>
                <input
                  type="text"
                  required
                  value={skuExpiry}
                  onChange={(e) => setSkuExpiry(e.target.value)}
                  placeholder="10/2028"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Initial Demo Qty
                </label>
                <input
                  type="number"
                  min={0}
                  max={SCHEMA_LIMITS.maxStockQuantity}
                  required
                  value={skuQty}
                  onChange={(e) => setSkuQty(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pack Size
                </label>
                <input
                  type="text"
                  value={skuPack}
                  onChange={(e) => setSkuPack(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Storage Instructions
                </label>
                <input
                  type="text"
                  value={skuStorage}
                  onChange={(e) => setSkuStorage(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Clinical Summary (Demo)
              </label>
              <input
                type="text"
                value={skuSummary}
                onChange={(e) => setSkuSummary(e.target.value)}
                placeholder="Sample formulation summary for catalogue demonstration."
                className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] cursor-pointer"
            >
              Create Demo SKU
            </button>
          </form>
        )}

        {/* Batch & Expiry Management Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Batch Number &amp; Expiry Management (MM/YYYY)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Adjust sample stock with +10 / -1 steppers or toggle Hold /
                Quarantine per batch.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter SKU or batch #..."
                aria-label="Filter admin inventory"
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#0B6E4F]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F6FBF8] border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4">Demo SKU &amp; MRP</th>
                  <th className="py-3.5 px-4">Batch #</th>
                  <th className="py-3.5 px-4">Expiry</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4 text-right">Stock Qty</th>
                  <th className="py-3.5 px-4 text-right">Steppers &amp; Hold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSkus.flatMap((med) =>
                  med.batches.map((batch) => {
                    const status = getBatchStatus(batch);
                    const isLow =
                      (status === 'active' || status === 'expiring_soon') &&
                      batch.quantity <= 25;
                    return (
                      <tr key={`${med.skuId}-${batch.batchId}`} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900">
                            {med.brandName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {med.schedule} ·{' '}
                            <span className="font-mono tabular-nums">
                              {formatInr(med.mrpInr)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-800">
                          {batch.batchNumber}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-700">
                          {batch.expiryMonthYear}
                        </td>
                        <td className="py-3.5 px-4">
                          {status === 'quarantined' ? (
                            <span className="text-xs font-semibold text-red-700">
                              Quarantined
                            </span>
                          ) : status === 'expired' ? (
                            <span className="text-xs font-semibold text-red-700">
                              Expired
                            </span>
                          ) : status === 'expiring_soon' ? (
                            <span className="text-xs font-semibold text-amber-700">
                              Expiring &le;90d{isLow ? ' · Low' : ''}
                            </span>
                          ) : isLow ? (
                            <span className="text-xs font-semibold text-amber-700">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#0B6E4F]">
                              Valid Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                          {batch.quantity}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                adminAdjustBatchStock(
                                  med.skuId,
                                  batch.batchId,
                                  -1,
                                )
                              }
                              aria-label={`Decrease ${batch.batchNumber} by 1`}
                              className="min-h-[34px] px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:border-[#0B6E4F] hover:text-[#0B6E4F] inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                              <span>1</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                adminAdjustBatchStock(
                                  med.skuId,
                                  batch.batchId,
                                  10,
                                )
                              }
                              aria-label={`Increase ${batch.batchNumber} by 10`}
                              className="min-h-[34px] px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:border-[#0B6E4F] hover:text-[#0B6E4F] inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>10</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                adminToggleQuarantine(med.skuId, batch.batchId)
                              }
                              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                batch.quarantined
                                  ? 'bg-red-700 text-white hover:bg-red-800'
                                  : 'bg-[#F6FBF8] border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700'
                              }`}
                            >
                              {batch.quarantined ? 'Release Hold' : 'Hold / Quarantine'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Statutory Legal Gate Checklist (Informational Only) */}
        <section className="bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <Scale className="w-6 h-6 text-[#0B6E4F] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#0B6E4F]">
                Informational Only — Not Legal Authorization
              </p>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Statutory Legal Gate Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                Before any future real pharmacy operation, all applicable
                drug-sale licences, registered pharmacist requirements, premises
                approvals, and other applicable legal requirements must be
                independently verified with the relevant authorities. Neither
                FSSAI registration nor RBI Merchant KYC alone authorizes
                pharmacy sales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {STATUTORY_LEGAL_GATE_ITEMS.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <CheckCircle2
                    className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs font-medium text-[#0B6E4F]">
                  Authority: {item.authority}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
