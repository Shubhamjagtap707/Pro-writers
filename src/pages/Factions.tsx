import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';

const DEFAULT_EMBLEM = 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80';

const stripHtml = (html?: string) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const ScrollableTitle = ({ text, className }: { text: string, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [overflowAmount, setOverflowAmount] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const overflow = textRef.current.scrollWidth - containerRef.current.clientWidth;
        setOverflowAmount(overflow > 0 ? overflow : 0);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap relative ${className}`}>
      <motion.h3
        ref={textRef}
        className="inline-block w-max text-3xl font-body font-bold text-on-surface"
        animate={overflowAmount > 0 ? { x: [0, -overflowAmount, 0] } : { x: 0 }}
        transition={overflowAmount > 0 ? { repeat: Infinity, duration: 4 + overflowAmount * 0.02, ease: "linear", repeatDelay: 1 } : {}}
      >
        {text}
      </motion.h3>
      {overflowAmount > 0 && (
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-surface-container to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default function Factions() {
  const navigate = useNavigate();
  const { factions, activeProjectId, projects, createFaction, deleteFaction, characters } = useProjectStore();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;
  const seriesId = activeProject?.series_id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFaction, setNewFaction] = useState({ 
    name: '', 
    motto: '',
    description: '',
    emblemUrl: '',
    color: 'text-primary'
  });

  const projectFactions = Object.values(factions).filter(f => 
    f.project_id === activeProjectId || (seriesId && f.series_id === seriesId)
  );

  const getMemberCount = (factionId: string) => {
    return Object.values(characters).filter(c => 
      c.allegiances?.some(a => a.factionId === factionId)
    ).length;
  };

  const handleCreate = () => {
    if (!activeProjectId || !newFaction.name.trim()) return;
    createFaction(activeProjectId, {
      name: newFaction.name.trim(),
      motto: newFaction.motto.trim(),
      description: newFaction.description.trim(),
      emblemUrl: newFaction.emblemUrl,
      color: newFaction.color
    }, seriesId);
    setIsModalOpen(false);
    setNewFaction({ name: '', motto: '', description: '', emblemUrl: '', color: 'text-primary' });
  };

  if (!activeProjectId) {
    return (
      <div className="page-shell flex items-center justify-center">
        <p className="text-slate-500 font-body text-xl">Please select a project first.</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h2 className="text-3xl font-body font-bold text-on-surface mb-6">Found Faction</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Faction Name</label>
                  <input
                    autoFocus
                    value={newFaction.name}
                    onChange={e => setNewFaction(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. The Iron Vanguard"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Motto / Creed</label>
                  <input
                    value={newFaction.motto}
                    onChange={e => setNewFaction(prev => ({ ...prev, motto: e.target.value }))}
                    placeholder="e.g. Strength in Iron"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Emblem Image URL</label>
                  <input
                    value={newFaction.emblemUrl}
                    onChange={e => setNewFaction(prev => ({ ...prev, emblemUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Color Theme</label>
                  <select
                    value={newFaction.color}
                    onChange={e => setNewFaction(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="text-primary">Gold (Primary)</option>
                    <option value="text-error">Crimson (Error)</option>
                    <option value="text-tertiary">Emerald (Tertiary)</option>
                    <option value="text-slate-300">Silver</option>
                    <option value="text-purple-400">Amethyst</option>
                  </select>
                </div>
                
                <button
                  onClick={handleCreate}
                  disabled={!newFaction.name.trim()}
                  className="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-surface transition-colors"
                >
                  ESTABLISH
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="page-content relative z-20">
        {/* Editorial Header */}
        <section className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-body font-bold text-on-surface mb-2">Factions & Groups</h2>
            <p className="text-on-surface-variant font-label tracking-wide max-w-xl">Organizations, guilds, noble houses, and cabals that shape the world.</p>
          </div>
        </section>

        {/* Factions Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projectFactions.map(faction => (
            <motion.div
              layoutId={`faction-${faction.id}`}
              key={faction.id}
              className="group cursor-pointer"
              onClick={() => navigate(`../factions/${faction.id}`)}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-surface-container shadow-xl mb-4 group-hover:shadow-primary/20 transition-all border border-outline-variant/10">
                <img 
                  src={faction.emblemUrl || DEFAULT_EMBLEM} 
                  alt={faction.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFaction(faction.id); }}
                    className="w-8 h-8 rounded-full bg-error/90 text-on-error flex items-center justify-center hover:bg-error transition-colors backdrop-blur-md"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <div className={`mb-2 ${faction.color || 'text-primary'}`}>
                    <span className="material-symbols-outlined text-xl">shield</span>
                  </div>
                  <ScrollableTitle text={faction.name} className="mb-1" />
                  <p className="text-slate-400 font-label text-xs tracking-widest uppercase mb-4 truncate">{faction.motto || 'No motto established'}</p>
                  
                  <p className="text-slate-300 font-body text-sm line-clamp-2 leading-relaxed">
                    {stripHtml(faction.description) || "Lore incomplete. Awaiting archival entries."}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-500">group</span>
                    <span className="text-xs font-label uppercase tracking-widest text-slate-400">
                      {getMemberCount(faction.id)} Members
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Create New Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsModalOpen(true)}
            className="aspect-[3/4] rounded-3xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 flex flex-col items-center justify-center gap-4 cursor-pointer bg-surface/30 hover:bg-surface-container-low transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">add</span>
            </div>
            <span className="font-label tracking-widest text-sm text-slate-400 uppercase">Found Faction</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
