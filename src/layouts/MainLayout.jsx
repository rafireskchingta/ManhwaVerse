import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';
import { OfflineBadge } from '../components/OfflineBadge';
import { InstallPwaBanner } from '../components/InstallPwaBanner';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-manhwa-bg text-manhwa-text">
      <OfflineBadge />
      <InstallPwaBanner />
      <Header />

      {/* Main Content Area: fleksibel mengikuti berbagai ukuran layar */}
      <main className="flex-grow w-full max-w-[96%] xl:max-w-[1560px] mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar (Otomatis hanya muncul di mobile) */}
      <Navbar />
    </div>
  );
};
