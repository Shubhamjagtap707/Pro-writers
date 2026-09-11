import { motion } from 'framer-motion';

const characters = ['Silas', 'Elara', 'Silver Man', 'Clara', 'The Archivist'];
const chapters = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'Ch 5', 'Ch 6', 'Ch 7', 'Ch 8'];

// Presence matrix: 1 = present, 0 = absent, 0.5 = mentioned
const presence = [
  [1, 1, 1, 1, 0, 1, 1, 1],   // Silas
  [0, 1, 0, 1, 1, 1, 0, 1],   // Elara
  [0, 0, 0.5, 0, 1, 0, 1, 1], // Silver Man
  [1, 0, 1, 0, 0, 1, 0, 0],   // Clara
  [0, 0, 0, 1, 0, 0, 1, 0],   // The Archivist
];

function getColor(val: number) {
  if (val === 1) return 'var(--color-primary)';
  if (val === 0.5) return 'var(--color-primary-container)';
  return 'var(--color-surface-container-low)';
}

export default function CharacterTimeline() {
  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      <div className="page-content">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Narrative Presence Matrix</span>
            <h1 className="text-5xl font-body text-on-surface mb-4">Character Timeline</h1>
            <p className="text-on-surface-variant font-body italic text-lg max-w-xl">Track exactly which characters appear in each chapter of your manuscript.</p>
          </div>

          {/* Presence Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low rounded-[2rem] p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-on-surface">Presence Matrix</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-primary" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-primary-container" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mentioned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-surface-container-low border border-outline-variant/30" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Absent</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] font-bold uppercase tracking-widest text-slate-500 pb-4 w-40">Character</th>
                    {chapters.map(ch => (
                      <th key={ch} className="text-[11px] font-bold uppercase tracking-widest text-slate-500 pb-4 text-center px-2">{ch}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-3">
                  {characters.map((char, ci) => (
                    <tr key={char} className="group">
                      <td className="py-3 pr-6">
                        <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{char}</span>
                      </td>
                      {presence[ci].map((val, chi) => (
                        <td key={chi} className="py-3 px-2 text-center">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-8 h-8 rounded-lg mx-auto cursor-pointer transition-all"
                            style={{
                              background: getColor(val),
                              boxShadow: val === 1 ? '0 0 12px rgba(192,193,255,0.3)' : 'none'
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Most Active', value: 'Silas Thorne', sub: '7 / 8 Chapters', color: 'text-primary', icon: 'person' },
              { label: 'Least Active', value: 'The Archivist', sub: '2 / 8 Chapters', color: 'text-slate-400', icon: 'person_off' },
              { label: 'Scene Without POV', value: 'Chapter 5', sub: 'Silver Man only', color: 'text-tertiary', icon: 'warning' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-surface-container-low rounded-[2rem] p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                  <p className={`font-body text-xl ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
