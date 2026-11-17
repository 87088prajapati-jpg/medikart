import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  KeyRound,
  LogOut,
  Mail,
  RefreshCw,
  Save,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEMO_CITIES, SCHEMA_LIMITS } from '../lib/validation';
import type { DemoCity } from '../types/pharmacy';

export function AccountPage() {
  const {
    firebaseUser,
    authReady,
    userProfile,
    profileLoading,
    selectedCity,
    registerCustomer,
    loginCustomer,
    updateCustomerProfile,
    sendPasswordReset,
    sendCustomerVerificationEmail,
    refreshEmailVerification,
    logoutUser,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<DemoCity>(selectedCity);
  const [addressLine, setAddressLine] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [verifyingAction, setVerifyingAction] = useState<
    'send' | 'refresh' | null
  >(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName);
      setPhone(userProfile.phone);
      setCity(userProfile.city);
      setAddressLine(userProfile.addressLine);
    }
  }, [userProfile]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'reset') {
      const res = await sendPasswordReset(email);
      setSubmitting(false);
      if (!res.ok) {
        setErrorMsg(res.error || 'Could not send password reset email.');
      } else {
        setSuccessMsg(
          `Password reset link sent to ${email.trim()}. Check your inbox and spam folder.`,
        );
      }
      return;
    }

    if (mode === 'register') {
      const res = await registerCustomer({
        email,
        password,
        fullName,
        phone,
        city,
        addressLine,
      });
      setSubmitting(false);
      if (!res.ok) {
        setErrorMsg(res.error || 'Registration failed.');
      } else {
        setSuccessMsg(
          'Customer account created with customer role. You can verify your email from the verification panel below.',
        );
        setPassword('');
      }
    } else {
      const res = await loginCustomer(email, password);
      setSubmitting(false);
      if (!res.ok) {
        setErrorMsg(res.error || 'Login failed.');
      } else {
        setPassword('');
      }
    }
  };

  const handleSendVerification = async () => {
    setVerifyingAction('send');
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = await sendCustomerVerificationEmail();
    setVerifyingAction(null);
    if (!res.ok) {
      setErrorMsg(res.error || 'Could not send verification email.');
    } else {
      setSuccessMsg(
        `Verification email sent to ${firebaseUser?.email ?? 'your email'}. Open the link in your inbox, then click Refresh Status.`,
      );
    }
  };

  const handleRefreshVerification = async () => {
    setVerifyingAction('refresh');
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = await refreshEmailVerification();
    setVerifyingAction(null);
    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.verified) {
      setSuccessMsg('Email address verified successfully.');
    } else {
      setErrorMsg(
        'Email is still pending verification. Please open the link sent to your inbox and try Refresh Status again.',
      );
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await updateCustomerProfile({
      fullName,
      phone,
      city,
      addressLine,
    });
    setSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.error || 'Failed to update profile.');
    } else {
      setSuccessMsg('Profile saved to Firestore.');
    }
  };

  if (!authReady || profileLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-[#F6FBF8] border border-emerald-100 rounded-2xl p-8 animate-pulse space-y-4">
          <div className="h-6 bg-emerald-100 rounded w-1/3" />
          <div className="h-4 bg-emerald-100 rounded w-2/3" />
          <div className="h-24 bg-white rounded-xl border border-emerald-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Firebase Authentication · Email &amp; Password Only
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {firebaseUser ? 'Customer Account & Profile' : 'Customer Sign In & Registration'}
          </h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {firebaseUser ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F6FBF8] border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    {userProfile?.fullName || firebaseUser.email}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                    <span>{firebaseUser.email} · Role: Customer (Standard)</span>
                    {firebaseUser.emailVerified ? (
                      <span className="inline-flex items-center gap-1 font-medium text-[#0B6E4F]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Email Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>Email Verification Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logoutUser}
                className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-700 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {!firebaseUser.emailVerified && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 space-y-0.5">
                    <p className="font-semibold">Verify your email address</p>
                    <p className="text-amber-800">
                      Confirm ownership of{' '}
                      <span className="font-medium">{firebaseUser.email}</span>{' '}
                      using Firebase Email Verification.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={verifyingAction !== null}
                    onClick={handleSendVerification}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B6E4F] text-white text-xs font-medium hover:bg-[#064E3B] disabled:opacity-60 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>
                      {verifyingAction === 'send'
                        ? 'Sending...'
                        : 'Send Verification Email'}
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={verifyingAction !== null}
                    onClick={handleRefreshVerification}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-amber-900 text-xs font-medium hover:border-amber-400 disabled:opacity-60 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        verifyingAction === 'refresh' ? 'animate-spin' : ''
                      }`}
                    />
                    <span>
                      {verifyingAction === 'refresh'
                        ? 'Checking...'
                        : 'Refresh Status'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <p
                role="alert"
                className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p
                role="status"
                className="text-xs font-medium text-[#0B6E4F] bg-[#F6FBF8] border border-emerald-200 rounded-xl px-4 py-3 inline-flex items-center gap-2 w-full"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </p>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-fullname"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="profile-fullname"
                    type="text"
                    required
                    maxLength={SCHEMA_LIMITS.fullNameMax}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Contact Phone (Optional Demo)
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    maxLength={SCHEMA_LIMITS.phoneMax}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-city"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Preferred Demo City
                  </label>
                  <select
                    id="profile-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value as DemoCity)}
                    className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0B6E4F]"
                  >
                    {DEMO_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="profile-role"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Assigned Role (Immutable)
                  </label>
                  <input
                    id="profile-role"
                    type="text"
                    readOnly
                    value="customer"
                    className="w-full min-h-[42px] px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-address"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Demo Address Line (Optional)
                </label>
                <input
                  id="profile-address"
                  type="text"
                  maxLength={SCHEMA_LIMITS.addressLineMax}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Sample street or locality (do not enter sensitive medical info)"
                  className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] disabled:opacity-60 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            {mode === 'reset' ? (
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F6FBF8] border border-emerald-200 text-[#0B6E4F] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-slate-900">
                      Reset Customer Password
                    </h2>
                    <p className="text-xs text-slate-500">
                      We will send a password reset link via Firebase Auth.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#0B6E4F] hover:text-[#064E3B] underline underline-offset-2 cursor-pointer whitespace-nowrap"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              /* Segmented Mode Switch */
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#F6FBF8] border border-emerald-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`min-h-[40px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#0B6E4F] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Customer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`min-h-[40px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-[#0B6E4F] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {errorMsg && (
              <p
                role="alert"
                className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p
                role="status"
                className="text-xs font-medium text-[#0B6E4F] bg-[#F6FBF8] border border-emerald-200 rounded-xl px-4 py-3"
              >
                {successMsg}
              </p>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="reg-fullname"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="reg-fullname"
                        type="text"
                        required
                        maxLength={SCHEMA_LIMITS.fullNameMax}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Aarav Mehta"
                        className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-city"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Demo City
                      </label>
                      <select
                        id="reg-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value as DemoCity)}
                        className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0B6E4F]"
                      >
                        {DEMO_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      maxLength={SCHEMA_LIMITS.phoneMax}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXXXXXXX"
                      className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                    />
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  maxLength={SCHEMA_LIMITS.emailMax}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('reset');
                          setPassword('');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-xs font-medium text-[#0B6E4F] hover:text-[#064E3B] underline underline-offset-2 cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting
                  ? mode === 'reset'
                    ? 'Sending reset link...'
                    : 'Authenticating...'
                  : mode === 'reset'
                    ? 'Send Password Reset Email'
                    : mode === 'register'
                      ? 'Register Customer Account'
                      : 'Sign In with Email & Password'}
              </button>

              <p className="text-xs text-slate-500 text-center pt-1">
                New registrations receive the standard <code className="font-mono">customer</code>{' '}
                role only and cannot access Admin inventory.
              </p>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
