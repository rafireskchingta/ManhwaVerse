import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import comicRoutes from './routes/comicRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import trackerRoutes from './routes/trackerRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { isSupabaseConfigured } from './config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Info & Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    app: 'ManhwaVerse API',
    version: '1.0.0',
    supabaseConnected: isSupabaseConfigured(),
    timestamp: new Date().toISOString()
  });
});

// Registrasi Route Utama (Mendukung baik /api/... maupun direct /...)
const registerRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/comics`, comicRoutes);
  app.use(`${prefix}/characters`, characterRoutes);
  app.use(`${prefix}/genres`, genreRoutes);
  app.use(`${prefix}/tracker`, trackerRoutes);
  app.use(`${prefix}/profiles`, profileRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
};

registerRoutes('/api');
registerRoutes('');

// Penanganan Route Tidak Ditemukan & Error
app.use(notFoundHandler);
app.use(errorHandler);

// Jalankan server jika dieksekusi langsung
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n===========================================`);
    console.log(`🚀 Server ManhwaVerse berjalan pada port ${PORT}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Status Supabase: ${isSupabaseConfigured() ? 'Terhubung' : 'Mode Pengembangan (Lokal)'}`);
    console.log(`===========================================\n`);
  });
}

export default app;
