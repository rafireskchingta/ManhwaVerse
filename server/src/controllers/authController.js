import { supabaseAdmin, supabaseAnon, isSupabaseConfigured } from '../config/supabase.js';
import { profileModel } from '../models/profileModel.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Nama, email, dan kata sandi wajib diisi.'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Kata sandi minimal harus 6 karakter.'
        });
      }

      if (!isSupabaseConfigured()) {
        const mockId = `mock-user-${Date.now()}`;
        const newProfile = await profileModel.create({
          id: mockId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'reader'
        });

        return res.status(201).json({
          success: true,
          message: 'Registrasi berhasil (Mode Development/Lokal).',
          data: {
            token: `mock-token-${mockId}`,
            user: {
              id: newProfile.id,
              email: newProfile.email,
              name: newProfile.name,
              role: newProfile.role
            }
          }
        });
      }

      // Buat akun di Supabase Auth via Admin API agar terverifikasi langsung
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: { name: name.trim() }
      });

      if (authError) {
        return res.status(400).json({
          success: false,
          message: authError.message || 'Gagal mendaftarkan akun.'
        });
      }

      const user = authData.user;

      // Simpan data ke tabel profiles dengan role default reader
      const profile = await profileModel.create({
        id: user.id,
        name: name.trim(),
        email: user.email,
        role: 'reader'
      });

      // Login otomatis untuk mendapatkan access token
      const { data: loginData, error: loginError } = await supabaseAnon.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      const token = loginData?.session?.access_token || 'pending-auth';

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil.',
        data: {
          token,
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan kata sandi wajib diisi.'
        });
      }

      const cleanEmail = email.trim().toLowerCase();

      if (!isSupabaseConfigured()) {
        let profile = await profileModel.getByEmail(cleanEmail);

        if (!profile) {
          // Buat akun pembaca otomatis untuk kemudahan testing jika belum ada
          profile = await profileModel.create({
            id: `mock-user-${Date.now()}`,
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            role: cleanEmail.includes('admin') ? 'admin' : 'reader'
          });
        }

        const token = profile.role === 'admin' ? 'mock-token-admin' : 'mock-token-reader';

        return res.json({
          success: true,
          message: 'Login berhasil (Mode Development/Lokal).',
          data: {
            token,
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              avatar_url: profile.avatar_url
            }
          }
        });
      }

      // Login via Supabase Auth
      const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (authError || !authData.session) {
        return res.status(401).json({
          success: false,
          message: 'Email atau kata sandi tidak valid.'
        });
      }

      const user = authData.user;
      let profile = await profileModel.getById(user.id);

      if (!profile) {
        profile = await profileModel.create({
          id: user.id,
          name: user.user_metadata?.name || user.email.split('@')[0],
          email: user.email,
          role: 'reader'
        });
      }

      return res.json({
        success: true,
        message: 'Login berhasil.',
        data: {
          token: authData.session.access_token,
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            avatar_url: profile.avatar_url
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Pengguna belum terautentikasi.'
        });
      }

      return res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      if (isSupabaseConfigured() && supabaseAnon) {
        await supabaseAnon.auth.signOut();
      }

      return res.json({
        success: true,
        message: 'Berhasil keluar dari akun.'
      });
    } catch (error) {
      next(error);
    }
  }
};
