import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let fallbackCharacters = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    comic_id: '11111111-1111-1111-1111-111111111101',
    comic_title: 'Omniscient Reader’s Viewpoint',
    name: 'Kim Dokja',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Satu-satunya pembaca setia novel web "Tiga Cara Bertahan Hidup di Dunia yang Hancur".',
    description: 'Cerdas, tenang di bawah tekanan, dan memanfaatkan pengetahuannya tentang alur cerita untuk mengubah takdir dunia.'
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    comic_id: '11111111-1111-1111-1111-111111111101',
    comic_title: 'Omniscient Reader’s Viewpoint',
    name: 'Yoo Joonghyuk',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    role: 'Tokoh Utama Pria',
    background: 'Regressor legendaris yang mengulang waktu berkali-kali demi menyelamatkan dunia.',
    description: 'Pendekar pedang dingin dan kuat yang menjadi sekutu utama Kim Dokja.'
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    comic_id: '11111111-1111-1111-1111-111111111102',
    comic_title: 'The Villainess’s Blind Date Is Too Perfect',
    name: 'Villainess (Kencan Buta)',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Wanita bangsawan yang menjalani kencan buta tak terduga dan terjerat kisah romansa istana.',
    description: 'Elegan, cerdik, dan berusaha menghindari akhir buruk sebagai karakter antagonis.'
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    comic_id: '11111111-1111-1111-1111-111111111103',
    comic_title: 'The Beginning After The End',
    name: 'Arthur Leywin',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Reinkarnasi dari Raja Grey di benua sihir Dicathen.',
    description: 'Mage muda berbakat yang berjuang melindungi keluarga dan dunia barunya.'
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    comic_id: '11111111-1111-1111-1111-111111111104',
    comic_title: 'I’m a Contract Stepmother, but the Tyrant Is Way Too Overprotective',
    name: 'Permaisuri Kontrak',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Wanita modern yang memasuki pernikahan kontrak istana dengan kaisar tiran.',
    description: 'Hangat, berhati lembut namun cerdik menghadapi rumor dan politik istana.'
  },
  {
    id: '22222222-2222-2222-2222-222222222207',
    comic_id: '11111111-1111-1111-1111-111111111105',
    comic_title: 'The Return Of the Crazy Demon',
    name: 'Lee Jaha',
    image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Iblis Gila yang kembali ke masa muda sebelum menjadi penguasa murim.',
    description: 'Eksentrik, tidak terduga, ahli bela diri mematikan dengan humor gelap yang khas.'
  },
  {
    id: '22222222-2222-2222-2222-222222222208',
    comic_id: '11111111-1111-1111-1111-111111111106',
    comic_title: 'Revenge Of The Iron-Blooded Sword Hound',
    name: 'Vikir Van Baskerville',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Anjing pemburu klan Baskerville yang beregresi ke masa kecil setelah dikhianati.',
    description: 'Dingin, kejam terhadap pengkhianat, dan bertekad membalas dendam kepada ayahnya.'
  },
  {
    id: '22222222-2222-2222-2222-222222222209',
    comic_id: '11111111-1111-1111-1111-111111111107',
    comic_title: 'Solo Leveling',
    name: 'Sung Jinwoo',
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Mantan Hunter Rank E yang bangkit menjadi Shadow Monarch terkuat.',
    description: 'Tenang, dingin, dan memimpin pasukan bayangan.'
  },
  {
    id: '22222222-2222-2222-2222-222222222210',
    comic_id: '11111111-1111-1111-1111-111111111108',
    comic_title: 'The Greatest Estate Developer',
    name: 'Lloyd Frontera',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Mahasiswa teknik sipil yang bertransmigrasi ke tubuh bangsawan pemalas.',
    description: 'Cerdik, matre, dengan ekspresi komikal legendaris dan kejeniusan teknik sipil.'
  },
  {
    id: '22222222-2222-2222-2222-222222222211',
    comic_id: '11111111-1111-1111-1111-111111111109',
    comic_title: 'Eleceed',
    name: 'Seo Jiwoo',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Pemuda baik hati pemilik kekuatan kecepatan super yang menyelamatkan Kayden si kucing gemuk.',
    description: 'Penyayang binatang, pekerja keras, dan terus berkembang di bawah bimbingan Kayden.'
  },
  {
    id: '22222222-2222-2222-2222-222222222212',
    comic_id: '11111111-1111-1111-1111-111111111110',
    comic_title: 'Mercenary Enrollment',
    name: 'Yu Ijin',
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Mantan tentara bayaran elit 001 yang kembali ke Korea untuk melindungi keluarganya.',
    description: 'Pendiam, sangat protektif, dengan kemampuan bertarung tak tertandingi.'
  },
  {
    id: '22222222-2222-2222-2222-222222222213',
    comic_id: '11111111-1111-1111-1111-111111111111',
    comic_title: 'Nano Machine',
    name: 'Cheon Yeo-woon',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Pewaris terbuang Sekte Iblis yang menerima teknologi Nano dari masa depan.',
    description: 'Tegas, cerdik, dan bangkit menjadi pemimpin kultus terkuat.'
  },
  {
    id: '22222222-2222-2222-2222-222222222214',
    comic_id: '11111111-1111-1111-1111-111111111116',
    comic_title: 'One Piece',
    name: 'Monkey D. Luffy',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Kapten Bajak Laut Topi Jerami pemakan buah iblis Gomu Gomu no Mi.',
    description: 'Pemberani dan pantang menyerah mengejar impian menjadi Raja Bajak Laut.'
  },
  {
    id: '22222222-2222-2222-2222-222222222215',
    comic_id: '11111111-1111-1111-1111-111111111118',
    comic_title: 'Jujutsu Kaisen',
    name: 'Yuji Itadori',
    image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Siswa SMA wadah Raja Kutukan Ryomen Sukuna.',
    description: 'Baik hati dan rela bertarung demi menyelamatkan sesama.'
  },
  {
    id: '22222222-2222-2222-2222-222222222216',
    comic_id: '11111111-1111-1111-1111-111111111120',
    comic_title: 'Tower Of God',
    name: 'Twenty-Fifth Bam',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Irregular yang memanjat Menara demi mencari kebenaran dan Rachel.',
    description: 'Tulus namun menyimpan potensi penguasaan Shinsu yang sangat dahsyat.'
  }
];

