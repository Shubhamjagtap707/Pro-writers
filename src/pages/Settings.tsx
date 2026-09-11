import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetting(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password reset link sent to your email.' });
    }
    setResetting(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />
      <div className="page-content py-12 relative z-20">
        <div className="max-w-4xl mx-auto">
          
          <header className="mb-12">
            <span className="font-label text-xs font-bold text-primary tracking-[0.3em] uppercase block mb-2">Preferences</span>
            <h2 className="font-body text-5xl text-on-surface leading-tight">Account Settings</h2>
            <p className="text-on-surface-variant mt-4 text-lg">Manage your account security and application preferences.</p>
          </header>

          <div className="space-y-8">
            {/* Account Information */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container border border-outline-variant/20 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                Account Security
              </h3>

              {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-error/10 text-error border border-error/20'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                  <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface opacity-70 cursor-not-allowed">
                    {user?.email}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">Email changes must be verified through support.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
                  <button 
                    onClick={handlePasswordReset}
                    disabled={resetting}
                    className="w-full bg-surface-container-high border border-outline-variant/30 hover:border-primary text-on-surface font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                    {resetting ? 'Sending Link...' : 'Send Reset Link'}
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Data & Privacy */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-surface-container border border-outline-variant/20 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">data_usage</span>
                Data & Privacy
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl">
                  <div>
                    <h4 className="font-bold text-on-surface">Export Manuscript Data</h4>
                    <p className="text-sm text-on-surface-variant">Download a JSON backup of all your projects.</p>
                  </div>
                  <button className="px-4 py-2 bg-surface border border-outline-variant/30 text-primary font-semibold rounded-lg hover:bg-surface-container-highest transition-colors">
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-error/5 border border-error/20 rounded-xl">
                  <div>
                    <h4 className="font-bold text-error">Danger Zone</h4>
                    <p className="text-sm text-on-surface-variant">Permanently delete your account and all data.</p>
                  </div>
                  <button className="px-4 py-2 bg-error text-on-error font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Sign Out */}
            <div className="flex justify-end pt-4">
               <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-6 py-3 bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-xl transition-colors font-semibold shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sign Out
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
