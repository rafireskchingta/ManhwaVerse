import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan membaca .env dari root project
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ [PERINGATAN SUPABASE] Kredensial Supabase belum dikonfigurasi di file .env.\n' +
      'Silakan lengkapi SUPABASE_URL, SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY untuk koneksi penuh ke database.\n'
  );
}

// Client untuk operasi publik / autentikasi standar
export const supabaseAnon = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Client untuk backend dengan hak akses service role (bypass RLS setelah verifikasi di server)
export const supabaseAdmin =
  isSupabaseConfigured() && supabaseServiceKey && !supabaseServiceKey.includes('your-service-role')
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : supabaseAnon;

// Helper untuk membuat client Supabase atas nama pengguna (menerapkan RLS via JWT)
export const createUserClient = (accessToken) => {
  if (!isSupabaseConfigured()) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};
