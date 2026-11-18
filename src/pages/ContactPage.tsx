import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Mail,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface ContactPageProps {
  onExploreAbout: () => void;
  onBrowseCatalogue: () => void;
}

export function ContactPage({
  onExploreAbout,
  onBrowseCatalogue,
}: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedPreview, setSubmittedPreview] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setValidationError('Please complete your name, email, and message.');
      return;
    }

    setValidationError(null);
    // Strictly local browser preview — nothing is sent or stored anywhere.
    setSubmittedPreview({ name: cleanName, email: cleanEmail });
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleReset = () => {
    setSubmittedPreview(null);
    setValidationError(null);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header Section */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Local Browser Demo Form · Zero Data Transmitted
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5"
            style={{ textWrap: 'balance' }}
          >
            Contact MediKart Demo
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mt-3">
            Explore the interactive contact form layout below. Because MediKart
            runs strictly in demo and catalogue-only mode, this form does not
            send emails or store submitted messages.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Demo Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
              <AlertCircle
                className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="leading-relaxed">
                <strong>Demo Form Notice:</strong> This is a demo form only and
                does not send, transmit, or store messages. Do not enter
                sensitive medical or personal health information.
              </p>
            </div>

            {validationError && (
              <p
                role="alert"
                className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                {validationError}
              </p>
            )}

            {submittedPreview ? (
              <div
                role="status"
                className="bg-[#F6FBF8] border border-emerald-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-[#0B6E4F] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <h2 className="font-display text-base font-bold text-slate-900">
                      Demo Form Preview Completed
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Thank you,{' '}
                      <span className="font-medium text-slate-900">
                        {submittedPreview.name}
                      </span>
                      . Because MediKart is in demo mode, no message was sent to
                      or from{' '}
                      <span className="font-medium text-slate-900">
                        {submittedPreview.email}
                      </span>
                      , and nothing was stored on any server.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[42px] px-4 py-2 rounded-xl border border-emerald-200 bg-white text-[#0B6E4F] text-sm font-medium hover:border-[#0B6E4F] transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Preview Another Message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={120}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a sample inquiry (local demo preview only—nothing is sent or saved)..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Submit Demo Form</span>
                </button>
              </form>
            )}
          </div>

          {/* Informational Scope Card (No Invented Business Details) */}
          <aside className="lg:col-span-5 bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0B6E4F]">
                <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                <h2>Demo Catalogue Scope</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                MediKart India operates strictly as a demo medicine catalogue and
                inventory showcase. No customer support phone numbers, email
                inboxes, physical store addresses, or commercial pharmacy
                services are active on this website.
              </p>
            </div>

            <div className="border-t border-emerald-200/70 pt-4 space-y-2.5">
              <h3 className="text-sm font-semibold text-slate-900">
                Useful Showcase Pages
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onBrowseCatalogue}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-emerald-200 text-sm font-medium text-[#0B6E4F] hover:border-[#0B6E4F] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Browse Medicine Catalogue</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onExploreAbout}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-[#0B6E4F] hover:text-[#0B6E4F] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Read About MediKart</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
