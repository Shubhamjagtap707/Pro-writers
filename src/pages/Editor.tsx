import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';
import type { Scene } from '../types/database';

export default function Editor() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const { 
    activeProjectId, setActiveProject, projects, chapters, scenes, characters,
    updateSceneContent, createChapter, createScene, renameChapter, renameScene, deleteChapter, deleteScene, updateSceneNotes
  } = useProjectStore();
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const submitEdit = (id: string, isChapter: boolean) => {
    if (editTitle.trim()) {
      if (isChapter) renameChapter(id, editTitle.trim());
      else renameScene(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const matchedProject = Object.values(projects).find(p => p.slug === projectSlug) || null;
  const activeProject = activeProjectId ? projects[activeProjectId] : null;

  useEffect(() => {
    if (matchedProject && matchedProject.id !== activeProjectId) {
      setActiveProject(matchedProject.id);
    }
  }, [matchedProject, activeProjectId, setActiveProject]);

  const projectChapters = Object.values(chapters)
    .filter(c => c.project_id === activeProjectId)
    .sort((a, b) => a.sort_order - b.sort_order);

  const projectScenes = Object.values(scenes).filter(s => s.project_id === activeProjectId);

  const scenesByChapter: Record<string, Scene[]> = {};
  projectChapters.forEach(c => {
    scenesByChapter[c.id] = projectScenes
      .filter(s => s.chapter_id === c.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  });

  useEffect(() => {
    const isSceneMissing = activeSceneId ? !scenes[activeSceneId] : true;
    if (isSceneMissing && projectChapters.length > 0) {
      const firstChapterScenes = scenesByChapter[projectChapters[0].id];
      if (firstChapterScenes && firstChapterScenes.length > 0) {
        setActiveSceneId(firstChapterScenes[0].id);
      } else {
        setActiveSceneId(null);
      }
    } else if (isSceneMissing) {
      setActiveSceneId(null);
    }
  }, [activeProjectId, activeSceneId, scenes, projectChapters, scenesByChapter]);

  const activeScene = activeSceneId ? scenes[activeSceneId] : null;

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <p className="text-slate-500 font-body text-xl">Loading manuscript...</p>
      </div>
    );
  }

  const wordCount = activeScene?.word_count || 0;
  const projectCharacters = Object.values(characters).filter(c => c.project_id === activeProjectId);

  const exportManuscript = () => {
    if (!activeProject || projectChapters.length === 0) return;
    let compileText = `${activeProject.title.toUpperCase()}\n`;
    compileText += `A manuscript created in Pro Writers\n\n`;
    
    projectChapters.forEach(chapter => {
      compileText += `\n\n=========================================\n`;
      compileText += `          ${chapter.title.toUpperCase()}\n`;
      compileText += `=========================================\n\n`;
      const chapterScenes = scenesByChapter[chapter.id] || [];
      chapterScenes.forEach(scene => {
         compileText += `\n[ ${scene.title} ]\n\n`;
         compileText += scene.content + `\n`;
      });
    });

    const blob = new Blob([compileText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.slug}-manuscript.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-row h-full overflow-hidden text-on-surface bg-surface relative">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />

      {/* Manuscript Tree / Secondary Nav */}
      <aside className="w-72 bg-surface-container-low flex flex-col no-scrollbar overflow-y-auto px-6 py-8 space-y-6 flex-shrink-0">
        <div className="px-6 mb-4 flex justify-between items-center">
          <h2 className="font-headline text-[10px] text-slate-500 uppercase tracking-[0.2em]">Manuscript</h2>
          <button 
            onClick={() => activeProjectId && createChapter(activeProjectId)}
            className="text-slate-400 hover:text-primary transition-colors"
            title="Add Chapter"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
          </button>
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4 font-bold font-headline">The Great Descent</h3>
          <div className="space-y-1">
            {projectChapters.map(chapter => {
              const chapterScenes = scenesByChapter[chapter.id] || [];
              return (
                <div key={chapter.id} className="mb-4">
                  <div className="flex justify-between items-center group/chapter px-2 mb-3">
                    {editingId === chapter.id ? (
                      <input 
                        autoFocus
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onBlur={() => submitEdit(chapter.id, true)}
                        onKeyDown={e => e.key === 'Enter' && submitEdit(chapter.id, true)}
                        className="bg-transparent border-b border-primary outline-none text-on-surface text-xs font-bold uppercase tracking-widest w-full"
                      />
                    ) : (
                      <h3 
                        onDoubleClick={() => startEdit(chapter.id, chapter.title)}
                        className="text-xs font-bold text-on-surface uppercase tracking-widest cursor-text select-none"
                      >
                        {chapter.title}
                      </h3>
                    )}
                    <div className="flex gap-1 opacity-0 group-hover/chapter:opacity-100 transition-opacity">
                      <button onClick={() => activeProjectId && createScene(chapter.id, activeProjectId)} className="text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                      <button onClick={() => deleteChapter(chapter.id)} className="text-slate-400 hover:text-red-400">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="pl-6 space-y-1">
                    {chapterScenes.map(scene => (
                      <div
                        key={scene.id}
                        onClick={() => setActiveSceneId(scene.id)}
                        className={`py-2 px-3 rounded-lg text-xs cursor-pointer transition-colors flex justify-between items-center group/scene ${activeSceneId === scene.id
                            ? 'bg-surface-container text-primary border-l-2 border-primary'
                            : 'text-slate-400 hover:bg-surface-container-high'
                          }`}
                      >
                        {editingId === scene.id ? (
                          <input 
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onBlur={() => submitEdit(scene.id, false)}
                            onKeyDown={e => e.key === 'Enter' && submitEdit(scene.id, false)}
                            className="bg-transparent text-on-surface outline-none w-full"
                          />
                        ) : (
                          <>
                            <span 
                              onDoubleClick={() => startEdit(scene.id, scene.title)} 
                              className="select-none flex-1 truncate"
                            >
                              {scene.title}
                            </span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }} 
                              className="opacity-0 group-hover/scene:opacity-100 text-slate-500 hover:text-red-400 ml-2"
                            >
                              <span className="material-symbols-outlined text-[12px]">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col bg-surface relative">

        {/* Editor area */}
        <div className="flex-1 flex overflow-hidden">
          {!activeScene ? (
            <section className="flex-1 bg-surface-container flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
              <div className="text-center">
                 <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">edit_document</span>
                 <p className="font-body text-xl text-slate-500">Your manuscript canvas awaits.</p>
                 <p className="font-label text-xs uppercase tracking-widest text-primary/50 mt-2">Create a chapter and scene in the sidebar to begin.</p>
              </div>
            </section>
          ) : (
<>
          {/* Manuscript / Zen Editor */}
          <section className="flex-1 bg-surface-container flex flex-col items-center overflow-y-auto no-scrollbar">
            <div className="max-w-3xl w-full px-12 py-24 min-h-screen">
              <div className="mb-12 space-y-2">
                <span className="text-[11px] font-headline uppercase tracking-[0.3em] text-primary/60">
                  {projectChapters.find(c => c.id === activeScene.chapter_id)?.title}
                </span>
                <h2 className="text-4xl font-body italic text-on-surface leading-tight">{activeScene.title}</h2>
                <div className="flex items-center gap-4 pt-4">
                  <span className="text-[10px] font-headline text-slate-500 border border-outline-variant/30 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {wordCount.toLocaleString()} Words
                  </span>
                  <span className="text-[10px] font-headline text-slate-500 border border-outline-variant/30 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Reading time: {Math.ceil(wordCount / 200)}m
                  </span>
                </div>
              </div>

              <textarea
                className="drop-cap font-body text-xl leading-relaxed text-on-surface/90 w-full bg-transparent border-none outline-none resize-none"
                style={{ minHeight: '60vh', fontFamily: "'Newsreader', serif" }}
                value={activeScene.content}
                onChange={e => updateSceneContent(activeScene.id, e.target.value)}
                spellCheck={false}
              />

            </div>
          </section>

          {/* Right Inspector Sidebar */}
          <aside className="w-80 bg-surface-container-low border-l border-outline-variant/5 flex flex-col flex-shrink-0">
            <div className="p-8 space-y-8">
              {/* Scene Notes */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[11px] uppercase tracking-widest text-slate-500 font-bold font-headline">Scene Notes</h4>
                </div>
                <div className="bg-surface-container p-4 rounded-xl space-y-3">
                  <textarea
                    placeholder="Capture atmospheric goals or hidden themes here..."
                    className="w-full bg-transparent text-xs text-on-surface-variant leading-relaxed font-body resize-none outline-none"
                    rows={4}
                    value={activeScene.notes || ''}
                    onChange={(e) => updateSceneNotes(activeScene.id, e.target.value)}
                  />
                </div>
              </div>

              {/* Character Mentions */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[11px] uppercase tracking-widest text-slate-500 font-bold font-headline">Project Entities</h4>
                </div>
                <div className="space-y-4 max-h-40 overflow-y-auto no-scrollbar">
                  {projectCharacters.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No characters added yet.</p>
                  ) : projectCharacters.map(char => (
                    <div key={char.id} className="flex items-center gap-3 group cursor-pointer">
                       <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/30 overflow-hidden shrink-0">
                         <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                       </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-on-surface truncate">{char.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{char.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Writing Goal */}
              <div className="pt-6">
                <div className="bg-gradient-to-br from-surface-container-high to-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2 font-headline">Writing Goal</p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-2xl font-bold text-on-surface">{wordCount.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 mb-1">/ 2,000 words today</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'var(--color-primary)', boxShadow: '0 0 8px rgba(192,193,255,0.4)' }}
                      animate={{ width: `${Math.min((wordCount / 2000) * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="mt-auto p-8 border-t border-outline-variant/5">
              <div className="flex items-center justify-between text-slate-500">
                <button title="Export Manuscript (.txt)" onClick={exportManuscript} className="material-symbols-outlined cursor-pointer hover:text-primary text-on-surface transition-colors bg-surface-container-high p-2 rounded-xl border border-outline-variant/30">
                  download
                </button>
                <button title="View History" className="material-symbols-outlined cursor-pointer hover:text-tertiary transition-colors p-2">
                  history
                </button>
                <button title="More Options" className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors p-2">
                  more_vert
                </button>
              </div>
            </div>
          </aside>
</>
)}
        </div>
      </main>


    </div>
  );
}
