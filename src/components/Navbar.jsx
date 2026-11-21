import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, BookmarkCheck, Compass, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/', label: 'Komik', icon: BookOpen, end: true },
    { to: '/characters', label: 'Karakter', icon: Users },
    { to: '/tracker', label: 'Bacaan', icon: BookmarkCheck },
    ...(isAdmin
      ? [{ to: '/admin', label: 'Kelola', icon: ShieldAlert }]
      : [{ to: '/discover', label: 'Temukan', icon: Compass }]),
    { to: '/profile', label: 'Profil', icon: User }
  ];

  return (
    // Hanya tampil di mobile (< 768px), tersembunyi di desktop
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-manhwa-card/95 backdrop-blur-md border-t border-manhwa-border transition-smooth shadow-elevated">
      <div className="max-w-md mx-auto px-2">
        <ul className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-smooth text-center group ${
                      isActive
                        ? 'text-manhwa-accent font-semibold'
                        : 'text-manhwa-muted hover:text-manhwa-text'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`p-1 rounded-lg transition-smooth ${
                          isActive
                            ? 'bg-manhwa-accent/10 text-manhwa-accent scale-105'
                            : 'group-hover:bg-manhwa-surface'
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="text-xs mt-0.5 tracking-tight font-sans font-medium">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
