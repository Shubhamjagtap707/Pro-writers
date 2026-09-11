import { motion } from 'framer-motion';

const locationCards = [
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUtaU-eNRxLaAZ_QHJ8WGpStUwt4ACDgcwj4sVgFTjMIlU8aBVUpPi4vsFkDUen2AIpuy4VhkjVOvW5k-ux0luQ16Rf7WyMP38leXSa9IZJl2REP_ZatnOZIvrMH_T7pCNU-9pOO5JOzvKuZoK8Wu7jyDYqVlQSkQsn0a62sdODxMKPvAK4FfrGJ6ju7lRXJiLvKbjN_ZGbS7T9GqtuZdvxvR9P1Isx14KiaARtLNI_4UB_5pYU_6WPWgIBTcvyyvI8UBf-n4rJz0u',
    tag: 'EXT. NIGHT', title: 'Blackwood Manor', sub: 'The Thorne Estate • 3 Characters', chars: 2,
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChVRgtiagaToWR2rUg2QnaabiN--IFTf3wirImKCeSqmRdld4Ul30EoDyswVgGXsYWhZlVih8Obb2gSgNR4oW9mooa9jClIHuRer0PCwU-TGSOtbdzJaivIsse-0iApFwH4tGBBox2nm0VQADTo4CbcQjoeqMZ4M4jSIIhCj2pZHjvtD-wXLIGF-GLvZGPuB-i5Ne8daa7uHyw-iW2uCll2JNqVjjLD9wn9oxQkgiEjDnfxrIVNFU_T3aE7uPukP5glqLsIlhQPLt',
    tag: 'INT. DAY', title: 'The Shattered Glass', sub: 'Observation Deck • 1 Character', chars: 1,
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM2Q25l8TRnZpaFTnyYRpCOS4z41Hri9N5R9H6KgMpEa-bwAWtG499twM0ATIvWGcrAUssN15qYzkJ_TK9gu7gdwejQUt9Vjrqs7e93Tffc7nTknxGU0Hc454cL7lznNCaZsYMNDneBLJiqXTryyFiPp901VlmG2K8uqxX6fgffJRx0xYaD4JM4BlrbRovYuyon3nFaDRs2feDjZP7Sa9IU9vZGEebgk5Ctx-yw_0_dpx8My3b-T-dWzQgA3PJxVrjmobodidRcbm9',
    tag: 'EXT. DAWN', title: 'Wailing Woods', sub: 'Outer Perimeter • 0 Characters', chars: 0,
  },
];

const matrixData = [
  { location: 'The Docks',        cols: ['present','present','absent','mention'] },
  { location: 'Blackwood Manor',  cols: ['absent','mention','present','present'] },
  { location: 'The Shattered Glass', cols: ['present','absent','absent','absent'] },
];

function MatrixDot({ type }: { type: string }) {
  if (type === 'present')  return <span className="inline-block w-3 h-3 rounded-full bg-primary" />;
  if (type === 'mention')  return <span className="inline-block w-3 h-3 rounded-full bg-tertiary" />;
  return <span className="inline-block w-3 h-3 rounded-full bg-outline-variant opacity-20" />;
}

