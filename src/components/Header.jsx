import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BookmarkCheck,
  Compass,
  User,
  ShieldAlert,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const Header = () => {
  const { user, isAdmin } = useAuth();
  const isOnline = useOnlineStatus();

  const navLinks = [
    { to: '/', label: 'Komik', icon: BookOpen, end: true },
    { to: '/characters', label: 'Karakter', icon: Users },
    { to: '/tracker', label: 'Bacaan Saya', icon: BookmarkCheck },
    { to: '/discover', label: 'Temukan', icon: Compass },
    ...(isAdmin ? [{ to: '/admin', label: 'Kelola', icon: ShieldAlert }] : []),
    { to: '/profile', label: 'Profil', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 bg-manhwa-card/95 backdrop-blur-sm border-b border-manhwa-border transition-smooth shadow-xs">
      <div className="w-full max-w-[96%] xl:max-w-[1560px] mx-auto px-2 sm:px-4 md:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-manhwa-accent flex items-center justify-center text-white shadow-soft transition-smooth group-hover:bg-manhwa-accent-hover">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-manhwa-text tracking-normal leading-tight">
                ManhwaVerse
              </h1>
              {isAdmin && (
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-manhwa-accent/10 text-manhwa-accent border border-manhwa-accent/20">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-manhwa-muted tracking-wide font-sans hidden sm:block">
              Temukan Ceritamu, Catat Perjalananmu
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links (Tampil di Desktop, Tersembunyi di Mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-smooth ${
                    isActive
                      ? 'bg-manhwa-accent text-white font-semibold shadow-xs'
                      : 'text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-surface'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Status & Quick Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs md:text-sm border border-amber-200">
              <WifiOff className="w-4 h-4" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-manhwa-surface transition-smooth"
              title={user.name}
            >
              <div className="w-9 h-9 rounded-full bg-manhwa-accent/15 text-manhwa-accent font-serif font-bold flex items-center justify-center text-sm border border-manhwa-border">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth shadow-xs"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
