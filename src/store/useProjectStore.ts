import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Chapter, Scene, Character, WorldItem, Series } from '../types/database';

interface ProjectState {
  projects: Record<string, Project>;
  chapters: Record<string, Chapter>;
  scenes: Record<string, Scene>;
  characters: Record<string, Character>;
  worldItems: Record<string, WorldItem>;
  series: Record<string, Series>;
  activeProjectId: string | null;

  // Actions
  setActiveProject: (id: string | null) => void;
  createProject: (template: string, title: string, seriesId?: string) => string;
  createSeries: (title: string) => string;
  renameProject: (id: string, newTitle: string) => void;
  updateProjectGenre: (id: string, newGenre: string) => void;
  updateProjectSeries: (id: string, seriesId: string | undefined) => void;
  deleteProject: (id: string) => void;
  deleteSeries: (id: string) => void;
  createChapter: (projectId: string) => void;
  createScene: (chapterId: string, projectId: string) => string;
  renameChapter: (id: string, newTitle: string) => void;
  renameScene: (id: string, newTitle: string) => void;
  deleteChapter: (id: string) => void;
  deleteScene: (id: string) => void;
  updateSceneOrder: (sceneId: string, newChapterId: string, newSortOrder: number) => void;
  reorderChapters: (projectId: string, activeId: string, overId: string) => void;
  updateSceneContent: (sceneId: string, content: string) => void;
  updateSceneNotes: (sceneId: string, notes: string) => void;
  createCharacter: (project_id: string, char: Omit<Character, 'id' | 'project_id' | 'series_id'>, seriesId?: string) => string;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  createWorldItem: (project_id: string, item: Omit<WorldItem, 'id' | 'project_id' | 'series_id'>, seriesId?: string) => void;
  deleteWorldItem: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: {},
      chapters: {},
      scenes: {},
      characters: {},
      worldItems: {},
      series: {},
      activeProjectId: null,


      setActiveProject: (id) => set({ activeProjectId: id }),

      createSeries: (title) => {
        const seriesId = crypto.randomUUID();
        const newSeries: Series = {
          id: seriesId,
          created_at: new Date().toISOString(),
          title: title.trim() || 'Untitled Series',
        };
        set(state => ({ series: { ...state.series, [seriesId]: newSeries } }));
        return seriesId;
      },

      createProject: (template, title, seriesId) => {
        const projectId = crypto.randomUUID();
        const shortId = projectId.split('-')[0];
        const baseTitle = title.trim() || 'Untitled Draft';
        const rawSlug = baseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Handle empty strings completely turning into shortIds
        const slug = (rawSlug === '' || rawSlug === '-') ? shortId : `${rawSlug}-${shortId}`;

        const templateMap: Record<string, string> = {
          'novel': 'Novel',
          'screenplay': 'Screenplay',
          'short': 'Short Story'
        };

        const newProject: Project = {
          id: projectId,
          created_at: new Date().toISOString(),
          title: baseTitle,
          slug,
          genre: templateMap[template] || 'Novel',
          template,
          series_id: seriesId,
          last_edited_at: new Date().toISOString(),
        };

        const chapterId = crypto.randomUUID();
        const initialChapter: Chapter = {
          id: chapterId,
          project_id: projectId,
          title: 'Chapter 1',
          sort_order: 1,
        };

        const sceneId = crypto.randomUUID();
        const initialScene: Scene = {
          id: sceneId,
          chapter_id: chapterId,
          project_id: projectId,
          title: 'Scene 1',
          content: '',
          word_count: 0,
          sort_order: 1,
        };

        set((state) => ({
          projects: { ...state.projects, [projectId]: newProject },
          chapters: { ...state.chapters, [chapterId]: initialChapter },
          scenes: { ...state.scenes, [sceneId]: initialScene },
          activeProjectId: projectId,
        }));

        return projectId;
      },

