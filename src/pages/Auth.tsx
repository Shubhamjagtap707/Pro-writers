import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          options: { 
            data: { full_name: name },
            emailRedirectTo: window.location.origin 
          },
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
    <div className="relative min-h-screen w-full bg-surface flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary-container/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-inverse-primary/10 blur-[80px] mix-blend-screen" />
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
          <div className="relative z-10 bg-surface-container-low/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50">
            
            {/* Logo / Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-primary-container/20 mb-6"
              >
                <div className="w-6 h-6 border-2 border-on-primary rounded-sm transform rotate-45" />
              </motion.div>
              <h1 className="text-3xl font-semibold text-on-surface tracking-tight mb-2">
                {mode === 'signup' ? 'Join Pro Writers' : mode === 'forgot' ? 'Reset Password' : 'Welcome back'}
              </h1>
              <p className="text-on-surface-variant/70 text-sm">
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
                      : 'bg-error/10 text-error border-error/20'
                  }`}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-on-surface-variant/80 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest/50 border border-white/5 rounded-2xl text-on-surface placeholder-outline/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:bg-surface-container-lowest/80 transition-all duration-300"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-on-surface-variant/80 uppercase tracking-wider ml-1">
                    Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest/50 border border-white/5 rounded-2xl text-on-surface placeholder-outline/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:bg-surface-container-lowest/80 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-on-surface-variant/80 uppercase tracking-wider ml-1 flex justify-between">
                    <span>Password</span>
                    {mode === 'signin' && (
                      <button 
                        type="button"
                        onClick={() => { setMode('forgot'); setMessage(null); }}
                        className="text-primary-container hover:text-primary transition-colors normal-case tracking-normal"
                      >
                        Forgot?
                      </button>
                    )}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-12 py-3.5 bg-surface-container-lowest/50 border border-white/5 rounded-2xl text-on-surface placeholder-outline/50 focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:bg-surface-container-lowest/80 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !email || (mode !== 'forgot' && !password)}
                className="group relative w-full h-12 bg-gradient-to-r from-primary-container to-inverse-primary hover:from-primary hover:to-primary-container text-white font-medium rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-inverse-primary/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10 text-on-primary-fixed" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2 text-on-primary-fixed font-semibold">
                    {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-outline">
              {mode === 'signup' ? 'Already have an account? ' : mode === 'forgot' ? 'Remember your password? ' : "Don't have an account? "}
              <button 
                type="button" 
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null); }}
                className="text-on-surface hover:text-primary font-medium transition-colors border-b border-on-surface/30 hover:border-primary pb-0.5"
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
