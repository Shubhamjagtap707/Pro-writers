import { motion } from 'framer-motion';

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const streakBars = [8, 12, 10, 16, 0, 0, 0]; // heights in units

const versionHistory = [
  { when: 'Today, 11:24 PM', label: 'LATEST', title: 'Revision: The Library Encounter', delta: '+452 words · -12 deletions', opacity: '' },
  { when: 'Yesterday, 09:15 AM', label: '', title: 'Chapter VII: Initial Draft', delta: '+3,200 words', opacity: 'opacity-70 hover:opacity-100' },
  { when: 'Feb 12, 10:45 PM', label: '', title: 'Outline Refinement', delta: '-84 words · Structural changes', opacity: 'opacity-50 hover:opacity-100' },
  { when: 'Feb 10, 08:20 PM', label: '', title: 'Concept Brainstorming', delta: '+1,102 words', opacity: 'opacity-40 hover:opacity-100' },
];

const velocityStats = [
  { label: 'Words/Hour', value: '842' },
  { label: 'Active Time', value: '4h 12m' },
  { label: 'Focus Score', value: '92%', green: true },
  { label: 'Draft Completion', value: '18.4%' },
];

const weeklyBars = [40, 70, 20, 95, 55, 80, 15];

export default function Progress() {
  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Content */}
      <div className="page-content">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="mb-12">
            <h2 className="font-body text-5xl text-on-surface mb-2">Editorial Pulse</h2>
            <p className="font-label text-slate-400 tracking-wide uppercase text-xs">Tracking "The Silver Hourglass" — Book II</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs font-label text-slate-500 uppercase tracking-widest mb-1">Daily Target</p>
                    <p className="font-body text-4xl font-light text-on-surface">1,248 / 2,000</p>
                  </div>
                  <div className="bg-[#4ade80]/10 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold">62%</div>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '62%' }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    style={{ background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.4)' }}
                  />
                </div>
                <p className="text-sm font-label text-slate-400 italic">"Keep the momentum. The ink flows best at midnight."</p>
              </div>
            </motion.div>

            {/* Streak Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <p className="font-body text-3xl text-on-surface">14 Day Streak</p>
              </div>
              <div className="flex justify-between items-end gap-1">
                {weekDays.map((d, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-2 rounded-full mb-1 transition-all"
                      style={{ height: streakBars[i] ? `${streakBars[i] * 4}px` : '8px', background: streakBars[i] ? '#4ade80' : 'var(--color-surface-container-high)' }}
                    />
                    <span className={`text-[10px] ${streakBars[i] ? 'text-[#4ade80]' : 'text-slate-500'}`}>{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weekly Rhythm Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <p className="text-xs font-label text-slate-500 uppercase tracking-widest">Weekly Rhythm</p>
                <span className="material-symbols-outlined text-slate-500 text-sm">info</span>
              </div>
              <div className="h-32 flex items-end justify-between px-2 gap-2">
                {weeklyBars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                    style={{ background: `rgba(128,131,255,${0.2 + (h / 100) * 0.8})` }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[10px] text-slate-500 font-label">
                <span>WK 01</span>
                <span>AVERAGE: 3.2K</span>
                <span>WK 04</span>
              </div>
            </motion.div>

            {/* Creative Velocity + Image Card */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-surface-container rounded-xl p-10 border border-outline-variant/10"
              >
                <h3 className="font-body text-3xl mb-8 text-on-surface">Creative Velocity</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {velocityStats.map(stat => (
                    <div key={stat.label} className="space-y-1">
                      <p className="font-label text-xs text-slate-500 uppercase tracking-tighter">{stat.label}</p>
                      <p className={`font-body text-2xl ${stat.green ? 'text-[#4ade80]' : 'text-on-surface'}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="relative rounded-xl overflow-hidden group" style={{ height: 256 }}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7L69-0hKqNOoaoaO4B8bWNqp_72aRo5-ubuMoMsQSgNHIQP1tHMX5sZF4ggWQUAY02c1pKCgy2CdGy-zQQlwmvEOXaK_7WTEtcLNyu4f3C8s5iOALLU7DLobadopBej0ncAhdx_TAo7zCXDZ4VSCUKjK00DNswrozFVwPTbXsZW1O2IrHEpHu2fVXMF8AMEzMErId_5bZlzQJYHKFTUQrKginIGYf-l7K7xesa3Ii4UPMT1oaVVp5EzuVQMHx4Sxl68rDqXfE8hn"
                  alt="Writing setup"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-label text-xs text-primary mb-2">CHAPTER VII IN PROGRESS</p>
                  <h4 className="font-body text-3xl text-white italic">"The echo of silence in the library was louder than any shout."</h4>
                </div>
              </motion.div>
            </div>

            {/* Version History */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}
                className="bg-surface-container-low p-8 rounded-xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-label font-bold text-sm tracking-widest uppercase text-on-surface">Version History</h3>
                  <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-primary transition-colors">history</span>
                </div>
                <div className="space-y-6">
                  {versionHistory.map((v, i) => (
                    <div key={i} className={`group cursor-pointer ${v.opacity} transition-opacity`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label text-xs text-slate-500">{v.when}</span>
                        {v.label && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{v.label}</span>}
                      </div>
                      <p className="font-body text-lg group-hover:text-primary transition-colors text-on-surface">{v.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{v.delta}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 rounded-lg border border-outline-variant/30 text-xs font-label uppercase tracking-widest text-slate-400 hover:bg-surface-container-high transition-all">
                  View All Archive
                </button>
              </motion.div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">compare</span>
                  <span>Compare Drafts</span>
                </div>
                <div className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 cursor-pointer hover:bg-surface-container-highest transition-colors">
                  <span className="material-symbols-outlined text-sm">file_download</span>
                  <span>Export Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Focus Mode Banner */}
          <div className="mt-20 p-1 rounded-2xl" style={{ background: 'linear-gradient(to right, rgba(192,193,255,0.2), transparent, rgba(255,183,131,0.2))' }}>
            <div className="bg-surface-container-lowest rounded-[calc(1rem-2px)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-primary text-3xl">shutter_speed</span>
                </div>
                <div>
                  <h4 className="font-body text-2xl text-on-surface">Ready for a sprint?</h4>
                  <p className="text-slate-500 text-sm font-label">The AI editor has identified your most productive hours start now.</p>
                </div>
              </div>
              <button className="bg-surface-container-highest text-primary font-bold px-8 py-4 rounded-xl backdrop-blur-xl border border-primary/10 hover:border-primary/40 transition-all flex items-center gap-3">
                <span>Enter Zen Mode</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
