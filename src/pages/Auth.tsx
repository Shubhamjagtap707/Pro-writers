import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage({ text: 'Success! Please check your email to verify your account.', type: 'success' });
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        setMessage({ text: 'Password reset link sent! Check your email.', type: 'success' });
      }
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0b1326] flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#8083ff]/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d97721]/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-[#494bd6]/10 blur-[80px] mix-blend-screen" />
        <div className="noise-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative w-full max-w-[420px]"
        >
          {/* Glass Card */}
          <div className="relative z-10 bg-[#131b2e]/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50">
            
            {/* Logo / Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-14 h-14 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8083ff]/20 mb-6"
              >
                <div className="w-6 h-6 border-2 border-[#1000a9] rounded-sm transform rotate-45" />
              </motion.div>
              <h1 className="text-3xl font-semibold text-[#dae2fd] tracking-tight mb-2">
                {mode === 'signup' ? 'Join Pro Writers' : mode === 'forgot' ? 'Reset Password' : 'Welcome back'}
              </h1>
              <p className="text-[#c7c4d7]/70 text-sm">
                {mode === 'signup' 
                  ? 'Craft your world with professional tools.' 
                  : mode === 'forgot'
                  ? 'Enter your email to receive a reset link.'
                  : 'Enter your credentials to access your workspace.'}
              </p>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 rounded-xl flex items-start gap-3 border backdrop-blur-sm ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                      : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20'
                  }`}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#c7c4d7]/80 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#908fa0] group-focus-within:text-[#c0c1ff] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-[#060e20]/50 border border-white/5 rounded-2xl text-[#dae2fd] placeholder-[#908fa0]/50 focus:outline-none focus:ring-2 focus:ring-[#8083ff]/50 focus:bg-[#060e20]/80 transition-all duration-300"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#c7c4d7]/80 uppercase tracking-wider ml-1 flex justify-between">
                    <span>Password</span>
                    {mode === 'signin' && (
                      <button 
                        type="button"
                        onClick={() => { setMode('forgot'); setMessage(null); }}
                        className="text-[#8083ff] hover:text-[#c0c1ff] transition-colors normal-case tracking-normal"
                      >
                        Forgot?
                      </button>
                    )}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#908fa0] group-focus-within:text-[#c0c1ff] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#060e20]/50 border border-white/5 rounded-2xl text-[#dae2fd] placeholder-[#908fa0]/50 focus:outline-none focus:ring-2 focus:ring-[#8083ff]/50 focus:bg-[#060e20]/80 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !email || (mode !== 'forgot' && !password)}
                className="group relative w-full h-12 bg-gradient-to-r from-[#8083ff] to-[#494bd6] hover:from-[#c0c1ff] hover:to-[#8083ff] text-white font-medium rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#494bd6]/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10 text-[#07006c]" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2 text-[#07006c] font-semibold">
                    {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-[#908fa0]">
              {mode === 'signup' ? 'Already have an account? ' : mode === 'forgot' ? 'Remember your password? ' : "Don't have an account? "}
              <button 
                type="button" 
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null); }}
                className="text-[#dae2fd] hover:text-[#c0c1ff] font-medium transition-colors border-b border-[#dae2fd]/30 hover:border-[#c0c1ff] pb-0.5"
              >
                {mode === 'signup' ? 'Sign In' : mode === 'forgot' ? 'Back to Sign In' : 'Create one'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
