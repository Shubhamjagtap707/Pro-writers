import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useProjectStore } from '../store/useProjectStore';

const weeklyBars = [40, 65, 90, 55, 75, 45, 30];

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, scenes, series, deleteProject } = useProjectStore();
  
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
          <p className="font-headline text-[#c0c1ff] uppercase tracking-[0.3em] text-xs mb-4">Current Endeavors</p>
          <div className="flex justify-between items-end">
            <h2 className="font-body text-6xl text-[#dae2fd] font-light leading-none">
              The Inkwell <span className="italic">Repository</span>
            </h2>
            <div className="text-right">
              <span className="block font-headline text-3xl font-bold text-[#dae2fd]">
                {totalWords.toLocaleString()}
              </span>
              <span className="block font-headline text-[10px] uppercase tracking-widest text-slate-500">Total System Words</span>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {projectList.map((p, i) => {
            const isFeatured = i === 0;
            const words = getProjectWordCount(p.id);

            if (isFeatured) {
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="col-span-12 lg:col-span-8 bg-[#131b2e] rounded-[2rem] p-10 group relative overflow-hidden flex flex-col justify-between hover:bg-[#171f33] transition-colors"
                  style={{ minHeight: 400 }}
                >
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzKzGG8MudJ_k0OriLakPM3S0Jmx3ahnkoNfMMzExshnJPiZ53yyxKlCIRwj4jV2V81G94PuQV2oQdgQNI1j2_O_xa7nIObT_aiicHy6hzkN-5vO6t0dqD2OWe5HG0DHzQlTXHSsREMdbtDzUaSGRlcg02L-B5tHvXQn4DTNa10MeQMHPY5WCVFVrAxhgTH01sILnj6mmfsfeTJveh-uGPclxfVTN7whRCqO6ZZDjZWsSupT8HgEbr0c_2WYXWkARB2iHGL3lFw-4D" alt="Pen" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 bg-[#4f319c] text-[#bea8ff] rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {p.template}
                      </span>
                      {p.series_id && (
                        <span className="px-3 py-1 bg-[#ffb783]/20 text-[#ffb783] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#ffb783]/30">
                          {series[p.series_id]?.title || 'Part of a Series'}
                        </span>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                        className="text-red-500/50 hover:text-red-400 ml-auto transition-colors z-20"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                    <h3 onClick={() => navigate(`/${p.slug}/editor`)} className="font-body text-5xl mb-4 italic text-[#dae2fd] leading-tight max-w-md cursor-pointer hover:text-[#c0c1ff]">
                      {p.title}
                    </h3>
                    <p className="font-body text-xl text-[#c7c4d7] max-w-sm font-light leading-relaxed">
                      {p.genre === 'Unassigned' ? (p.template.charAt(0).toUpperCase() + p.template.slice(1)) : p.genre}
                    </p>
                  </div>
                  <div className="relative z-10 mt-12 cursor-pointer" onClick={() => navigate(`/${p.slug}/editor`)}>
                    <div className="flex justify-between mb-3 items-end">
                      <span className="font-headline text-[11px] uppercase tracking-widest text-slate-400">Total Written</span>
                      <span className="font-body text-2xl text-[#c0c1ff] italic">{words.toLocaleString()} words</span>
                    </div>
                    <div className="h-2 w-full bg-[#2d3449] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #c0c1ff, #8083ff)', width: '100%' }} />
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="col-span-12 lg:col-span-4 bg-[#171f33] rounded-[2rem] p-8 flex flex-col justify-between hover:bg-[#222a3d] transition-colors group cursor-pointer"
                onClick={() => navigate(`/${p.slug}/editor`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="material-symbols-outlined text-[#c0c1ff] text-4xl" style={{ fontVariationSettings: "'wght' 200" }}>auto_stories</span>
                    {p.series_id && (
                      <span className="px-2 py-0.5 bg-[#ffb783]/20 text-[#ffb783] rounded-md text-[8px] font-bold uppercase tracking-widest border border-[#ffb783]/30">
                        {series[p.series_id]?.title || 'Series'}
                      </span>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                      className="material-symbols-outlined text-slate-600 group-hover:text-red-400 transition-colors z-20"
                    >
                      delete
                    </button>
                  </div>
                  <p className="font-body text-3xl text-[#dae2fd] mb-2">{p.title}</p>
                  <p className="font-label text-xs text-slate-500 uppercase tracking-widest">
                    {p.genre === 'Unassigned' ? p.template : p.genre}
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between text-[11px] font-headline text-slate-400 uppercase tracking-tighter mb-2">
                    <span>Written</span>
                    <span>{words.toLocaleString()} Words</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#2d3449] rounded-full">
                    <div className="h-full bg-[#ffb783] rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Weekly Rhythm */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 lg:col-span-4 bg-[#131b2e] rounded-[2rem] p-8 border border-[#464554]/10"
          >
            <h4 className="font-headline text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-6">Weekly Rhythm</h4>
            <div className="flex items-end gap-2 h-32 mb-6">
              {weeklyBars.map((h, i) => (
                <div key={i} className="flex-1 bg-[#222a3d] rounded-t-lg group relative" style={{ height: `${h}%` }}>
                  <div className="absolute inset-0 bg-[#c0c1ff]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                  {i === 3 && (
                    <div className="absolute inset-0 bg-[#c0c1ff] opacity-50 rounded-t-lg" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-headline text-[#c7c4d7] italic">Steady flow this week</span>
              <div className="flex items-center gap-1 text-[#ffb783]">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-[10px] font-bold">12%</span>
              </div>
            </div>
          </motion.div>

          {/* Empty Project Slot / CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            onClick={() => navigate('/templates')}
            className="col-span-12 lg:col-span-4 rounded-[2rem] border-2 border-dashed border-[#464554]/30 flex flex-col items-center justify-center p-8 hover:border-[#c0c1ff]/40 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-[#171f33] flex items-center justify-center mb-4 group-hover:bg-[#8083ff]/20 transition-colors">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-[#c0c1ff] transition-colors">add_circle</span>
            </div>
            <p className="font-headline text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-[#dae2fd] transition-colors">Begin New Manuscript</p>
          </motion.div>
        </div>
      </div>


    </div>
  );
}
