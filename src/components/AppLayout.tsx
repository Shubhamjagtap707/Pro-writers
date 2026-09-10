import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import GlobalSidebar from './GlobalSidebar';
import ProjectSidebar from './ProjectSidebar';
import TopBar from './TopBar';
import FAB from './FAB';

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0, 0, 0.2, 1] as any } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export default function AppLayout() {
  const location = useLocation();

  const isGlobalRoute = ['/', '/templates', '/archive', '/help'].includes(location.pathname);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-surface">
      {/* ── Sidebar (Contextual) ── */}
      <AnimatePresence mode="popLayout">
        {!isGlobalRoute ? (
          <ProjectSidebar key="project-sidebar" />
        ) : (
          <GlobalSidebar key="global-sidebar" />
        )}
      </AnimatePresence>

      {/* ── Main area: TopBar + page content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Single shared TopBar — rendered once for all pages */}
        <TopBar />

        {/* Page content with enter/exit animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="flex-1 flex flex-col min-w-0 overflow-hidden"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <FAB tooltip="Quick Action" />
      </div>
    </div>
  );
}