      deleteSeries: (id) => set(state => {
        const nextSeries = { ...state.series };
        delete nextSeries[id];

        // Unlink projects
        const nextProjects = { ...state.projects };
        Object.keys(nextProjects).forEach(pid => {
          if (nextProjects[pid].series_id === id) {
            nextProjects[pid].series_id = undefined;
          }
        });

        // Optional: Clean up series assets
        const nextChars = { ...state.characters };
        Object.keys(nextChars).forEach(cid => {
          if (nextChars[cid].series_id === id) {
            nextChars[cid].series_id = undefined;
          }
        });

        const nextWorldItems = { ...state.worldItems };
        Object.keys(nextWorldItems).forEach(wid => {
          if (nextWorldItems[wid].series_id === id) {
            nextWorldItems[wid].series_id = undefined;
          }
        });

        return {
          series: nextSeries,
          projects: nextProjects,
          characters: nextChars,
          worldItems: nextWorldItems
        };
      }),

      renameProject: (id, newTitle) => set(state => {
        const project = state.projects[id];
        if (!project) return state;
        return {
          projects: {
            ...state.projects,
            [id]: { ...project, title: newTitle, last_edited_at: new Date().toISOString() },
          }
        };
      }),

      updateProjectGenre: (id, newGenre) => set(state => {
        const project = state.projects[id];
        if (!project) return state;
        return {
          projects: {
            ...state.projects,
            [id]: { ...project, genre: newGenre, last_edited_at: new Date().toISOString() },
          }
        };
      }),

      updateProjectSeries: (id, seriesId) => set(state => {
        const project = state.projects[id];
        if (!project) return state;
        return {
          projects: {
            ...state.projects,
            [id]: { ...project, series_id: seriesId, last_edited_at: new Date().toISOString() },
          }
        };
      }),

      deleteProject: (id) => set((state) => {
        const projectToDelete = state.projects[id];
        const nextProjects = { ...state.projects };
        delete nextProjects[id];

        const nextChapters = { ...state.chapters };
        Object.keys(nextChapters).forEach(k => { if (nextChapters[k].project_id === id) delete nextChapters[k]; });

        const nextScenes = { ...state.scenes };
        Object.keys(nextScenes).forEach(k => { if (nextScenes[k].project_id === id) delete nextScenes[k]; });

        // Auto-cleanup Series if empty
        const nextSeries = { ...state.series };
        if (projectToDelete?.series_id) {
          const seriesId = projectToDelete.series_id;
          const otherProjectsInSeries = Object.values(nextProjects).some(p => p.series_id === seriesId);
          if (!otherProjectsInSeries) {
            delete nextSeries[seriesId];
          }
        }

        return {
          projects: nextProjects,
          chapters: nextChapters,
          scenes: nextScenes,
          series: nextSeries,
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        };
      }),

      createChapter: (projectId) => set((state) => {
        const chapterId = crypto.randomUUID();
        const existingChapters = Object.values(state.chapters).filter(c => c.project_id === projectId);
        const nextOrder = existingChapters.length > 0 ? Math.max(...existingChapters.map(c => c.sort_order)) + 1 : 1;
        const nextDisplayNumber = existingChapters.length + 1;

        const newChapter: Chapter = {
          id: chapterId,
          project_id: projectId,
          title: `Chapter ${nextDisplayNumber}`,
          sort_order: nextOrder,
        };
        const project = state.projects[projectId];
        return { 
          chapters: { ...state.chapters, [chapterId]: newChapter },
          projects: project ? { ...state.projects, [projectId]: { ...project, last_edited_at: new Date().toISOString() } } : state.projects
        };
      }),

      createScene: (chapterId, projectId) => {
        const sceneId = crypto.randomUUID();
        set((state) => {
          const existingScenes = Object.values(state.scenes).filter(s => s.chapter_id === chapterId);
          const nextOrder = existingScenes.length > 0 ? Math.max(...existingScenes.map(s => s.sort_order)) + 1 : 1;

          const newScene: Scene = {
            id: sceneId,
            chapter_id: chapterId,
            project_id: projectId,
            title: `Scene ${nextOrder}`,
            content: '',
            word_count: 0,
            sort_order: nextOrder,
          };
          const project = state.projects[projectId];
          return { 
            scenes: { ...state.scenes, [sceneId]: newScene },
            projects: project ? { ...state.projects, [projectId]: { ...project, last_edited_at: new Date().toISOString() } } : state.projects
          };
        });
        return sceneId;
      },

      renameChapter: (id, newTitle) => set(state => {
        const chapter = state.chapters[id];
        if (!chapter) return state;
        const project = state.projects[chapter.project_id];
        return {
          chapters: { ...state.chapters, [id]: { ...chapter, title: newTitle } },
          projects: project ? { ...state.projects, [chapter.project_id]: { ...project, last_edited_at: new Date().toISOString() } } : state.projects
        };
      }),
      
