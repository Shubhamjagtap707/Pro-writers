import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';

const filters = ['All Figures', 'Protagonists', 'Antagonists', 'NPCs'];
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=800&q=80';

const stripHtml = (html: string) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const ScrollableTitle = ({ text, className }: { text: string, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [overflowAmount, setOverflowAmount] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const overflow = textRef.current.scrollWidth - containerRef.current.clientWidth;
        setOverflowAmount(overflow > 0 ? overflow : 0);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap relative ${className}`}>
      <motion.h3
        ref={textRef}
        className="inline-block w-max text-3xl font-body font-bold text-on-surface"
        animate={overflowAmount > 0 ? { x: [0, -overflowAmount, 0] } : { x: 0 }}
        transition={overflowAmount > 0 ? { repeat: Infinity, duration: 4 + overflowAmount * 0.02, ease: "linear", repeatDelay: 1 } : {}}
      >
        {text}
      </motion.h3>
      {overflowAmount > 0 && (
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-surface-container to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default function Characters() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Figures');
  const { characters, activeProjectId, projects, createCharacter, deleteCharacter, updateCharacter } = useProjectStore();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;
  const seriesId = activeProject?.series_id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChar, setNewChar] = useState({ 
    name: '', 
    role: 'Protagonist', 
    archetype: '', 
    avatarUrl: '', 
  });

  const projectChars = Object.values(characters).filter(c => 
    c.project_id === activeProjectId || (seriesId && c.series_id === seriesId)
  );
  const filteredChars = projectChars.filter(c => {
    if (activeFilter === 'All Figures') return true;
    if (activeFilter === 'Protagonists') return c.role === 'Protagonist';
    if (activeFilter === 'Antagonists') return c.role === 'Antagonist';
    if (activeFilter === 'NPCs') return !['Protagonist', 'Antagonist'].includes(c.role);
    return true;
  });

  const handleCreate = () => {
    if (!activeProjectId || !newChar.name.trim()) return;
    createCharacter(activeProjectId, {
      name: newChar.name.trim(),
      role: newChar.role,
      archetype: newChar.archetype.trim() || 'Unknown Archetype',
      avatarUrl: newChar.avatarUrl,
      color: newChar.role === 'Protagonist' ? 'text-primary' : newChar.role === 'Antagonist' ? 'text-error' : 'text-tertiary'
    }, seriesId);
    setIsModalOpen(false);
    setNewChar({ name: '', role: 'Protagonist', archetype: '', avatarUrl: '' });
  };

  if (!activeProjectId) {
    return (
      <div className="page-shell flex items-center justify-center">
        <p className="text-slate-500 font-body text-xl">Please select a project first.</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h2 className="text-3xl font-body font-bold text-on-surface mb-6">Envisage Character</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input
                    autoFocus
                    value={newChar.name}
                    onChange={e => setNewChar(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Silas Vane"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Archetype</label>
                  <input
                    value={newChar.archetype}
                    onChange={e => setNewChar(prev => ({ ...prev, archetype: e.target.value }))}
                    placeholder="e.g. The Haunted Inquisitor"
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Role</label>
                  <select
                    value={newChar.role}
                    onChange={e => setNewChar(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option>Protagonist</option>
                    <option>Antagonist</option>
                    <option>Supporting</option>
                    <option>NPCs</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Image URL</label>
                  <input
                    value={newChar.avatarUrl}
                    onChange={e => setNewChar(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                <button
                  onClick={handleCreate}
                  disabled={!newChar.name.trim()}
                  className="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-surface transition-colors"
                >
                  SPAWN ENTITY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="page-content relative z-20">
        {/* Editorial Header */}
        <section className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-body font-bold text-on-surface mb-2">Character Archive</h2>
            <p className="text-on-surface-variant font-label tracking-wide max-w-xl">Deep psychological profiles and interpersonal maps for your active manuscript.</p>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
                  activeFilter === f
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid layout with original dynamic aesthetic bindings */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8">

          {/* New Character Spawn Button (Fixed Position at Top) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsModalOpen(true)}
            className="md:col-span-3 lg:col-span-4 rounded-[2rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-8 hover:border-primary/40 transition-colors cursor-pointer group"
            style={{ minHeight: 280 }}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">person_add</span>
            </div>
            <p className="font-headline text-[11px] uppercase tracking-widest text-slate-500 group-hover:text-on-surface transition-colors">Spawn Character</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              if (!activeProjectId) return;
              const charId = createCharacter(activeProjectId, {
                name: 'Aeron Stormbreaker',
                role: 'Protagonist',
                archetype: 'Reluctant King',
                avatarUrl: 'https://images.unsplash.com/photo-1629853381665-27a9223e7179?q=80&w=800&auto=format&fit=crop',
                color: 'text-primary'
              }, seriesId);
              
              updateCharacter(charId, {
                appearance: 'Tall, broad-shouldered, and rugged — with storm-grey eyes that flash like lightning when angered or inspired. His dark brown hair, streaked faintly with silver after surviving a lightning strike, mirrors the storms that define him. A faint scar along his jaw marks his first true battle. His armor is plain and practical, bearing his personal sigil: a shattered thunderbolt.',
                personality: 'Stoic, introspective, fiercely independent.\nCalm under pressure; storm-like when provoked.\nBelieves power must be earned — leadership is service, not privilege.\nEmpathetic to the oppressed; despises tyranny and deceit.\nDistrusts politics, preferring honesty and action.\nHaunted by guilt over lives lost under his command.\nSpeaks little but observes deeply — his silence inspires fear and loyalty alike.\nCarries quiet melancholy — a heart shaped by loss and love.',
                background: 'Aeron’s beginnings are shrouded in mystery. He was found as an infant near the ruins of an ancient temple during a thunderstorm — crying beneath the open sky. Beside him lay a rusted pendant engraved with a forgotten symbol, a relic no scholar could decipher.\n\nHe grew up among orphans and war camps, surviving by instinct and endurance. No record names his parents; no noble house claims him. Raised by wanderers, soldiers, and mercenaries in the wild lands beyond the eastern borders, Aeron learned early that the world only respects strength and resolve.',
                internalConflict: 'Aeron’s greatest war is within himself.\nHe craves freedom, yet destiny binds him to rule. Every step toward leadership feels like another chain on his soul. Though he never sought a crown, he cannot turn away from those who need him.',
                externalConflict: 'The tension between his desire for freedom and the external pressure to unite the kingdoms, facing rivals like King Aelric Velarys who believe in bloodline over merit, and Commander Selene Ironwing who distrusts his instinctive leadership.',
                weaponsAndSkills: 'Stormbreaker Blade: Forged from meteor-steel and tempered in lightning; hums faintly when danger nears.\nBattle Instincts: Master strategist known for unorthodox tactics — “feels” storms before they break.\nLeadership: Inspires unity among soldiers of rival banners; commands through respect, not fear.\nDiplomacy: Learned through hardship, not heritage — can calm kings and lead commoners alike.\nHorsemanship & Swordsmanship: Exceptional rider and close-combat fighter.',
                themes: 'Love and Loss: Through Elara and Lyra, Aeron experiences both the beauty and pain of love.\nFreedom vs. Duty: His greatest struggle — to remain himself while bearing the weight of a kingdom.\nStrength and Compassion: He learns that true leadership lies not in domination but in empathy.\nDestiny and Free Will: Though fate crowns him king, it is his choices that make him worthy of the throne.\nLegacy of Peace: His rule ends the age of kings born by blood — beginning one ruled by merit.',
                connections: 'Lady Elara Stormveil (First Love): She taught him how to feel before the world taught him how to endure. Represents innocence and heart.\n\nLady Lyra Faelin (Second Love): Healer with empathic magic. Represents healing, balance, and redemption. Separated by destiny.\n\nKing Aelric Velarys: A proud monarch who once allied with Aeron, now a rival.\n\nGeneral Cailen Stormrider: A rival-turned-mentor.\n\nCommander Selene Ironwing: A disciplined commander.\n\nReygar the Bold: A free-spirited warrior and truest friend.\n\nNerissa the Wanderer: A mystical nomad.',
                roleInStory: 'Rises as a reluctant king who unites the seven kingdoms under one banner. His rule marks the dawn of a new era built on fairness, strength, and humility. The man who never sought power, but became power itself.',
                timeline: 'Infant: Found near ruins of an ancient temple during a thunderstorm.\n\nSeventeen: Fought in the war between Velarys and Eldoria.\n\nEarly life: Wandering mercenary, saved a village during the Great Tempest of the Shattered Coast.\n\nLater life: Becomes the Last King of the Seven Kingdoms.',
                canonChoices: [
                  { id: crypto.randomUUID(), element: 'First Love', choice: 'Lady Elara Stormveil — gentle, pure, dies of incurable illness' },
                  { id: crypto.randomUUID(), element: 'Second Love', choice: 'Lady Lyra Faelin — healer with magic, deep emotional bond, separated by destiny (will they meet again?)' },
                  { id: crypto.randomUUID(), element: 'Greatest Conflict', choice: 'Freedom vs. Duty' },
                  { id: crypto.randomUUID(), element: 'Theme', choice: 'Healing after loss, reluctant destiny, compassion as strength' },
                  { id: crypto.randomUUID(), element: 'Fate', choice: 'Becomes the Last King of the Seven Kingdoms — unites them under peace and justice' }
                ]
              });
            }}
            className="md:col-span-3 lg:col-span-4 rounded-[2rem] border-2 border-dashed border-primary/30 flex flex-col items-center justify-center p-8 hover:border-primary/80 hover:bg-primary/5 transition-colors cursor-pointer group"
            style={{ minHeight: 280 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary">download</span>
            </div>
            <p className="font-headline text-[11px] uppercase tracking-widest text-primary text-center">Load Aeron Stormbreaker (Test)</p>
          </motion.div>


          {filteredChars.map((char, index) => {
            return (
              <motion.div
                key={char.id}
                onClick={() => activeProject && navigate(`/${activeProject.slug}/characters/${char.id}`)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="col-span-12 lg:col-span-6 bg-surface-container rounded-[2rem] overflow-hidden group cursor-pointer border border-transparent hover:border-primary/10 transition-all duration-300 relative flex flex-row h-56"
              >
                <div className="w-2/5 relative h-full overflow-hidden shrink-0">
                  <img
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={char.avatarUrl || DEFAULT_AVATAR}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-container" />
                </div>
                <div className="w-3/5 p-8 flex flex-col justify-center relative">
                  <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute z-20 right-6 top-6 p-2 bg-surface hover:bg-red-500/10 rounded-full text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <span className={`font-label text-[10px] uppercase tracking-[0.3em] mb-2 block ${char.color || 'text-primary'}`}>{char.role}</span>
                  <ScrollableTitle text={char.name} className="mb-2" />
                  <p className="text-slate-500 font-label text-xs tracking-widest uppercase mb-4 truncate">{char.archetype || 'Unknown Archetype'}</p>
                  
                  <p className="text-slate-400 font-body text-sm line-clamp-2 leading-relaxed">
                    {stripHtml(char.roleInStory) || stripHtml(char.background) || stripHtml(char.personality) || "Profile incomplete. Awaiting psychological manifestation."}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Removed buttons from bottom to top */}
          
        </div>
      </div>
    </div>
  );
}
