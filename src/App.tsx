import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProjectContextWrapper from './components/ProjectContextWrapper';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Outliner from './pages/Outliner';
import Characters from './pages/Characters';
import CharacterProfile from './pages/CharacterProfile';
import WorldBuilding from './pages/WorldBuilding';
import AiMuseLab from './pages/AiMuseLab';
import ContinuityChecker from './pages/ContinuityChecker';
import RelationshipMap from './pages/RelationshipMap';
import ArcTracker from './pages/ArcTracker';
import CharacterTimeline from './pages/CharacterTimeline';
import Progress from './pages/Progress';
import LocationTracker from './pages/LocationTracker';
import Critique from './pages/Critique';
import Templates from './pages/Templates';
import Archive from './pages/Archive';
import Help from './pages/Help';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Global Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/help" element={<Help />} />

              {/* Fallback to bounce old flat routes */}
              <Route path="/editor" element={<Navigate to="/" replace />} />

              {/* Dynamic Project Context Routes */}
              <Route path="/:projectSlug" element={<ProjectContextWrapper />}>
                <Route index element={<Navigate to="editor" replace />} />
                <Route path="editor" element={<Editor />} />
                <Route path="outliner" element={<Outliner />} />
                <Route path="characters" element={<Characters />} />
                <Route path="characters/:id" element={<CharacterProfile />} />
                <Route path="world" element={<WorldBuilding />} />
                <Route path="ai-muse" element={<AiMuseLab />} />
                <Route path="continuity" element={<ContinuityChecker />} />
                <Route path="relationships" element={<RelationshipMap />} />
                <Route path="arc-tracker" element={<ArcTracker />} />
                <Route path="locations" element={<LocationTracker />} />
                <Route path="timeline" element={<CharacterTimeline />} />
                <Route path="critique" element={<Critique />} />
                <Route path="progress" element={<Progress />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
