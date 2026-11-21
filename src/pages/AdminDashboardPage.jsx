import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  BookOpen,
  Users,
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Archive,
  Info
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { comicService } from '../services/comicService';
import { characterService } from '../services/characterService';
import { genreService } from '../services/genreService';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminDashboardPage = () => {
  const { user, isAdmin, loading: authLoading, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('comics'); // 'comics' | 'characters' | 'genres'
  const [comics, setComics] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });
  const [syncingRole, setSyncingRole] = useState(false);

  // Modal States
  // Comic Form
  const [comicModalOpen, setComicModalOpen] = useState(false);
  const [editingComicId, setEditingComicId] = useState(null);
  const [comicForm, setComicForm] = useState({
    title: '',
    alternative_title: '',
    synopsis: '',
    cover_url: '',
    author: '',
    status: 'Ongoing',
    total_chapters: 0,
    genre_ids: []
  });

  // Character Form
  const [charModalOpen, setCharModalOpen] = useState(false);
  const [editingCharId, setEditingCharId] = useState(null);
  const [charForm, setCharForm] = useState({
    comic_id: '',
    name: '',
    image_url: '',
    role: 'Protagonis Utama',
    background: '',
    description: ''
  });

  // Genre Form
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [genreName, setGenreName] = useState('');

  // Delete Confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: '', // 'comic' | 'character' | 'genre'
    id: null,
    title: ''
  });

  const [submitting, setSubmitting] = useState(false);

  // Check admin authorization & auto-sync if role changed in Supabase
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (!isAdmin) {
        // Coba sinkronisasi otomatis satu kali dengan Supabase
        refreshProfile?.().catch(() => {});
      }
    }
  }, [user, isAdmin, authLoading, navigate, refreshProfile]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [comicsData, charsData, genresData] = await Promise.all([
        comicService.getAll(),
        characterService.getAll(),
        genreService.getAll()
      ]);
      setComics(comicsData);
      setCharacters(charsData);
      setGenres(genresData);
    } catch (err) {
      console.error('Error refresh data admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshData();
    }
  }, [isAdmin]);

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 4000);
  };

  // ================= COMIC HANDLERS =================
  const handleOpenAddComic = () => {
    setEditingComicId(null);
    setComicForm({
      title: '',
      alternative_title: '',
      synopsis: '',
      cover_url: '',
      author: '',
      status: 'Ongoing',
      total_chapters: 0,
      genre_ids: []
    });
    setComicModalOpen(true);
  };

  const handleOpenEditComic = (comic) => {
    setEditingComicId(comic.id);
    setComicForm({
      title: comic.title || '',
      alternative_title: comic.alternative_title || '',
      synopsis: comic.synopsis || '',
      cover_url: comic.cover_url || '',
      author: comic.author || '',
      status: comic.status || 'Ongoing',
      total_chapters: comic.total_chapters || 0,
      genre_ids: comic.genres ? comic.genres.map((g) => g.id) : []
    });
    setComicModalOpen(true);
  };

  const handleSaveComic = async (e) => {
    e.preventDefault();
    if (!comicForm.title.trim()) {
      showAlert('error', 'Judul komik wajib diisi.');
      return;
    }
    try {
      setSubmitting(true);
      if (editingComicId) {
        await comicService.update(editingComicId, comicForm);
        showAlert('success', 'Data komik berhasil diperbarui.');
      } else {
        await comicService.create(comicForm);
        showAlert('success', 'Komik baru berhasil ditambahkan ke katalog.');
      }
      setComicModalOpen(false);
      await refreshData();
    } catch (err) {
      showAlert('error', err.message || 'Gagal menyimpan komik.');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= CHARACTER HANDLERS =================
  const handleOpenAddChar = async (preselectedComicId = null) => {
    setEditingCharId(null);
    try {
      // Pastikan data komik selalu paling mutakhir dari database sebelum modal dibuka
      const freshComics = await comicService.getAll();
      if (freshComics && freshComics.length > 0) {
        setComics(freshComics);
      }
      setCharForm({
        comic_id:
          preselectedComicId ||
          (freshComics && freshComics.length > 0 ? freshComics[0].id : comics.length > 0 ? comics[0].id : ''),
        name: '',
        image_url: '',
        role: 'Protagonis Utama',
        background: '',
        description: ''
      });
    } catch {
      setCharForm({
        comic_id: preselectedComicId || (comics.length > 0 ? comics[0].id : ''),
        name: '',
        image_url: '',
        role: 'Protagonis Utama',
        background: '',
        description: ''
      });
    }
    setCharModalOpen(true);
  };

  const handleOpenEditChar = async (char) => {
    setEditingCharId(char.id);
    try {
      const freshComics = await comicService.getAll();
      if (freshComics && freshComics.length > 0) {
        setComics(freshComics);
      }
    } catch {}
    setCharForm({
      comic_id: char.comic_id || (comics.length > 0 ? comics[0].id : ''),
      name: char.name || '',
      image_url: char.image_url || '',
      role: char.role || 'Protagonis Utama',
      background: char.background || '',
      description: char.description || ''
    });
    setCharModalOpen(true);
  };

  const handleSaveChar = async (e) => {
    e.preventDefault();
    if (!charForm.comic_id) {
      showAlert('error', 'Silakan pilih asal judul komik terlebih dahulu.');
      return;
    }
    if (!charForm.name.trim()) {
      showAlert('error', 'Nama karakter wajib diisi.');
      return;
    }
    try {
      setSubmitting(true);
      if (editingCharId) {
        await characterService.update(editingCharId, charForm);
        showAlert('success', 'Data karakter berhasil diperbarui.');
      } else {
        await characterService.create(charForm);
        showAlert('success', 'Karakter baru berhasil ditambahkan.');
      }
      setCharModalOpen(false);
      await refreshData();
    } catch (err) {
      showAlert('error', err.message || 'Gagal menyimpan karakter.');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= GENRE HANDLERS =================
  const handleOpenAddGenre = () => {
    setEditingGenreId(null);
    setGenreName('');
    setGenreModalOpen(true);
  };

  const handleOpenEditGenre = (g) => {
    setEditingGenreId(g.id);
    setGenreName(g.name);
    setGenreModalOpen(true);
  };

  const handleSaveGenre = async (e) => {
    e.preventDefault();
    if (!genreName.trim()) return;

    try {
      setSubmitting(true);
      if (editingGenreId) {
        await genreService.update(editingGenreId, { name: genreName.trim() });
        showAlert('success', 'Nama genre berhasil diperbarui.');
      } else {
        await genreService.create({ name: genreName.trim() });
        showAlert('success', 'Genre baru berhasil ditambahkan.');
      }
      setGenreModalOpen(false);
      await refreshData();
    } catch (err) {
      showAlert('error', err.message || 'Gagal menyimpan genre.');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE HANDLER (SOFT DELETE & HARD DELETE) =================
  const handleExecuteDelete = async (isHard = false) => {
    const { type, id, title } = deleteConfirm;
    try {
      setSubmitting(true);
      if (type === 'comic') {
        if (isHard) {
          await comicService.hardDelete(id);
          showAlert('success', `Komik "${title}" berhasil dihapus secara permanen dari database.`);
        } else {
          await comicService.softDelete(id);
          showAlert('success', `Komik "${title}" berhasil dipindahkan ke Kotak Sampah.`);
        }
      } else if (type === 'character') {
        if (isHard) {
          await characterService.hardDelete(id);
          showAlert('success', `Karakter "${title}" berhasil dihapus secara permanen dari database.`);
        } else {
          await characterService.softDelete(id);
          showAlert('success', `Karakter "${title}" berhasil dipindahkan ke Kotak Sampah.`);
        }
      } else if (type === 'genre') {
        await genreService.delete(id);
        showAlert('success', `Genre "${title}" berhasil dihapus.`);
      }
      setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
      await refreshData();
    } catch (err) {
      showAlert('error', err.message || 'Gagal menghapus data.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (loading && isAdmin)) {
    return <LoadingSpinner message="Menyiapkan panel admin..." />;
  }

  // Jika sudah login tapi role di session browser belum admin
  if (!authLoading && user && !isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-10 p-6 bg-manhwa-card rounded-2xl border border-manhwa-border shadow-soft text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="font-serif font-bold text-xl text-manhwa-text">
          Akses Khusus Administrator
        </h3>
        <p className="text-sm text-manhwa-muted leading-relaxed">
          Akun Anda (<strong className="text-manhwa-text">{user.email}</strong>) saat ini masih terbaca dengan role <span className="px-2 py-0.5 rounded bg-manhwa-surface text-manhwa-secondary border border-manhwa-border font-semibold text-xs">reader</span>.
        </p>
        <div className="text-xs text-manhwa-muted leading-relaxed bg-manhwa-surface p-3.5 rounded-xl border border-manhwa-border text-left space-y-1.5">
          <p className="font-semibold text-manhwa-text">Sudah ubah role jadi admin di Supabase?</p>
          <p>
            Sesi browser Anda mungkin masih menyimpan data lama. Klik tombol di bawah untuk menyinkronkan status role langsung dari database Supabase:
          </p>
        </div>

        {alertMsg.text && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={async () => {
              try {
                setSyncingRole(true);
                const p = await refreshProfile?.();
                if (p?.role === 'admin') {
                  showAlert('success', 'Status Administrator aktif! Memuat data...');
                  refreshData();
                } else {
                  showAlert('error', 'Status di database masih "reader". Pastikan nilai role di tabel profiles bernilai "admin".');
                }
              } catch (e) {
                showAlert('error', 'Gagal menyinkronkan: ' + e.message);
              } finally {
                setSyncingRole(false);
              }
            }}
            disabled={syncingRole}
            className="w-full py-2.5 px-4 rounded-xl bg-manhwa-accent text-white font-semibold text-sm hover:bg-manhwa-accent-hover transition-smooth cursor-pointer shadow-xs disabled:opacity-60"
          >
            {syncingRole ? 'Memeriksa Database...' : 'Sinkronkan Status Akun Sekarang'}
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-manhwa-surface text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold text-sm transition-smooth cursor-pointer"
          >
            Keluar (Logout) & Login Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel Admin */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-manhwa-accent/15 text-manhwa-accent flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-manhwa-text">
                Panel Manajemen Administrator
              </h2>
            </div>
            <p className="text-xs md:text-sm text-manhwa-muted mt-1">
              Kelola katalog komik, profil karakter, dan kategori genre direktori ManhwaVerse.
            </p>
          </div>

          {/* Tombol Menuju Halaman Sampah */}
          <Link
            to="/admin/trash"
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 text-xs md:text-sm font-semibold flex items-center gap-2 transition-smooth shadow-xs cursor-pointer flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-rose-700" />
            <span>Kotak Sampah</span>
          </Link>
        </div>

        {/* Notifikasi Alert */}
        {alertMsg.text && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Tab Navigasi Admin */}
        <div className="flex border-b border-manhwa-border mt-5">
          <button
            onClick={() => setActiveTab('comics')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-smooth ${
              activeTab === 'comics'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kelola Komik ({comics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-smooth ${
              activeTab === 'characters'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Karakter ({characters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('genres')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold border-b-2 transition-smooth ${
              activeTab === 'genres'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kelola Genre ({genres.length})</span>
          </button>
        </div>
      </section>

      {/* ================= TAB 1: COMICS ================= */}
      {activeTab === 'comics' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
                Katalog Komik
              </h3>
              <p className="text-xs text-manhwa-muted">
                Total {comics.length} judul komik aktif.
              </p>
            </div>
            <button
              onClick={handleOpenAddComic}
              className="px-3.5 py-2 rounded-xl bg-manhwa-accent text-white font-semibold text-xs md:text-sm hover:bg-manhwa-accent-hover transition-smooth flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Komik</span>
            </button>
          </div>

          <div className="bg-manhwa-card rounded-2xl border border-manhwa-border overflow-hidden shadow-soft">
            <div className="divide-y divide-manhwa-border">
              {comics.map((comic) => (
                <div
                  key={comic.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-manhwa-surface/40 transition-smooth"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={comic.cover_url}
                      alt={comic.title}
                      className="w-12 h-16 object-cover rounded-lg bg-manhwa-surface flex-shrink-0 border border-manhwa-border shadow-xs"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm md:text-base text-manhwa-text truncate">
                        {comic.title}
                      </h4>
                      <p className="text-xs text-manhwa-muted mt-0.5">
                        {comic.author} • {comic.status} • {comic.total_chapters} Chapter
                      </p>
                      {comic.genres && comic.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {comic.genres.map((g) => (
                            <span
                              key={g.id || g.name}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-manhwa-surface text-manhwa-muted border border-manhwa-border/80"
                            >
                              {g.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi (Tambah Karakter, Edit & Hapus) */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleOpenAddChar(comic.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-smooth flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Tambah Karakter untuk Komik Ini"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>+ Karakter</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditComic(comic)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Edit Komik"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-manhwa-accent" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'comic',
                          id: comic.id,
                          title: comic.title
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-smooth flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Hapus Komik"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 2: CHARACTERS ================= */}
      {activeTab === 'characters' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
                Daftar Karakter Tokoh
              </h3>
              <p className="text-xs text-manhwa-muted">
                Total {characters.length} karakter aktif.
              </p>
            </div>
            <button
              onClick={handleOpenAddChar}
              className="px-3.5 py-2 rounded-xl bg-manhwa-accent text-white font-semibold text-xs md:text-sm hover:bg-manhwa-accent-hover transition-smooth flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Karakter</span>
            </button>
          </div>

          <div className="bg-manhwa-card rounded-2xl border border-manhwa-border overflow-hidden shadow-soft">
            <div className="divide-y divide-manhwa-border">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-manhwa-surface/40 transition-smooth"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={char.image_url}
                      alt={char.name}
                      className="w-12 h-14 object-cover rounded-lg bg-manhwa-surface flex-shrink-0 border border-manhwa-border shadow-xs"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm md:text-base text-manhwa-text truncate">
                        {char.name}
                      </h4>
                      <p className="text-xs text-manhwa-muted mt-0.5">
                        <strong className="text-manhwa-accent">{char.role}</strong> • Asal:{' '}
                        <span className="font-semibold text-manhwa-text">
                          {char.comic_title || comics.find((c) => c.id === char.comic_id)?.title || 'Tidak Diketahui'}
                        </span>
                      </p>
                      {char.description && (
                        <p className="text-xs text-manhwa-muted line-clamp-1 mt-1 max-w-md">
                          {char.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi (Edit & Hapus) */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleOpenEditChar(char)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Edit Karakter"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-manhwa-accent" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'character',
                          id: char.id,
                          title: char.name
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-smooth flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Hapus Karakter"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 3: GENRES ================= */}
      {activeTab === 'genres' && (
        <section className="space-y-4 max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
                Daftar Kategori Genre
              </h3>
              <p className="text-xs text-manhwa-muted">
                Total {genres.length} genre aktif di direktori.
              </p>
            </div>
            <button
              onClick={handleOpenAddGenre}
              className="px-3.5 py-2 rounded-xl bg-manhwa-accent text-white font-semibold text-xs md:text-sm hover:bg-manhwa-accent-hover transition-smooth flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Genre</span>
            </button>
          </div>

          <div className="bg-manhwa-card rounded-2xl border border-manhwa-border overflow-hidden shadow-soft">
            <div className="divide-y divide-manhwa-border">
              {genres.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 flex items-center justify-between hover:bg-manhwa-surface/40 transition-smooth"
                >
                  <span className="font-serif font-semibold text-sm md:text-base text-manhwa-text">
                    {g.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditGenre(g)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Edit Genre"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-manhwa-accent" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'genre',
                          id: g.id,
                          title: g.name
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-smooth flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Hapus Genre"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= MODAL COMIC FORM ================= */}
      <Modal
        isOpen={comicModalOpen}
        onClose={() => setComicModalOpen(false)}
        title={editingComicId ? 'Edit Data Komik' : 'Tambah Komik Baru'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveComic} noValidate className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Judul Komik *
            </label>
            <input
              type="text"
              value={comicForm.title}
              onChange={(e) => setComicForm({ ...comicForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Judul Alternatif
            </label>
            <input
              type="text"
              value={comicForm.alternative_title}
              onChange={(e) => setComicForm({ ...comicForm, alternative_title: e.target.value })}
              placeholder="Contoh: TBATE / Judul Bahasa Korea"
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Penulis / Author
              </label>
              <input
                type="text"
                value={comicForm.author}
                onChange={(e) => setComicForm({ ...comicForm, author: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Status Rilis
              </label>
              <select
                value={comicForm.status}
                onChange={(e) => setComicForm({ ...comicForm, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed (Tamat)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Total Chapter
              </label>
              <input
                type="number"
                min="0"
                value={comicForm.total_chapters}
                onChange={(e) => setComicForm({ ...comicForm, total_chapters: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                URL Gambar Cover
              </label>
              <input
                type="url"
                value={comicForm.cover_url}
                onChange={(e) => setComicForm({ ...comicForm, cover_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Genre Komik
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-manhwa-surface border border-manhwa-border max-h-32 overflow-y-auto">
              {genres.map((g) => {
                const checked = comicForm.genre_ids.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-smooth ${
                      checked
                        ? 'bg-manhwa-accent text-white border-manhwa-accent'
                        : 'bg-manhwa-card text-manhwa-text border-manhwa-border hover:bg-manhwa-highlight'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => {
                        const newIds = checked
                          ? comicForm.genre_ids.filter((id) => id !== g.id)
                          : [...comicForm.genre_ids, g.id];
                        setComicForm({ ...comicForm, genre_ids: newIds });
                      }}
                    />
                    <span>{g.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Sinopsis
            </label>
            <textarea
              rows="3"
              value={comicForm.synopsis}
              onChange={(e) => setComicForm({ ...comicForm, synopsis: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setComicModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Komik'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL CHARACTER FORM ================= */}
      <Modal
        isOpen={charModalOpen}
        onClose={() => setCharModalOpen(false)}
        title={editingCharId ? 'Edit Karakter' : 'Tambah Karakter Baru'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveChar} noValidate className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Asal Judul Komik *
            </label>
            <select
              value={charForm.comic_id}
              onChange={(e) => setCharForm({ ...charForm, comic_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent cursor-pointer"
              required
            >
              <option value="" disabled>-- Pilih Asal Judul Komik --</option>
              {comics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {comics.length === 0 && (
              <p className="text-[11px] text-amber-700 mt-1">
                Belum ada komik aktif. Silakan tambahkan komik terlebih dahulu di tab Kelola Komik.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Nama Karakter *
              </label>
              <input
                type="text"
                value={charForm.name}
                onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Peran (Role) *
              </label>
              <select
                value={charForm.role}
                onChange={(e) => setCharForm({ ...charForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
                required
              >
                <option value="Protagonis Utama">Protagonis Utama</option>
                <option value="Tokoh Utama Pria">Tokoh Utama Pria</option>
                <option value="Antagonis">Antagonis</option>
                <option value="Karakter Pendukung">Karakter Pendukung</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              URL Foto Karakter
            </label>
            <input
              type="url"
              value={charForm.image_url}
              onChange={(e) => setCharForm({ ...charForm, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Latar Belakang Karakter
            </label>
            <textarea
              rows="3"
              value={charForm.background}
              onChange={(e) => setCharForm({ ...charForm, background: e.target.value })}
              placeholder="Asal-usul atau riwayat masa lalu..."
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Deskripsi & Sifat Tokoh
            </label>
            <textarea
              rows="3"
              value={charForm.description}
              onChange={(e) => setCharForm({ ...charForm, description: e.target.value })}
              placeholder="Karakteristik kepribadian dan keahlian..."
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCharModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Karakter'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL GENRE FORM ================= */}
      <Modal
        isOpen={genreModalOpen}
        onClose={() => setGenreModalOpen(false)}
        title={editingGenreId ? 'Edit Genre' : 'Tambah Genre Baru'}
      >
        <form onSubmit={handleSaveGenre} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Nama Genre
            </label>
            <input
              type="text"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              placeholder="Contoh: Mystery / Supernatural"
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs focus:outline-none focus:border-manhwa-accent"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setGenreModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Genre'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL DELETE CONFIRMATION ================= */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
        title={
          deleteConfirm.type === 'genre'
            ? 'Konfirmasi Hapus Genre'
            : deleteConfirm.type === 'character'
            ? 'Konfirmasi Hapus Karakter'
            : 'Konfirmasi Hapus Komik'
        }
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-manhwa-muted leading-relaxed">
            Apakah Anda yakin ingin menghapus {deleteConfirm.type === 'comic' ? 'komik' : deleteConfirm.type === 'character' ? 'karakter' : 'genre'}:{' '}
            <strong className="text-manhwa-text font-serif font-bold">"{deleteConfirm.title}"</strong>?
          </p>

          {deleteConfirm.type === 'genre' ? (
            /* Opsi Hapus untuk Genre */
            <div className="space-y-3">
              <p className="text-xs text-manhwa-muted leading-relaxed bg-manhwa-surface p-3 rounded-xl border border-manhwa-border">
                Kategori genre ini akan dihapus dari sistem. Komik yang sudah memiliki genre ini tidak akan terpengaruh.
              </p>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
                  className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteDelete(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-rose-700 text-white hover:bg-rose-800 transition-smooth disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Menghapus...' : 'Ya, Hapus Genre'}
                </button>
              </div>
            </div>
          ) : (
            /* Hapus Komik & Karakter (Soft Delete) */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/60 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-semibold text-amber-950 mb-0.5">Dapat Dipulihkan Kembali</p>
                  <p className="text-amber-800/90">
                    Item ini akan dipindahkan ke halaman{' '}
                    <Link to="/admin/trash" className="font-bold underline text-amber-900 hover:text-amber-950">
                      Kotak Sampah
                    </Link>
                    . Anda masih dapat memulihkannya kembali kapan saja jika diperlukan.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
                  className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteDelete(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-rose-700 text-white hover:bg-rose-800 transition-smooth disabled:opacity-60 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Menghapus...' : 'Ya, Hapus'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
