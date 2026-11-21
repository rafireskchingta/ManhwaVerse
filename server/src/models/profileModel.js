import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let fallbackProfiles = [
  {
    id: 'user-admin-001',
    name: 'Admin ManhwaVerse',
    email: 'admin@manhwaverse.com',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date('2024-01-01').toISOString()
  },
  {
    id: 'user-reader-001',
    name: 'Pembaca Setia',
    email: 'reader@manhwaverse.com',
    role: 'reader',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: new Date('2024-01-02').toISOString()
  }
];

export const profileModel = {
  async getById(id) {
    if (!isSupabaseConfigured()) {
      return fallbackProfiles.find((p) => p.id === id) || null;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getByEmail(email) {
    if (!isSupabaseConfigured()) {
      return fallbackProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) || null;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create({ id, name, email, role = 'reader', avatar_url = null }) {
    if (!isSupabaseConfigured()) {
      const existing = fallbackProfiles.find((p) => p.id === id || p.email === email);
      if (existing) return existing;
      const newProfile = { id, name, email, role, avatar_url, created_at: new Date().toISOString() };
      fallbackProfiles.push(newProfile);
      return newProfile;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({ id, name, email, role, avatar_url }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, { name, avatar_url }) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackProfiles.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      if (name) fallbackProfiles[idx].name = name;
      if (avatar_url !== undefined) fallbackProfiles[idx].avatar_url = avatar_url;
      return fallbackProfiles[idx];
    }

    const payload = {};
    if (name) payload.name = name;
    if (avatar_url !== undefined) payload.avatar_url = avatar_url;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRole(id, role) {
    if (!['reader', 'admin'].includes(role)) {
      throw new Error("Role harus bernilai 'reader' atau 'admin'");
    }

    if (!isSupabaseConfigured()) {
      const idx = fallbackProfiles.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      fallbackProfiles[idx].role = role;
      return fallbackProfiles[idx];
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    if (!isSupabaseConfigured()) {
      return [...fallbackProfiles];
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
