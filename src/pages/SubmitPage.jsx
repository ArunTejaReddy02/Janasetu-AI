import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { submitReport } from '../services/api';
import { getAllAdminUnits } from '../services/geocoding';

const CONSENT_TEXT =
  'Your message will be shared with your MP\'s office to help prioritize development work in your area. We store your phone number only to follow up with you if needed, and never publish it publicly. You can request deletion of your submission at any time by replying DELETE.';

export default function SubmitPage() {
  const [text, setText] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [adminUnitId, setAdminUnitId] = useState('');
  const [location, setLocation] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const adminUnits = getAllAdminUnits();

  const captureGps = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: 'device_gps' });
        setError('');
      },
      () => setError('Could not get GPS location. Select your ward below instead.')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Please accept the consent notice before submitting.');
      return;
    }
    if (!text.trim()) {
      setError('Please describe the issue in your own language.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        channel: 'web',
        text: text.trim(),
        consent: true,
        phone: phone.trim() || undefined,
        location: location ?? (adminUnitId ? { admin_unit_id: adminUnitId, source: 'admin_unit_centroid' } : undefined),
        photo_attached: !!photoName,
      };
      const res = await submitReport(payload);
      setResult(res);
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel rounded-2xl p-8 text-center inner-glow-top animate-fade-in-up">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-secondary text-3xl">check_circle</span>
          </div>
          <h1 className="text-xl font-bold text-on-surface mb-2">Report Recorded</h1>
          <p className="text-sm text-on-surface-variant mb-4">{result.reference_message}</p>
          <p className="text-2xl font-mono font-bold text-primary mb-6">{result.submission_id}</p>
          <p className="text-xs text-on-surface-variant mb-6">
            Save this reference ID. Your MP&apos;s office will use it to track your report.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full py-3 bg-gradient-primary text-white rounded-xl font-bold text-sm cursor-pointer"
              onClick={() => {
                setResult(null);
                setText('');
                setPhone('');
                setConsent(false);
                setPhotoName('');
                setLocation(null);
              }}
            >
              Submit Another Report
            </button>
            <Link to="/" className="text-sm text-primary font-bold hover:underline">
              Go to MP Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-black/5 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">badge</span>
            </div>
            <div>
              <p className="font-bold text-primary text-sm leading-none">JanasetuAI</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Report a Need</p>
            </div>
          </div>
          <Link to="/" className="text-xs text-primary font-bold">MP Dashboard</Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 pb-12">
        <h1 className="text-2xl font-bold text-on-surface mb-1">Tell us what your area needs</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Share in your own language — Hindi, Marathi, Telugu, Kannada, or English. Voice notes via WhatsApp are also accepted.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Describe the issue *
            </label>
            <textarea
              className="w-full min-h-[120px] p-4 rounded-xl bg-white border border-black/10 text-on-surface text-sm focus:ring-2 focus:ring-primary/40 outline-none resize-y"
              placeholder="e.g. Water hasn't come to the borewell near the Anganwadi for two weeks..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Photo (optional)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? '')}
            />
            <button
              type="button"
              className="w-full py-3 rounded-xl border border-dashed border-black/20 bg-black/[0.02] text-sm text-on-surface-variant flex items-center justify-center gap-2 cursor-pointer hover:bg-black/5"
              onClick={() => fileRef.current?.click()}
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              {photoName || 'Upload a photo of the issue'}
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Location
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-primary/20"
                onClick={captureGps}
              >
                <span className="material-symbols-outlined text-sm">my_location</span>
                Use GPS
              </button>
            </div>
            {location && (
              <p className="text-[10px] text-secondary font-mono mb-2">
                GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
            <select
              className="w-full p-3 rounded-xl bg-white border border-black/10 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              value={adminUnitId}
              onChange={(e) => setAdminUnitId(e.target.value)}
            >
              <option value="">Or select your ward / area</option>
              {adminUnits.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
              Phone (optional, for follow-up only)
            </label>
            <input
              type="tel"
              className="w-full p-3 rounded-xl bg-white border border-black/10 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="glass-panel rounded-xl p-4 border border-primary/20">
            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 rounded text-primary focus:ring-primary"
              />
              <span className="text-xs text-on-surface-variant leading-relaxed">{CONSENT_TEXT}</span>
            </label>
          </div>

          {error && (
            <p className="text-xs text-error font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      </main>
    </div>
  );
}
