import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let fallbackCharacters = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    comic_id: '11111111-1111-1111-1111-111111111101',
    comic_title: "Omniscient Reader's Viewpoint",
    name: 'Kim Dokja',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Seorang staf kontrak di Mino Soft yang sangat gemar membaca novel web "Tiga Cara Bertahan Hidup di Dunia yang Hancur".',
    description: 'Cerdas, tenang di bawah tekanan, dan memiliki kemampuan menganalisis situasi menggunakan pengetahuan lengkap mengenai jalan cerita apokaliptik.'
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    comic_id: '11111111-1111-1111-1111-111111111101',
    comic_title: "Omniscient Reader's Viewpoint",
    name: 'Yoo Joonghyuk',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    role: 'Tokoh Utama Pria',
    background: 'Karakter utama asli dari novel web yang terus mengalami regresi waktu setiap kali gagal menyelamatkan dunia.',
    description: 'Pendekar pedang yang dingin, sangat kuat, namun memikul beban mental yang sangat berat akibat ratusan kali menyaksikan kematian rekan-rekannya.'
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    comic_id: '11111111-1111-1111-1111-111111111102',
    comic_title: 'The Villainess Reverses the Hourglass',
    name: 'Aria Roscent',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Gadis berparas rupawan anak dari mantan pelacur yang diangkat menjadi keluarga bangsawan Count Roscent.',
    description: 'Memiliki tekad membara, berhitung secara cermat, dan memanfaatkan jam pasir pembalik waktu untuk memperdaya mereka yang pernah menghancurkannya.'
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    comic_id: '11111111-1111-1111-1111-111111111102',
    comic_title: 'The Villainess Reverses the Hourglass',
    name: 'Asher (Crown Prince)',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    role: 'Tokoh Utama Pria',
    background: 'Putra Mahkota Kekaisaran yang menyamar sebagai bangsawan biasa untuk menyelidiki pergerakan kaum aristokrat.',
    description: 'Pemimpin berwibawa, bijaksana, dan menjadi sekutu terpenting sekaligus tambatan hati Aria.'
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    comic_id: '11111111-1111-1111-1111-111111111103',
    comic_title: 'The Beginning After the End',
    name: 'Arthur Leywin',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Reinkarnasi dari Raja Grey yang menguasai seni bela diri dan pemahaman inti mana sejak usia balita.',
    description: 'Mage muda berbakat yang melindungi keluarganya, kawan-kawannya, dan benua Dicathen dari ancaman bangsa Asura.'
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    comic_id: '11111111-1111-1111-1111-111111111104',
    comic_title: "A Stepmother's Märchen",
    name: 'Shuri von Neuschwanstein',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Janda muda yang menjadi pengasuh dan wali bagi keempat anak tiri peninggalan mendiang suaminya.',
    description: 'Penuh kasih sayang, tangguh, pantang menyerah, dan bertekad memperbaiki relasi keluarga serta membimbing anak-anak tirinya menuju masa depan bahagia.'
  },
  {
    id: '22222222-2222-2222-2222-222222222207',
    comic_id: '11111111-1111-1111-1111-111111111105',
    comic_title: 'Bastard',
    name: 'Jin Seon',
    image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Remaja dengan katup jantung buatan dan mata kaca yang hidup dalam bayang-bayang ayahnya yang seorang psikopat.',
    description: 'Terjebak dalam rasa bersalah dan trauma mendalam, tetapi mengumpulkan keberanian moral untuk menghentikan kejahatan ayahnya demi orang yang disayanginya.'
  },
  {
    id: '22222222-2222-2222-2222-222222222208',
    comic_id: '11111111-1111-1111-1111-111111111106',
    comic_title: 'The Villainess Lives Again',
    name: 'Artezia Rosan',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    role: 'Protagonis Utama',
    background: 'Wanita jenius pemikir taktik dan intrik kekaisaran yang rela mengorbankan segalanya demi janji masa depan.',
    description: 'Memiliki kecerdasan analitis yang tajam, mampu membaca pergerakan politik lawan dengan cermat, dan berjuang demi keadilan sejati.'
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
