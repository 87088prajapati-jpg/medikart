import { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookmarkPlus,
  FileCheck2,
  FileText,
  Lock,
  Trash2,
  Upload,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { RxSampleType } from '../types/pharmacy';

const MAX_LOCAL_PREVIEW_BYTES = 10 * 1024 * 1024; // 10 MB

interface LocalFilePreview {
  name: string;
  sizeKb: number;
  isPdf: boolean;
  objectUrl: string | null;
}

export function RxUploadPage() {
  const {
    selectedCity,
    firebaseUser,
    userProfile,
    rxDrafts,
    saveSampleRxDraft,
    deleteSampleRxDraft,
  } = useStore();

  const [localPreview, setLocalPreview] = useState<LocalFilePreview | null>(
    null,
  );
  const [activeSample, setActiveSample] = useState<
    'none' | 'sample_cardiac' | 'sample_fever'
  >('sample_cardiac');
  const [draftTitle, setDraftTitle] = useState(
    'Sample Demo Rx Marker (Non-PHI)',
  );
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);

  // Clean up local object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (localPreview?.objectUrl) {
        URL.revokeObjectURL(localPreview.objectUrl);
      }
    };
  }, [localPreview]);

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setDraftStatus(null);

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setFileError('Please select a PNG, JPG, WEBP, or PDF file for local preview.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_LOCAL_PREVIEW_BYTES) {
      setFileError(
        'Selected file exceeds the 10 MB local preview limit. Please choose a smaller sample image or PDF.',
      );
      e.target.value = '';
      return;
    }

    if (localPreview?.objectUrl) {
      URL.revokeObjectURL(localPreview.objectUrl);
    }

    const objectUrl = isImage ? URL.createObjectURL(file) : null;
    setLocalPreview({
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      isPdf,
      objectUrl,
    });
    setActiveSample('none');
    setDraftStatus(
      'Local preview rendered in browser memory only. File was NOT uploaded or transmitted.',
    );
  };

  const handleClearLocalFile = () => {
    if (localPreview?.objectUrl) {
      URL.revokeObjectURL(localPreview.objectUrl);
    }
    setLocalPreview(null);
    setFileError(null);
    setActiveSample('sample_cardiac');
  };

  const handleSaveSampleMarker = async () => {
    setSavingDraft(true);
    setDraftStatus(null);
    const sampleType: RxSampleType =
      activeSample === 'sample_fever'
        ? 'sample_fever'
        : activeSample === 'sample_cardiac'
          ? 'sample_cardiac'
          : 'local_preview_marker';

    const res = await saveSampleRxDraft({
      title: draftTitle,
      sampleType,
      note:
        sampleType === 'local_preview_marker'
          ? 'Local preview session marker (no file or PHI uploaded)'
          : `Fictional sample Rx preset (${selectedCity})`,
    });
    setSavingDraft(false);

    if (res.ok) {
      setDraftStatus('Saved non-PHI sample Rx draft marker to your account.');
    } else {
      setDraftStatus(res.error || 'Could not save sample draft marker.');
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      {/* Header & Mandatory Disabled Notice */}
      <section className="bg-[#F6FBF8] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <p className="text-xs font-medium text-[#0B6E4F]">
            Local Demo Preview Only · No Upload · No PHI Storage
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Prescription Upload Interface (Demo Preview)
          </h1>

          <div
            role="alert"
            className="bg-white border border-amber-300 rounded-xl p-4 flex items-start gap-3 max-w-3xl"
          >
            <AlertCircle
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Prescription verification and dispensing are disabled in demo
                mode.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Do not upload, transmit, or enter real prescriptions or personal
                health information (PHI). File selection stays strictly in local
                browser memory for UI preview only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: File Picker + Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Local File Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  1. Local Image / PDF Selection
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Browser-only memory preview · Max 10 MB
                </span>
              </div>

              <label
                htmlFor="rx-local-file-input"
                className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 hover:border-[#0B6E4F] bg-[#F6FBF8] rounded-xl p-8 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-7 h-7 text-[#0B6E4F] mb-2.5" />
                <span className="text-sm font-semibold text-slate-900">
                  Select a sample image or PDF for local preview
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, WEBP, or PDF up to 10 MB · Never uploaded to any server
                </span>
                <input
                  id="rx-local-file-input"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleLocalFileSelect}
                  className="sr-only"
                />
              </label>

              {fileError && (
                <p
                  role="alert"
                  className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  {fileError}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleClearLocalFile();
                    setActiveSample('sample_cardiac');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeSample === 'sample_cardiac' && !localPreview
                      ? 'bg-[#0B6E4F] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sample Demo Rx: Cardiac
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClearLocalFile();
                    setActiveSample('sample_fever');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeSample === 'sample_fever' && !localPreview
                      ? 'bg-[#0B6E4F] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sample Demo Rx: Fever
                </button>
                {localPreview && (
                  <button
                    type="button"
                    onClick={handleClearLocalFile}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Clear Local Preview
                  </button>
                )}
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  2. Local Preview Canvas
                </h2>
                <span className="text-xs font-medium text-[#0B6E4F]">
                  {localPreview ? 'Local File Preview' : 'Sample Demo Prescription'}
                </span>
              </div>

              {localPreview ? (
                <div className="rounded-xl border border-slate-200 bg-[#F6FBF8] p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-900 truncate max-w-xs">
                      {localPreview.name}
                    </span>
                    <span className="font-mono tabular-nums">
                      {localPreview.sizeKb} KB · Local Only
                    </span>
                  </div>
                  {localPreview.isPdf ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-2">
                      <FileText className="w-10 h-10 text-[#0B6E4F] mx-auto" />
                      <p className="text-sm font-semibold text-slate-900">
                        Local PDF Selected for Preview
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF metadata rendered locally. Verification and upload are
                        disabled in demo mode.
                      </p>
                    </div>
                  ) : (
                    localPreview.objectUrl && (
                      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-h-[380px] flex items-center justify-center">
                        <img
                          src={localPreview.objectUrl}
                          alt="Local browser prescription preview"
                          className="max-h-[360px] w-auto object-contain"
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                /* Synthetic Sample Demo Prescription Sheet */
                <div className="rounded-xl border border-emerald-200 bg-[#F6FBF8] p-6 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-200/80 pb-4">
                    <div>
                      <p className="text-xs font-semibold text-[#0B6E4F]">
                        SAMPLE DEMO PRESCRIPTION — NOT VALID FOR DISPENSING
                      </p>
                      <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                        Arogya Demo Polyclinic ({selectedCity})
                      </h3>
                      <p className="text-xs text-slate-600">
                        Dr. R. Sharma (Fictional Sample) · Reg. No. DEMO-0000
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs text-slate-500">
                      <div>Sample ID: RX-DEMO-101</div>
                      <div>Patient: Sample User (Fictional)</div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white border border-emerald-100 rounded-lg p-4">
                    {activeSample === 'sample_fever' ? (
                      <>
                        <div className="flex items-start justify-between gap-4 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900">
                              1. PyroCalm 650 Demo (Paracetamol 650 mg)
                            </p>
                            <p className="text-xs text-slate-500">
                              Sample OTC Reference · Illustrative entry only
                            </p>
                          </div>
                          <span className="font-mono text-xs text-slate-600">
                            1 Strip (Sample)
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 text-sm pt-2 border-t border-slate-100">
                          <div>
                            <p className="font-semibold text-slate-900">
                              2. SinoEase Relief Demo
                            </p>
                            <p className="text-xs text-slate-500">
                              Sample OTC Reference · Illustrative entry only
                            </p>
                          </div>
                          <span className="font-mono text-xs text-slate-600">
                            1 Strip (Sample)
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900">
                              1. CardioTel-40 Demo (Telmisartan 40 mg)
                            </p>
                            <p className="text-xs text-slate-500">
                              Sample Schedule H Reference · Dispensing disabled
                            </p>
                          </div>
                          <span className="font-mono text-xs text-slate-600">
                            1 Strip (Sample)
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 text-sm pt-2 border-t border-slate-100">
                          <div>
                            <p className="font-semibold text-slate-900">
                              2. GlycoNorm-SR 500 Demo (Metformin SR 500 mg)
                            </p>
                            <p className="text-xs text-slate-500">
                              Sample Schedule H Reference · Dispensing disabled
                            </p>
                          </div>
                          <span className="font-mono text-xs text-slate-600">
                            1 Strip (Sample)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-slate-600">
                      Pharmacist verification &amp; order submission disabled.
                    </span>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="px-4 py-2 rounded-lg bg-slate-200 text-slate-500 text-xs font-medium inline-flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Submit for Pharmacist Review (Disabled)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Saved Sample Rx Drafts List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-[#0B6E4F]" />
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Save Sample Draft Marker
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stores only a non-PHI sample preset label in your account
                demonstrating draft bookmarking. Never saves uploaded files or
                patient data.
              </p>

              <div className="space-y-3">
                <label
                  htmlFor="rx-draft-title"
                  className="block text-xs font-medium text-slate-700"
                >
                  Sample Draft Label
                </label>
                <input
                  id="rx-draft-title"
                  type="text"
                  maxLength={80}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0B6E4F]"
                />
                <button
                  type="button"
                  disabled={savingDraft}
                  onClick={handleSaveSampleMarker}
                  className="w-full min-h-[42px] px-4 py-2.5 rounded-xl bg-[#0B6E4F] text-white text-sm font-medium hover:bg-[#064E3B] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {savingDraft
                    ? 'Saving Sample Marker...'
                    : 'Save Sample Draft Marker'}
                </button>
              </div>

              {draftStatus && (
                <p
                  role="status"
                  className="text-xs font-medium text-[#0B6E4F] bg-[#F6FBF8] border border-emerald-200 rounded-lg px-3 py-2"
                >
                  {draftStatus}
                </p>
              )}

              {!firebaseUser && (
                <p className="text-xs text-slate-500">
                  Sign in on the Account tab to persist non-PHI sample markers
                  to Firestore.
                </p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Saved Sample Rx Drafts
                </h2>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  {rxDrafts.length} items
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {rxDrafts.map((draft) => {
                  const isCustom = Boolean(draft.userId && userProfile);
                  return (
                    <div
                      key={draft.draftId}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-[#0B6E4F] shrink-0" />
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {draft.title}
                          </p>
                        </div>
                        <p className="text-xs text-slate-600">
                          {draft.note || 'Sample demo draft entry'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {draft.city} · {draft.createdAtLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            handleClearLocalFile();
                            setActiveSample(
                              draft.sampleType === 'sample_fever'
                                ? 'sample_fever'
                                : 'sample_cardiac',
                            );
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-[#0B6E4F] hover:text-[#0B6E4F] cursor-pointer"
                        >
                          Preview
                        </button>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => deleteSampleRxDraft(draft.draftId)}
                            aria-label={`Delete ${draft.title}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
