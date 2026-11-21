import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBadge = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-800 text-amber-50 px-4 py-2 text-xs text-center flex items-center justify-center gap-2 border-b border-amber-900 transition-smooth">
      <WifiOff className="w-4 h-4" />
      <span>
        Anda sedang offline. Menampilkan antarmuka yang tersimpan di cache lokal.
      </span>
    </div>
  );
};
