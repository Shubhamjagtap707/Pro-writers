import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const coreNav: NavItem[] = [
  { path: 'editor', icon: 'edit_note', label: 'Editor' },
  { path: 'outliner', icon: 'account_tree', label: 'Outline' },
  { path: 'characters', icon: 'group', label: 'Characters' },
  { path: 'factions', icon: 'shield', label: 'Factions & Groups' },
  { path: 'world', icon: 'public', label: 'World-Building' },
  { path: 'ai-muse', icon: 'auto_awesome', label: 'AI Muse Lab' },
];

const toolsNav: NavItem[] = [
  { path: 'continuity', icon: 'warning', label: 'Continuity' },
  { path: 'relationships', icon: 'share', label: 'Relationships' },
  { path: 'arc-tracker', icon: 'trending_up', label: 'Arc Tracker' },
  { path: 'locations', icon: 'location_on', label: 'Locations' },
  { path: 'timeline', icon: 'timeline', label: 'Timeline' },
  { path: 'critique', icon: 'rate_review', label: 'Critique' },
  { path: 'progress', icon: 'bar_chart', label: 'Progress' },
];

const sidebarVariants = {
  hidden: { x: -24, opacity: 0, width: 0 },
  visible: (isMinimized: boolean) => ({ 
    x: 0, 
    opacity: 1, 
    width: isMinimized ? 88 : 256, 
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as any } 
  }),
  exit: { x: -24, opacity: 0, width: 0, transition: { duration: 0.2 } },
};

export default function ProjectSidebar() {
  const { activeProjectId, projects, setActiveProject, renameProject } = useProjectStore();
  const navigate = useNavigate();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const startEdit = () => {
    if (!activeProject || isMinimized) return;
    setEditTitle(activeProject.title);
    setIsEditingTitle(true);
  };

  const submitEdit = () => {
    if (!activeProject) return;
    if (editTitle.trim()) {
      renameProject(activeProject.id, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  if (!activeProject) return null;

  return (
    <motion.aside
      custom={isMinimized}
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen flex flex-col py-8 bg-surface-container-low z-40 rounded-r-3xl overflow-hidden shrink-0 border-r border-surface-container/50 relative"
    >
      {/* Project Header */}
      <div className={`mb-8 relative px-6 flex flex-col ${isMinimized ? 'items-center' : ''}`}>
        <button 
          onClick={() => { setActiveProject(null); navigate('/'); }}
          className={`text-slate-500 hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container ${isMinimized ? 'p-3' : 'absolute -top-4 -left-2 p-2'}`}
          title="Return to Library"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        
        {!isMinimized && (
          <div className="pl-8 group">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold font-headline mb-1">Active Project</p>
            {isEditingTitle ? (
              <input 
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={submitEdit}
                onKeyDown={e => e.key === 'Enter' && submitEdit()}
                className="bg-transparent border-b border-primary outline-none text-on-surface text-xl tracking-tight font-body w-full truncate"
              />
            ) : (
              <div className="flex items-center gap-1 cursor-text" onDoubleClick={startEdit}>
                <h2 className="text-xl font-bold text-on-surface tracking-tight font-body leading-tight truncate" title={activeProject.title}>
                  {activeProject.title}
                </h2>
                <span className="material-symbols-outlined text-[14px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
              </div>
            )}
            <div className="mt-4 flex items-center justify-start flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-[10px] text-on-secondary-container capitalize tracking-wider border border-secondary-container/30 font-bold font-headline select-none">
                 {activeProject.genre === 'Unassigned' ? activeProject.template : activeProject.genre}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main App Navigation */}
      <nav className={`flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar pb-4 ${isMinimized ? 'px-3' : 'px-6 min-w-[208px]'}`}>
        {coreNav.map(item => {
          const destination = `/${activeProject.slug}/${item.path}`;
          return (
          <NavLink
            key={item.path}
            to={destination}
            title={isMinimized ? item.label : undefined}
            className={({ isActive: active }) =>
              `group flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-300 ease-out ${isMinimized ? 'justify-center px-0' : 'px-4'} ${active
                ? 'bg-surface-container text-primary font-semibold border-l-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            {({ isActive: active }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                {!isMinimized && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        )})}

        {/* Separator / Tools Category */}
        <div className={`mt-6 mb-2 ${isMinimized ? 'text-center' : 'px-2'}`}>
          {!isMinimized ? (
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold font-headline truncate">Project Tools</p>
          ) : (
            <div className="h-px bg-slate-800 w-full" />
          )}
        </div>

        {toolsNav.map(item => {
          const destination = `/${activeProject.slug}/${item.path}`;
          return (
          <NavLink
            key={item.path}
            to={destination}
            title={isMinimized ? item.label : undefined}
            className={({ isActive: active }) =>
              `group flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all duration-300 ease-out ${isMinimized ? 'justify-center px-0' : 'px-4'} ${active
                ? 'bg-surface-container text-primary font-semibold border-l-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            {({ isActive: active }) => (
              <>
                <span className="material-symbols-outlined text-[18px]"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                {!isMinimized && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        )})}
      </nav>
      
      <div className="px-4 mt-auto">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-full flex items-center justify-center p-3 text-slate-500 hover:text-primary transition-colors rounded-xl hover:bg-surface-container bg-surface-container-lowest/50"
          title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
        >
          <span className="material-symbols-outlined">
            {isMinimized ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>
    </motion.aside>
  );
}
