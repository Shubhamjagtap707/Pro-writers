import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=800&q=80';

import RichTextEditor from '../components/RichTextEditor';

export default function CharacterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, updateCharacter, factions } = useProjectStore();
  const char = id ? characters[id] : null;

  if (!char) {
    return <div className="page-shell flex items-center justify-center text-slate-500">Character not found</div>;
  }

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftChar, setDraftChar] = useState<any>(null);
  const activeChar = (isEditMode && draftChar) ? draftChar : char;

  const handleChange = (field: string, value: string) => {
    if (isEditMode) {
      if (!draftChar) return;
      setDraftChar((prev: any) => prev ? { ...prev, [field]: value } : prev);
    } else {
      updateCharacter(char.id, { [field]: value });
    }
  };

  const updateCanonChoice = (index: number, field: 'element' | 'choice', value: string) => {
    if (!isEditMode || !draftChar) return;
    const newChoices = [...(draftChar.canonChoices || [])];
    newChoices[index] = { ...newChoices[index], [field]: value };
    setDraftChar((prev: any) => ({ ...prev, canonChoices: newChoices }));
  };

  const addCanonChoice = () => {
    if (!isEditMode || !draftChar) return;
    const newChoices = [...(draftChar.canonChoices || []), { id: crypto.randomUUID(), element: '', choice: '' }];
    setDraftChar((prev: any) => ({ ...prev, canonChoices: newChoices }));
  };

  const removeCanonChoice = (index: number) => {
    if (!isEditMode || !draftChar) return;
    const newChoices = [...(draftChar.canonChoices || [])];
    newChoices.splice(index, 1);
    setDraftChar((prev: any) => ({ ...prev, canonChoices: newChoices }));
  };

  const updateTitle = (index: number, value: string) => {
    if (!isEditMode || !draftChar) return;
    const newTitles = [...(draftChar.titles || [])];
    newTitles[index] = { ...newTitles[index], title: value };
    setDraftChar((prev: any) => ({ ...prev, titles: newTitles }));
  };

  const addTitle = () => {
    if (!isEditMode || !draftChar) return;
    const newTitles = [...(draftChar.titles || []), { id: crypto.randomUUID(), title: '' }];
    setDraftChar((prev: any) => ({ ...prev, titles: newTitles }));
  };

  const removeTitle = (index: number) => {
    if (!isEditMode || !draftChar) return;
    const newTitles = [...(draftChar.titles || [])];
    newTitles.splice(index, 1);
    setDraftChar((prev: any) => ({ ...prev, titles: newTitles }));
  };

  const updateRelationshipArc = (index: number, value: string) => {
    if (!isEditMode || !draftChar) return;
    const newArcs = [...(draftChar.relationshipArcs || [])];
    newArcs[index] = { ...newArcs[index], content: value };
    setDraftChar((prev: any) => ({ ...prev, relationshipArcs: newArcs }));
  };

  const addRelationshipArc = () => {
    if (!isEditMode || !draftChar) return;
    const newArcs = [...(draftChar.relationshipArcs || []), { id: crypto.randomUUID(), content: '' }];
    setDraftChar((prev: any) => ({ ...prev, relationshipArcs: newArcs }));
  };

  const removeRelationshipArc = (index: number) => {
    if (!isEditMode || !draftChar) return;
    const newArcs = [...(draftChar.relationshipArcs || [])];
    newArcs.splice(index, 1);
    setDraftChar((prev: any) => ({ ...prev, relationshipArcs: newArcs }));
  };
  const updateAllegiance = (index: number, field: 'factionId' | 'rank', value: string) => {
    if (!isEditMode || !draftChar) return;
    const newAllegiances = [...(draftChar.allegiances || [])];
    newAllegiances[index] = { ...newAllegiances[index], [field]: value };
    setDraftChar((prev: any) => ({ ...prev, allegiances: newAllegiances }));
  };

  const addAllegiance = () => {
    if (!isEditMode || !draftChar) return;
    const newAllegiances = [...(draftChar.allegiances || []), { id: crypto.randomUUID(), factionId: '', rank: '' }];
    setDraftChar((prev: any) => ({ ...prev, allegiances: newAllegiances }));
  };

  const removeAllegiance = (index: number) => {
    if (!isEditMode || !draftChar) return;
    const newAllegiances = [...(draftChar.allegiances || [])];
    newAllegiances.splice(index, 1);
    setDraftChar((prev: any) => ({ ...prev, allegiances: newAllegiances }));
  };

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />

      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h2 className="text-3xl font-body font-bold text-on-surface mb-6">Update Portrait</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-2 block">Image URL</label>
                  <input
                    autoFocus
                    value={tempImageUrl}
                    onChange={e => setTempImageUrl(e.target.value)}
                    placeholder="Paste image link here..."
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                
                <button
                  onClick={() => {
                    handleChange('avatarUrl', tempImageUrl);
                    setIsImageModalOpen(false);
                  }}
                  disabled={!tempImageUrl.trim()}
                  className="w-full mt-4 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-surface transition-colors"
                >
                  SAVE IMAGE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-content relative z-20 py-12">
        <button onClick={() => navigate(-1)} className="mb-12 text-slate-500 hover:text-primary flex items-center gap-2 transition-colors max-w-4xl mx-auto w-full">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label text-xs uppercase tracking-widest font-bold">Back to Archive</span>
        </button>

        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => {
                  if (!isEditMode) return;
                  setTempImageUrl(activeChar.avatarUrl || '');
                  setIsImageModalOpen(true);
                }}
                className="w-48 h-48 rounded-full overflow-hidden bg-surface-container-low border-4 border-surface shadow-2xl flex-shrink-0 relative group cursor-pointer"
              >
                <img
                  alt={activeChar.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-30"
                  src={activeChar.avatarUrl || DEFAULT_AVATAR}
                />
                {isEditMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="material-symbols-outlined text-white text-3xl mb-1 drop-shadow-md">edit</span>
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Edit Portrait</span>
                </div>
                )}
              </button>
            </div>
            <div className="flex-1 text-center md:text-left pt-4 flex justify-between items-start">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-3">Character Identity</label>
              <input
                className="w-full bg-transparent border-none text-6xl font-body font-bold text-on-surface focus:ring-0 p-0 mb-6 outline-none placeholder-slate-600 text-center md:text-left"
                value={activeChar.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Character Name"
              />
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <select
                  disabled={!isEditMode}
                  value={activeChar.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="px-6 py-3 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-bold uppercase tracking-wider border-none outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  <option>Protagonist</option>
                  <option>Antagonist</option>
                  <option>Supporting</option>
                  <option>NPCs</option>
                </select>
                <input
                  readOnly={!isEditMode}
                  value={activeChar.archetype}
                  onChange={(e) => handleChange('archetype', e.target.value)}
                  placeholder="Archetype (e.g. The Mentor)"
                  className="px-6 py-3 rounded-full bg-surface-container-high text-slate-400 text-xs font-bold uppercase tracking-wider border-none outline-none focus:ring-1 focus:ring-primary md:flex-1 text-center md:text-left"
                />
              </div>
            </div>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${isEditMode ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}
            >
              {isEditMode ? 'Save' : 'Edit'}
            </button>
          </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent my-8" />

          {/* Earned Titles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">military_tech</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Earned Titles Throughout the Storyline</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-outline-variant/10 overflow-hidden">
              <div className="p-4 space-y-2">
                {(activeChar.titles || []).map((t: any, index: number) => (
                  <div key={t.id} className="flex gap-2 group relative">
                    <input
                      readOnly={!isEditMode}
                      className="w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-high transition-colors px-6 py-4 rounded-2xl outline-none text-xl font-body text-on-surface"
                      placeholder="Title or alias..."
                      value={t.title}
                      onChange={(e) => updateTitle(index, e.target.value)}
                    />
                    {isEditMode && (
                    <button
                      onClick={() => removeTitle(index)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    )}
                  </div>
                ))}
                {(!activeChar.titles || activeChar.titles.length === 0) && (
                  <div className="p-6 text-center text-slate-500 italic font-body">No titles earned yet.</div>
                )}
              </div>
              {isEditMode && (
                <button
                  onClick={addTitle}
                  className="w-full p-6 flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:bg-surface-container hover:text-primary transition-colors border-t border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Title
                </button>
              )}
            </div>
          </section>

          {/* Background */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">history_edu</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Origins and Background</h3>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-transparent focus-within:border-primary/20 transition-colors">
              <RichTextEditor readOnly={!isEditMode}
                className="text-xl"
                minRows={3}
                placeholder="Where do they come from? What is their history before the story begins?"
                value={activeChar.background || ''}
                onChange={(val: string) => handleChange('background', val)}
              />
            </div>
          </section>

          {/* Appearance & Personality */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">face</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Appearance, Personality & Traits</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-transparent focus-within:border-primary/20 transition-colors divide-y divide-outline-variant/10">
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Appearance</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="Describe their physical appearance, clothing, distinguishing marks..."
                  value={activeChar.appearance || ''}
                  onChange={(val: string) => handleChange('appearance', val)}
                />
              </div>
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Personality</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="General demeanor, attitudes, and core characteristics..."
                  value={activeChar.personality || ''}
                  onChange={(val: string) => handleChange('personality', val)}
                />
              </div>
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Core Traits</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="Unique habits, fatal flaws, and peculiar mannerisms..."
                  value={activeChar.quirksAndFlaws || ''}
                  onChange={(val: string) => handleChange('quirksAndFlaws', val)}
                />
              </div>
            </div>
          </section>

          {/* Conflicts */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-2xl">local_fire_department</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Conflicts</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-transparent focus-within:border-error/20 transition-colors divide-y divide-outline-variant/10">
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Internal Conflict</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="What emotional battle are they fighting inside?"
                  value={activeChar.internalConflict || ''}
                  onChange={(val: string) => handleChange('internalConflict', val)}
                />
              </div>
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">External Conflict</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="What or who stands in their way in the physical world?"
                  value={activeChar.externalConflict || ''}
                  onChange={(val: string) => handleChange('externalConflict', val)}
                />
              </div>
            </div>
          </section>

          {/* Attributes */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl">auto_awesome</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Attributes & Themes</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-transparent focus-within:border-tertiary/20 transition-colors divide-y divide-outline-variant/10">
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Weapons & Skills</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="Special abilities, fighting styles, tools..."
                  value={activeChar.weaponsAndSkills || ''}
                  onChange={(val: string) => handleChange('weaponsAndSkills', val)}
                />
              </div>
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Themes & Symbolism</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="What motifs or thematic elements are tied to this character?"
                  value={activeChar.themes || ''}
                  onChange={(val: string) => handleChange('themes', val)}
                />
              </div>
            </div>
          </section>

          {/* Relationships & Connections */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">hub</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Relationships and Emotional Arcs</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-transparent focus-within:border-secondary/20 transition-colors divide-y divide-outline-variant/10">
              {activeChar.connections && activeChar.connections !== '<p></p>' && (
                <div className="p-8 border-b border-outline-variant/10 relative">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] text-error uppercase tracking-widest font-bold">Legacy Field (Move contents below, then clear this)</label>
                    {isEditMode && (
                      <button
                        onClick={() => handleChange('connections', '')}
                        className="text-error hover:text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete_forever</span>
                        Delete Legacy Field
                      </button>
                    )}
                  </div>
                  <RichTextEditor readOnly={!isEditMode}
                    className="text-lg opacity-80"
                    minRows={3}
                    placeholder="Legacy field..."
                    value={activeChar.connections}
                    onChange={(val: string) => handleChange('connections', val)}
                  />
                </div>
              )}
              
              <div className="p-4 space-y-4">
                {(activeChar.relationshipArcs || []).map((arc: any, index: number) => (
                  <div key={arc.id} className="relative group bg-surface-container hover:bg-surface-container-high transition-colors rounded-2xl overflow-hidden border border-outline-variant/10">
                    <div className="p-6 pr-14">
                      <RichTextEditor readOnly={!isEditMode}
                        className="text-lg"
                        minRows={2}
                        placeholder="Detail a specific relationship or emotional arc..."
                        value={arc.content}
                        onChange={(val: string) => updateRelationshipArc(index, val)}
                      />
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() => removeRelationshipArc(index)}
                        className="absolute right-4 top-4 text-slate-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </div>
                ))}
                {(!activeChar.relationshipArcs || activeChar.relationshipArcs.length === 0) && (
                  <div className="p-6 text-center text-slate-500 italic font-body">No relationship arcs added yet.</div>
                )}
              </div>
              {isEditMode && (
                <button
                  onClick={addRelationshipArc}
                  className="w-full p-6 flex items-center justify-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest hover:bg-surface-container hover:text-secondary transition-colors border-t border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Relationship Arc
                </button>
              )}
              <div className="p-8">
                <label className="block text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Other Key Relationships</label>
                <RichTextEditor readOnly={!isEditMode}
                  className="text-lg"
                  minRows={2}
                  placeholder="Mentors, rivals, obscure allies..."
                  value={activeChar.otherRelationships || ''}
                  onChange={(val: string) => handleChange('otherRelationships', val)}
                />
              </div>
            </div>
          </section>

          {/* Factions & Allegiances */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">shield</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Allegiances & Factions</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-transparent focus-within:border-primary/20 transition-colors overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/10">
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest w-1/2">Faction</th>
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Rank / Role</th>
                    <th className="p-6 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {((activeChar.allegiances as any[]) || []).map((row: any, index: number) => (
                    <tr key={row.id} className="border-b border-outline-variant/5 last:border-0 group transition-colors hover:bg-surface/50">
                      <td className="p-6 align-middle border-r border-outline-variant/5">
                        {isEditMode ? (
                          <select
                            value={row.factionId}
                            onChange={(e) => updateAllegiance(index, 'factionId', e.target.value)}
                            className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none"
                          >
                            <option value="">Select a faction...</option>
                            {Object.values(factions).filter(f => f.project_id === activeChar.project_id || f.series_id === activeChar.series_id).map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="font-bold text-lg text-on-surface">
                            {row.factionId && factions[row.factionId] ? factions[row.factionId].name : 'Unknown Faction'}
                          </div>
                        )}
                      </td>
                      <td className="p-6 align-middle">
                        {isEditMode ? (
                          <input
                            value={row.rank}
                            onChange={(e) => updateAllegiance(index, 'rank', e.target.value)}
                            placeholder="e.g. Captain, Initiate"
                            className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                          />
                        ) : (
                          <div className="text-slate-300">
                            {row.rank || <span className="text-slate-500 italic">No rank specified</span>}
                          </div>
                        )}
                      </td>
                      <td className="p-6 align-middle text-right">
                        {isEditMode && (
                          <button
                            onClick={() => removeAllegiance(index)}
                            className="text-slate-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-2"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!activeChar.allegiances || activeChar.allegiances.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-slate-500 italic font-body">No allegiances sworn yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isEditMode && (
                <button
                  onClick={addAllegiance}
                  className="w-full p-6 flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:bg-surface-container hover:text-primary transition-colors border-t border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Allegiance
                </button>
              )}
            </div>
          </section>

          {/* Role in Story */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">theater_comedy</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Role in Story</h3>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-transparent focus-within:border-primary/20 transition-colors">
              <RichTextEditor readOnly={!isEditMode}
                className="text-lg"
                minRows={3}
                placeholder="How do they drive the narrative forward? What is their function in the plot?"
                value={activeChar.roleInStory || ''}
                onChange={(val: string) => handleChange('roleInStory', val)}
              />
            </div>
          </section>

          {/* Full Life Timeline */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl">timeline</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Full Life Timeline</h3>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-transparent focus-within:border-tertiary/20 transition-colors">
              <RichTextEditor readOnly={!isEditMode}
                className="text-lg"
                minRows={4}
                placeholder="Chronological sequence of their life events from birth to end..."
                value={activeChar.timeline || ''}
                onChange={(val: string) => handleChange('timeline', val)}
              />
            </div>
          </section>

          {/* Fate & Legacy */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">auto_stories</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Fate and Legacy</h3>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-transparent focus-within:border-secondary/20 transition-colors">
              <RichTextEditor readOnly={!isEditMode}
                className="text-lg"
                minRows={3}
                placeholder="What is their ultimate end? How will they be remembered?"
                value={activeChar.fateAndLegacy || ''}
                onChange={(val: string) => handleChange('fateAndLegacy', val)}
              />
            </div>
          </section>

          {/* Canon Choices Table */}
          <section className="space-y-6 pt-8 border-t border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">table_view</span>
              <h3 className="font-bold text-2xl tracking-tight text-on-surface">Final Canon Choices</h3>
            </div>
            <div className="bg-surface-container-low rounded-3xl shadow-lg border border-outline-variant/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/10">
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest w-1/3">Element</th>
                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Choice</th>
                    <th className="p-6 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {((activeChar.canonChoices as any[]) || []).map((row: any, index: number) => (
                    <tr key={row.id} className="border-b border-outline-variant/5 last:border-0 group transition-colors hover:bg-surface/50">
                      <td className="p-6 align-top border-r border-outline-variant/5">
                        <RichTextEditor readOnly={!isEditMode}
                          value={row.element}
                          onChange={(val: string) => updateCanonChoice(index, 'element', val)}
                          placeholder="Element (e.g. First Love)"
                          className="text-on-surface font-semibold text-lg"
                        />
                      </td>
                      <td className="p-6 align-top">
                        <RichTextEditor readOnly={!isEditMode}
                          value={row.choice}
                          onChange={(val: string) => updateCanonChoice(index, 'choice', val)}
                          placeholder="Choice details..."
                          className="text-on-surface-variant text-lg"
                        />
                      </td>
                      <td className="p-6 align-top text-right">
                        {isEditMode && (
                          <button
                            onClick={() => removeCanonChoice(index)}
                            className="text-slate-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!activeChar.canonChoices || activeChar.canonChoices.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500 italic font-body">No canon choices added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isEditMode && (
                <button
                  onClick={addCanonChoice}
                  className="w-full p-6 flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:bg-surface-container hover:text-primary transition-colors border-t border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Row
                </button>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