      renameScene: (id, newTitle) => set(state => {
        const scene = state.scenes[id];
        if (!scene) return state;
        const project = state.projects[scene.project_id];
        return {
          scenes: { ...state.scenes, [id]: { ...scene, title: newTitle } },
          projects: project ? { ...state.projects, [scene.project_id]: { ...project, last_edited_at: new Date().toISOString() } } : state.projects
        };
      }),

      deleteChapter: (id) => set(state => {
        const nextChapters = { ...state.chapters };
        delete nextChapters[id];
        const nextScenes = { ...state.scenes };
        Object.keys(nextScenes).forEach(k => { if (nextScenes[k].chapter_id === id) delete nextScenes[k]; });
        return { chapters: nextChapters, scenes: nextScenes };
      }),

      deleteScene: (id) => set(state => {
        const nextScenes = { ...state.scenes };
        delete nextScenes[id];
        return { scenes: nextScenes };
      }),

      updateSceneOrder: (sceneId, newChapterId, newSortOrder) => set(state => {
        const scene = state.scenes[sceneId];
        if (!scene) return state;
        return {
          scenes: {
            ...state.scenes,
            [sceneId]: { ...scene, chapter_id: newChapterId, sort_order: newSortOrder }
          }
        };
      }),

      reorderChapters: (projectId, activeId, overId) => set(state => {
        const sortedChapters = Object.values(state.chapters)
          .filter(c => c.project_id === projectId)
          .sort((a, b) => a.sort_order - b.sort_order);

        const oldIndex = sortedChapters.findIndex(c => c.id === activeId);
        const newIndex = sortedChapters.findIndex(c => c.id === overId);

        if (oldIndex === -1 || newIndex === -1) return state;

        // Move the item
        const item = sortedChapters.splice(oldIndex, 1)[0];
        sortedChapters.splice(newIndex, 0, item);

        // Re-assign monotonically increasing sort_orders
        const nextChapters = { ...state.chapters };
        sortedChapters.forEach((chapter, index) => {
          nextChapters[chapter.id] = { ...chapter, sort_order: index + 1 };
        });

        return { chapters: nextChapters };
      }),

      createCharacter: (projectId, char, seriesId) => {
        const id = crypto.randomUUID();
        set(state => ({
          characters: { ...state.characters, [id]: { ...char, id, project_id: projectId, series_id: seriesId } }
        }));
        return id;
      },

      updateCharacter: (id, updates) => set(state => {
        const character = state.characters[id];
        if (!character) return state;
        return {
          characters: {
            ...state.characters,
            [id]: { ...character, ...updates }
          }
        };
      }),

      deleteCharacter: (id) => set(state => {
        const nextChars = { ...state.characters };
        delete nextChars[id];
        return { characters: nextChars };
      }),

      createWorldItem: (projectId, item, seriesId) => set(state => {
        const id = crypto.randomUUID();
        return { worldItems: { ...state.worldItems, [id]: { ...item, id, project_id: projectId, series_id: seriesId } } };
      }),

      deleteWorldItem: (id) => set(state => {
        const nextItems = { ...state.worldItems };
        delete nextItems[id];
        return { worldItems: nextItems };
      }),

      updateSceneContent: (sceneId, content) => {
        set((state) => {
          const scene = state.scenes[sceneId];
          if (!scene) return state;

          const project = state.projects[scene.project_id];
          const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

          return {
            scenes: {
              ...state.scenes,
              [sceneId]: {
                ...scene,
                content,
                word_count: wordCount,
              },
            },
            projects: project ? { ...state.projects, [scene.project_id]: { ...project, last_edited_at: new Date().toISOString() } } : state.projects
          };
        });
      },

      updateSceneNotes: (sceneId, notes) => {
        set((state) => {
          const scene = state.scenes[sceneId];
          if (!scene) return state;

          const project = state.projects[scene.project_id];
          return {
            scenes: {
              ...state.scenes,
              [sceneId]: { ...scene, notes },
            },
            projects: project ? { ...state.projects, [scene.project_id]: { ...project, last_edited_at: new Date().toISOString() } } : state.projects
          };
        });
      },

    }),
    {
      name: 'pro-writers-storage',
    }
  )
);
