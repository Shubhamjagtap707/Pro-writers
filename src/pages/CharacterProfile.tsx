import { motion } from 'framer-motion';

export default function CharacterProfile() {
  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Content */}
      <div className="page-content">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Main Profile */}
          <div className="flex-1 space-y-12">
            {/* Profile Header */}
            <div className="flex items-start gap-8">
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl overflow-hidden bg-surface-container-low">
                  <img
                    alt="Silas Thorne"
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtkm-4qgPEl_byUNKsTjR2sBtnxdw6vXrmdhwK0nD7g3Rg_Oc-LT95yVWIe8RlsugXn5m3Qvuna75DQ2AdvJDb4Muzjl-CBAgdeWCpw5JXkOAaVFy7s1uW7sBTVPS0JqKe9C999BuIlqh5u3_1DJwHnZ-ckI2Rd7t8hIvveirVyKr2nQhwzbmGQ_qT9eD_KLhONrjKTUEvh0G61ULRcqdDJ5IfyIlpy5rJQ_c-hGVFjShavSWGKfYbGjll15nV-xN8Kq_1n2Bps1Xu"
                  />
                </div>
                <button className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>
              <div className="flex-1 pt-4">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">Character Identity</label>
                <input
                  className="w-full bg-transparent border-none text-5xl font-body font-semibold text-on-surface focus:ring-0 p-0 mb-2 outline-none"
                  defaultValue="Silas Thorne"
                />
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">Protagonist</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high text-slate-400 text-[11px] font-bold uppercase tracking-wider">The Last Watcher</span>
                </div>
              </div>
            </div>

            {/* Grid sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                  <h3 className="font-bold text-lg tracking-tight text-on-surface">Core Traits</h3>
                </div>
                <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-1">Demeanor</label>
                    <p className="font-body text-lg leading-relaxed italic text-on-surface-variant">Stoic, calculating, haunted by the memories of the Great Collapse.</p>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/10">
                    <label className="block text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-1">Defining Habit</label>
                    <p className="font-body text-lg leading-relaxed text-on-surface-variant">Taps a silver pocket watch that no longer ticks when he's anxious.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">target</span>
                  <h3 className="font-bold text-lg tracking-tight text-on-surface">Primary Goals</h3>
                </div>
                <div className="bg-surface-container-low p-6 rounded-3xl space-y-4">
                  {['Recover the lost archives from the Obsidian Spire.', 'Find the sister he abandoned ten years ago.'].map(goal => (
                    <div key={goal} className="flex items-start gap-3">
                      <span className="w-2 h-2 mt-2 rounded-full bg-tertiary flex-shrink-0" />
                      <p className="font-body text-lg text-on-surface-variant">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Backstory */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
                  <h3 className="font-bold text-lg tracking-tight text-on-surface">Backstory</h3>
                </div>
                <button className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">Expand View</button>
              </div>
              <div className="bg-surface-container-low p-8 rounded-3xl">
                <textarea
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body text-xl leading-relaxed text-on-surface-variant resize-none outline-none"
                  placeholder="The ink of the past is never dry..."
                  rows={6}
                  defaultValue="Born into the fading nobility of the Mid-Rim, Silas was groomed for a life of bureaucratic leisure. That ended the night the Spire fell. He escaped with nothing but the clothes on his back and the burden of knowing exactly why the shields failed. He spent the next decade in the shadows of the Under-City, sharpening his skills and his resentment."
                />
              </div>
            </div>

            {/* Narrative Arc */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">insights</span>
                <h3 className="font-bold text-lg tracking-tight text-on-surface">Narrative Arc</h3>
              </div>
              <div className="relative bg-surface-container-low p-8 rounded-3xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest">Rising Action</span>
                </div>
                <div className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mb-1" />
                    <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-400 mb-2 uppercase tracking-widest">Transformation Trigger</h4>
                    <p className="font-body text-xl text-on-surface">Receiving a coded message meant for a dead man forces Silas out of hiding and into the path of the Resistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-8">
            {/* Quick Notes */}
            <section className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Quick Notes</h4>
              <div className="glass-panel rounded-3xl p-6 space-y-4 border border-outline-variant/10">
                {[
                  { text: '"He smells of ozone and old paper."', category: 'Sensory Detail' },
                  { text: 'Internal Monologue: Questioning his loyalty to the Watchers.', category: 'Plot Hook' },
                ].map(note => (
                  <div key={note.category} className="group cursor-pointer">
                    <p className="text-sm font-body text-on-surface-variant mb-2 italic">{note.text}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{note.category}</span>
                      <span className="material-symbols-outlined text-sm text-slate-600 group-hover:text-primary transition-colors">delete</span>
                    </div>
                    <div className="h-px bg-outline-variant/10 mt-4" />
                  </div>
                ))}
                <button className="w-full py-3 rounded-xl border border-dashed border-outline-variant/30 text-slate-500 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">add</span> Add Note
                </button>
              </div>
            </section>

            {/* Connections */}
            <section className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Connections</h4>
              <div className="space-y-3">
                {[
                  { name: 'Elara Thorne', rel: 'Sister / Estranged', relColor: 'text-primary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWoFTWbZ06wFe8grbc71bxC7llkH4N_nmHC06Cmr7cdY1L2SLLqtUlbp02TJBQ798WWC-eev0_IXd0hvc5I3ylRklbb8hmPU1hacZ-82AjaohMZ84H6KyTRAneuVhdDH8mI2CwxloRsl3GIK96_kWTot8caIKNTfvCq6AFzzH_8BPFt25UCFKngAtEzT38JThOEB2BtnvF5VVVY6jjdLt3peE1IzFx2UCbIAAvEW0Ar7PO8XKrCmO-o1BOXi8bUBb9qSYs1d1kqX2P' },
                  { name: 'Vaelin Nox', rel: 'Mentor / Antagonist', relColor: 'text-tertiary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2fAYYXXHaJ6Jlq2tIivh2RcrQPIcuO_GtM9uJ8PkJMory1OaxVxumVpt7rgK8sD1R2Jg4UPAt0WAzrhRVt7zkz1Ir3_GlDxgA247FJQbl6n7UAzksj7X48ZKqt0t8_0kXqrcguN7pUVePdtGu6VpGQPEKr33cWMPKnqCMDluP7kPpz4yK4nxppFUUBd7o5yo1LfCtHX-3h_PMB1T5WR0Agyd2I8t2aauEc5FT9bCMAbP49xll-QYn7oJrxDvF_IV_pwBXpBO3r8yl' },
                ].map(conn => (
                  <div key={conn.name} className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img alt={conn.name} className="w-full h-full object-cover" src={conn.img} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-on-surface">{conn.name}</h5>
                      <p className={`text-[10px] uppercase font-bold tracking-widest ${conn.relColor}`}>{conn.rel}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl border border-primary/10 relative overflow-hidden"
              style={{ background: 'linear-gradient(to bottom right, rgba(192,193,255,0.1), #2d3449)' }}
            >
              <div className="relative z-10">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 font-headline">Narrative Presence</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-400">Word Count Contribution</span>
                      <span className="text-on-surface">14,203</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ delay: 0.5, duration: 1 }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Complexity Score</span>
                      <span className="font-body text-3xl text-on-surface">High</span>
                    </div>
                    <span className="material-symbols-outlined text-primary opacity-50 text-4xl">analytics</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
