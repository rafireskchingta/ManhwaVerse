import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Send,
  Smartphone,
  QrCode
} from 'lucide-react';

export const ShareComicModal = ({ isOpen, onClose, comic }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !comic) return null;

  // URL lengkap yang mengarahkan langsung ke halaman komik ini
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/comics/${comic.id}`
    : `/comics/${comic.id}`;

  const shareTitle = `Baca ${comic.title} di ManhwaVerse`;
  const shareText = `Halo! Yuk baca komik "${comic.title}"${comic.author ? ` karya ${comic.author}` : ''} di ManhwaVerse. Akses langsung komiknya melalui tautan berikut:`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback untuk browser lama
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Gagal menyalin tautan:', err);
    }
  };

  // Web Share API (native share drawer Android / iOS)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n`,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error saat share native:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // WhatsApp
  const handleShareWhatsApp = () => {
    const fullMessage = `${shareText}\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`, '_blank');
  };

  // Telegram
  const handleShareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  // Twitter / X
  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  // Facebook
  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const defaultCover =
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-manhwa-card w-full max-w-md rounded-2xl border border-manhwa-border shadow-elevated overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-manhwa-border bg-manhwa-surface/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-manhwa-accent/15 text-manhwa-accent flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
                Bagikan Komik
              </h3>
              <p className="text-xs text-manhwa-muted">
                Kirim link agar teman langsung diarahkan ke komik ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-highlight transition-smooth"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-4 md:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Card Preview Komik (Gaya Produk Shopee) */}
          <div className="flex gap-3.5 p-3 rounded-xl bg-manhwa-surface border border-manhwa-border/80">
            <div className="w-16 h-22 rounded-lg overflow-hidden bg-manhwa-card flex-shrink-0 border border-manhwa-border">
              <img
                src={comic.cover_url || defaultCover}
                alt={comic.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultCover;
                }}
              />
            </div>
            <div className="flex flex-col justify-between flex-grow min-w-0">
              <div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-manhwa-accent/10 text-manhwa-accent border border-manhwa-accent/20">
                  {comic.status === 'Completed' ? 'Tamat' : 'Ongoing'}
                </span>
                <h4 className="font-serif font-bold text-sm text-manhwa-text truncate mt-1">
                  {comic.title}
                </h4>
                {comic.author && (
                  <p className="text-xs text-manhwa-muted truncate">
                    oleh {comic.author}
                  </p>
                )}
              </div>
              <p className="text-[11px] text-manhwa-muted">
                {comic.total_chapters > 0 ? `${comic.total_chapters} Chapter` : 'Katalog ManhwaVerse'}
              </p>
            </div>
          </div>

          {/* Salin Tautan Langsung (Input + Tombol Salin) */}
          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1.5">
              Tautan Langsung Komik
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow min-w-0">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full px-3 py-2 text-xs font-mono bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-muted focus:outline-none select-all truncate"
                />
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-smooth whitespace-nowrap shadow-xs ${
                  copied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-manhwa-accent text-white hover:bg-manhwa-accent-hover'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 mt-2 flex items-center gap-1 animate-fadeIn">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Link berhasil disalin! Teman Anda dapat langsung membukanya.</span>
              </p>
            )}
          </div>

          {/* Tombol Opsi Berbagi ke Berbagai Platform (Gaya Shopee) */}
          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-2">
              Kirim ke Media Sosial & Pesan
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-smooth group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 transition-smooth group"
              >
                <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Telegram</span>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={handleShareTwitter}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 transition-smooth group"
              >
                <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform font-bold text-xs">
                  𝕏
                </div>
                <span className="text-[11px] font-medium">Twitter / X</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleShareFacebook}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition-smooth group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform font-bold text-xs">
                  f
                </div>
                <span className="text-[11px] font-medium">Facebook</span>
              </button>
            </div>
          </div>

          {/* Opsi Berbagi Native (Drawer Sistem HP) jika didukung */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2 px-3 rounded-xl bg-manhwa-surface border border-manhwa-border hover:bg-manhwa-highlight text-manhwa-text text-xs font-semibold flex items-center justify-center gap-2 transition-smooth"
            >
              <Smartphone className="w-4 h-4 text-manhwa-accent" />
              <span>Buka Menu Berbagi Bawaan Perangkat (Android / iOS)</span>
            </button>
          )}

          {/* Toggle QR Code untuk scan langsung antar perangkat */}
          <div className="pt-2 border-t border-manhwa-border/70">
            <button
              type="button"
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between text-xs text-manhwa-muted hover:text-manhwa-text py-1"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQR ? 'Sembunyikan QR Code' : 'Tampilkan QR Code untuk Scan HP'}</span>
              </span>
              <span className="text-[11px] underline">
                {showQR ? 'Tutup' : 'Lihat'}
              </span>
            </button>

            {showQR && (
              <div className="mt-3 p-4 bg-manhwa-surface rounded-xl border border-manhwa-border flex flex-col items-center justify-center animate-fadeIn">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Komik"
                  className="w-40 h-40 rounded-lg bg-white p-2 border border-manhwa-border shadow-xs"
                />
                <p className="text-[11px] text-manhwa-muted text-center mt-2">
                  Arahkan kamera smartphone teman Anda untuk langsung membuka komik ini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-3.5 md:p-4 border-t border-manhwa-border bg-manhwa-surface/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-manhwa-surface text-manhwa-muted hover:text-manhwa-text border border-manhwa-border text-xs font-semibold transition-smooth"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
