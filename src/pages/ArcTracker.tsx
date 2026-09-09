import { motion } from 'framer-motion';

const arcs = [
  { char: 'Silas Thorne', role: 'Protagonist', color: '#c0c1ff', points: [20, 35, 45, 60, 55, 75, 80, 95] },
  { char: 'Elara Vance', role: 'Confidant', color: '#ffb783', points: [10, 15, 30, 40, 45, 50, 65, 70] },
];

const chapters = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'Ch 5', 'Ch 6', 'Ch 7', 'Ch 8'];

function toPolyline(points: number[], width: number, height: number) {
  return points.map((p, i) => `${(i / (points.length - 1)) * width},${height - (p / 100) * height}`).join(' ');
}

const arcHealth = [
  { name: 'Character Growth', score: 82, color: '#c0c1ff' },
  { name: 'Tension Curve', score: 71, color: '#ffb783' },
  { name: 'Pacing', score: 90, color: '#4ade80' },
  { name: 'Emotional Depth', score: 65, color: '#cebdff' },
];

export default function ArcTracker() {
  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      <div className="page-content">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <span className="text-[#c0c1ff] text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Narrative Analysis Engine</span>
            <h1 className="text-5xl font-body text-[#dae2fd] mb-4">Arc Progression</h1>
          </div>

          {/* Arc Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#131b2e] rounded-[2rem] p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-[#dae2fd]">Character Arc Visualization</h3>
              <div className="flex items-center gap-6">
                {arcs.map(arc => (
                  <div key={arc.char} className="flex items-center gap-2">
                    <div className="w-8 h-0.5" style={{ background: arc.color }} />
                    <span className="text-[11px] text-slate-400 font-bold">{arc.char}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative">
              <svg viewBox="0 0 800 200" className="w-full" style={{ height: 200 }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(p => (
                  <line key={p} x1="0" y1={200 - p * 2} x2="800" y2={200 - p * 2}
                    stroke="#464554" strokeOpacity="0.15" strokeWidth="1" />
                ))}
                {/* Arc lines */}
                {arcs.map(arc => (
                  <g key={arc.char}>
                    <polyline
                      points={toPolyline(arc.points, 800, 200)}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* Area fill */}
                    <polygon
                      points={`0,200 ${toPolyline(arc.points, 800, 200)} 800,200`}
                      fill={arc.color}
                      fillOpacity="0.06"
                    />
                    {/* Data points */}
                    {arc.points.map((p, i) => (
                      <circle
                        key={i}
                        cx={(i / (arc.points.length - 1)) * 800}
                        cy={200 - (p / 100) * 200}
                        r="4"
                        fill={arc.color}
                        fillOpacity="0.8"
                      />
                    ))}
                  </g>
                ))}
              </svg>
              {/* X-axis labels */}
              <div className="flex justify-between mt-2 px-1">
                {chapters.map(ch => (
                  <span key={ch} className="text-[10px] text-slate-500 font-bold">{ch}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Arc Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#131b2e] rounded-[2rem] p-8"
            >
              <h3 className="font-headline font-bold text-[#dae2fd] mb-6">Arc Health Score</h3>
              <div className="space-y-5">
                {arcHealth.map(metric => (
                  <div key={metric.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-[#c7c4d7]">{metric.name}</span>
                      <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#222a3d] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ background: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#131b2e] rounded-[2rem] p-8"
            >
              <h3 className="font-headline font-bold text-[#dae2fd] mb-6">AI Arc Suggestions</h3>
              <div className="space-y-4">
                {[
                  { icon: 'trending_up', text: 'Silas\'s emotional arc peaks too early — consider adding a setback at Chapter 6.', color: 'text-[#c0c1ff]' },
                  { icon: 'warning', text: 'Tension dips significantly in Chapter 5. This may cause reader engagement drop.', color: 'text-[#ffb783]' },
                  { icon: 'check_circle', text: 'Elara\'s growth trajectory is well-paced and consistent.', color: 'text-[#4ade80]' },
                ].map((sug, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-[#171f33] rounded-xl">
                    <span className={`material-symbols-outlined text-sm flex-shrink-0 mt-0.5 ${sug.color}`}>{sug.icon}</span>
                    <p className="text-sm text-[#c7c4d7] font-body">{sug.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
