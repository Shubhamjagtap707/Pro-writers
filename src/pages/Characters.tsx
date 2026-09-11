import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';

const filters = ['All Figures', 'Protagonists', 'Antagonists', 'NPCs'];

export default function Characters() {
  const [activeFilter, setActiveFilter] = useState('All Figures');
  const { characters, activeProjectId, projects, createCharacter, deleteCharacter } = useProjectStore();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;
  const seriesId = activeProject?.series_id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChar, setNewChar] = useState({ 
    name: '', 
    role: 'Protagonist', 
    archetype: '', 
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 
  });

  const projectChars = Object.values(characters).filter(c => 
    c.project_id === activeProjectId || (seriesId && c.series_id === seriesId)
  );
  const filteredChars = projectChars.filter(c => {
    if (activeFilter === 'All Figures') return true;
    if (activeFilter === 'Protagonists') return c.role === 'Protagonist';
    if (activeFilter === 'Antagonists') return c.role === 'Antagonist';
    if (activeFilter === 'NPCs') return !['Protagonist', 'Antagonist'].includes(c.role);
    return true;
  });

  const handleCreate = () => {
    if (!activeProjectId || !newChar.name.trim()) return;
    createCharacter(activeProjectId, {
      name: newChar.name.trim(),
      role: newChar.role,
      archetype: newChar.archetype.trim() || 'Unknown Archetype',
      avatarUrl: newChar.avatarUrl,
      color: newChar.role === 'Protagonist' ? 'text-primary' : newChar.role === 'Antagonist' ? 'text-error' : 'text-tertiary'
    }, seriesId);
    setIsModalOpen(false);
    setNewChar({ name: '', role: 'Protagonist', archetype: '', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' });
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
              
              <h2 className="text-3xl font-body font-bold text-on-surface mb-6">Envisage Character</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input
                    autoFocus
                    value={newChar.name}
                    onChange={e => setNewChar(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Silas Vane"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Archetype</label>
                  <input
                    value={newChar.archetype}
                    onChange={e => setNewChar(prev => ({ ...prev, archetype: e.target.value }))}
                    placeholder="e.g. The Haunted Inquisitor"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Role</label>
                  <select
                    value={newChar.role}
                    onChange={e => setNewChar(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option>Protagonist</option>
                    <option>Antagonist</option>
                    <option>Supporting</option>
                    <option>NPCs</option>
                  </select>
                </div>
                
                <button
                  onClick={handleCreate}
                  disabled={!newChar.name.trim()}
                  className="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-surface transition-colors"
                >
                  SPAWN ENTITY
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
            <h2 className="text-5xl font-body font-bold text-on-surface mb-2">Character Archive</h2>
            <p className="text-on-surface-variant font-label tracking-wide max-w-xl">Deep psychological profiles and interpersonal maps for your active manuscript.</p>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
                  activeFilter === f
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid layout with original dynamic aesthetic bindings */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8">

          {filteredChars.map((char, index) => {
            const pattern = index % 5;
            
            if (pattern === 0) {
              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="md:col-span-6 lg:col-span-8 bg-surface-container-low rounded-[2rem] overflow-hidden group cursor-pointer border border-transparent hover:border-primary/10 transition-all duration-300 relative"
                >
                  <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute z-20 right-4 top-4 p-2 bg-black/40 rounded-full text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden">
                      <img
                        alt={char.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={char.avatarUrl}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">{char.role}</span>
                      </div>
                    </div>
                    <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                      <span className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-2 block">{char.archetype}</span>
                      <h3 className="text-3xl font-body font-bold mb-4 text-on-surface">{char.name}</h3>
                      <p className="text-on-surface-variant font-body italic mb-6 leading-relaxed">A core figure locked inside the narrative framework of your manuscript.</p>
                      <div className="space-y-3">
                        {[
                          { label: 'Role', value: char.role },
                          { label: 'Archetype', value: char.archetype || 'Unknown' },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                            <span className="text-xs font-label text-slate-500 uppercase tracking-widest">{item.label}</span>
                            <span className="text-sm font-body text-on-surface">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            if (pattern === 1) {
              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="md:col-span-3 lg:col-span-4 bg-surface-container rounded-[2rem] p-6 flex flex-col border border-transparent hover:border-error/20 transition-all duration-300 cursor-pointer group relative"
                >
                  <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute z-20 right-8 top-8 p-2 bg-black/40 rounded-full text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative">
                    <img
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={char.avatarUrl}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-error-container/40 backdrop-blur-md text-error text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{char.role}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-body font-bold text-on-surface">{char.name}</h3>
                  <p className="text-slate-500 text-sm font-label mb-4 tracking-wide">{char.archetype}</p>
                </motion.div>
              );
            }

            if (pattern === 2) {
              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="md:col-span-3 lg:col-span-4 bg-surface-container-low rounded-[2rem] p-6 border border-transparent hover:border-tertiary/20 transition-all duration-300 cursor-pointer group relative"
                >
                  <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute z-20 right-8 top-8 p-2 bg-black/40 rounded-full text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative">
                    <img
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={char.avatarUrl}
                    />
                  </div>
                  <h3 className="text-2xl font-body font-bold text-on-surface">{char.name}</h3>
                  <p className="text-slate-500 text-sm font-label mb-4 tracking-wide">{char.role}</p>
                  <div className="p-4 bg-tertiary/10 rounded-xl border border-tertiary/10">
                    <p className="text-xs font-body italic text-tertiary">"{char.archetype} dynamics deployed within narrative."</p>
                  </div>
                </motion.div>
              );
            }

            if (pattern === 3) {
              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="md:col-span-3 lg:col-span-4 bg-surface-container rounded-[2rem] p-6 border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer group relative"
                >
                  <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute z-20 right-6 top-6 p-2 bg-black/40 rounded-full text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                      <img
                        alt={char.name}
                        className="w-full h-full object-cover"
                        src={char.avatarUrl}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-body font-bold text-on-surface">{char.name}</h3>
                      <p className="text-xs text-slate-500 font-label tracking-widest uppercase">{char.archetype}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {[{ label: 'Role', value: char.role }, { label: 'Status', value: 'Active' }].map(item => (
                      <div key={item.label} className="p-3 bg-surface-container-high rounded-xl">
                        <span className="block text-[10px] text-slate-500 font-label uppercase tracking-widest mb-1">{item.label}</span>
                        <span className={`text-xs ${item.label === 'Status' ? 'text-secondary' : 'text-on-surface'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="md:col-span-3 lg:col-span-4 bg-surface-container rounded-[2rem] overflow-hidden relative group cursor-pointer border border-transparent hover:border-secondary/20 transition-all duration-300"
                style={{ minHeight: 280 }}
              >
                <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute z-20 left-4 top-4 p-2 bg-black/40 rounded-full text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <img
                  alt={char.name}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-700 absolute inset-0"
                  src={char.avatarUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-secondary font-label text-[10px] uppercase tracking-[0.3em] mb-1 block">Role: {char.role}</span>
                  <h3 className="text-3xl font-body font-bold text-on-surface mb-2">{char.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="material-symbols-outlined text-sm">visibility_off</span>
                    <span className="font-label tracking-wide">{char.archetype}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* New Character Spawn Button added dynamically at the end */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsModalOpen(true)}
            className="md:col-span-3 lg:col-span-4 rounded-[2rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-8 hover:border-primary/40 transition-colors cursor-pointer group"
            style={{ minHeight: 280 }}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">person_add</span>
            </div>
            <p className="font-headline text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-on-surface transition-colors">Spawn Character</p>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
