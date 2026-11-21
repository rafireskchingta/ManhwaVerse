import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// Fallback seed data jika Supabase belum dihubungkan pengguna
let fallbackComics = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    title: "Omniscient Reader's Viewpoint",
    alternative_title: 'Sudut Pandang Pembaca Serba Tahu',
    synopsis: 'Kim Dokja adalah pekerja kantoran biasa yang menjadi satu-satunya pembaca novel web apokaliptik selama 10 tahun. Saat chapter terakhir novel tersebut dirilis, dunia tiba-tiba berubah persis seperti skenario novel fiksi tersebut. Hanya Dokja yang mengetahui akhir dari kehancuran dunia ini.',
    cover_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    author: 'sing N song, Sleepy-C',
    status: 'Ongoing',
    total_chapters: 215,
    created_at: new Date('2024-01-01').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    title: 'The Villainess Reverses the Hourglass',
    alternative_title: 'Aria Memutar Jam Pasir',
    synopsis: 'Setelah ibunya yang pelacur menikahi seorang bangsawan, Aria menikmati hidup bermewah-mewah, namun jatuh ke dalam tipu muslihat saudari tirinya, Mielle, hingga berujung pada eksekusi mati. Sebelum meninggal, sebuah jam pasir misterius memutar kembali waktu ke masa lalu. Aria bersumpah untuk membalas dendam dengan menjadi penjahat sesungguhnya.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    author: 'SANSOBEE, Antstudio',
    status: 'Completed',
    total_chapters: 125,
    created_at: new Date('2024-01-02').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    title: 'The Beginning After the End',
    alternative_title: 'TBATE',
    synopsis: 'Raja Grey memiliki kekuatan, kekayaan, dan prestise yang tak tertandingi di dunia militer, namun kesepian menyelimutinya. Bereinkarnasi di dunia sihir dan monster yang asing sebagai Arthur Leywin, ia memiliki kesempatan kedua untuk melindungi orang-orang yang dicintainya dan menebus kesalahan masa lalunya.',
    cover_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    author: 'TurtleMe, Fuyuki23',
    status: 'Ongoing',
    total_chapters: 185,
    created_at: new Date('2024-01-03').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    title: "A Stepmother's Märchen",
    alternative_title: 'Dongeng Ibu Tiri / The Fantasie of a Stepmother',
    synopsis: 'Shuri von Neuschwanstein dinikahkan saat remaja dan ditinggal mati oleh suaminya yang telah memiliki 4 anak seusianya. Setelah berjuang mengurus keluarga di tengah cemoohan masyarakat dan kebencian anak-anak tirinya, Shuri tewas dalam kecelakaan saat menghadiri pernikahan anak sulung tirinya. Keajaiban membawanya bangun 7 tahun silam saat upacara pemakaman suaminya.',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    author: 'Spice&Kitty, ORKA',
    status: 'Ongoing',
    total_chapters: 130,
    created_at: new Date('2024-01-04').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    title: 'Bastard',
    alternative_title: 'Putra Pembunuh Berantai',
    synopsis: 'Jin Seon adalah siswa sekolah menengah yang lemah dan sering menjadi korban perundungan. Di rumah, ia dipaksa oleh ayahnya yang merupakan CEO sukses sekaligus pembunuh berantai berdarah dingin untuk menjadi kaki tangan dalam mencari korban. Ketika ayahnya mengincar teman sekelas yang ia sukai, Jin memutuskan untuk melawan ayahnya.',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    author: 'Carnby Kim, Youngchan Hwang',
    status: 'Completed',
    total_chapters: 93,
    created_at: new Date('2024-01-05').toISOString(),
    genres: [{ id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }]
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    title: 'The Villainess Lives Again',
    alternative_title: 'Kelahiran Kembali Sang Ahli Strategi',
    synopsis: 'Artezia Rosan mendedikasikan hidupnya sebagai dalang konspirasi politik demi menaikkan saudara tirinya ke tahta kekaisaran, namun akhirnya dikhianati dan dipotong anggota tubuhnya. Hanya Cedric Evron, pangeran yang berintegritas, yang menyelamatkannya dari penjara. Menggunakan sihir terlarang, Artezia memutar waktu kembali untuk menebus dosanya dan membantu Cedric menjadi kaisar.',
    cover_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&auto=format&fit=crop&q=80',
    author: 'Mint, Peachberry',
    status: 'Ongoing',
    total_chapters: 160,
    created_at: new Date('2024-01-06').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  }
];

