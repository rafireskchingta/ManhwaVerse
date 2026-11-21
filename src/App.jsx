import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { CharactersPage } from './pages/CharactersPage';
import { TrackerPage } from './pages/TrackerPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComicDetailPage } from './pages/ComicDetailPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminTrashPage } from './pages/AdminTrashPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* 5 Halaman Utama (Bottom Navigation Bar) */}
            <Route index element={<HomePage />} />
            <Route path="characters" element={<CharactersPage />} />
            <Route path="tracker" element={<TrackerPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* 2 Halaman Detail */}
            <Route path="comics/:id" element={<ComicDetailPage />} />
            <Route path="characters/:id" element={<CharacterDetailPage />} />

            {/* Autentikasi */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Panel Manajemen Khusus Admin */}
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/trash" element={<AdminTrashPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
