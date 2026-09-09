import { useState } from 'react';
import { motion } from 'framer-motion';



export default function Critique() {
  const [question, setQuestion] = useState('');

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Content */}
      <div className="page-content space-y-12 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <p className="text-[#c0c1ff] font-headline font-bold tracking-[0.2em] uppercase text-xs">AI Editor Suite</p>
            <h1 className="text-5xl font-body italic text-[#dae2fd]">The Shadow of the Spire</h1>
            <p className="text-[#c7c4d7] font-headline">Draft 4 • 84,210 words • Revised 2 hours ago</p>
          </div>
          <div className="bg-[#131b2e] px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ffb783] shadow-[0_0_8px_rgba(255,183,131,0.6)]" />
            <span className="text-sm font-headline font-semibold text-[#dae2fd]">AI Assistant: Active</span>
          </div>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Manuscript Editor Panel */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#131b2e] rounded-2xl p-10 relative overflow-hidden group"
              style={{ minHeight: 600 }}
            >
              <div className="absolute top-6 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {['content_copy','history'].map(ic => (
                  <button key={ic} className="p-2 rounded-lg bg-[#222a3d] text-[#c0c1ff] hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all">
                    <span className="material-symbols-outlined text-sm">{ic}</span>
                  </button>
                ))}
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="font-body text-3xl text-[#dae2fd] border-b border-[#464554]/10 pb-4">Chapter 14: The Silver Thread</h2>
                <div className="font-body text-xl leading-relaxed text-[#c7c4d7]/90 space-y-6">
                  <p>
                    Elias watched as the fog rolled over the rooftops of Old Valoria. It was a thick, cloying mist
                    that smelled of ozone and forgotten magic. He gripped the hilt of his sword, his knuckles turning white.{' '}
                    <span className="bg-[#c0c1ff]/20 border-b-2 border-[#c0c1ff] cursor-pointer hover:bg-[#c0c1ff]/30 transition-colors" title="AI Insight: Weak Verb Choice">
                      He walked
                    </span>{' '}
                    across the cobblestones, the sound of his boots echoing in the empty street.
                  </p>
                  <p>
                    "I told you he wouldn't come," Sarah whispered from the shadows. Her voice was flat, devoid of the emotion that usually colored her speech.{' '}
                    <span className="bg-[#93000a]/30 border-b-2 border-[#ffb4ab] cursor-pointer" title="AI Insight: Dialogue Inconsistency">
                      "But perhaps we should wait another hour just in case he decides to surprise us with his presence."
                    </span>
                  </p>
                  <p>
                    The tower loomed ahead, a jagged needle of black stone piercing the grey sky. There was a sense of dread pooling in Elias's stomach.
                    He knew the prophecy was clear, yet he couldn't help but feel that someone had moved the pieces of the board when they weren't looking.{' '}
                    <span className="bg-[#ffb783]/20 border-b-2 border-[#ffb783] cursor-pointer" title="AI Insight: Potential Plot Hole">
                      The door was locked from the inside, despite no one having lived there for a century.
                    </span>
                  </p>
                  <p className="opacity-50">He reached for the heavy iron knocker, his hand trembling slightly...</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Readability */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              className="bg-[#131b2e] p-6 rounded-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-[#dae2fd]">Readability</h3>
                <span className="text-[#c0c1ff] text-xl font-bold">84%</span>
              </div>
              <div className="space-y-3">
                <div className="bg-[#171f33] p-4 rounded-xl flex items-start gap-3 border-l-4 border-[#c0c1ff]">
                  <span className="material-symbols-outlined text-[#c0c1ff] mt-0.5">bolt</span>
                  <div>
                    <p className="text-sm font-medium text-[#dae2fd]">Passive Voice Detected</p>
                    <p className="text-xs text-[#c7c4d7] mt-1">"The prophecy was clear..." Consider active phrasing.</p>
                  </div>
                </div>
                <div className="bg-[#171f33] p-4 rounded-xl flex items-start gap-3 border-l-4 border-[#cebdff]">
                  <span className="material-symbols-outlined text-[#cebdff] mt-0.5">subject</span>
                  <div>
                    <p className="text-sm font-medium text-[#dae2fd]">Sentence Complexity</p>
                    <p className="text-xs text-[#c7c4d7] mt-1">2 paragraphs contain long, winding clauses.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dialogue Consistency */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
              className="bg-[#131b2e] p-6 rounded-2xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#cebdff]/5 blur-3xl rounded-full" />
              <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-[#dae2fd]">Dialogue Check</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#222a3d] flex items-center justify-center text-xs font-bold text-[#cebdff]">S</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-[#dae2fd]">Sarah</span>
                      <span className="text-[10px] text-[#ffb4ab] font-bold">Deviation!</span>
                    </div>
                    <div className="w-full h-1 bg-[#222a3d] rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-[#cebdff] rounded-full" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#c7c4d7] italic border-l border-[#464554] pl-3 py-1">
                  "Sarah's tone shifted from 'Short/Pragmatic' to 'Formal/Ornate' in paragraph 2."
                </p>
                <button className="w-full py-2 text-xs font-bold text-[#c0c1ff] bg-[#c0c1ff]/5 rounded-lg border border-[#c0c1ff]/20 hover:bg-[#c0c1ff]/10 transition-colors">
                  Normalize Voice
                </button>
              </div>
            </motion.div>

            {/* Critique Assistant */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
              className="bg-[#222a3d] p-6 rounded-2xl space-y-6 shadow-2xl shadow-black/40 border border-white/5"
            >
              <div className="flex items-center gap-2 text-[#ffb783]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="font-headline font-bold text-sm tracking-widest uppercase">Critique Assistant</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#0b1326] rounded-xl border border-[#464554]/10">
                  <div className="flex items-center gap-2 mb-2 text-[#ffb783]">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span className="text-xs font-bold uppercase tracking-tighter">Plot Hole Alert</span>
                  </div>
                  <p className="text-sm text-[#c7c4d7] leading-relaxed">
                    You mentioned in <span className="text-[#dae2fd]">Chapter 2</span> that the tower was accessible by magic only, but Elias is using a physical key.
                  </p>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full bg-[#131b2e] border-none rounded-xl text-sm p-4 placeholder-slate-600 focus:ring-1 focus:ring-[#c0c1ff] h-24 resize-none outline-none text-[#dae2fd]"
                    placeholder="Ask about this scene..."
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                  />
                  <button className="absolute bottom-3 right-3 p-2 bg-[#c0c1ff] text-[#1000a9] rounded-lg">
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12">
          <div className="bg-[#131b2e] p-6 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pace Score</span>
            <div className="flex items-end gap-2 mt-4">
              <span className="text-4xl font-headline font-bold text-[#c0c1ff]">7.2</span>
              <span className="text-xs text-[#c7c4d7] pb-1">/10</span>
            </div>
            <div className="mt-4 flex gap-1">
              {[1,1,1,0,0].map((on, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${on ? 'bg-[#c0c1ff]' : 'bg-[#c0c1ff]/20'}`} />
              ))}
            </div>
          </div>

          <div className="bg-[#131b2e] p-6 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sentiment</span>
            <div className="flex items-center gap-2 mt-4">
              <span className="material-symbols-outlined text-[#ffb783]">mood</span>
              <span className="text-2xl font-headline font-bold text-[#dae2fd]">Tense / Dark</span>
            </div>
            <p className="text-[10px] text-[#c7c4d7] mt-4">Matches established genre tone.</p>
          </div>

          <div className="bg-[#131b2e] p-6 rounded-2xl col-span-1 md:col-span-2 relative group overflow-hidden">
            <div className="relative z-10 flex justify-between items-center h-full">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Style Transfer</span>
                <h4 className="text-xl font-headline font-semibold text-[#dae2fd]">Analyze vs. "Classic Noir"</h4>
                <p className="text-xs text-[#c7c4d7]">Compare syntax patterns to 1940s literary styles.</p>
              </div>
              <button className="bg-[#222a3d] px-4 py-2 rounded-xl text-[#c0c1ff] font-bold text-sm hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all flex-shrink-0">
                Run Analysis
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#c0c1ff]/5 rounded-full blur-2xl group-hover:bg-[#c0c1ff]/10 transition-colors" />
          </div>
        </div>
      </div>


    </div>
  );
}