// Helper untuk membersihkan struktur relasi comic_genres
const formatComicWithGenres = (comic) => {
  if (!comic) return null;
  const genres =
    comic.comic_genres && Array.isArray(comic.comic_genres)
      ? comic.comic_genres.map((cg) => cg.genres).filter(Boolean)
      : comic.genres || [];

  const { comic_genres, ...rest } = comic;
  return {
    ...rest,
    genres
  };
};

export const comicModel = {
  async getAll({ search = '', genre = '', status = '', limit = 50, offset = 0, isDeleted = false } = {}) {
    if (!isSupabaseConfigured()) {
      let filtered = [...fallbackComics];

      if (isDeleted) {
        filtered = filtered.filter((c) => Boolean(c.deleted_at));
      } else {
        filtered = filtered.filter((c) => !c.deleted_at);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            (c.alternative_title && c.alternative_title.toLowerCase().includes(q)) ||
            (c.author && c.author.toLowerCase().includes(q))
        );
      }

      if (genre) {
        const gQuery = genre.toLowerCase();
        filtered = filtered.filter((c) =>
          c.genres.some((g) => g.name.toLowerCase() === gQuery || g.id === genre)
        );
      }

      if (status) {
        filtered = filtered.filter((c) => c.status.toLowerCase() === status.toLowerCase());
      }

      return filtered.slice(offset, offset + limit);
    }

    let query = supabaseAdmin
      .from('comics')
      .select('*, comic_genres(genres(*))')
      .order('created_at', { ascending: false });

    if (isDeleted) {
      query = query.not('deleted_at', 'is', null);
    } else {
      query = query.is('deleted_at', null);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,alternative_title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    let { data, error } = await query;
    if (error) {
      // Jika kolom deleted_at belum dibuat di tabel Supabase
      if (error.code === '42703' && !isDeleted) {
        let fallbackQuery = supabaseAdmin
          .from('comics')
          .select('*, comic_genres(genres(*))')
          .order('created_at', { ascending: false });
        if (search) {
          fallbackQuery = fallbackQuery.or(`title.ilike.%${search}%,alternative_title.ilike.%${search}%,author.ilike.%${search}%`);
        }
        if (status) fallbackQuery = fallbackQuery.eq('status', status);
        const res = await fallbackQuery;
        if (res.error) throw res.error;
        data = res.data;
      } else if (error.code === '42703' && isDeleted) {
        return [];
      } else {
        throw error;
      }
    }

    let result = (data || []).map(formatComicWithGenres);

    if (genre) {
      const gQuery = genre.toLowerCase();
      result = result.filter((c) =>
        c.genres.some((g) => g.name.toLowerCase() === gQuery || g.id === genre)
      );
    }

    return result.slice(offset, offset + limit);
  },

  async getById(id) {
    if (!isSupabaseConfigured()) {
      const comic = fallbackComics.find((c) => c.id === id);
      return comic ? { ...comic } : null;
    }

    const { data, error } = await supabaseAdmin
      .from('comics')
      .select('*, comic_genres(genres(*)), characters(*)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return formatComicWithGenres(data);
  },

  async create({
    title,
    alternative_title = '',
    synopsis = '',
    cover_url = '',
    author = '',
    status = 'Ongoing',
    total_chapters = 0,
    genre_ids = []
  }) {
    if (!isSupabaseConfigured()) {
      const newComic = {
        id: `mock-comic-${Date.now()}`,
        title,
        alternative_title,
        synopsis,
        cover_url: cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        author,
        status,
        total_chapters: Number(total_chapters) || 0,
        created_at: new Date().toISOString(),
        genres: genre_ids.map((gid) => ({ id: gid, name: 'Genre' }))
      };
      fallbackComics.unshift(newComic);
      return newComic;
    }

    // Insert komik baru
    const { data: comic, error: comicError } = await supabaseAdmin
      .from('comics')
      .insert([
        {
          title,
          alternative_title,
          synopsis,
          cover_url,
          author,
          status,
          total_chapters: Number(total_chapters) || 0
        }
      ])
      .select()
      .single();

    if (comicError) throw comicError;

    // Hubungkan genre jika ada
    if (genre_ids && genre_ids.length > 0) {
      const relationRows = genre_ids.map((genre_id) => ({
        comic_id: comic.id,
        genre_id
      }));

      const { error: genreRelError } = await supabaseAdmin
        .from('comic_genres')
        .insert(relationRows);

      if (genreRelError) console.error('Gagal menghubungkan genre:', genreRelError);
    }

    return this.getById(comic.id);
  },

  async update(id, {
    title,
    alternative_title,
    synopsis,
    cover_url,
    author,
    status,
    total_chapters,
    genre_ids
  }) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      fallbackComics[idx] = {
        ...fallbackComics[idx],
        ...(title !== undefined && { title }),
        ...(alternative_title !== undefined && { alternative_title }),
        ...(synopsis !== undefined && { synopsis }),
        ...(cover_url !== undefined && { cover_url }),
        ...(author !== undefined && { author }),
        ...(status !== undefined && { status }),
        ...(total_chapters !== undefined && { total_chapters: Number(total_chapters) })
      };
      return fallbackComics[idx];
    }

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (alternative_title !== undefined) updatePayload.alternative_title = alternative_title;
    if (synopsis !== undefined) updatePayload.synopsis = synopsis;
    if (cover_url !== undefined) updatePayload.cover_url = cover_url;
    if (author !== undefined) updatePayload.author = author;
    if (status !== undefined) updatePayload.status = status;
    if (total_chapters !== undefined) updatePayload.total_chapters = Number(total_chapters);
    updatePayload.last_updated = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from('comics')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) throw updateError;

    // Perbarui relasi genre jika genre_ids diberikan
    if (genre_ids && Array.isArray(genre_ids)) {
      await supabaseAdmin.from('comic_genres').delete().eq('comic_id', id);
      if (genre_ids.length > 0) {
        const relationRows = genre_ids.map((genre_id) => ({
          comic_id: id,
          genre_id
        }));
        await supabaseAdmin.from('comic_genres').insert(relationRows);
      }
    }

    return this.getById(id);
  },

  async softDelete(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackComics[idx].deleted_at = new Date().toISOString();
      return true;
    }

    const { error } = await supabaseAdmin
      .from('comics')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async restore(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackComics[idx].deleted_at = null;
      return true;
    }

    const { error } = await supabaseAdmin
      .from('comics')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async hardDelete(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackComics.splice(idx, 1);
      return true;
    }

    // Bersihkan relasi terlebih dahulu
    try {
      await supabaseAdmin.from('comic_genres').delete().eq('comic_id', id);
      await supabaseAdmin.from('characters').delete().eq('comic_id', id);
      await supabaseAdmin.from('reading_tracker').delete().eq('comic_id', id);
    } catch (e) {
      console.warn('Pembersihan relasi komik:', e.message);
    }

    const { error } = await supabaseAdmin.from('comics').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async delete(id, { hard = false } = {}) {
    if (hard) {
      return this.hardDelete(id);
    }
    return this.softDelete(id);
  }
};
