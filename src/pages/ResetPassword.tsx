import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // If they land here without a session, they can't reset password
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setMessage({ text: 'Password updated successfully! Redirecting to login...', type: 'success' });
      
      // Log them out and redirect to auth page so they can login with new password
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate('/auth');
      }, 2000);

    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen w-full bg-[#0b1326] flex items-center justify-center p-4 overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#8083ff]/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d97721]/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-[#494bd6]/10 blur-[80px] mix-blend-screen" />
        <div className="noise-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative w-full max-w-[420px]"
        >
          <div className="relative z-10 bg-[#131b2e]/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50">
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
                Set New Password
              </h1>
              <p className="text-[#c7c4d7]/70 text-sm">
                Please enter your new password below.
              </p>
            </div>

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

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#c7c4d7]/80 uppercase tracking-wider ml-1 flex justify-between">
                  <span>New Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#908fa0] group-focus-within:text-[#c0c1ff] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-3.5 bg-[#060e20]/50 border border-white/5 rounded-2xl text-[#dae2fd] placeholder-[#908fa0]/50 focus:outline-none focus:ring-2 focus:ring-[#8083ff]/50 focus:bg-[#060e20]/80 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#908fa0] hover:text-[#c0c1ff] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !password}
                className="group relative w-full h-12 bg-gradient-to-r from-[#8083ff] to-[#494bd6] hover:from-[#c0c1ff] hover:to-[#8083ff] text-white font-medium rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#494bd6]/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10 text-[#07006c]" />
                ) : (
                  <span className="relative z-10 flex items-center gap-2 text-[#07006c] font-semibold">
                    Update Password
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
