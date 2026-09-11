import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';
import type { Scene, Chapter } from '../types/database';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SceneProps {
  scene: Scene;
  startEdit: (id: string, title: string) => void;
  deleteScene: (id: string) => void;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (t: string) => void;
  submitEdit: (id: string, isChapter: boolean) => void;
  updateSceneNotes: (id: string, notes: string) => void;
}

function SortableSceneCard({ scene, startEdit, deleteScene, editingId, editTitle, setEditTitle, submitEdit, updateSceneNotes }: SceneProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: scene.id,
    data: { type: 'scene', chapterId: scene.chapter_id }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4 touch-none group/scene">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-all cursor-grab border border-outline-variant/10 shadow-lg relative"
      >
        <div className="flex justify-between items-start mb-2">
          {editingId === scene.id ? (
            <input
              autoFocus
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => submitEdit(scene.id, false)}
              onKeyDown={e => e.key === 'Enter' && submitEdit(scene.id, false)}
              onPointerDown={e => e.stopPropagation()} // Prevent drag when focusing input
              className="bg-transparent border-b border-primary outline-none text-on-surface text-lg font-body truncate w-[80%]"
            />
          ) : (
            <h3
              onDoubleClick={(e) => { e.stopPropagation(); startEdit(scene.id, scene.title); }}
              className="font-body text-lg text-on-surface truncate pr-4 cursor-text"
            >
              {scene.title}
            </h3>
          )}
          <div className="flex items-center gap-1">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => deleteScene(scene.id)}
              className="opacity-0 group-hover/scene:opacity-100 text-slate-500 hover:text-red-400 p-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
            <span className="material-symbols-outlined text-slate-600 text-[18px]">drag_indicator</span>
          </div>
        </div>
        <textarea
          onPointerDown={e => e.stopPropagation()}
          className="w-full bg-transparent font-body text-sm text-slate-400 placeholder-slate-600 leading-relaxed mb-4 outline-none resize-none border border-transparent focus:border-outline-variant/30 focus:bg-surface/50 rounded-lg p-2 -ml-2 transition-all transition-colors no-scrollbar"
          rows={3}
          value={scene.notes || ''}
          onChange={(e) => updateSceneNotes(scene.id, e.target.value)}
          placeholder="Brief scene summary..."
        />
        <div className="flex items-center justify-between text-[10px] font-label uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">edit_note</span> {scene.word_count || 0} Words
          </span>
        </div>
      </motion.div>
    </div>
  );
}

interface ChapterProps {
  chapter: Chapter;
  index: number;
  scenes: Scene[];
  activeProjectId: string | null;
  createScene: (chapterId: string, projectId: string) => void;
  deleteChapter: (id: string) => void;
  startEdit: (id: string, title: string) => void;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (t: string) => void;
  submitEdit: (id: string, isChapter: boolean) => void;
  deleteScene: (id: string) => void;
  updateSceneNotes: (id: string, notes: string) => void;
}