export const characterModel = {
  async getAll({ search = '', role = '', comic_id = '', limit = 50, offset = 0, isDeleted = false } = {}) {
    if (!isSupabaseConfigured()) {
      let filtered = [...fallbackCharacters];

      if (isDeleted) {
        filtered = filtered.filter((c) => Boolean(c.deleted_at));
      } else {
        filtered = filtered.filter((c) => !c.deleted_at);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.comic_title && c.comic_title.toLowerCase().includes(q)) ||
            (c.description && c.description.toLowerCase().includes(q))
        );
      }

      if (role) {
        filtered = filtered.filter((c) => c.role.toLowerCase() === role.toLowerCase());
      }

      if (comic_id) {
        filtered = filtered.filter((c) => c.comic_id === comic_id);
      }

      return filtered.slice(offset, offset + limit);
    }

    let query = supabaseAdmin
      .from('characters')
      .select('*, comics(id, title, cover_url)')
      .order('name', { ascending: true });

    if (isDeleted) {
      query = query.not('deleted_at', 'is', null);
    } else {
      query = query.is('deleted_at', null);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,background.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    if (comic_id) {
      query = query.eq('comic_id', comic_id);
    }

    let { data, error } = await query;
    if (error) {
      // Jika kolom deleted_at belum dibuat di tabel Supabase
      if (error.code === '42703' && !isDeleted) {
        let fallbackQuery = supabaseAdmin
          .from('characters')
          .select('*, comics(id, title, cover_url)')
          .order('name', { ascending: true });
        if (search) fallbackQuery = fallbackQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,background.ilike.%${search}%`);
        if (role) fallbackQuery = fallbackQuery.eq('role', role);
        if (comic_id) fallbackQuery = fallbackQuery.eq('comic_id', comic_id);
        const res = await fallbackQuery;
        if (res.error) throw res.error;
        data = res.data;
      } else if (error.code === '42703' && isDeleted) {
        return [];
      } else {
        throw error;
      }
    }

    const formatted = (data || []).map((ch) => ({
      ...ch,
      comic_title: ch.comics?.title || ''
    }));

    return formatted.slice(offset, offset + limit);
  },

  async getById(id) {
    if (!isSupabaseConfigured()) {
      const character = fallbackCharacters.find((c) => c.id === id);
      return character ? { ...character } : null;
    }

    const { data, error } = await supabaseAdmin
      .from('characters')
      .select('*, comics(id, title, cover_url, author, status)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      ...data,
      comic_title: data.comics?.title || ''
    };
  },

  async create({ comic_id, name, image_url, role, background, description }) {
    if (!isSupabaseConfigured()) {
      const newChar = {
        id: `mock-char-${Date.now()}`,
        comic_id,
        comic_title: 'Komik Pilihan',
        name,
        image_url: image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        role: role || 'Protagonis Utama',
        background: background || '',
        description: description || '',
        created_at: new Date().toISOString()
      };
      fallbackCharacters.push(newChar);
      return newChar;
    }

    const { data, error } = await supabaseAdmin
      .from('characters')
      .insert([
        {
          comic_id,
          name,
          image_url: image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          role: role || 'Protagonis Utama',
          background: background || '',
          description: description || ''
        }
      ])
      .select('*, comics(id, title, cover_url)')
      .single();

    if (error) throw error;
    return {
      ...data,
      comic_title: data.comics?.title || ''
    };
  },

  async update(id, { comic_id, name, image_url, role, background, description }) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackCharacters.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      fallbackCharacters[idx] = {
        ...fallbackCharacters[idx],
        ...(comic_id && { comic_id }),
        ...(name && { name }),
        ...(image_url && { image_url }),
        ...(role && { role }),
        ...(background !== undefined && { background }),
        ...(description !== undefined && { description })
      };
      return fallbackCharacters[idx];
    }

    const updatePayload = {};
    if (comic_id) updatePayload.comic_id = comic_id;
    if (name) updatePayload.name = name;
    if (image_url) updatePayload.image_url = image_url;
    if (role) updatePayload.role = role;
    if (background !== undefined) updatePayload.background = background;
    if (description !== undefined) updatePayload.description = description;

    const { data, error } = await supabaseAdmin
      .from('characters')
      .update(updatePayload)
      .eq('id', id)
      .select('*, comics(id, title, cover_url)')
      .single();

    if (error) throw error;
    return {
      ...data,
      comic_title: data.comics?.title || ''
    };
  },

  async softDelete(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackCharacters.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackCharacters[idx].deleted_at = new Date().toISOString();
      return true;
    }

    const { error } = await supabaseAdmin
      .from('characters')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async restore(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackCharacters.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackCharacters[idx].deleted_at = null;
      return true;
    }

    const { error } = await supabaseAdmin
      .from('characters')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async hardDelete(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackCharacters.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackCharacters.splice(idx, 1);
      return true;
    }

    const { error } = await supabaseAdmin.from('characters').delete().eq('id', id);
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
