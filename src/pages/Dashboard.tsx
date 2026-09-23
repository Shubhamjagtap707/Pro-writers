import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useProjectStore } from '../store/useProjectStore';


export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, scenes, series, deleteProject, updateProjectSeries } = useProjectStore();
  const [seriesModalOpen, setSeriesModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const projectList = Object.values(projects).sort((a, b) => {
    const timeA = new Date(a.last_edited_at || a.created_at).getTime();
    const timeB = new Date(b.last_edited_at || b.created_at).getTime();
    return timeB - timeA;
  });
  const totalWords = Object.values(scenes).reduce((acc, s) => acc + s.word_count, 0);

  const getProjectWordCount = (projectId: string) => {
    return Object.values(scenes)
      .filter(s => s.project_id === projectId)
      .reduce((acc, s) => acc + s.word_count, 0);
  };

  return (
    <div className="page-shell">
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Content */}
      <div className="page-content">
        {/* Editorial Header */}
        <section className="mb-16">
          <p className="font-headline text-primary uppercase tracking-[0.3em] text-xs mb-4">Current Endeavors</p>
          <div className="flex justify-between items-end">
            <h2 className="font-body text-6xl text-on-surface font-light leading-none">
              The Inkwell <span className="italic">Repository</span>
            </h2>
            <div className="text-right">
              <span className="block font-headline text-3xl font-bold text-on-surface">
                {totalWords.toLocaleString()}
              </span>
              <span className="block font-headline text-[10px] uppercase tracking-widest text-slate-500">Total System Words</span>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Empty Project Slot / CTA (Fixed Position) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            onClick={() => navigate('/templates')}
            className="col-span-12 lg:col-span-4 rounded-[2rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-8 hover:border-primary/40 transition-colors cursor-pointer group"
            style={{ minHeight: 400 }}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">add_circle</span>
            </div>
            <p className="font-headline text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-on-surface transition-colors">Begin New Manuscript</p>
          </motion.div>

          {/* Featured Project */}
          {projectList.length > 0 && (
            <motion.div
              key={projectList[0].id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-[2rem] p-10 group relative overflow-hidden flex flex-col justify-between hover:bg-surface-container transition-colors"
              style={{ minHeight: 400 }}
            >
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzKzGG8MudJ_k0OriLakPM3S0Jmx3ahnkoNfMMzExshnJPiZ53yyxKlCIRwj4jV2V81G94PuQV2oQdgQNI1j2_O_xa7nIObT_aiicHy6hzkN-5vO6t0dqD2OWe5HG0DHzQlTXHSsREMdbtDzUaSGRlcg02L-B5tHvXQn4DTNa10MeQMHPY5WCVFVrAxhgTH01sILnj6mmfsfeTJveh-uGPclxfVTN7whRCqO6ZZDjZWsSupT8HgEbr0c_2WYXWkARB2iHGL3lFw-4D" alt="Pen" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    {projectList[0].template}
                  </span>
                  {projectList[0].series_id ? (
                    <span className="px-3 py-1 bg-tertiary/20 text-tertiary rounded-full text-[10px] font-bold uppercase tracking-widest border border-tertiary/30">
                      {series[projectList[0].series_id]?.title || 'Part of a Series'}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProjectId(projectList[0].id); setSeriesModalOpen(true); }}
                      className="px-3 py-1 bg-surface-container-high hover:bg-tertiary/20 text-slate-400 hover:text-tertiary rounded-full text-[10px] font-bold uppercase tracking-widest border border-outline-variant/30 hover:border-tertiary/30 transition-colors z-20"
                    >
                      + Add to Series
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteProject(projectList[0].id); }}
                    className="text-red-500/50 hover:text-red-400 ml-auto transition-colors z-20"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <h3 onClick={() => navigate(`/${projectList[0].slug}/editor`)} className="font-body text-5xl mb-4 italic text-on-surface leading-tight max-w-md cursor-pointer hover:text-primary">
                  {projectList[0].title}
                </h3>
                <p className="font-body text-xl text-on-surface-variant max-w-sm font-light leading-relaxed">
                  {projectList[0].genre === 'Unassigned' ? (projectList[0].template.charAt(0).toUpperCase() + projectList[0].template.slice(1)) : projectList[0].genre}
                </p>
              </div>
              <div className="relative z-10 mt-12 cursor-pointer" onClick={() => navigate(`/${projectList[0].slug}/editor`)}>
                <div className="flex justify-between mb-3 items-end">
                  <span className="font-headline text-[11px] uppercase tracking-widest text-slate-400">Total Written</span>
                  <span className="font-body text-2xl text-primary italic">{getProjectWordCount(projectList[0].id).toLocaleString()} words</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #c0c1ff, #8083ff)', width: '100%' }} />
                </div>
              </div>
            </motion.div>
          )}



          {/* Remaining Projects */}
          {projectList.slice(1).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="col-span-12 lg:col-span-4 bg-surface-container rounded-[2rem] p-8 flex flex-col justify-between hover:bg-surface-container-high transition-colors group cursor-pointer"
              onClick={() => navigate(`/${p.slug}/editor`)}
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'wght' 200" }}>auto_stories</span>
                  {p.series_id ? (
                    <span className="px-2 py-0.5 bg-tertiary/20 text-tertiary rounded-md text-[8px] font-bold uppercase tracking-widest border border-tertiary/30">
                      {series[p.series_id]?.title || 'Series'}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProjectId(p.id); setSeriesModalOpen(true); }}
                      className="px-2 py-0.5 bg-surface-container-high hover:bg-tertiary/20 text-slate-400 hover:text-tertiary rounded-md text-[8px] font-bold uppercase tracking-widest border border-outline-variant/30 hover:border-tertiary/30 transition-colors z-20"
                    >
                      + Add to Series
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                    className="material-symbols-outlined text-slate-600 group-hover:text-red-400 transition-colors z-20"
                  >
                    delete
                  </button>
                </div>
                <p className="font-body text-3xl text-on-surface mb-2">{p.title}</p>
                <p className="font-label text-xs text-slate-500 uppercase tracking-widest">
                  {p.genre === 'Unassigned' ? p.template : p.genre}
                </p>
              </div>
              <div className="mt-8">
                <div className="flex justify-between text-[11px] font-headline text-slate-400 uppercase tracking-tighter mb-2">
                  <span>Written</span>
                  <span>{getProjectWordCount(p.id).toLocaleString()} Words</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* CTA moved to top */}
        </div>
      </div>

      <AnimatePresence>
        {seriesModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => { setSeriesModalOpen(false); setSelectedProjectId(null); }}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h2 className="text-3xl font-body font-bold text-on-surface mb-2">Select Series</h2>
              <p className="text-sm text-on-surface-variant mb-6">Group this manuscript into an existing series universe.</p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {Object.values(series).length > 0 ? (
                  Object.values(series).map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (selectedProjectId) {
                          updateProjectSeries(selectedProjectId, s.id);
                        }
                        setSeriesModalOpen(false);
                        setSelectedProjectId(null);
                      }}
                      className="w-full text-left bg-surface hover:bg-surface-container-high border border-outline-variant/10 rounded-xl p-4 transition-colors group flex justify-between items-center"
                    >
                      <span className="font-body text-lg text-on-surface group-hover:text-primary transition-colors">{s.title}</span>
                      <span className="material-symbols-outlined text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">add</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No series found. Create one by starting a new manuscript from a template.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
