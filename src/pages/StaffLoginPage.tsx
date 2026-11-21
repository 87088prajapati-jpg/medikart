import { useState } from 'react';
import { LockKeyhole, ShieldCheck, ShieldOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface StaffLoginPageProps {
  onVerifiedAdminSuccess: () => void;
  onEnterDemoSandbox: () => void;
  onBackHome: () => void;
}

export function StaffLoginPage({
  onVerifiedAdminSuccess,
  onEnterDemoSandbox,
  onBackHome,
}: StaffLoginPageProps) {
  const { loginStaffAdmin, setAdminSandboxActive, isVerifiedAdmin } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    const res = await loginStaffAdmin(email, password);
    setSubmitting(false);

    if (res.ok) {
      onVerifiedAdminSuccess();
    } else {
      setErrorMsg(res.error || 'Admin verification failed.');
    }
  };

  const handleOpenSandbox = () => {
    if (!__ENABLE_ADMIN_SANDBOX__) return;
    setAdminSandboxActive(true);
    onEnterDemoSandbox();
  };

  if (isVerifiedAdmin) {
    return (
      <div className="bg-white min-h-[calc(100vh-140px)] py-14 px-4">
        <div className="max-w-lg mx-auto bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
          <ShieldCheck className="w-10 h-10 text-[#0B6E4F] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Verified Admin Session Active
          </h1>
          <p className="text-sm text-slate-600">
            Your account has verified server-provisioned Admin authorization.
          </p>
          <button
            type="button"
            onClick={onVerifiedAdminSuccess}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] cursor-pointer"
          >
            Open Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      <section className="bg-[#064E3B] text-white border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-medium text-emerald-200">
            Separate Staff Access · Zero-Trust RBAC Enforced
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            MediKart Admin Staff Portal
          </h1>
        </div>
      </section>

      <section
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-10 ${
          __ENABLE_ADMIN_SANDBOX__
            ? 'max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'
            : 'max-w-xl'
        }`}
      >
        {/* Verified Server-Side Admin Login */}
        <div
          className={`${
            __ENABLE_ADMIN_SANDBOX__ ? 'lg:col-span-7' : ''
          } bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6FBF8] border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <LockKeyhole className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Verified Staff Sign In
              </h2>
              <p className="text-xs text-slate-500">
                Requires verified email + server-provisioned <code className="font-mono">/admins/{'{uid}'}</code> record
              </p>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl p-3.5"
            >
              <ShieldOff className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="staff-email"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Staff Email Address
              </label>
              <input
                id="staff-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff-admin@medikart-demo.in"
                className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
              />
            </div>

            <div>
              <label
                htmlFor="staff-password"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="staff-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting ? 'Verifying Admin Authorization...' : 'Sign In as Verified Staff'}
            </button>
          </form>

          <p className="text-xs text-slate-500 leading-relaxed">
            Security policy: Customer accounts cannot assign themselves an
            Admin role. Admin privileges can only be provisioned via trusted
            server-side Firebase Admin tooling.
          </p>

          {!__ENABLE_ADMIN_SANDBOX__ && (
            <button
              type="button"
              onClick={onBackHome}
              className="w-full min-h-[40px] px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Return to Storefront
            </button>
          )}
        </div>

        {/* Isolated Local Demo Mode Fallback (Development/Evaluation Builds Only) */}
        {__ENABLE_ADMIN_SANDBOX__ && (
          <div className="lg:col-span-5 bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-6 space-y-4">
            <p className="text-xs font-semibold text-[#0B6E4F]">
              Demo Evaluation Mode
            </p>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Admin Inventory UI Sandbox
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              When trusted server-side Admin authorization is not yet
              provisioned for your session, you can inspect the Admin KPIs, FEFO
              batch steppers, quarantine controls, and Statutory Legal Gate
              checklist in strictly isolated local demo mode.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              This sandbox uses local browser state only — it does not grant
              Admin permissions, modify user roles, or read/write Firestore
              inventory.
            </p>
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleOpenSandbox}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#0B6E4F] bg-white text-[#0B6E4F] text-sm font-medium hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Open Admin Demo Mode (Local Sandbox)
              </button>
              <button
                type="button"
                onClick={onBackHome}
                className="w-full min-h-[40px] px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
