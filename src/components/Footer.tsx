import { MediKartLogo } from './Navbar';
import type { AppRoute } from '../types/pharmacy';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#064E3B] text-emerald-50 border-t border-emerald-900 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-emerald-800/70">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <MediKartLogo />
              <span className="font-display text-lg font-bold text-white tracking-tight">
                MediKart
              </span>
            </div>
            <p className="text-sm text-emerald-100/85 leading-relaxed max-w-md">
              Indian Online Pharmacy Catalogue &amp; Inventory Showcase operating in
              strictly demo mode. All products, batch records, and prescriptions
              shown are sample data only.
            </p>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-md">
              Notice: Sales, checkout, payment collection, prescription
              verification, and medicine dispensing are permanently disabled.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">Explore Demo</h3>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Medicine Catalogue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('rx-upload')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Rx Preview Workspace
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('account')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Account
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">
              Regulatory &amp; Access Notice
            </h3>
            <p className="text-xs text-emerald-100/75 leading-relaxed">
              Before any real pharmacy operation, applicable drug-sale licences,
              registered pharmacist supervision, and premises approvals must be
              independently verified with statutory authorities.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('staff-login')}
                className="inline-flex items-center px-3.5 py-2 rounded-lg border border-emerald-700 text-xs font-medium text-emerald-100 hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200/75">
          <span>MediKart Pharmacy Demo Showcase • Catalogue Only</span>
          <span>No Real Orders • No PHI Stored • Firebase Project medikart-d1afe</span>
        </div>
      </div>
    </footer>
  );
}
