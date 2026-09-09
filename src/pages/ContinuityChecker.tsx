import { motion } from 'framer-motion';

const conflicts = [
  {
    severity: 'Critical',
    severityBg: 'bg-[#93000a]',
    severityText: 'text-[#ffdad6]',
    title: 'Missing characters in critical scenes',
    chapter: 'Chapter 14: The Descent',
    desc: 'Elias Vance is mentioned as being present in the laboratory during the chemical spill, but was last documented 400 miles away in "The Crossing" only 2 hours prior. No travel method established.',
    actions: [
      { icon: 'edit_note', label: 'Resolve in Manuscript', color: 'text-[#c0c1ff]' },
      { icon: 'visibility_off', label: 'Dismiss Paradox', color: 'text-slate-500' },
    ],
  },
  {
    severity: 'Warning',
    severityBg: 'bg-[#d97721]/30',
    severityText: 'text-[#ffb783]',
    title: 'Conflicting Timelines',
    chapter: 'Multiple Chapters',
    desc: 'The solar eclipse event is described as taking place on a Thursday in Chapter 3, but the regional calendar established in Chapter 1 places the astronomical event on a lunar Tuesday.',
    actions: [{ icon: 'auto_fix', label: 'Adjust Calendar', color: 'text-[#c0c1ff]' }],
  },
  {
    severity: 'Warning',
    severityBg: 'bg-[#d97721]/30',
    severityText: 'text-[#ffb783]',
    title: 'Item Persistence Error',
    chapter: 'Chapter 8: The Gala',
    desc: 'The "Onyx Pendant" was sold to the merchant in Chapter 5, yet Clara is seen wearing it in the ballroom scene.',
    actions: [{ icon: 'inventory_2', label: 'Trace Item Path', color: 'text-[#c0c1ff]' }],
  },
];

const geoTimeline = [
  { time: '09:00 AM — Citadel', name: 'Elias Vance', quote: '"The sunrise caught the spires..."', isConflict: false },
  { time: '11:15 AM — Iron Docks', name: 'Elias Vance', quote: 'Movement Conflict: Distance unreachable by current lore constraints.', isConflict: true },
  { time: '01:00 PM — Shadow Market', name: 'Clara Thorne', quote: '"The scent of copper and spice..."', isConflict: false, dimmed: true },
];

export default function ContinuityChecker() {
  return (
    <div className="page-shell"
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(192,193,255,0.02) 1px, transparent 0)', backgroundSize: '40px 40px' }}>

      {/* TopNavBar */}


      {/* Content */}
      <div className="page-content pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-[#c0c1ff] font-label text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Inconsistency Engine</span>
              <h2 className="text-4xl font-body text-[#dae2fd] font-medium italic">Continuity Checker</h2>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-3 rounded-2xl bg-[#131b2e] flex flex-col items-end">
                <span className="text-[10px] uppercase text-slate-500 tracking-tighter">Total Inconsistencies</span>
                <span className="text-2xl font-headline font-bold text-[#ffb783]">14</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-[#131b2e] flex flex-col items-end">
                <span className="text-[10px] uppercase text-slate-500 tracking-tighter">Critical Paradoxes</span>
                <span className="text-2xl font-headline font-bold text-[#ffb4ab]">03</span>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main Report */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <section className="bg-[#131b2e] rounded-2xl p-8">
                <h3 className="font-headline text-lg font-semibold mb-6 flex items-center gap-3 text-[#dae2fd]">
                  <span className="material-symbols-outlined text-[#c0c1ff]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  Active Conflict Reports
                </h3>
                <div className="space-y-4">
                  {conflicts.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="group p-6 rounded-2xl bg-[#171f33] hover:bg-[#222a3d] transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded ${c.severityBg} ${c.severityText} text-[10px] font-bold uppercase tracking-widest`}>{c.severity}</span>
                          <h4 className="font-body text-xl text-[#dae2fd]">{c.title}</h4>
                        </div>
                        <span className="text-slate-500 text-xs font-label">{c.chapter}</span>
                      </div>
                      <p className="text-[#c7c4d7] text-sm font-body leading-relaxed mb-4">{c.desc}</p>
                      <div className="flex items-center gap-4 border-t border-[#464554]/10 pt-4">
                        {c.actions.map(a => (
                          <button key={a.label} className={`${a.color} text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-80 transition-opacity`}>
                            <span className="material-symbols-outlined text-sm">{a.icon}</span>
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Side Controls */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Geo-Timeline */}
              <section className="bg-[#131b2e] rounded-2xl p-6">
                <h3 className="font-headline text-sm font-bold uppercase tracking-[0.1em] text-slate-500 mb-6">Character Geo-Timeline</h3>
                <div className="relative pl-6 space-y-8" style={{ borderLeft: '2px solid rgba(70,69,84,0.1)' }}>
                  {geoTimeline.map((pt, i) => (
                    <div key={i} className={`relative ${pt.dimmed ? 'opacity-50' : ''}`}>
                      <div
                        className="absolute -left-[20px] top-1 w-4 h-4 rounded-full border-4 border-[#131b2e] z-10"
                        style={{ background: pt.isConflict ? '#ffb4ab' : pt.dimmed ? '#475569' : '#c0c1ff' }}
                      />
                      <div className={pt.isConflict ? 'p-4 rounded-xl bg-[#ffb4ab]/5 border border-[#ffb4ab]/10' : ''}>
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${pt.isConflict ? 'text-[#ffb4ab]' : 'text-[#c0c1ff]'}`}>{pt.time}</span>
                        <h5 className="text-sm font-semibold mt-1 text-[#dae2fd]">{pt.name}</h5>
                        <p className={`text-xs mt-1 font-body italic ${pt.isConflict ? 'text-[#ffb4ab]/80' : 'text-slate-500'}`}>{pt.isConflict ? pt.quote : `Manuscript Ref: ${pt.quote}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 rounded-xl border border-[#464554]/20 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#c0c1ff] hover:border-[#c0c1ff]/30 transition-all duration-300">
                  Expand Full Map
                </button>
              </section>

              {/* AI Narrative Patch */}
              <section className="rounded-2xl p-6 border border-[#c0c1ff]/5" style={{ background: 'linear-gradient(to bottom right, #222a3d, #131b2e)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#ffb783]">lightbulb</span>
                  <h3 className="font-headline text-sm font-bold uppercase tracking-[0.1em] text-[#dae2fd]">AI Narrative Patch</h3>
                </div>
                <p className="text-xs text-[#c7c4d7] leading-relaxed mb-4 font-body italic">
                  "To resolve the Elias Vance paradox, consider introducing a 'Wayfarer's Gate' in the Citadel scene or delaying the Iron Docks arrival by 3 hours."
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold uppercase rounded-lg hover:bg-[#c0c1ff]/20 transition-all">Apply Fix</button>
                  <button className="px-3 py-2 bg-[#2d3449] text-slate-400 rounded-lg hover:text-[#dae2fd] transition-all">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-12 flex gap-12 border-t border-[#464554]/10 pt-8">
            {[
              { label: 'Scanning Depth', value: 'Deep Narrative Analysis (V4.2)', color: '' },
              { label: 'Last Analysis', value: '4 minutes ago', color: '' },
              { label: 'World Laws', value: 'Hard Magic (Enforced)', color: 'text-[#c0c1ff]' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-500 tracking-[0.1em] font-bold">{stat.label}</span>
                <span className={`text-sm font-medium mt-1 ${stat.color || 'text-[#dae2fd]'}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}
