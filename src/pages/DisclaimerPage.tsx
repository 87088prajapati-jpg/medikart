import {
  AlertTriangle,
  ArrowRight,
  Ban,
  FileText,
  Scale,
  Stethoscope,
} from 'lucide-react';

interface DisclaimerPageProps {
  onBrowseCatalogue: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
}

export function DisclaimerPage({
  onBrowseCatalogue,
  onOpenPrivacyPolicy,
  onOpenTerms,
}: DisclaimerPageProps) {
  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header Section */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Demo Catalogue Notice · Informational Reference Only
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            Disclaimer
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl mt-3">
            MediKart India is strictly a demo pharmacy catalogue and medicine
            information showcase. Nothing on this website constitutes medical
            advice, commercial pharmacy operations, or an offer to sell or
            dispense medicines.
          </p>
        </div>
      </section>

      {/* Disclaimer Clauses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              1. Not a Substitute for Medical or Pharmacist Advice
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Product names, generic salt compositions, clinical summaries,
              storage notes, indicative MRPs, and sample batch records shown on
              MediKart are provided purely as general sample information. This
              information is{' '}
              <strong className="font-semibold text-slate-900">
                not medical advice and is not a substitute for consultation with
                a qualified doctor or registered pharmacist
              </strong>
              .
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Ban className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              2. No Medicines Sold, Fulfilled, or Dispensed
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              No medicines, medical devices, or health products are sold,
              supplied, fulfilled, or dispensed through MediKart. The demo
              shopping cart, illustrative GST calculation, checkout button, and
              payment options remain permanently disabled.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              3. No Drug Licence, Registration, or Certification Claimed
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediKart India does not claim any drug licence, pharmacy
              registration, wholesale or retail drug-sale approval, or medical
              certification. All inventory figures, batch numbers, and sample
              prescriptions are illustrative demonstration entries only.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              4. Local Rx Previews &amp; Demo Contact Form
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Any file opened in the Prescription Upload preview (up to 10 MB)
              stays strictly in local browser memory and is never uploaded,
              verified, or stored. Likewise, the Contact Us form is a local UI
              demonstration and does not transmit or save messages.
            </p>
          </article>
        </div>

        {/* Summary Callout */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h2>Seek Qualified Healthcare Guidance</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never start, change, or discontinue any medication based on demo
              catalogue listings. For diagnosis, prescriptions, or dispensing,
              consult a licensed physician or authorized pharmacy.
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
              Read Privacy Policy
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors whitespace-nowrap cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
