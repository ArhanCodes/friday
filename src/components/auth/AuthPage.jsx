import { useState } from 'react';
import { Eye, EyeOff, Zap, Shield, Brain, ChevronRight } from 'lucide-react';

export default function AuthPage({ onLogin, onSignup, loading, error, clearError }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setForm({ name: '', email: '', password: '' });
    clearError?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!form.name.trim()) return;
      if (!form.email.trim()) return;
      if (form.password.length < 4) return;
      await onSignup({ name: form.name, email: form.email, password: form.password });
    } else {
      if (!form.email.trim()) return;
      if (!form.password) return;
      await onLogin({ email: form.email, password: form.password });
    }
  };

  return (
    <div className="h-screen w-screen bg-friday-bg flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-friday-cyan/5 animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-friday-blue/5 animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-friday-cyan/[0.03]" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-friday-cyan animate-pulse" />
            <h1 className="text-4xl font-black tracking-[0.3em] text-friday-cyan"
                style={{ textShadow: '0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1)' }}>
              F.R.I.D.A.Y.
            </h1>
          </div>
          <p className="text-friday-text-dim text-sm tracking-widest uppercase">
            Personal Command AI for Students
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-friday-surface/80 backdrop-blur-xl border border-friday-border rounded-2xl p-8 card-glow">
          {/* Mode tabs */}
          <div className="flex gap-1 mb-6 bg-friday-bg/50 rounded-lg p-1">
            <button
              onClick={() => { setMode('login'); clearError?.(); }}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/20'
                  : 'text-friday-text-dim hover:text-friday-text'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); clearError?.(); }}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/20'
                  : 'text-friday-text-dim hover:text-friday-text'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-friday-danger/10 border border-friday-danger/20 text-friday-danger text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="animate-fade-in">
                <label className="block text-xs text-friday-text-dim uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="What should FRIDAY call you?"
                  className="w-full bg-friday-bg/70 border border-friday-border rounded-lg px-4 py-3 text-friday-text placeholder:text-friday-text-dim/50 focus:outline-none focus:border-friday-cyan/50 focus:ring-1 focus:ring-friday-cyan/20 transition-all"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-friday-text-dim uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full bg-friday-bg/70 border border-friday-border rounded-lg px-4 py-3 text-friday-text placeholder:text-friday-text-dim/50 focus:outline-none focus:border-friday-cyan/50 focus:ring-1 focus:ring-friday-cyan/20 transition-all"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-friday-text-dim uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={mode === 'signup' ? 'Min 4 characters' : 'Enter password'}
                  className="w-full bg-friday-bg/70 border border-friday-border rounded-lg px-4 py-3 pr-11 text-friday-text placeholder:text-friday-text-dim/50 focus:outline-none focus:border-friday-cyan/50 focus:ring-1 focus:ring-friday-cyan/20 transition-all"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={mode === 'signup' ? 4 : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-friday-text-dim hover:text-friday-cyan transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-semibold tracking-wide text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-friday-cyan/10 text-friday-cyan border border-friday-cyan/30 hover:bg-friday-cyan/20 hover:border-friday-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-friday-cyan/30 border-t-friday-cyan rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Initialize Session' : 'Create Account'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode link */}
          <p className="text-center text-sm text-friday-text-dim mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="text-friday-cyan hover:text-friday-cyan-glow transition-colors font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <div className="flex items-center gap-1.5 text-xs text-friday-text-dim/70 bg-friday-surface/40 px-3 py-1.5 rounded-full border border-friday-border/50">
            <Zap size={12} className="text-friday-cyan" />
            Voice Commands
          </div>
          <div className="flex items-center gap-1.5 text-xs text-friday-text-dim/70 bg-friday-surface/40 px-3 py-1.5 rounded-full border border-friday-border/50">
            <Brain size={12} className="text-friday-cyan" />
            Smart Scheduling
          </div>
          <div className="flex items-center gap-1.5 text-xs text-friday-text-dim/70 bg-friday-surface/40 px-3 py-1.5 rounded-full border border-friday-border/50">
            <Shield size={12} className="text-friday-cyan" />
            No API Keys Needed
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-friday-text-dim/30 mt-4 tracking-wider">
          v1.0 &mdash; All data stored locally in your browser
        </p>
      </div>
    </div>
  );
}
