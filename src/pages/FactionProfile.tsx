import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { motion, AnimatePresence } from 'framer-motion';

import RichTextEditor from '../components/RichTextEditor';

const DEFAULT_EMBLEM = 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=800&q=80';

export default function FactionProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { factions, updateFaction, characters, updateCharacter } = useProjectStore();
  const faction = id ? factions[id] : null;

  if (!faction) {
    return <div className="page-shell flex items-center justify-center text-slate-500">Faction not found</div>;
  }

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftFaction, setDraftFaction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'lore' | 'members' | 'subfactions' | 'diplomacy'>('lore');
  const [newDiplomacyTarget, setNewDiplomacyTarget] = useState('');
  const [newDiplomacyStatus, setNewDiplomacyStatus] = useState<'Ally' | 'Enemy' | 'Trade Partner' | 'Neutral'>('Neutral');
  
  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberRank, setNewMemberRank] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [pendingMemberUpdates, setPendingMemberUpdates] = useState<{ charId: string, action: 'add' | 'remove', rank?: string }[]>([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberFilterHouseId, setMemberFilterHouseId] = useState('all');

  const activeFaction = (isEditMode && draftFaction) ? draftFaction : faction;

  const handleChange = (field: string, value: string) => {
    if (isEditMode) {
      if (!draftFaction) return;
      setDraftFaction((prev: any) => prev ? { ...prev, [field]: value } : prev);
    } else {
      updateFaction(faction.id, { [field]: value });
    }
  };

  const handleEditClick = () => {
    if (isEditMode) {
      // Save
      if (draftFaction) {
        updateFaction(faction.id, draftFaction);
        pendingMemberUpdates.forEach(u => {
          const char = characters[u.charId];
          if (!char) return;
          let newAllegiances = char.allegiances || [];
          if (u.action === 'remove') {
            newAllegiances = newAllegiances.filter(a => a.factionId !== faction.id);
          } else if (u.action === 'add') {
            if (!newAllegiances.some(a => a.factionId === faction.id)) {
              newAllegiances = [...newAllegiances, { id: crypto.randomUUID(), factionId: faction.id, rank: u.rank || '' }];
            }
          }
          updateCharacter(char.id, { allegiances: newAllegiances });
        });
      }
      setPendingMemberUpdates([]);
      setIsEditMode(false);
      setDraftFaction(null);
    } else {
      // Start edit
      setDraftFaction({ ...faction });
      setIsEditMode(true);
    }
  };

  const saveImageUrl = () => {
    handleChange('emblemUrl', tempImageUrl);
    setIsImageModalOpen(false);
  };

  const displayedMembers = Object.values(characters).filter(c => {
    if (c.project_id !== faction.project_id) return false;
    const isCurrentlyMember = c.allegiances?.some(a => a.factionId === faction.id);
    const pendingAdd = pendingMemberUpdates.find(u => u.charId === c.id && u.action === 'add');
    const pendingRemove = pendingMemberUpdates.find(u => u.charId === c.id && u.action === 'remove');
    
    if (isEditMode) {
      if (pendingRemove) return false;
      if (pendingAdd) return true;
    }
    return isCurrentlyMember;
  });

  const availableCharacters = Object.values(characters).filter(c => {
    if (c.project_id !== faction.project_id) return false;
    return !displayedMembers.find(m => m.id === c.id);
  });

  const getAllDescendants = (parentId: string, allFactions: typeof factions, visited = new Set<string>()): typeof factions[string][] => {
    if (visited.has(parentId)) return [];
    visited.add(parentId);
    const directChildren = Object.values(allFactions).filter(f => f.parentFactionId === parentId);
    let descendants = [...directChildren];
    for (const child of directChildren) {
      descendants = [...descendants, ...getAllDescendants(child.id, allFactions, visited)];
    }
    return descendants;
  };

  const subFactions = getAllDescendants(faction.id, factions);
  const vassalMembers = Object.values(characters).filter(c => 
    c.project_id === faction.project_id && 
    c.allegiances?.some(a => subFactions.map(sf => sf.id).includes(a.factionId)) &&
    !displayedMembers.find(m => m.id === c.id) // exclude direct members
  );

  const filteredDisplayedMembers = displayedMembers.filter(m => {
    if (memberSearchTerm && !m.name.toLowerCase().includes(memberSearchTerm.toLowerCase())) return false;
    if (memberFilterHouseId !== 'all' && memberFilterHouseId !== faction.id) return false;
    return true;
  });

  const filteredVassalMembers = vassalMembers.filter(m => {
    if (memberSearchTerm && !m.name.toLowerCase().includes(memberSearchTerm.toLowerCase())) return false;
    if (memberFilterHouseId !== 'all' && memberFilterHouseId !== faction.id) {
      const allegiance = m.allegiances?.find(a => subFactions.map(sf => sf.id).includes(a.factionId));
      if (allegiance?.factionId !== memberFilterHouseId) return false;
    } else if (memberFilterHouseId === faction.id) {
      return false; // hide vassals if strictly filtering for main faction
    }
    return true;
  });

  const handleAddMember = () => {
    if (!newMemberId) return;
    const char = Object.values(characters).find(c => c.name === newMemberId || c.id === newMemberId);
    if (!char) return;
    setPendingMemberUpdates(prev => {
      const filtered = prev.filter(p => p.charId !== char.id);
      return [...filtered, { charId: char.id, action: 'add', rank: newMemberRank.trim() }];
    });
    setNewMemberId('');
    setNewMemberRank('');
  };

  const handleRemoveMember = (charId: string) => {
    setPendingMemberUpdates(prev => {
      const filtered = prev.filter(p => p.charId !== charId);
      return [...filtered, { charId, action: 'remove' }];
    });
  };

  const handleAddRole = () => {
    if (!newRoleTitle) return;
    const newRoles = [...(activeFaction.roles || []), { id: crypto.randomUUID(), title: newRoleTitle.trim() }];
    handleChange('roles', newRoles);
    setNewRoleTitle('');
  };

  const handleUpdateRole = (roleId: string, charId: string) => {
    const newRoles = (activeFaction.roles || []).map(r => r.id === roleId ? { ...r, characterId: charId } : r);
    handleChange('roles', newRoles);
  };
  
  const handleRemoveRole = (roleId: string) => {
    const newRoles = (activeFaction.roles || []).filter(r => r.id !== roleId);
    handleChange('roles', newRoles);
  };

  const handleAddDiplomacy = () => {
    if (!newDiplomacyTarget) return;
    const newDiplomacy = [...(activeFaction.diplomacy || []), { id: crypto.randomUUID(), targetFactionId: newDiplomacyTarget, status: newDiplomacyStatus }];
    handleChange('diplomacy', newDiplomacy);
    setNewDiplomacyTarget('');
    setNewDiplomacyStatus('Neutral');
  };

  const handleUpdateDiplomacy = (diplomacyId: string, status: any) => {
    const newDiplomacy = (activeFaction.diplomacy || []).map(d => d.id === diplomacyId ? { ...d, status } : d);
    handleChange('diplomacy', newDiplomacy);
  };
  
  const handleRemoveDiplomacy = (diplomacyId: string) => {
    const newDiplomacy = (activeFaction.diplomacy || []).filter(d => d.id !== diplomacyId);
    handleChange('diplomacy', newDiplomacy);
  };

  const FactionNode = ({ factionId, level = 0 }: { factionId: string, level?: number }) => {
    const f = factions[factionId];
    if (!f) return null;
    const children = Object.values(factions).filter((child: any) => child.parentFactionId === factionId);
    
    return (
      <div className="relative mt-4">
        {level > 0 && (
          <div className="absolute top-8 -left-8 w-8 h-[2px] bg-outline-variant/20" />
        )}
        
        <div 
          onClick={(e) => { e.stopPropagation(); navigate(`../factions/${f.id}`); }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/10 hover:border-primary/50 transition-all cursor-pointer z-10 w-full max-w-sm shadow-sm relative group"
        >
          <img src={f.emblemUrl || DEFAULT_EMBLEM} className="w-12 h-12 rounded-lg object-cover border border-outline-variant/20 grayscale group-hover:grayscale-0 transition-all" />
          <div className="flex-1">
            <h4 className="font-body font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{f.name}</h4>
            <p className="text-[10px] font-label uppercase tracking-widest text-slate-400">{children.length} Vassal{children.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {children.length > 0 && (
          <div className="ml-8 pl-8 border-l-2 border-outline-variant/20 relative pt-2">
            {children.map(child => (
              <FactionNode key={child.id} factionId={child.id} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-shell">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />
      
      <div className="page-content relative z-20 py-12">
        <button onClick={() => navigate('../factions')} className="mb-12 text-slate-500 hover:text-primary flex items-center gap-2 transition-colors max-w-6xl mx-auto w-full">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label text-xs uppercase tracking-widest font-bold">Back to Archive</span>
        </button>

        {/* Header Region */}
        <div className="max-w-6xl mx-auto mb-16 pt-0">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Emblem */}
            <div className="w-64 shrink-0 flex flex-col gap-4">
              <div 
                className={`relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border ${isEditMode ? 'border-primary cursor-pointer' : 'border-outline-variant/10'}`}
                onClick={() => {
                  if (isEditMode) {
                    setTempImageUrl(activeFaction.emblemUrl || '');
                    setIsImageModalOpen(true);
                  }
                }}
              >
                <img 
                  src={activeFaction.emblemUrl || DEFAULT_EMBLEM} 
                  alt={activeFaction.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-4xl text-white">edit</span>
                  </div>
                )}
              </div>
            </div>

            {/* Core Identity */}
            <div className="flex-1 pt-8 w-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-label uppercase tracking-widest bg-surface-container text-primary`}>
                  FACTION
                </span>
                <button
                  onClick={handleEditClick}
                  className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${isEditMode ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}
                >
                  {isEditMode ? 'Save' : 'Edit'}
                </button>
              </div>
              
              {isEditMode ? (
                <input
                  value={activeFaction.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-transparent text-6xl font-body font-bold text-on-surface outline-none border-b border-primary/50 mb-2 focus:border-primary transition-colors"
                  placeholder="Faction Name"
                />
              ) : (
                <h1 className="text-6xl font-body font-bold text-on-surface mb-2">{activeFaction.name}</h1>
              )}
              
              {isEditMode ? (
                <input
                  value={activeFaction.motto}
                  onChange={(e) => handleChange('motto', e.target.value)}
                  className="w-full bg-transparent text-xl font-label uppercase tracking-widest text-slate-400 outline-none border-b border-primary/50 mb-8 focus:border-primary transition-colors"
                  placeholder="Motto or Creed"
                />
              ) : (
                <h2 className="text-xl font-label uppercase tracking-widest text-slate-400 mb-8">{activeFaction.motto || 'No motto established'}</h2>
              )}

              {isEditMode ? (
                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Sworn to (Liege / Parent Faction)</label>
                  <select
                    value={activeFaction.parentFactionId || ''}
                    onChange={(e) => handleChange('parentFactionId', e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="">None (Independent)</option>
                    {Object.values(factions)
                      .filter(f => f.project_id === faction.project_id && f.id !== faction.id && f.parentFactionId !== faction.id)
                      .map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                  </select>
                </div>
              ) : activeFaction.parentFactionId && factions[activeFaction.parentFactionId] && (
                <div 
                  onClick={() => navigate(`../factions/${activeFaction.parentFactionId}`)}
                  className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-sm text-primary">security</span>
                  <span className="text-xs font-label uppercase tracking-widest text-slate-400">
                    Sworn to <strong className="text-on-surface ml-1">{factions[activeFaction.parentFactionId].name}</strong>
                  </span>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-8 border-b border-outline-variant/20 mb-8">
                <button
                  onClick={() => setActiveTab('lore')}
                  className={`pb-4 text-sm font-label uppercase tracking-widest transition-colors ${
                    activeTab === 'lore' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Lore & History
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`pb-4 text-sm font-label uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    activeTab === 'members' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Members
                  <span className="bg-surface-container-high text-xs px-2 py-0.5 rounded-full">{displayedMembers.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('subfactions')}
                  className={`pb-4 text-sm font-label uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    activeTab === 'subfactions' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Vassals
                  {subFactions.length > 0 && (
                    <span className="bg-surface-container-high text-xs px-2 py-0.5 rounded-full">{subFactions.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('diplomacy')}
                  className={`pb-4 text-sm font-label uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    activeTab === 'diplomacy' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Diplomacy
                </button>
              </div>

              {activeTab === 'lore' && (
                <div className="grid grid-cols-1 gap-8">
                  {/* Summary/Description */}
                  <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      Overview
                    </h3>
                    <RichTextEditor readOnly={!isEditMode}
                      value={activeFaction.description || ''}
                      onChange={(val: string) => handleChange('description', val)}
                      placeholder="High-level description of the faction..."
                      className="text-slate-300"
                    />
                  </div>
                  
                  {/* History */}
                  <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">history_edu</span>
                      History & Origins
                    </h3>
                    <RichTextEditor readOnly={!isEditMode}
                      value={activeFaction.history || ''}
                      onChange={(val: string) => handleChange('history', val)}
                      placeholder="How did this faction come to be?"
                      className="text-slate-300"
                    />
                  </div>

                  {/* Political Influence */}
                  <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">gavel</span>
                      Political Influence
                    </h3>
                    <RichTextEditor readOnly={!isEditMode}
                      value={activeFaction.politicalInfluence || ''}
                      onChange={(val: string) => handleChange('politicalInfluence', val)}
                      placeholder="What power do they hold in the world?"
                      className="text-slate-300"
                    />
                  </div>

                  {/* Goals */}
                  <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">flag</span>
                      Objectives & Goals
                    </h3>
                    <RichTextEditor readOnly={!isEditMode}
                      value={activeFaction.goals || ''}
                      onChange={(val: string) => handleChange('goals', val)}
                      placeholder="What are they trying to achieve?"
                      className="text-slate-300"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10">
                  {/* Leadership Roles */}
                  {(activeFaction.roles && activeFaction.roles.length > 0 || isEditMode) && (
                    <div className="mb-12 pb-8 border-b border-outline-variant/10">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        Leadership Council
                      </h3>
                      
                      {activeFaction.roles && activeFaction.roles.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {activeFaction.roles.map((role: any) => {
                            const char = role.characterId ? characters[role.characterId] : null;
                            return (
                              <div key={role.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/10 shadow-sm relative group">
                                {char ? (
                                  <img src={char.avatarUrl || DEFAULT_AVATAR} className="w-12 h-12 rounded-full object-cover border border-primary/30" />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-500">person_off</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-xs font-label uppercase tracking-widest text-primary mb-1">{role.title}</p>
                                  <h4 className="font-body font-bold text-on-surface">{char ? char.name : 'Unassigned'}</h4>
                                </div>
                                {isEditMode && (
                                  <div className="flex flex-col gap-2 min-w-[120px]">
                                    <select 
                                      value={role.characterId || ''}
                                      onChange={(e) => handleUpdateRole(role.id, e.target.value)}
                                      className="bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary/50 text-on-surface"
                                    >
                                      <option value="">Unassigned</option>
                                      {[...displayedMembers, ...vassalMembers].map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                      ))}
                                    </select>
                                    <button onClick={() => handleRemoveRole(role.id)} className="text-[10px] text-error hover:underline text-right font-label uppercase tracking-widest">Remove</button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isEditMode && (
                        <div className="flex flex-col md:flex-row gap-4 mt-6 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 border-dashed">
                          <input
                            value={newRoleTitle}
                            onChange={(e) => setNewRoleTitle(e.target.value)}
                            placeholder="New Role (e.g. Hand of the King)"
                            className="flex-1 bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                          />
                          <button
                            onClick={handleAddRole}
                            disabled={!newRoleTitle}
                            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors whitespace-nowrap flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            ADD ROLE
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 m-0">
                      <span className="material-symbols-outlined text-sm">group</span>
                      Known Affiliates
                    </h3>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-1 md:w-48">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                        <input
                          type="text"
                          placeholder="Search members..."
                          value={memberSearchTerm}
                          onChange={(e) => setMemberSearchTerm(e.target.value)}
                          className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-sm text-on-surface outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      {subFactions.length > 0 && (
                        <select
                          value={memberFilterHouseId}
                          onChange={(e) => setMemberFilterHouseId(e.target.value)}
                          className="bg-surface border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface outline-none focus:border-primary/50 transition-colors appearance-none md:w-48"
                        >
                          <option value="all">All Houses</option>
                          <option value={faction.id}>Direct Members Only</option>
                          {subFactions.map(sf => (
                            <option key={sf.id} value={sf.id}>{sf.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <div className="mb-8 pb-8 border-b border-outline-variant/10">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Add Character to Faction</h4>
                      <div className="flex flex-col md:flex-row gap-4">
                        <input
                          list="available-characters-list"
                          value={newMemberId}
                          onChange={(e) => setNewMemberId(e.target.value)}
                          placeholder="Type or select character name..."
                          className="flex-1 bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                        />
                        <datalist id="available-characters-list">
                          {availableCharacters.map(c => (
                            <option key={c.id} value={c.name} />
                          ))}
                        </datalist>
                        <input
                          value={newMemberRank}
                          onChange={(e) => setNewMemberRank(e.target.value)}
                          placeholder="Rank (Optional)"
                          className="flex-1 bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                          onClick={handleAddMember}
                          disabled={!newMemberId}
                          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors whitespace-nowrap"
                        >
                          ADD MEMBER
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredDisplayedMembers.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-4xl text-slate-600 mb-4 block">person_off</span>
                      <p className="text-slate-500 font-label tracking-widest text-sm uppercase">No known members</p>
                      <p className="text-slate-600 text-sm mt-2">Assign characters to this faction from their Character Profile.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDisplayedMembers.map(member => {
                        let rank = member.allegiances?.find(a => a.factionId === faction.id)?.rank || 'Unknown Rank';
                        if (isEditMode) {
                          const pendingAdd = pendingMemberUpdates.find(u => u.charId === member.id && u.action === 'add');
                          if (pendingAdd && pendingAdd.rank) rank = pendingAdd.rank;
                        }

                        return (
                          <div 
                            key={member.id}
                            onClick={() => navigate(`../characters/${member.id}`)}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/5 hover:border-primary/30 hover:bg-surface-container-high transition-all cursor-pointer group"
                          >
                            <img 
                              src={member.avatarUrl || DEFAULT_AVATAR} 
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover border border-outline-variant/20"
                            />
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <h4 className="font-body font-bold text-on-surface group-hover:text-primary transition-colors">{member.name}</h4>
                                <p className="text-xs font-label uppercase tracking-widest text-slate-400">{rank}</p>
                              </div>
                              {isEditMode && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
                                  className="w-8 h-8 rounded-full text-slate-500 hover:bg-error/20 hover:text-error flex items-center justify-center transition-colors"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {filteredVassalMembers.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-outline-variant/10">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sworn Characters (Via Vassals)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                        {filteredVassalMembers.map(member => {
                          const allegiance = member.allegiances?.find(a => subFactions.map(sf => sf.id).includes(a.factionId));
                          const vassalFaction = subFactions.find(sf => sf.id === allegiance?.factionId);
                          return (
                            <div 
                              key={member.id}
                              onClick={() => navigate(`../characters/${member.id}`)}
                              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/5 hover:border-primary/30 hover:bg-surface-container-high transition-all cursor-pointer group"
                            >
                              <img 
                                src={member.avatarUrl || DEFAULT_AVATAR} 
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover border border-outline-variant/20 grayscale group-hover:grayscale-0 transition-all"
                              />
                              <div className="flex-1">
                                <h4 className="font-body font-bold text-on-surface group-hover:text-primary transition-colors text-sm">{member.name}</h4>
                                <p className="text-[10px] font-label uppercase tracking-widest text-slate-400">
                                  {allegiance?.rank || 'Unknown Rank'} • {vassalFaction?.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'subfactions' && (
                <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10 overflow-x-auto">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">account_tree</span>
                    Vassal Hierarchy
                  </h3>
                  
                  {subFactions.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-4xl text-slate-600 mb-4 block">account_balance</span>
                      <p className="text-slate-500 font-label tracking-widest text-sm uppercase">No vassals</p>
                      <p className="text-slate-600 text-sm mt-2">This faction has no sworn houses.</p>
                    </div>
                  ) : (
                    <div className="pt-4 pb-12 px-4 min-w-[600px]">
                      {/* Root node of the tree is the current faction itself, conceptually, but we render its direct children */}
                      <div className="flex flex-col border-l-2 border-outline-variant/20 ml-8 pl-8 relative">
                        {/* Parent Faction indicator */}
                        <div className="absolute -top-8 -left-4 flex items-center gap-2">
                          <img src={activeFaction.emblemUrl || DEFAULT_EMBLEM} className="w-8 h-8 rounded-full border-2 border-primary object-cover" />
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">{activeFaction.name}</span>
                        </div>
                        {Object.values(factions).filter((f: any) => f.parentFactionId === faction.id).map(child => (
                          <FactionNode key={child.id} factionId={child.id} level={1} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'diplomacy' && (
                <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg border border-outline-variant/10">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">handshake</span>
                    Diplomatic Relations
                  </h3>
                  
                  {(!activeFaction.diplomacy || activeFaction.diplomacy.length === 0) ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-4xl text-slate-600 mb-4 block">public_off</span>
                      <p className="text-slate-500 font-label tracking-widest text-sm uppercase">Isolated</p>
                      <p className="text-slate-600 text-sm mt-2">No known relations with other factions.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeFaction.diplomacy.map((rel: any) => {
                        const targetFaction = factions[rel.targetFactionId];
                        if (!targetFaction) return null;
                        
                        let statusColor = 'text-slate-400';
                        if (rel.status === 'Ally') statusColor = 'text-green-400';
                        if (rel.status === 'Enemy') statusColor = 'text-error';
                        if (rel.status === 'Trade Partner') statusColor = 'text-primary';

                        return (
                          <div key={rel.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/10 shadow-sm relative group">
                            <img src={targetFaction.emblemUrl || DEFAULT_EMBLEM} className="w-12 h-12 rounded-xl object-cover border border-outline-variant/20" />
                            <div className="flex-1">
                              <h4 
                                onClick={() => navigate(`../factions/${targetFaction.id}`)}
                                className="font-body font-bold text-on-surface cursor-pointer hover:text-primary transition-colors"
                              >
                                {targetFaction.name}
                              </h4>
                              {!isEditMode ? (
                                <p className={`text-xs font-label uppercase tracking-widest ${statusColor}`}>{rel.status}</p>
                              ) : (
                                <select
                                  value={rel.status}
                                  onChange={(e) => handleUpdateDiplomacy(rel.id, e.target.value)}
                                  className="mt-1 bg-surface-container border border-outline-variant/30 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary/50 text-on-surface"
                                >
                                  <option value="Ally">Ally</option>
                                  <option value="Enemy">Enemy</option>
                                  <option value="Trade Partner">Trade Partner</option>
                                  <option value="Neutral">Neutral</option>
                                </select>
                              )}
                            </div>
                            {isEditMode && (
                              <button onClick={() => handleRemoveDiplomacy(rel.id)} className="w-8 h-8 rounded-full text-slate-500 hover:bg-error/20 hover:text-error flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isEditMode && (
                    <div className="flex flex-col md:flex-row gap-4 mt-8 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 border-dashed">
                      <select
                        value={newDiplomacyTarget}
                        onChange={(e) => setNewDiplomacyTarget(e.target.value)}
                        className="flex-1 bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="">Select Faction...</option>
                        {Object.values(factions)
                          .filter(f => f.id !== faction.id && !activeFaction.diplomacy?.find((d: any) => d.targetFactionId === f.id))
                          .map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                      </select>
                      <select
                        value={newDiplomacyStatus}
                        onChange={(e) => setNewDiplomacyStatus(e.target.value as any)}
                        className="flex-1 bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="Ally">Ally</option>
                        <option value="Enemy">Enemy</option>
                        <option value="Trade Partner">Trade Partner</option>
                        <option value="Neutral">Neutral</option>
                      </select>
                      <button
                        onClick={handleAddDiplomacy}
                        disabled={!newDiplomacyTarget}
                        className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        ADD
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image URL Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-surface/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-container-high border border-outline-variant/30 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="font-label tracking-widest text-sm text-slate-300 uppercase mb-4">Update Emblem URL</h3>
              <input
                autoFocus
                value={tempImageUrl}
                onChange={e => setTempImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary/50 transition-colors mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-label text-xs tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={saveImageUrl}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label text-xs tracking-widest hover:bg-primary/80 transition-colors"
                >
                  SAVE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
