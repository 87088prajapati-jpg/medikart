import {
  ArrowRight,
  Ban,
  Database,
  FileText,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

interface TermsPageProps {
  onBrowseCatalogue: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenDisclaimer: () => void;
}

export function TermsPage({
  onBrowseCatalogue,
  onOpenPrivacyPolicy,
  onOpenDisclaimer,
}: TermsPageProps) {
  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header Section */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Demo Platform Usage Rules · Catalogue Showcase Only
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl mt-3">
            These Terms &amp; Conditions govern access to MediKart India.
            MediKart is currently a strictly demo and catalogue-only platform—no
            online medicine sales, checkout, payments, or order fulfilment are
            available.
          </p>
        </div>
      </section>

      {/* Terms Clauses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              1. Demo &amp; Catalogue-Only Platform Scope
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediKart India is presented solely as a demonstration pharmacy
              catalogue and medicine information showcase. Browsing product
              listings, sample prices, or FEFO batch examples does not create a
              commercial offer, buyer-seller contract, or patient-pharmacist
              relationship.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Ban className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              2. No Sales, Payments, Checkout, or Order Fulfilment
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Online medicine sales, payment processing, billing, checkout
              submission, and delivery or order fulfilment are permanently
              disabled. Using the demo shopping cart only illustrates SKU
              selection, indicative INR calculations, and batch assignment inside
              the demo interface.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              3. Limitations of Prescription Uploads &amp; Demo Features
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Rx Upload interface only generates a local browser preview (up
              to 10 MB per file). Selected files are{' '}
              <strong className="font-semibold text-slate-900">
                not transmitted to any server, verified, approved, or dispensed
              </strong>
              . Likewise, the Contact Us form is a local UI demo that neither
              sends nor stores messages, and inventory/admin views display
              illustrative demo data only.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Database className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              4. User Information &amp; Responsible Demo Usage
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Do not enter real patient records, personal health information
              (PHI), or financial credentials anywhere on MediKart. Guest cart
              state stays in browser <code className="font-mono">localStorage</code>,
              and optional Firebase Email/Password demo accounts exist strictly
              to test sign-in and sample profile workflows.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3 md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              5. No Drug Licence, Pharmacy Registration, or Medical Certification
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediKart India does not claim any retail or wholesale drug licence,
              pharmacy registration, statutory authority approval, or medical
              certification. Medicine details shown on this platform are general
              sample information for demonstration only and must never replace
              advice from a qualified doctor or registered pharmacist.
            </p>
          </article>
        </div>

        {/* Summary Callout */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0B6E4F]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h2>Related Policy &amp; Transparency Pages</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Review how browser data and demo accounts are handled in our
              Privacy Policy, or read our full medical and regulatory
              Disclaimer before exploring the catalogue.
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
              onClick={onOpenPrivacyPolicy}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors whitespace-nowrap cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors whitespace-nowrap cursor-pointer"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
