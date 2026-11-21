import React from 'react';
import { BookOpen } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Memuat data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-manhwa-border border-t-manhwa-accent animate-spin" />
        <BookOpen className="w-5 h-5 text-manhwa-accent" />
      </div>
      <p className="mt-3 text-xs text-manhwa-muted font-sans tracking-wide">
        {message}
      </p>
    </div>
  );
};
