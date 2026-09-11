import { useState } from 'react';

export default function RelationshipMap() {
  const [, setActiveNode] = useState('silas');

  return (
    <div className="page-shell">
      {/* Dot grid background */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(192,193,255,0.05) 1px, transparent 0)', backgroundSize: '48px 48px' }} />



      {/* Map canvas + side panel */}
      <div className="flex-grow relative overflow-hidden flex z-10">
        {/* SVG Node Graph */}
        <div className="flex-grow relative p-12 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Silas → Silver Man (antagonist) */}
            <path className="opacity-40" d="M 400 300 Q 550 250 700 350" fill="none" stroke="url(#grad-antag)" strokeDasharray="4 4" strokeWidth="2" />
            {/* Silas → Elara (ally) */}
            <path className="opacity-30" d="M 400 300 Q 300 450 250 550" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
            {/* Silver Man → Elara (conflict) */}
            <path className="opacity-20" d="M 700 350 Q 500 500 250 550" fill="none" stroke="var(--color-tertiary)" strokeWidth="2" />
            <defs>
              <linearGradient id="grad-antag" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-error)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Silas Thorne — Protagonist */}
          <div className="absolute z-10 group cursor-pointer" style={{ top: 260, left: 340 }} onClick={() => setActiveNode('silas')}>
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-container"
              style={{ boxShadow: '0 0 30px rgba(192,193,255,0.3)' }}>
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface">
                <img alt="Silas" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANz2fkuw4mTpK9roVioow2y2pGi416_7qpY7kt9Zv9x9yjDomOTy0lJlI151q4CiYVFhGarrKjYFpGH4HmW9ryEfvo0lPJk3k9IlT14Ss_adDgQxZuEx-PCoGZ3unKE8L-SRkz3sLrMSvLXYKnYd5MjMiBIT4HwGAslurVNU7NLPaxE-Z8d4rCdxR27Ay7krTRHCnCQq1Wex0KMyEVNADEueVa4iDtF9HkZLBIK9jxVxVpQx4HnP2D8TrZpLwvgpCkvhxB0zavPZiW"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="block text-primary font-bold tracking-tight">Silas Thorne</span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-400">Protagonist</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-surface shadow-lg" />
          </div>

          {/* The Silver Man — Antagonist */}
          <div className="absolute z-10 group cursor-pointer" style={{ top: 310, left: 680 }} onClick={() => setActiveNode('silver')}>
            <div className="w-24 h-24 rounded-full p-1 bg-surface-container-highest group-hover:scale-105 transition-transform"
              style={{ boxShadow: '0 0 20px rgba(192,193,255,0.15)' }}>
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface-container-low">
                <img alt="Silver Man" className="w-full h-full object-cover grayscale opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuARzcNHXq08GeRm1NTZC6agIrsQbYqSalrRh2xAAlPttqbxGgNuoPpHYcPCGa97dO9ClMgNwmSMGjhOAJoOCVi0RDpni-5Klv4SqfK2BvRJoPfxfzwToVbMMaJFYXoQ4CIXOobhKgYmS_lRgDG5v46zDzu18xgWmnGzBZPzgTYVrg52keAfIpeR0rQfNScjoL17RazKb5dyCVlGpGTRcJgmfpXH_5aAO5Y-d5FdKFWdTRJ4DIuG3j0owFhlPHFMfyfwEjYahfirrIlu"
                />
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="block text-error font-semibold text-sm">The Silver Man</span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-500">Antagonist</span>
            </div>
          </div>

          {/* Elara Vance — Ally */}
          <div className="absolute z-10 group cursor-pointer" style={{ top: 520, left: 180 }} onClick={() => setActiveNode('elara')}>
            <div className="w-20 h-20 rounded-full p-1 bg-surface-container-high group-hover:scale-105 transition-transform"
              style={{ boxShadow: '0 0 20px rgba(192,193,255,0.15)' }}>
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-surface">
                <img alt="Elara Vance" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT0bWJeTuAe9lR47XM5TwntUFSYn7dSkWUc2lyg7CmEIdpuEoGuXSZDDU7cQK5g4c4bB_tqgS3qH5dGHpK-tyclAz-ZDbJH3nTzE_JcmHwSIlWgHPkVDuRnPNfJeyaX3IcRZcbn_Xht_OfzMz7iBFRU06XQZR0WtYhI0LDMh9zhfnFw8gtNhdc_Zw6JZCABVnBaMJSN5gsvo776CqVntjmkQjofT3jTIFHYVsoY06Il57YytY3rbXZar-PjGSfRkkk8wc2tsdO65cd"
                />
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="block text-secondary font-semibold text-sm">Elara Vance</span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-500">The Confidant</span>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-12 glass-panel p-4 rounded-xl flex gap-6 items-center border border-white/5">
            {[
              { color: 'var(--color-primary)', solid: true, label: 'Ally' },
              { color: 'var(--color-error)', solid: false, label: 'Conflict' },
              { color: 'var(--color-tertiary)', solid: true, label: 'Family' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-6 h-0.5 ${!item.solid ? 'border-t border-dashed' : ''}`}
                  style={{ background: item.solid ? item.color : 'transparent', borderColor: item.color }} />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Side Panel */}
        <aside className="w-96 h-full glass-panel z-20 flex flex-col p-8 border-l border-white/5 flex-shrink-0">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">Active Focus</span>
                <h2 className="font-body text-4xl text-on-surface leading-tight">Silas Thorne</h2>
              </div>
              <button className="p-2 rounded-full bg-surface-container-high text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">edit_note</span>
              </button>
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {['Disgraced Detective', 'Obsessive', '38 Years Old'].map(tag => (
                <span key={tag} className="bg-[tag === 'Disgraced Detective' ? 'var(--color-secondary-container)' : 'var(--color-surface-container-highest)'] text-[10px] px-3 py-1 rounded-full uppercase font-bold text-slate-300"
                  style={{ background: tag === 'Disgraced Detective' ? 'var(--color-secondary-container)' : 'var(--color-surface-container-highest)', color: tag === 'Disgraced Detective' ? 'var(--color-on-secondary-container)' : undefined }}
                >{tag}</span>
              ))}
            </div>
            <p className="font-body text-lg text-slate-300 leading-relaxed italic">
              "The ink never lies, Elara. It merely waits for someone who knows how to read the stains."
            </p>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 no-scrollbar">
            {/* Connections */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Core Connections</h3>
              <div className="space-y-4">
                {[
                  { icon: 'swords', name: 'The Silver Man', rel: 'Antagonistic • Linked by the 1892 Murders', iconBg: 'bg-error-container/20', iconColor: 'text-error' },
                  { icon: 'favorite', name: 'Elara Vance', rel: 'Deep Ally • Emotional Anchor', iconBg: 'bg-primary-container/20', iconColor: 'text-primary', filled: true },
                ].map(conn => (
                  <div key={conn.name} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg ${conn.iconBg} flex items-center justify-center ${conn.iconColor}`}>
                      <span className="material-symbols-outlined" style={conn.filled ? { fontVariationSettings: "'FILL' 1" } : {}}>{conn.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{conn.name}</p>
                      <p className="text-[10px] text-slate-500">{conn.rel}</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400">arrow_forward_ios</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Arc */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Narrative Arc</h3>
              <div className="border-l-2 border-outline-variant/20 ml-2 pl-6 space-y-6 py-2">
                {[
                  { range: 'CHAPTER 1-4', text: 'Introduced as a recluse in The Nocturnal Atelier. Discovery of the first silver letter.', active: true },
                  { range: 'CHAPTER 5-12', text: 'The investigation deepens. First encounter with the Silver Man in the fog.', active: false },
                ].map(arc => (
                  <div key={arc.range} className="relative">
                    <div className={`absolute -left-[31px] top-1 w-2 h-2 rounded-full ring-4 ring-surface ${arc.active ? 'bg-primary' : 'bg-slate-600'}`} />
                    <p className={`text-[11px] font-bold mb-1 ${arc.active ? 'text-primary' : 'text-slate-500'}`}>{arc.range}</p>
                    <p className={`text-sm ${arc.active ? 'text-slate-300' : 'text-slate-400'}`}>{arc.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-tertiary/10 text-tertiary hover:bg-tertiary/20 transition-colors border border-tertiary/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">auto_fix_high</span>
                <span className="text-xs font-bold uppercase tracking-wider">AI Relationship Insight</span>
              </div>
              <span className="material-symbols-outlined text-sm">colors_spark</span>
            </button>
          </div>
        </aside>
      </div>


    </div>
  );
}