function SortableChapterColumn({
  chapter, index, scenes, activeProjectId, createScene, deleteChapter,
  startEdit, editingId, editTitle, setEditTitle, submitEdit, deleteScene, updateSceneNotes
}: ChapterProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
    data: { type: 'chapter' }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 40 : 1,
  };

  return (
    <motion.section
      ref={setNodeRef} style={style}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col w-80 h-full flex-shrink-0 group/chapter"
    >
      <div className="mb-6 flex justify-between items-start px-2">
        <div className="flex-1 max-w-[80%]" {...attributes} {...listeners}>
          <span className="font-headline text-[10px] uppercase tracking-widest font-extrabold text-slate-500 cursor-grab">
            <span className="material-symbols-outlined text-[12px] align-middle mr-1">drag_indicator</span> CHAPTER {index + 1}
          </span>
          {editingId === chapter.id ? (
            <input
              autoFocus
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => submitEdit(chapter.id, true)}
              onKeyDown={e => e.key === 'Enter' && submitEdit(chapter.id, true)}
              onPointerDown={e => e.stopPropagation()}
              className="bg-transparent border-b border-primary outline-none text-on-surface text-2xl font-body w-full mt-1"
            />
          ) : (
            <h2
              onDoubleClick={(e) => { e.stopPropagation(); startEdit(chapter.id, chapter.title); }}
              className="font-body text-2xl text-on-surface cursor-text mt-1"
            >
              {chapter.title}
            </h2>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-slate-600 font-label text-xs pb-1">{scenes.length} Scenes</span>
          <button
            onClick={() => deleteChapter(chapter.id)}
            className="opacity-0 group-hover/chapter:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
            title="Delete Chapter"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>

      <div
        className="flex-grow overflow-y-auto pr-2 no-scrollbar"
        id={chapter.id}
      >
        <SortableContext
          items={scenes.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {scenes.map(scene => (
            <SortableSceneCard
              key={scene.id} scene={scene}
              startEdit={startEdit} deleteScene={deleteScene}
              editingId={editingId} editTitle={editTitle}
              setEditTitle={setEditTitle} submitEdit={submitEdit}
              updateSceneNotes={updateSceneNotes}
            />
          ))}

          {scenes.length === 0 && (
            <div className="h-32 border-2 border-dashed border-outline-variant/10 rounded-xl flex items-center justify-center text-slate-600 font-label text-xs uppercase tracking-widest opacity-50 pointer-events-none">
              Empty Chapter
            </div>
          )}
        </SortableContext>

        <button
          onClick={() => activeProjectId && createScene(chapter.id, activeProjectId)}
          className="w-full mt-4 py-4 border-2 border-dashed border-outline-variant/10 rounded-xl text-slate-600 hover:text-slate-400 hover:border-primary/30 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-xs uppercase font-bold tracking-widest">Append Scene</span>
        </button>
      </div>
    </motion.section>
  );
}

export default function Outliner() {
  const {
    activeProjectId, chapters, scenes,
    createChapter, createScene, updateSceneOrder, reorderChapters,
    renameChapter, renameScene, deleteChapter, deleteScene, updateSceneNotes
  } = useProjectStore();

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

  const projectChapters = Object.values(chapters)
    .filter(c => c.project_id === activeProjectId)
    .sort((a, b) => a.sort_order - b.sort_order);

  const scenesByChapter: Record<string, Scene[]> = {};
  projectChapters.forEach(c => {
    scenesByChapter[c.id] = Object.values(scenes)
      .filter(s => s.chapter_id === c.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  });

  const totalWords = Object.values(scenes)
    .filter(s => s.project_id === activeProjectId)
    .reduce((acc, s) => acc + s.word_count, 0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    // Check if what is being dragged is a Chapter
    const activeData = active.data.current;
    if (activeData?.type === 'chapter') {
      if (activeProjectId) {
        reorderChapters(activeProjectId, activeId, overId);
      }
      return;
    }

    // Default: It's a scene being dragged
    const activeScene = scenes[activeId];
    if (!activeScene) return;

    const overScene = scenes[overId];
    // Dropped onto another scene
    if (overScene) {
      updateSceneOrder(activeId, overScene.chapter_id, overScene.sort_order);
    }
    // Dropped onto an empty chapter column container
    else if (chapters[overId]) {
      updateSceneOrder(activeId, overId, 999);
    }
  };

  return (
    <div className="page-shell bg-surface">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-10" />

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-12 relative z-20">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-8 h-full items-start">

            <SortableContext
              items={projectChapters.map(c => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              {projectChapters.map((chapter, ai) => {
                const chapterScenes = scenesByChapter[chapter.id] || [];
                return (
                  <SortableChapterColumn
                    key={chapter.id}
                    chapter={chapter}
                    index={ai}
                    scenes={chapterScenes}
                    activeProjectId={activeProjectId}
                    createScene={createScene}
                    deleteChapter={deleteChapter}
                    startEdit={startEdit}
                    editingId={editingId}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    submitEdit={submitEdit}
                    deleteScene={deleteScene}
                    updateSceneNotes={updateSceneNotes}
                  />
                );
              })}
            </SortableContext>

            {/* New Act Button */}
            <button
              onClick={() => activeProjectId && createChapter(activeProjectId)}
              className="w-80 flex-shrink-0 border-2 border-dashed border-outline-variant/5 rounded-2xl flex flex-col items-center justify-center text-slate-700 hover:text-primary hover:border-primary/20 hover:bg-surface-container-low transition-all"
              style={{ height: 200 }}
            >
              <span className="material-symbols-outlined text-4xl mb-2">low_priority</span>
              <span className="font-label text-xs uppercase font-bold tracking-widest">Extend Structure</span>
            </button>

          </div>
        </DndContext>
      </div>

      {/* Footer status bar */}
      <footer className="h-14 bg-surface-container-low/80 backdrop-blur-md flex items-center justify-between px-12 border-t border-outline-variant/5 flex-shrink-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Autosave Active</span>
          </div>
          <div className="h-4 w-px bg-outline-variant/20" />
          <p className="font-body text-sm text-slate-300 italic">"The ink is just the blood of the imagination..."</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-label text-slate-500 uppercase tracking-tighter">Total Word Count</span>
            <span className="font-body text-lg leading-none text-primary">{totalWords.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-label text-slate-500 uppercase tracking-tighter">Chapters</span>
            <span className="font-body text-lg leading-none text-tertiary">{projectChapters.length}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
