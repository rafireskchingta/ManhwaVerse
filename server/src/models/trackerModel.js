import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { comicModel } from './comicModel.js';

let fallbackTracker = [
  {
    id: 'track-001',
    user_id: 'user-reader-001',
    comic_id: '11111111-1111-1111-1111-111111111101',
    reading_status: 'Sedang Dibaca',
    current_chapter: 142,
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString()
  },
  {
    id: 'track-002',
    user_id: 'user-reader-001',
    comic_id: '11111111-1111-1111-1111-111111111102',
    reading_status: 'Selesai Dibaca',
    current_chapter: 125,
    created_at: new Date('2024-01-08').toISOString(),
    updated_at: new Date('2024-01-12').toISOString()
  }
];

export const trackerModel = {
  async getUserTracker(userId, { status = '' } = {}) {
    if (!isSupabaseConfigured()) {
      let userItems = fallbackTracker.filter((t) => t.user_id === userId);

      if (status) {
        userItems = userItems.filter(
          (t) => t.reading_status.toLowerCase() === status.toLowerCase()
        );
      }

      // Gabungkan data komik
      const itemsWithComics = await Promise.all(
        userItems.map(async (t) => {
          const comic = await comicModel.getById(t.comic_id);
          return {
            ...t,
            comic: comic
              ? {
                  id: comic.id,
                  title: comic.title,
                  alternative_title: comic.alternative_title,
                  cover_url: comic.cover_url,
                  author: comic.author,
                  status: comic.status,
                  total_chapters: comic.total_chapters
                }
              : null
          };
        })
      );

      return itemsWithComics.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }

    let query = supabaseAdmin
      .from('reading_tracker')
      .select('*, comics(id, title, alternative_title, cover_url, author, status, total_chapters)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (status) {
      query = query.eq('reading_status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((item) => ({
      ...item,
      comic: item.comics || null
    }));
  },

  async getTrackerItem(userId, comicId) {
    if (!isSupabaseConfigured()) {
      const item = fallbackTracker.find(
        (t) => t.user_id === userId && t.comic_id === comicId
      );
      if (!item) return null;
      const comic = await comicModel.getById(item.comic_id);
      return { ...item, comic };
    }

    const { data, error } = await supabaseAdmin
      .from('reading_tracker')
      .select('*, comics(id, title, alternative_title, cover_url, author, status, total_chapters)')
      .eq('user_id', userId)
      .eq('comic_id', comicId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      ...data,
      comic: data.comics || null
    };
  },

  async addOrUpdate(userId, { comic_id, reading_status = 'Sedang Dibaca', current_chapter = 0 }) {
    const chapterNum = Math.max(0, parseInt(current_chapter, 10) || 0);

    if (!isSupabaseConfigured()) {
      const existingIdx = fallbackTracker.findIndex(
        (t) => t.user_id === userId && t.comic_id === comic_id
      );

      if (existingIdx !== -1) {
        fallbackTracker[existingIdx] = {
          ...fallbackTracker[existingIdx],
          reading_status,
          current_chapter: chapterNum,
          updated_at: new Date().toISOString()
        };
        const comic = await comicModel.getById(comic_id);
        return { ...fallbackTracker[existingIdx], comic };
      }

      const newItem = {
        id: `track-${Date.now()}`,
        user_id: userId,
        comic_id,
        reading_status,
        current_chapter: chapterNum,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      fallbackTracker.push(newItem);
      const comic = await comicModel.getById(comic_id);
      return { ...newItem, comic };
    }

    const { data, error } = await supabaseAdmin
      .from('reading_tracker')
      .upsert(
        {
          user_id: userId,
          comic_id,
          reading_status,
          current_chapter: chapterNum,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,comic_id' }
      )
      .select('*, comics(id, title, alternative_title, cover_url, author, status, total_chapters)')
      .single();

    if (error) throw error;
    return {
      ...data,
      comic: data.comics || null
    };
  },

  async updateProgress(userId, id, { reading_status, current_chapter }) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackTracker.findIndex((t) => t.id === id && t.user_id === userId);
      if (idx === -1) return null;

      if (reading_status) fallbackTracker[idx].reading_status = reading_status;
      if (current_chapter !== undefined) {
        fallbackTracker[idx].current_chapter = Math.max(0, parseInt(current_chapter, 10) || 0);
      }
      fallbackTracker[idx].updated_at = new Date().toISOString();

      const comic = await comicModel.getById(fallbackTracker[idx].comic_id);
      return { ...fallbackTracker[idx], comic };
    }

    const payload = { updated_at: new Date().toISOString() };
    if (reading_status) payload.reading_status = reading_status;
    if (current_chapter !== undefined) {
      payload.current_chapter = Math.max(0, parseInt(current_chapter, 10) || 0);
    }

    const { data, error } = await supabaseAdmin
      .from('reading_tracker')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, comics(id, title, alternative_title, cover_url, author, status, total_chapters)')
      .single();

    if (error) throw error;
    return {
      ...data,
      comic: data.comics || null
    };
  },

  async delete(userId, id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackTracker.findIndex((t) => t.id === id && t.user_id === userId);
      if (idx === -1) return false;
      fallbackTracker.splice(idx, 1);
      return true;
    }

    const { error } = await supabaseAdmin
      .from('reading_tracker')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  async getUserStats(userId) {
    if (!isSupabaseConfigured()) {
      const userItems = fallbackTracker.filter((t) => t.user_id === userId);
      const reading = userItems.filter((t) => t.reading_status === 'Sedang Dibaca').length;
      const completed = userItems.filter((t) => t.reading_status === 'Selesai Dibaca').length;
      return {
        total: userItems.length,
        reading,
        completed
      };
    }

    const { data, error } = await supabaseAdmin
      .from('reading_tracker')
      .select('reading_status')
      .eq('user_id', userId);

    if (error) throw error;

    const items = data || [];
    return {
      total: items.length,
      reading: items.filter((i) => i.reading_status === 'Sedang Dibaca').length,
      completed: items.filter((i) => i.reading_status === 'Selesai Dibaca').length
    };
  }
};
