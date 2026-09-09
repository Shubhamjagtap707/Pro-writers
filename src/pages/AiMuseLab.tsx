import { useState } from 'react';
import { motion } from 'framer-motion';

const twists = [
  '"The secret isn\'t what they found in the cellar, but why it was breathing."',
  '"The letter was written in a hand she recognized—her own, dated ten years from now."',
  '"The city had been abandoned for decades. So why were the lights still on in the tower?"',
];

const scratchNotes = [
  { text: '"A clock that only ticks when no one is looking at it."', meta: 'Saved 2m ago — Idea Bin', borderColor: 'border-[#ffb783]' },
  { text: '"Silas doesn\'t fear death, he fears the silence after the final breath."', meta: 'Saved 1h ago — Dialogue Suggestion', borderColor: 'border-[#c0c1ff]' },
];

export default function AiMuseLab() {
  const [twistIndex, setTwistIndex] = useState(0);
  const [dialogue, setDialogue] = useState('');
  const [suggestion] = useState('"I think you should go," he said, looking at the floor.');

  const rollTwist = () => setTwistIndex(prev => (prev + 1) % twists.length);

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />



      {/* Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col p-12 pt-4">
        <div className="grid grid-cols-12 gap-8 h-full">

          {/* Left: AI Interaction Modules */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-4 no-scrollbar">
            {/* Generate Plot Twist */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#131b2e] p-8 rounded-[2rem] group transition-all duration-300 hover:bg-[#171f33] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[#c0c1ff]" style={{ fontSize: 80 }}>cyclone</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#4f319c]/30 text-[#cebdff] p-2 rounded-lg material-symbols-outlined">shuffle</span>
                  <h3 className="text-xl font-headline font-semibold text-white">Generate Plot Twist</h3>
                </div>
                <motion.p
                  key={twistIndex}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[#c7c4d7] font-body text-lg italic mb-6 leading-relaxed"
                >
                  {twists[twistIndex]}
                </motion.p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Suspense', 'Betrayal', 'Gothic'].map(tag => (
                    <span key={tag} className="bg-[#222a3d] px-4 py-1.5 rounded-full text-xs font-label text-slate-400">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={rollTwist}
                    className="bg-[#c0c1ff]/10 hover:bg-[#c0c1ff]/20 text-[#c0c1ff] px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">auto_fix</span>
                    Roll the Dice
                  </button>
                  <button className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">history</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dialogue Polisher */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#171f33] flex-1 min-h-[400px] rounded-[2rem] flex flex-col overflow-hidden relative border border-[#c0c1ff]/5"
            >
              <div className="p-6 border-b border-[#464554]/10 flex justify-between items-center bg-[#222a3d]/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#c0c1ff]">forum</span>
                  <h3 className="font-headline font-semibold text-white">Dialogue Polisher</h3>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mode: Professional</span>
              </div>
              <div className="flex-1 p-8 space-y-6 overflow-y-auto no-scrollbar">
                {/* Original */}
                <div className="flex flex-col items-start gap-2 max-w-[85%]">
                  <div className="bg-[#131b2e] p-4 rounded-2xl rounded-tl-none border border-[#464554]/10">
                    <p className="text-sm font-body leading-relaxed text-[#c7c4d7]">"{suggestion}"</p>
                  </div>
                  <span className="text-[10px] text-slate-500 px-1">Current Draft</span>
                </div>
                {/* Suggestion */}
                <div className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                  <div className="p-5 rounded-2xl rounded-tr-none relative group"
                    style={{ background: 'linear-gradient(to bottom right, rgba(79,49,156,0.4), rgba(128,131,255,0.2))' }}>
                    <p className="text-md font-body italic leading-relaxed text-[#e8ddff]">
                      "The words hung between them like a physical weight. 'The door is right there, Silas,' he whispered, his eyes never rising from the fractured floorboards."
                    </p>
                    <button className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2d3449] p-2 rounded-full text-[#c0c1ff]">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-[#cebdff] font-bold px-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span> Suggested Polish
                  </span>
                </div>
              </div>
              <div className="p-6 bg-[#2d3449]/20">
                <div className="relative">
                  <textarea
                    className="w-full bg-[#131b2e] border-none rounded-2xl p-4 text-sm font-body text-[#dae2fd] min-h-[80px] resize-none outline-none focus:ring-1 focus:ring-[#c0c1ff]/40 transition-all placeholder-slate-600"
                    placeholder="Paste dialogue here to polish..."
                    value={dialogue}
                    onChange={e => setDialogue(e.target.value)}
                  />
                  <button className="absolute bottom-4 right-4 bg-[#c0c1ff] text-[#0d0096] p-2 rounded-xl hover:scale-105 transition-transform shadow-lg">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Scratchpad + Scene Starter */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-full">
            {/* Scene Starter */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              className="bg-[#131b2e] rounded-[2rem] p-8 flex flex-col gap-4 border border-[#464554]/10 hover:border-[#c0c1ff]/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ffb783]">movie_edit</span>
                <h3 className="font-headline font-semibold text-white">Scene Starter</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { icon: 'location_on', label: 'Vivid Setting', hoverColor: 'hover:bg-[#c0c1ff]/10 hover:border-[#c0c1ff]/20', iconHover: 'group-hover:text-[#c0c1ff]' },
                  { icon: 'face_6', label: 'Conflict Entry', hoverColor: 'hover:bg-[#ffb783]/10 hover:border-[#ffb783]/20', iconHover: 'group-hover:text-[#ffb783]' },
                ].map(item => (
                  <button key={item.label} className={`aspect-square bg-[#222a3d] rounded-3xl flex flex-col items-center justify-center gap-2 group transition-all border border-transparent ${item.hoverColor}`}>
                    <span className={`material-symbols-outlined text-3xl text-slate-400 transition-colors ${item.iconHover}`}>{item.icon}</span>
                    <span className={`text-xs font-bold text-slate-500 tracking-tight transition-colors ${item.iconHover}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Scratchpad */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#060e20] flex-1 rounded-[2rem] p-8 flex flex-col relative group overflow-hidden border border-[#464554]/10 shadow-2xl"
            >
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#c0c1ff]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#c0c1ff]">draw</span>
                  <h3 className="font-headline font-semibold text-white">Scratchpad</h3>
                </div>
                <button className="text-xs font-bold text-[#c0c1ff] hover:underline transition-all">Clear All</button>
              </div>
              <div className="flex-1 space-y-6 relative z-10 overflow-y-auto pr-2 no-scrollbar">
                {scratchNotes.map(note => (
                  <div key={note.meta} className={`p-5 bg-[#171f33] rounded-2xl border-l-4 ${note.borderColor} relative group/item`}>
                    <p className="text-sm font-body text-[#dae2fd] mb-2 italic">{note.text}</p>
                    <span className="text-[10px] text-slate-500 font-label">{note.meta}</span>
                    <button className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-xs text-slate-400 hover:text-[#ffb4ab]">delete</span>
                    </button>
                  </div>
                ))}
                <div className="border-2 border-dashed border-[#464554]/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity cursor-text">
                  <span className="material-symbols-outlined mb-2 text-slate-500">add_circle</span>
                  <p className="text-xs text-slate-400 font-medium">Click to scribble a thought...</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#464554]/10 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">3 active snippets</p>
                <button className="bg-[#c0c1ff]/10 text-[#c0c1ff] p-2 rounded-lg hover:bg-[#c0c1ff]/20 transition-colors">
                  <span className="material-symbols-outlined text-sm">open_in_full</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
