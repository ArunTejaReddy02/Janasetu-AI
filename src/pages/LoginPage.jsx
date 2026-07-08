import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve destination route or default to home
  const from = location.state?.from?.pathname || '/';

  const handleQuickFillAdmin = () => {
    setEmail('admin@janasetu.ai');
    setPassword('Admin@123!');
    setError('');
  };

  const handleQuickFillResident = () => {
    setEmail('resident@janasetu.ai');
    setPassword('Resident@123!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background text-on-background flex items-center justify-center relative overflow-hidden font-[Geist] p-4">
      {/* Decorative Blur Spheres for Premium Aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[440px] glass-panel p-8 rounded-3xl inner-glow-top border border-black/5 shadow-2xl relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">badge</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-on-surface leading-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-on-surface-variant mt-1.5 uppercase tracking-widest font-medium">
            JanasetuAI Civic Portal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4.5 bg-error/10 border border-error/20 text-error text-xs rounded-2xl flex items-start gap-2.5 animate-shake">
            <span className="material-symbols-outlined text-base mt-0.5">error</span>
            <span className="font-medium leading-normal">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block pl-1">
              Account Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="email@janasetu.ai"
                className="w-full bg-black/5 hover:bg-black/8 focus:bg-white border-none rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block pl-1">
              Secret Passphrase
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-black/5 hover:bg-black/8 focus:bg-white border-none rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-white font-bold py-3.5 rounded-xl mt-2 transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing Officer...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-black/5 flex flex-col gap-2">
          <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest mb-1 text-center">
            Demonstration Accounts
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">shield_person</span>
              Autofill Admin
            </button>
            <button
              type="button"
              onClick={handleQuickFillResident}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary/10 hover:bg-secondary/15 text-secondary text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              Autofill Resident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
