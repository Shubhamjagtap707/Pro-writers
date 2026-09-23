import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [penName, setPenName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user?.user_metadata) {
      setFullName(user.user_metadata.full_name || '');
      setPenName(user.user_metadata.pen_name || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        pen_name: penName
      }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
    setSaving(false);
  };

  const userInitials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />
      <div className="page-content py-12 relative z-20">
        <div className="max-w-4xl mx-auto">
          
          <header className="mb-12 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
               <span className="text-3xl font-bold text-on-primary">{userInitials}</span>
            </div>
            <div>
              <span className="font-label text-xs font-bold text-primary tracking-[0.3em] uppercase block mb-2">Author Profile</span>
              <h2 className="font-body text-4xl text-on-surface leading-tight">{fullName || 'Pro Writer'}</h2>
              <p className="text-on-surface-variant mt-1 text-sm">{penName ? `Writing as ${penName}` : user?.email}</p>
            </div>
          </header>

          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container border border-outline-variant/20 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Author Identity
              </h3>

              {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-error/10 text-error border border-error/20'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-on-surface placeholder-outline outline-none transition-all"
                    placeholder="Your real name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">Pen Name (Optional)</label>
                  <input 
                    type="text" 
                    value={penName}
                    onChange={e => setPenName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-on-surface placeholder-outline outline-none transition-all"
                    placeholder="Pseudonym or alias"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
