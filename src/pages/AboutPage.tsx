import {
  ArrowRight,
  BookOpen,
  Layers,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';

interface AboutPageProps {
  onExploreCatalogue: () => void;
  onOpenContact: () => void;
}

export function AboutPage({
  onExploreCatalogue,
  onOpenContact,
}: AboutPageProps) {
  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header Section */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Demo Pharmacy Catalogue · Informational Showcase
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 max-w-3xl"
            style={{ textWrap: 'balance' }}
          >
            About MediKart India
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl mt-3">
            MediKart is a demonstration Indian online pharmacy catalogue and
            medicine information platform. It showcases how therapeutic
            categories, generic salt compositions, FEFO batch records, and local
            prescription preview workflows can be organized in a clean,
            mobile-friendly interface—while keeping all commercial sales,
            checkout, and dispensing disabled.
          </p>
        </div>
      </section>

      {/* Purpose & Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Purpose of This Demo Platform
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            Every product entry, batch trail, and price displayed across MediKart
            uses clearly labelled sample data for evaluation and educational
            demonstration in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Structured Medicine Information
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Browse sample listings across seven healthcare categories—from
              cardiac care and daily vitamins to herbal formulations and home
              medical devices—complete with generic composition, schedule
              classification, indicative MRP in ₹ INR, and storage guidance.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              FEFO Batch &amp; Expiry Visibility
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Demonstrates First-Expired, First-Out (FEFO) inventory visibility
              with sample batch numbers and <code className="font-mono">MM/YYYY</code>{' '}
              expiry trails, distinguishing active, expiring, expired, and
              quarantined stock states.
            </p>
          </article>

          <article className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
              <ShieldOff className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Non-Commercial Demo Scope
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediKart does not sell medicines, process payments, verify real
              prescriptions, or fulfil deliveries. Local prescription previews
              stay strictly inside browser memory without uploading PHI.
            </p>
          </article>
        </div>

        {/* Transparency & Governance Notice */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0B6E4F]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h2>Demo Boundaries &amp; Accuracy Commitment</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediKart is strictly a software demonstration and does not claim
              pharmacy licensing, physical store locations, delivery networks,
              or clinical endorsements. Always consult a qualified medical
              practitioner and licensed pharmacy for real healthcare decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onExploreCatalogue}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors whitespace-nowrap cursor-pointer"
            >
              Contact Demo Form
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
