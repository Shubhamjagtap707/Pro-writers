import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'framer-motion';

const globalNav = [
  { to: '/', icon: 'book_4', label: 'Library', end: true },
  { to: '/templates', icon: 'library_books', label: 'Templates' },
  { to: '/archive', icon: 'inventory_2', label: 'Archive' },
  { to: '/help', icon: 'help_outline', label: 'Help' },
];

const sidebarVariants = {
  hidden: { x: -24, opacity: 0, width: 0 },
  visible: { x: 0, opacity: 1, width: 256, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as any } },
  exit: { x: -24, opacity: 0, width: 0, transition: { duration: 0.2 } },
};

export default function GlobalSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen w-64 flex-shrink-0 flex flex-col py-8 px-6 bg-surface-container-low z-40 rounded-r-3xl border-r border-surface-container/50"
    >
      {/* Brand */}
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-primary-container">
            <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>ink_pen</span>
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight font-headline">Pro Writers</h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-headline pl-11">Global Dashboard</p>
      </div>

      {/* New Project */}
      <button onClick={() => navigate('/templates')} className="mb-6 w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity active:scale-95">
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span className="text-sm">New Project</span>
      </button>

      {/* Primary Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar">
        {globalNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive: active }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ease-out ${active
                ? 'bg-surface-container text-primary font-semibold border-r-2 border-primary'
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
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-1">
        <div className="flex items-center gap-3 px-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center ring-2 ring-primary/20 overflow-hidden">
            <span className="text-sm font-bold text-primary">{userInitials}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-on-surface truncate">{user?.user_metadata?.full_name || user?.email || 'Pro Writer'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">Creator</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
