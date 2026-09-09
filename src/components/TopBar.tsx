import { useLocation, NavLink } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';

/** Map route → display title (used in the top bar centre title) */
const PAGE_TITLES: Record<string, string> = {
  '/':              'Library',
  '/editor':        'Editor',
  '/outliner':      'Outliner',
  '/characters':    'Characters',
  '/world':         'World-Building Hub',
  '/ai-muse':       'AI Muse Lab',
  '/continuity':    'Continuity Checker',
  '/relationships': 'Relationship Map',
  '/arc-tracker':   'Arc Tracker',
  '/locations':     'Location Tracker',
  '/timeline':      'Character Timeline',
  '/critique':      'Manuscript Critique',
  '/templates':     'Template Library',
  '/progress':      'Editorial Pulse',
  '/archive':       'Archive',
  '/help':          'Help & Support',
};

/** Top-level nav tabs shown next to the title */
const NAV_TABS = [
  { label: 'Manuscript', path: 'editor' },
  { label: 'Characters', path: 'characters' },
  { label: 'World',      path: 'world' },
  { label: 'Tools',      path: 'continuity' },
];

export default function TopBar() {
  const location = useLocation();
  const { activeProjectId, projects } = useProjectStore();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;

  // Find title by matching exact paths or endpoints of paths
  const title =
    Object.entries(PAGE_TITLES)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) =>
        path === '/'
          ? location.pathname === '/'
          : location.pathname.endsWith(path) || location.pathname.includes(path)
      )?.[1] ?? 'Pro Writers';

  return (
    <header className="
      flex items-center justify-between
      w-full flex-shrink-0
      h-16 px-8
      bg-surface/60 backdrop-blur-xl
      border-b border-outline-variant/10
      z-50
    ">
      {/* Left — page title + secondary nav */}
      <div className="flex items-center gap-8">
        <span className="text-base font-headline font-bold text-primary tracking-tight">
          {title}
        </span>

        <nav className="hidden md:flex items-center gap-1">
          {activeProject && NAV_TABS.map(tab => {
            const destination = `/${activeProject.slug}/${tab.path}`;
            const active = location.pathname.includes(`/${tab.path}`);
            return (
              <NavLink
                key={tab.path}
                to={destination}
                className={`
                  px-3 py-1 rounded-lg text-[11px] font-headline font-semibold
                  uppercase tracking-[0.06em] transition-all duration-200
                  ${active
                    ? 'text-primary bg-primary/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }
                `}
              >
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Right — search · bell · avatar */}
      <div className="flex items-center gap-3">
        {/* Search pill */}
        <div className="relative hidden lg:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search…"
            className="
              bg-surface-container-low rounded-full
              pl-9 pr-4 py-1.5
              text-[13px] font-label text-on-surface
              placeholder-outline w-52
              border border-outline-variant/10
              focus:outline-none focus:ring-1 focus:ring-primary/40
              transition-all duration-200 focus:w-64
            "
          />
        </div>

        {/* Notification bell */}
        <button className="
          w-8 h-8 rounded-full flex items-center justify-center
          text-on-surface-variant hover:text-primary hover:bg-surface-container-high
          transition-all duration-200
        ">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>

        {/* Settings */}
        <button className="
          w-8 h-8 rounded-full flex items-center justify-center
          text-on-surface-variant hover:text-primary hover:bg-surface-container-high
          transition-all duration-200
        ">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-outline-variant/20 mx-1" />

        {/* User avatar */}
        <div className="
          w-8 h-8 rounded-full
          bg-surface-container-high
          border border-primary/20
          flex items-center justify-center
          text-[11px] font-headline font-bold text-primary
          cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all duration-200
        ">
          JT
        </div>
      </div>
    </header>
  );
}
