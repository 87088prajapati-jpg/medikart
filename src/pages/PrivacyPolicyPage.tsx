import {
  ArrowRight,
  Database,
  FileWarning,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBrowseCatalogue: () => void;
  onOpenTerms: () => void;
  onOpenDisclaimer: () => void;
}

export function PrivacyPolicyPage({
  onBrowseCatalogue,
  onOpenTerms,
  onOpenDisclaimer,
}: PrivacyPolicyPageProps) {
  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header Section */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Demo Platform Transparency · Privacy Notice
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            Privacy Policy
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl mt-3">
            MediKart India currently operates strictly as a demo pharmacy
            catalogue and medicine information platform. No medicines are sold,
            ordered, or dispensed through this website, and sensitive personal
            health information should not be entered or uploaded.
          </p>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <FileWarning className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              1. Prescription Previews (Local Browser Only)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Files selected inside the Rx Upload preview interface (images or
              PDFs, up to 10 MB per file) are rendered strictly inside your
              local browser memory using temporary object URLs. Prescriptions
              are{' '}
              <strong className="font-semibold text-slate-900">
                never uploaded, transmitted over the network, stored on any
                server, verified, or reviewed by a pharmacist
              </strong>
              .
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              2. Contact Us Form (Demo Only)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Contact Us page provides a demonstration user interface only.
              Submitting the Contact Us form displays a local confirmation
              preview in your browser and{' '}
              <strong className="font-semibold text-slate-900">
                does not send emails, transmit inquiries, or store messages
              </strong>{' '}
              in any database or inbox.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              3. No Sales, Checkout, Payments, or Order Fulfilment
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Because all commercial sales, checkout flows, order fulfilment,
              and UPI/card/banking payment options are permanently disabled,
              MediKart never collects payment credentials, financial details, or
              real delivery orders.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Database className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              4. Browser Storage &amp; Optional Demo Account
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Guest demo cart selections are stored locally in your browser&apos;s{' '}
              <code className="font-mono">localStorage</code> so your demo cart
              persists on refresh. If you choose to create an optional demo
              customer account via Firebase Email &amp; Password authentication,
              basic demo profile details and non-PHI sample markers are scoped
              to your authenticated session under Firebase security rules.
            </p>
          </article>
        </div>

        {/* Additional Transparency Notice */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0B6E4F]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h2>5. Regulatory &amp; Certification Clarification</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediKart India is an educational and UI/catalogue showcase and does
              not claim any drug licence, pharmacy registration, medical
              certification, or statutory regulatory approval. Do not submit real
              medical records or confidential personal data anywhere on this
              demo site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBrowseCatalogue}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors whitespace-nowrap cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors whitespace-nowrap cursor-pointer"
            >
              Read Disclaimer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
