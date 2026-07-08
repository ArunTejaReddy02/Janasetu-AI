import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitReport } from '../services/api';
import { getAllAdminUnits } from '../services/geocoding';

const CONSENT_TEXT =
  'Your message will be shared with your MP\'s office to help prioritize development work in your area. We store your phone number only to follow up with you if needed, and never publish it publicly. You can request deletion of your submission at any time by replying DELETE.';

export default function ResidentPortal() {
  const { logout, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('text'); // text, voice, whatsapp
  
  // Text Form State
  const [text, setText] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [consent, setConsent] = useState(false);
  const [adminUnitId, setAdminUnitId] = useState('');
  const [location, setLocation] = useState(null);
  const [photoName, setPhotoName] = useState('');
  
  // Shared State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Please accept the consent notice before submitting.');
      return;
    }

    if (activeTab === 'text' && !text.trim()) {
      setError('Please describe the issue in your own language.');
      return;
    }

    if (activeTab === 'voice' && !audioBlob) {
      setError('Please record an audio message first.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        channel: activeTab === 'voice' ? 'ivr' : 'web',
        text: activeTab === 'voice' ? 'Audio report attached' : text.trim(),
        consent: true,
        phone: phone.trim() || undefined,
        location: location ?? (adminUnitId ? { admin_unit_id: adminUnitId, source: 'admin_unit_centroid' } : undefined),
        photo_attached: !!photoName || !!audioBlob,
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
        <div className="max-w-md w-full glass-panel rounded-2xl p-8 text-center inner-glow-top animate-fade-in-up border border-black/5 shadow-2xl">
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
              className="w-full py-3 bg-gradient-primary text-white rounded-xl font-bold text-sm cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-lg"
              onClick={() => {
                setResult(null);
                setText('');
                setConsent(false);
                setPhotoName('');
                setLocation(null);
                setAudioBlob(null);
                setAudioUrl(null);
              }}
            >
              Submit Another Report
            </button>
            <button
              onClick={logout}
              className="text-sm text-error font-bold hover:underline mt-2 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-[Geist] selection:bg-primary/30">
      <header className="sticky top-0 z-10 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-black/5 px-4 py-4 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-lg">home_work</span>
            </div>
            <div>
              <p className="font-bold text-primary text-sm leading-none">Resident Portal</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">JanasetuAI</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-xs text-error font-bold flex items-center gap-1 cursor-pointer bg-error/10 px-3 py-1.5 rounded-lg hover:bg-error/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 pb-12 pt-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-[28px] font-bold text-on-surface leading-tight tracking-tight mb-2">
            Report a Civic Issue
          </h1>
          <p className="text-sm text-on-surface-variant">
            Welcome, <strong>{user?.name || 'Resident'}</strong>! Submit your grievances securely. Type, record a voice note, or message us on WhatsApp.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/5 p-1 rounded-2xl mb-8 shadow-inner">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'text' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">edit_document</span>
            <span className="hidden sm:inline">Text Form</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'voice' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
            <span className="hidden sm:inline">Voice Note</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'whatsapp' ? 'bg-[#25D366] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>

        {activeTab === 'whatsapp' ? (
          <div className="glass-panel p-8 rounded-3xl text-center border border-black/5 shadow-xl animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">forum</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-3">Report via WhatsApp</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Send a text message or voice note directly to our official WhatsApp number. Our AI will automatically process and register your complaint.
            </p>
            <a
              href="https://wa.me/910000000000?text=Hi%2C%20I%20want%20to%20report%20an%20issue"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#25D366]/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              Open WhatsApp
            </a>
            <p className="text-xs text-on-surface-variant mt-6">
              Number: <span className="font-mono font-bold text-on-surface">+91 00000 00000</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            {activeTab === 'text' && (
              <div className="space-y-1.5">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block pl-1">
                  Describe the issue *
                </label>
                <textarea
                  className="w-full min-h-[140px] p-4 rounded-xl bg-black/5 border border-transparent text-on-surface text-sm focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none resize-y transition-all"
                  placeholder="e.g. Water hasn't come to the borewell near the Anganwadi for two weeks..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required={activeTab === 'text'}
                />
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-1.5">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block pl-1">
                  Record Voice Note *
                </label>
                <div className="glass-panel p-8 rounded-2xl border border-black/5 shadow-lg flex flex-col items-center">
                  {!audioBlob ? (
                    <>
                      <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                          isRecording 
                            ? 'bg-error text-white animate-pulse shadow-error/40 scale-105' 
                            : 'bg-primary text-white hover:scale-105 shadow-primary/30 hover:shadow-primary/40'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[40px]">
                          {isRecording ? 'stop' : 'mic'}
                        </span>
                      </button>
                      <p className="text-sm font-bold mt-6 text-on-surface">
                        {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
                      </p>
                      {isRecording && <p className="text-xs text-error mt-1">Tap stop when finished</p>}
                    </>
                  ) : (
                    <div className="w-full flex flex-col items-center gap-4">
                      <audio src={audioUrl} controls className="w-full h-12 outline-none" />
                      <button
                        type="button"
                        onClick={() => { setAudioBlob(null); setAudioUrl(null); }}
                        className="text-xs font-bold text-error hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Delete & Re-record
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block pl-1">
                Photo Evidence (optional)
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
                className="w-full py-4 rounded-xl bg-black/5 text-sm text-on-surface-variant font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-black/10 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <span className="material-symbols-outlined">add_a_photo</span>
                {photoName || 'Upload a photo'}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block pl-1">
                Location Details
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className="flex-1 py-3 rounded-xl bg-secondary/10 text-secondary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={captureGps}
                >
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                  Detect GPS
                </button>
              </div>
              {location && (
                <p className="text-[10px] text-secondary font-mono font-bold mb-2 pl-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
              <select
                className="w-full p-3.5 rounded-xl bg-black/5 border border-transparent text-sm text-on-surface outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                value={adminUnitId}
                onChange={(e) => setAdminUnitId(e.target.value)}
              >
                <option value="">Or manually select your ward / area</option>
                {adminUnits.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-black/5 shadow-sm">
              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 flex-shrink-0 w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer border-black/20"
                />
                <span className="text-xs text-on-surface-variant leading-relaxed select-none">{CONSENT_TEXT}</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 text-error text-xs rounded-xl flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-base">error</span>
                <span className="font-bold">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-[15px] shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Report</span>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
