import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';

const filters = ['All Lore', 'Location', 'Item', 'Lore'];

export default function WorldBuilding() {
  const [activeFilter, setActiveFilter] = useState('All Lore');
  const { activeProjectId, projects, worldItems, createWorldItem, deleteWorldItem } = useProjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    category: 'Location' as 'Location' | 'Item' | 'Lore', 
    description: '', 
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 
  });

  const activeProject = activeProjectId ? projects[activeProjectId] : null;
  const seriesId = activeProject?.series_id;
  const projectItems = Object.values(worldItems).filter(item => 
    item.project_id === activeProjectId || (seriesId && item.series_id === seriesId)
  );
  const filteredItems = projectItems.filter(item => {
    if (activeFilter === 'All Lore') return true;
    return item.category === activeFilter;
  });

  const handleCreate = () => {
    if (!activeProjectId || !newItem.name.trim()) return;
    createWorldItem(activeProjectId, {
      name: newItem.name.trim(),
      category: newItem.category,
      description: newItem.description.trim() || 'Undocumented phenomenon.',
      imageUrl: newItem.imageUrl,
    }, seriesId);
    setIsModalOpen(false);
    setNewItem({ name: '', category: 'Location', description: '', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' });
  };

  if (!activeProjectId || !activeProject) {
    return (
      <div className="page-shell flex items-center justify-center">
        <p className="text-slate-500 font-body text-xl">Please select a manuscript first.</p>
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
              
              <h2 className="text-3xl font-body font-bold text-on-surface mb-6">Archive New Lore</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Entry Title</label>
                  <input
                    autoFocus
                    value={newItem.name}
                    onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. The Sunken Isles"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option>Location</option>
                    <option>Item</option>
                    <option>Lore</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief history..."
                    rows={3}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                
                <button
                  onClick={handleCreate}
                  disabled={!newItem.name.trim()}
                  className="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-surface transition-colors"
                >
                  ADD TO ARCHIVE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-content space-y-12 max-w-7xl mx-auto w-full relative z-20">
        
        {/* Original Hero Section - Kept aesthetically intact but linked to project title */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative group overflow-hidden rounded-[2rem] bg-surface-container" style={{ height: 400 }}
          >
            <img
              alt="World map" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-DVvhQWc2v_lSDddNrKP2_93fleGCS9jApfArg_yH-vOqFLAud0lPaQ9u4Vomf2-GvnXu8L5TYOG-vLeOW65mHbcaffipMdhZ5EOhAZtKQAYFxyXSrOkwoz2bjhhHUBVhKFLkmCGHWolQiEffl58NX_TfIrHuL7AOolcz7jes1ZSDOG-gIX6KxcXDpi5SBgnoY5pkol8e4PLsyD5r1diDLEPlilJgRGCmQJ71YfpN6GJkKJisEWzhCPzD1GMvkFq4w5Z4qG_uyy4U"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest">Active Schema</span>
              <h3 className="text-4xl font-body italic text-on-surface">{activeProject.title} Framework</h3>
              <p className="text-on-surface-variant max-w-lg font-body text-lg leading-relaxed">{projectItems.length} logical entities have been mapped inside this universe.</p>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setIsModalOpen(true)} className="bg-primary px-6 py-2.5 rounded-xl text-on-primary font-bold text-sm">Add Metadata</button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline font-bold text-slate-400 text-sm tracking-widest uppercase">Quick Lore Sync</h4>
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <div className="space-y-6 flex-grow">
              <div className="p-4 rounded-2xl bg-surface-container-high border-l-2 border-primary/40">
                <p className="text-xs text-slate-500 mb-1 font-headline uppercase">Daily AI Prompt</p>
                <p className="text-on-surface font-body italic text-lg leading-snug">"What are the consequences of defying the natural laws of your new location?"</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Lore Cards */}
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-4">
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bento Grid with Original Aesthetic Variance */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-surface-container-low rounded-[2rem] p-8 border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-all group min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-colors">
                <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">note_add</span>
              </div>
              <p className="font-headline text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-on-surface transition-colors">Deposit Archive Entry</p>
            </motion.div>

            {filteredItems.map((item, index) => {
              const pattern = index % 3;

              if (pattern === 0) {
                 // The "Image Heavy" Card design
                 return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
                    className="bg-surface-container rounded-[2rem] group relative h-fit"
                  >
                    <button onClick={(e) => { e.stopPropagation(); deleteWorldItem(item.id); }} className="absolute z-20 right-4 top-4 w-8 h-8 rounded-full bg-black/50 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <div className="overflow-hidden rounded-[2rem]">
                      <div className="h-48 overflow-hidden relative">
                        <img alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={item.imageUrl} />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
                      </div>
                      <div className="p-8 space-y-4">
                        <div className="flex justify-between items-center mt-[-2rem] relative z-10">
                          <span className="px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold uppercase backdrop-blur-md">{item.category}</span>
                        </div>
                        <h4 className="text-2xl font-body text-on-surface">{item.name}</h4>
                        <p className="text-on-surface-variant font-body text-lg leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                 );
               } 
               else if (pattern === 1) {
                 // The "Impact / Event" Card design
                 return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
                    className="bg-surface-container border-l-4 border-primary rounded-[2rem] p-8 space-y-6 cursor-pointer group relative h-fit"
                  >
                    <button onClick={(e) => { e.stopPropagation(); deleteWorldItem(item.id); }} className="absolute z-20 right-4 top-4 p-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">{item.category}</span>
                      </div>
                      <h4 className="text-2xl font-body text-on-surface mb-4">{item.name}</h4>
                      <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-4">{item.description}</p>
                      <div className="p-4 rounded-xl bg-surface-container-lowest text-xs text-slate-400 font-headline">
                        <span className="font-bold text-primary block mb-1">STORY IMPACT: HIGH</span>
                        Logged into the permanent logical schema.
                      </div>
                    </div>
                  </motion.div>
                 );
               }
               else {
                 // The "Standard Minimalist" Card design
                 return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
                    className="bg-surface-container-low rounded-[2rem] p-8 space-y-6 cursor-pointer group relative h-fit"
                  >
                    <button onClick={(e) => { e.stopPropagation(); deleteWorldItem(item.id); }} className="absolute z-20 right-4 top-4 p-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="p-3 rounded-2xl bg-surface-container-high text-primary">
                          <span className="material-symbols-outlined">
                            {item.category === 'Location' ? 'landscape' : item.category === 'Item' ? 'diamond' : 'menu_book'}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">{item.category}</span>
                      </div>
                      <h4 className="text-2xl font-body group-hover:text-primary transition-colors text-on-surface">{item.name}</h4>
                      <p className="text-on-surface-variant font-body text-lg leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                 );
               }
            })}

          </div>
        </section>
      </div>
    </div>
  );
}
