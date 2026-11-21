import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { profileModel } from '../models/profileModel.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured()) {
      // Mode Fallback/Development tanpa Supabase langsung
      if (token.includes('admin') || token === 'mock-token-admin') {
        req.user = await profileModel.getById('user-admin-001');
      } else {
        req.user = (await profileModel.getById('user-reader-001')) || {
          id: 'user-reader-001',
          name: 'Pembaca Setia',
          email: 'reader@manhwaverse.com',
          role: 'reader'
        };
      }
      return next();
    }

    // Verifikasi token via Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Sesi autentikasi tidak valid atau telah kedaluwarsa.'
      });
    }

    // Ambil profile pengguna untuk mendapatkan role
    let profile = await profileModel.getById(user.id);

    if (!profile) {
      // Jika profile belum terbentuk, buat otomatis
      profile = await profileModel.create({
        id: user.id,
        name: user.user_metadata?.name || user.email.split('@')[0],
        email: user.email,
        role: 'reader'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: profile.name,
      role: profile.role,
      avatar_url: profile.avatar_url
    };

    next();
  } catch (error) {
    console.error('Error pada authMiddleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memverifikasi autentikasi.'
    });
  }
};

export const optionalToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured()) {
      if (token.includes('admin')) {
        req.user = await profileModel.getById('user-admin-001');
      } else {
        req.user = await profileModel.getById('user-reader-001');
      }
      return next();
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      const profile = await profileModel.getById(user.id);
      req.user = {
        id: user.id,
        email: user.email,
        name: profile?.name || user.email.split('@')[0],
        role: profile?.role || 'reader',
        avatar_url: profile?.avatar_url
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Silakan login terlebih dahulu.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Tindakan ini memerlukan hak akses Administrator.'
    });
  }

  next();
};
