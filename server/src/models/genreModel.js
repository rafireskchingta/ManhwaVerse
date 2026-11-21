import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// Fallback seed data jika Supabase belum dikonfigurasi
let fallbackGenres = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
];

export const genreModel = {
  async getAll() {
    if (!isSupabaseConfigured()) {
      return [...fallbackGenres];
    }

    const { data, error } = await supabaseAdmin
      .from('genres')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    if (!isSupabaseConfigured()) {
      return fallbackGenres.find((g) => g.id === id) || null;
    }

    const { data, error } = await supabaseAdmin
      .from('genres')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create({ name }) {
    if (!isSupabaseConfigured()) {
      const newGenre = {
        id: `00000000-0000-0000-0000-00000000000${fallbackGenres.length + 1}`,
        name: name.trim()
      };
      fallbackGenres.push(newGenre);
      return newGenre;
    }

    const { data, error } = await supabaseAdmin
      .from('genres')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, { name }) {
    if (!isSupabaseConfigured()) {
      const index = fallbackGenres.findIndex((g) => g.id === id);
      if (index === -1) return null;
      fallbackGenres[index].name = name.trim();
      return fallbackGenres[index];
    }

    const { data, error } = await supabaseAdmin
      .from('genres')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    if (!isSupabaseConfigured()) {
      const index = fallbackGenres.findIndex((g) => g.id === id);
      if (index === -1) return false;
      fallbackGenres.splice(index, 1);
      return true;
    }

    const { error } = await supabaseAdmin
      .from('genres')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
