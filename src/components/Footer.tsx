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
            <h2 className="text-sm font-semibold text-white">Explore Demo</h2>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li>
                <a
                  href="#/home"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Home Showcase
                </a>
              </li>
              <li>
                <a
                  href="#/catalogue"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('catalogue');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Medicine Catalogue
                </a>
              </li>
              <li>
                <a
                  href="#/rx-upload"
                  rel="nofollow"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('rx-upload');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Rx Preview Workspace
                </a>
              </li>
              <li>
                <a
                  href="#/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#/account"
                  rel="nofollow"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('account');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Customer Account
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h2 className="text-sm font-semibold text-white">
              Regulatory &amp; Access Notice
            </h2>
            <p className="text-xs text-emerald-100/75 leading-relaxed">
              Before any real pharmacy operation, applicable drug-sale licences,
              registered pharmacist supervision, and premises approvals must be
              independently verified with statutory authorities.
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 text-sm text-emerald-100/85">
              <li>
                <a
                  href="#/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('privacy-policy');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center min-h-[44px]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#/terms-and-conditions"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('terms-and-conditions');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center min-h-[44px]"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="#/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('disclaimer');
                  }}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center min-h-[44px]"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
            <div className="pt-1">
              <a
                href="#/staff-login"
                rel="nofollow"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('staff-login');
                }}
                className="inline-flex items-center px-3.5 py-2 rounded-lg border border-emerald-700 text-xs font-medium text-emerald-100 hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer"
              >
                Staff Portal
              </a>
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
