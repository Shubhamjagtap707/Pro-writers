import { useEffect } from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';

export default function ProjectContextWrapper() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const { projects, activeProjectId, setActiveProject } = useProjectStore();

  // Find project by slug
  const project = Object.values(projects).find(p => p.slug === projectSlug);

  useEffect(() => {
    // If the URL specifies a valid project that isn't currently active, sync it!
    if (project && activeProjectId !== project.id) {
      setActiveProject(project.id);
    }
  }, [project, activeProjectId, setActiveProject]);

  // If the slug doesn't match any project, bounce them back to the library securely
  if (!project) {
    return <Navigate to="/" replace />;
  }

  // The project exists, so we allow the nested routes to render.
  return <Outlet />;
}
