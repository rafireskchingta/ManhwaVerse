import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Plus, Minus, X, Check, BookOpen, Sparkles } from 'lucide-react';

export const QuickProgressModal = ({
  isOpen,
  onClose,
  comic,
  currentChapter = 0,
  onSaveProgress
}) => {
  const [chapter, setChapter] = useState(currentChapter || 1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Default ke chapter berikutnya atau chapter 1
      const nextCh = currentChapter > 0 ? currentChapter + 1 : 1;
      const maxCh = comic?.total_chapters || 9999;
      setChapter(Math.min(nextCh, maxCh));
    }
  }, [isOpen, currentChapter, comic]);

  if (!isOpen || !comic) return null;

  const maxChapters = comic.total_chapters > 0 ? comic.total_chapters : 9999;

  const handleIncrement = (amount = 1) => {
    setChapter((prev) => Math.min(prev + amount, maxChapters));
  };

  const handleDecrement = (amount = 1) => {
    setChapter((prev) => Math.max(prev - amount, 1));
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setChapter('');
    } else {
      setChapter(Math.max(0, Math.min(val, maxChapters)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCh = Number(chapter) || 1;
    setIsSaving(true);
    try {
      await onSaveProgress(finalCh);
      onClose();
    } catch (err) {
      console.error('Error saat menyimpan progres cepat:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-manhwa-card w-full max-w-sm rounded-2xl border border-manhwa-border shadow-elevated overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 md:p-5 border-b border-manhwa-border bg-manhwa-surface/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-manhwa-accent/15 text-manhwa-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-manhwa-text">
                Selamat Datang Kembali!
              </h3>
              <p className="text-[11px] text-manhwa-muted">
                Catat chapter terakhir yang baru saja kamu baca
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-highlight transition-smooth"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
          <div>
            <p className="text-xs text-manhwa-muted font-medium mb-0.5">Komik</p>
            <h4 className="font-serif font-bold text-sm text-manhwa-text truncate">
              {comic.title}
            </h4>
            {currentChapter > 0 && (
              <p className="text-[11px] text-manhwa-muted mt-0.5">
                Progres sebelumnya: <span className="font-semibold text-manhwa-text">Chapter {currentChapter}</span>
              </p>
            )}
          </div>

          {/* Stepper Kontrol Chapter */}
          <div className="bg-manhwa-surface p-3.5 rounded-xl border border-manhwa-border space-y-3">
            <label className="block text-xs font-semibold text-manhwa-text text-center">
              Terakhir membaca sampai:
            </label>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleDecrement(1)}
                className="w-9 h-9 rounded-xl bg-manhwa-card text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border flex items-center justify-center font-bold transition-smooth shadow-xs"
                title="Kurangi 1"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center">
                <span className="text-xs font-medium text-manhwa-muted mr-1">Ch.</span>
                <input
                  type="number"
                  min="0"
                  max={maxChapters}
                  value={chapter}
                  onChange={handleInputChange}
                  className="w-20 text-center font-bold text-lg text-manhwa-text bg-manhwa-card border border-manhwa-border rounded-xl py-1 px-2 focus:outline-none focus:ring-1 focus:ring-manhwa-accent"
                />
              </div>

              <button
                type="button"
                onClick={() => handleIncrement(1)}
                className="w-9 h-9 rounded-xl bg-manhwa-card text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border flex items-center justify-center font-bold transition-smooth shadow-xs"
                title="Tambah 1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Tombol Pintas +1, +2, +5 */}
            <div className="flex items-center justify-center gap-2 pt-1 border-t border-manhwa-border/50">
              <span className="text-[10px] text-manhwa-muted uppercase font-semibold">
                Lompat:
              </span>
              <button
                type="button"
                onClick={() => handleIncrement(1)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-manhwa-card hover:bg-manhwa-highlight border border-manhwa-border text-manhwa-accent transition-smooth shadow-xs"
              >
                +1 Ch
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(2)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-manhwa-card hover:bg-manhwa-highlight border border-manhwa-border text-manhwa-accent transition-smooth shadow-xs"
              >
                +2 Ch
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(5)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-manhwa-card hover:bg-manhwa-highlight border border-manhwa-border text-manhwa-accent transition-smooth shadow-xs"
              >
                +5 Ch
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-surface transition-smooth"
            >
              Lewati
            </button>
            <button
              type="submit"
              disabled={isSaving || chapter === ''}
              className="px-4 py-2 rounded-xl bg-manhwa-accent text-white font-semibold text-xs hover:bg-manhwa-accent-hover transition-smooth shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : `Simpan Ch. ${chapter}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
