import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const InstallPwaBanner = () => {
  const { isInstallable, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="bg-manhwa-surface border-b border-manhwa-border px-4 py-2.5 transition-smooth">
      <div className="w-full max-w-[96%] xl:max-w-[1560px] mx-auto px-2 sm:px-4 md:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-manhwa-accent text-white flex items-center justify-center flex-shrink-0">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-manhwa-text">
              Pasang Aplikasi ManhwaVerse
            </p>
            <p className="text-xs md:text-sm text-manhwa-muted">
              Akses cepat direktori dan pelacak bacaan di perangkat Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={installApp}
            className="px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth shadow-xs cursor-pointer"
          >
            Instal
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md text-manhwa-muted hover:text-manhwa-text transition-smooth"
            aria-label="Tutup Banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
