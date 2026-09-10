import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { useAuth } from '../lib/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

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
  const navigate = useNavigate();
  const { activeProjectId, projects, characters, worldItems } = useProjectStore();
  const { user, signOut } = useAuth();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ id: string; type: string; title: string; subtitle?: string; path: string }> = [];

    // Projects
    Object.values(projects).forEach(p => {
      if (p.title.toLowerCase().includes(query)) {
        results.push({ id: p.id, type: 'Project', title: p.title, path: `/${p.slug}` });
      }
    });

    // Characters
    Object.values(characters).forEach(c => {
      if (c.name.toLowerCase().includes(query)) {
        const p = projects[c.project_id];
        results.push({ 
          id: c.id,
          type: 'Character', 
          title: c.name, 
          subtitle: p?.title, 
          path: p ? `/${p.slug}/characters` : '#' 
        });
      }
    });

    // World Items
    Object.values(worldItems).forEach(w => {
      if (w.name.toLowerCase().includes(query)) {
        const p = projects[w.project_id];
        results.push({ 
          id: w.id,
          type: 'World', 
          title: w.name, 
          subtitle: p?.title, 
          path: p ? `/${p.slug}/world` : '#' 
        });
      }
    });

    return results.slice(0, 8); // Limit to top 8
  }, [searchQuery, projects, characters, worldItems]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

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
        <div className="relative hidden lg:flex items-center" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
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

          <AnimatePresence>
            {showSearch && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 w-64 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, i) => (
                      <button
                        key={`${result.type}-${result.id}-${i}`}
                        onClick={() => {
                          navigate(result.path);
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-surface-container-highest transition-colors flex flex-col gap-0.5"
                      >
                        <span className="text-sm text-on-surface font-medium flex items-center gap-2">
                          {result.title}
                        </span>
                        <span className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold tracking-wider text-[9px] uppercase">
                            {result.type}
                          </span>
                          {result.subtitle && <span>• {result.subtitle}</span>}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-on-surface-variant">
                    No results found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-200
              ${showSettingsMenu ? 'text-primary bg-surface-container-high' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}
            `}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          
          <AnimatePresence>
            {showSettingsMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    Account Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">palette</span>
                    Appearance
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">keyboard</span>
                    Shortcuts
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-outline-variant/20 mx-1" />

        {/* User avatar */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`
              w-8 h-8 rounded-full
              bg-surface-container-high
              border ${showProfileMenu ? 'border-primary' : 'border-primary/20'}
              flex items-center justify-center
              text-[11px] font-headline font-bold text-primary
              cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all duration-200
            `}
          >
            {userInitials}
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-outline-variant/10">
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {user?.user_metadata?.full_name || 'Pro Writer'}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Your Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                    Upgrade Plan
                  </button>
                  <div className="h-px bg-outline-variant/10 my-1" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
