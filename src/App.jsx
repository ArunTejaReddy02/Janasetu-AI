import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RankingProvider } from './context/RankingContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SubmissionsPage from './pages/SubmissionsPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import SubmitPage from './pages/SubmitPage';

function DashboardLayout({ searchQuery, onSearch }) {
  return (
    <div className="bg-background text-on-background font-[Geist] selection:bg-primary/30 overflow-hidden">
      <Sidebar />
      <Header onSearch={onSearch} searchQuery={searchQuery} />
      <main className="ml-[72px] mt-16 p-[12px] h-[calc(100vh-64px)] relative z-10 overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/submissions" element={<SubmissionsPage searchQuery={searchQuery} />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <RankingProvider>
      <Routes>
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/*" element={<DashboardLayout searchQuery={searchQuery} onSearch={setSearchQuery} />} />
      </Routes>
    </RankingProvider>
  );
}