export default function LocationTracker() {
  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Scrollable Content */}
      <div className="page-content">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest">Act II: The Descent</span>
              </div>
              <h2 className="font-body text-5xl text-on-surface font-light tracking-tight">
                Location <span className="italic text-primary">Intelligence</span>
              </h2>
              <p className="font-body text-lg text-on-surface-variant mt-3 max-w-xl">
                Mapping the physical presence of your cast across the narrative topography. Track character intersections and environmental beats.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="glass-panel text-primary px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined text-lg">grid_view</span> Board
              </button>
              <button className="bg-surface-container-low text-on-surface-variant px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-lg">layers</span> Timeline
              </button>
            </div>
          </header>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hero Map */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="md:col-span-8 bg-surface-container-low rounded-3xl overflow-hidden relative group border border-outline-variant/5"
              style={{ minHeight: 360 }}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxj94NXOmGV-J19i1rs4sqxrX_1H_N52svDjhtGBT8BBijLM1x_ims4Pa_Xt04fDKe58h-SFn9wvuiTG7Ys8yOma7YW6bGJ891BlxNFcXL7zMPvhh8nL3HI1zF0l9ETR035tj8xA8WXe0sPpz6zxkBqJbzs5gypEYonARPAbc4Pd3HSXmH0fA3FSJouVZYnGzweGHleV9JAAfs-_LdFZU31fJrLcyU32aljpt_japS2MjjxtlQPLcdN6ld6NkRatPCb_WIguhBXtFN"
                  alt="Midnight at the Docks map"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-8 h-full flex flex-col" style={{ minHeight: 360 }}>
                <div className="mt-auto">
                  <h3 className="font-body text-4xl text-on-surface mb-2 italic">Midnight at the Docks</h3>
                  <p className="font-label text-xs text-primary tracking-widest uppercase font-bold mb-6">Primary Story Hub • Scene 42-45</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex -space-x-3">
                      {[
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuA4js3eZInTgpBjqLRX4oTCjp57h3atKCSprKLqEMMMpR8YY8Kciq9TuXfI54_OfEft9xCtaYyPl3RC9x4Tkutt5lT4FnD1ohKTwnVPRlqRpi4ERy5bwSva89S_cYe4S9yVNEgUXal0ueYkSiux__cqQhYCzxz5CNEyQ777KW9pi_lkCeRKkSxF2kp7I-w1cqq8xLV2jMiAP4hcZBb6J1AvF0wKLhoymZwEgsJJMDsPvWXJxc19_pFLNLKEIW2JVRusSAsrR74xCGfJ',
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAyPYCh-JjK1klQICiw-DyDREDpaxDUdFyAE83OvffVvYWiglGT0_m0TdMwVexfOrmdEY59Bt4C1-tylJVXaiDXbucMb4svhdqSFKMq1DIDBcxhXb6MDh5gIkL3blFtv1HcvtC48GN8nIncehAQoGb4zxYO59T8ycRS3ICuzEuwXEc3n4nBi_TvnQ1jl2JIx_NoAevpLDgLbXHTbZdWol3Z6o5fKukD7rb9L7lI9Bx19b1Wmo6sqI72D-Q44bnNyTcmZfZMNHfGRh0w'
                      ].map((src, i) => (
                        <img key={i} alt="char" className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover" src={src} />
                      ))}
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold border-2 border-surface-container-low">+2</div>
                    </div>
                    <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/20">
                      <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-tight">Timeline Conflict: Scene 44</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Stats */}
            <div className="md:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                className="bg-surface-container-high p-8 rounded-3xl border border-outline-variant/10"
              >
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Spatial Density</p>
                <div className="space-y-4">
                  {[
                    { name: 'The Shattered Glass', pct: 85, color: 'var(--color-primary)' },
                    { name: 'Upper District', pct: 20, color: 'var(--color-outline-variant)' },
                  ].map(item => (
                    <div key={item.name}>
                      <div className="flex justify-between items-end mb-1">
                        <span className="font-body text-xl italic text-on-surface">{item.name}</span>
                        <span className="text-xs font-label font-bold" style={{ color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 1, delay: 0.3 }} style={{ background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-surface-container-low to-surface-container-high p-8 rounded-3xl border border-outline-variant/10 group cursor-pointer hover:border-primary/20 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">add_location_alt</span>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">arrow_outward</span>
                </div>
                <h4 className="font-body text-2xl text-on-surface mb-2">Architectural Ghosting</h4>
                <p className="text-sm text-slate-400 font-label leading-relaxed">Map characters who haven't entered the scene yet but are nearby.</p>
              </motion.div>
            </div>

            {/* Location Cards Row */}
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {locationCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/5 hover:border-primary/20 transition-all group"
                >
                  <div className="h-32 rounded-2xl mb-6 overflow-hidden relative">
                    <img className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500"
                      src={card.img} alt={card.title} />
                    <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-on-surface">
                      {card.tag}
                    </div>
                  </div>
                  <h5 className="font-body text-2xl mb-1 italic text-on-surface">{card.title}</h5>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{card.sub}</p>
                  <div className="flex items-center gap-2">
                    {card.chars > 0 ? (
                      Array.from({ length: card.chars }).map((_, ci) => (
                        <div key={ci} className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-primary">person</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs italic text-slate-500">No active presence detected</p>
                    )}
                    <button className="ml-auto text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
                      Open Plot <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Movement Matrix */}
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-body text-3xl text-on-surface">Movement <span className="italic">Matrix</span></h3>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Present</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary" /> Mentioned</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-outline-variant" /> Absent</span>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-outline-variant/10">
                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 w-1/4">Location / Chapter</th>
                    {['Ch. 12','Ch. 13','Ch. 14','Ch. 15'].map(ch => (
                      <th key={ch} className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">{ch}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {matrixData.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container transition-colors">
                      <td className="p-6 font-body text-lg italic text-on-surface">{row.location}</td>
                      {row.cols.map((type, ci) => (
                        <td key={ci} className="p-6 text-center"><MatrixDot type={type} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>


    </div>
  );
}
