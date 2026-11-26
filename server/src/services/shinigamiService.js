import axios from 'axios';

const SHINIGAMI_WEB_URL = 'https://s1.shinigami.mx';
const SHINIGAMI_API_URL = 'https://api.shinigami.io/v1';

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Origin: SHINIGAMI_WEB_URL,
  Referer: `${SHINIGAMI_WEB_URL}/`,
  Accept: 'application/json'
};

// Mapping manga_id terverifikasi di https://s1.shinigami.mx/
const VERIFIED_SHINIGAMI_IDS = {
  "omniscient reader's viewpoint": '799eb33b-c086-47a6-b4e0-4516cb87bc77',
  "the villainess's blind date is too perfect": '9cc7ecb6-b11b-4dea-8bdb-5901599fb5cd',
  'the beginning after the end': 'caf1c938-7512-4850-9b60-9c15f9dca173',
  "i'm a contract stepmother, but the tyrant is way too overprotective": '8ffc9e44-5211-4057-b92c-9d7040633a2e',
  'the return of the crazy demon': '4751525f-359c-423a-9fdb-44d40ac8105d',
  'revenge of the iron-blooded sword hound': '703f6c7a-ad78-4d50-b5cc-c768c0a12fdb',
  'solo leveling': '5c612573-fe38-42df-8618-dc3de1c9d04a',
  'the greatest estate developer': '6193d77a-1470-4365-9663-33027409325f',
  'eleceed': '05bbcbc4-56a6-47e6-ac36-1d482339a322',
  'mercenary enrollment': 'b80f7a1a-d572-417b-a5e0-9ac6097bf0be',
  'nano machine': 'd3b05787-4c8e-42bb-ba9a-6b2fafd92f3c',
  'lookism': 'a1529ab1-5e71-43d6-bb77-754cb6338b67',
  'pick me up': 'f96af365-8bf3-4b23-ab53-7bb6994a375d',
  'sss-class suicide hunter': '73a836fe-373e-4645-a5d9-a517922be4d3',
  "swordmaster's youngest son": 'f70af567-5f45-4859-8222-e41eb10ac169',
  'one piece': '48270276-bd79-4a46-b15e-fdd2cf5655b1',
  'one punch man': 'b112f871-7ea4-4adb-a311-711ae31a1e1f',
  'jujutsu kaisen': 'b06a5d18-a991-4867-8af8-eae43a9312ba',
  'blue lock': 'cd36aacc-23a5-4900-a362-841647151da7',
  'tower of god': '911071c9-4c37-444d-bcda-dc605c6f67a8',
  'chainsaw man': '3b1eab91-4a88-4d5c-babe-f9cf40be1347',
  'demonic emperor': 'c0f1d049-ff7f-474d-8c6a-3a55e4c44147'
};

const chapterCache = new Map();
const searchCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

const normalizeTitle = (str = '') =>
  String(str)
    .replace(/[’‘]/g, "'")
    .trim()
    .toLowerCase();

async function axiosGetWithRetry(url, config, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await axios.get(url, config);
    } catch (err) {
      lastError = err;
      const isTransient =
        !err.response ||
        err.code === 'ECONNRESET' ||
        err.code === 'ECONNABORTED' ||
        err.code === 'ETIMEDOUT' ||
        err.response.status >= 500;
      if (!isTransient || attempt === retries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  throw lastError;
}

export const shinigamiService = {
  async findMangaId(title = '', alternativeTitle = '', sourceId = '') {
    if (sourceId) return sourceId;

    const cleanTitle = normalizeTitle(title);
    const cleanAlt = normalizeTitle(alternativeTitle);

    if (VERIFIED_SHINIGAMI_IDS[cleanTitle]) {
      return VERIFIED_SHINIGAMI_IDS[cleanTitle];
    }
    if (cleanAlt && VERIFIED_SHINIGAMI_IDS[cleanAlt]) {
      return VERIFIED_SHINIGAMI_IDS[cleanAlt];
    }

    const cached = searchCache.get(cleanTitle);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached.mangaId;
    }

    const queries = [title, ...(alternativeTitle ? alternativeTitle.split('|').slice(0, 2) : [])]
      .map((q) => q.replace(/[’‘]/g, "'").trim())
      .filter((q) => q.length > 1);

    for (const q of queries) {
      try {
        const res = await axiosGetWithRetry(`${SHINIGAMI_API_URL}/manga/list`, {
          params: { q, page: 1, page_size: 5 },
          headers: REQUEST_HEADERS,
          timeout: 8000
        });
        const items = res.data?.data || [];
        if (items.length > 0) {
          const exact = items.find((m) => normalizeTitle(m.title) === normalizeTitle(q));
          const chosen = exact || items[0];
          searchCache.set(cleanTitle, { mangaId: chosen.manga_id, cachedAt: Date.now() });
          return chosen.manga_id;
        }
      } catch (err) {
        console.warn(`[shinigamiService] Pencarian gagal untuk "${q}":`, err.message);
      }
    }

    return null;
  },

  async fetchChapterList(mangaId) {
    if (!mangaId) return null;

    const cached = chapterCache.get(mangaId);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached;
    }

    try {
      const res = await axiosGetWithRetry(`${SHINIGAMI_API_URL}/chapter/${mangaId}/list`, {
        params: {
          limit: 2000,
          sort_by: 'chapter_number',
          sort_order: 'asc'
        },
        headers: REQUEST_HEADERS,
        timeout: 10000
      });

      const rawChapters = res.data?.data || [];
      const chapters = rawChapters
        .map((ch) => ({
          chapter_id: ch.chapter_id,
          chapter_number: Number(ch.chapter_number),
          chapter_title: ch.chapter_title || '',
          readUrl: `${SHINIGAMI_WEB_URL}/chapter/${ch.chapter_id}`
        }))
        .sort((a, b) => a.chapter_number - b.chapter_number);

      const payload = {
        seriesUrl: `${SHINIGAMI_WEB_URL}/series/${mangaId}`,
        chapters,
        firstChapter: chapters[0] || null,
        latestChapter: chapters[chapters.length - 1] || null,
        totalChapters: chapters.length,
        cachedAt: Date.now()
      };

      // Hanya simpan ke cache jika daftar chapter berhasil dimuat
      if (chapters.length > 0) {
        chapterCache.set(mangaId, payload);
      }
      return payload;
    } catch (err) {
      console.warn(`[shinigamiService] Gagal memuat daftar chapter untuk ${mangaId}:`, err.message);
      return {
        seriesUrl: `${SHINIGAMI_WEB_URL}/series/${mangaId}`,
        chapters: [],
        firstChapter: null,
        latestChapter: null,
        totalChapters: 0,
        cachedAt: 0
      };
    }
  },

  async resolveReadLink({ title, alternative_title = '', source_id = '', chapter = 0 }) {
    const mangaId = await this.findMangaId(title, alternative_title, source_id);
    const searchFallbackUrl = `${SHINIGAMI_WEB_URL}/series?q=${encodeURIComponent(
      (title || '').trim()
    )}`;

    if (!mangaId) {
      return {
        found: false,
        source: 'shinigami',
        seriesUrl: searchFallbackUrl,
        readUrl: searchFallbackUrl,
        targetChapter: Number(chapter) || 0
      };
    }

    const chapterData = await this.fetchChapterList(mangaId);
    const seriesUrl = chapterData?.seriesUrl || `${SHINIGAMI_WEB_URL}/series/${mangaId}`;
    const requestedCh = Number(chapter) || 0;

    let selectedChapter = null;

    if (chapterData?.chapters?.length > 0) {
      if (requestedCh <= 0) {
        // Mulai membaca dari awal: selalu arahkan ke chapter paling pertama (termasuk Chapter 0/Prolog jika ada)
        selectedChapter = chapterData.firstChapter;
      } else {
        // Lanjutkan baca: arahkan sesuai nomor chapter yang dicatat user di tracker
        selectedChapter =
          chapterData.chapters.find((c) => c.chapter_number === requestedCh) ||
          chapterData.chapters.find(
            (c) => Math.floor(c.chapter_number) === Math.floor(requestedCh)
          );

        if (!selectedChapter) {
          if (requestedCh < chapterData.firstChapter.chapter_number) {
            selectedChapter = chapterData.firstChapter;
          } else if (requestedCh >= chapterData.latestChapter.chapter_number) {
            selectedChapter = chapterData.latestChapter;
          } else {
            selectedChapter =
              [...chapterData.chapters].reverse().find((c) => c.chapter_number <= requestedCh) ||
              chapterData.firstChapter;
          }
        }
      }
    }

    return {
      found: true,
      source: 'shinigami',
      mangaId,
      seriesUrl,
      readUrl: selectedChapter?.readUrl || seriesUrl,
      selectedChapterNumber: selectedChapter?.chapter_number ?? null,
      targetChapter: requestedCh > 0 ? requestedCh : (selectedChapter?.chapter_number ?? 1),
      latestChapter: chapterData?.latestChapter?.chapter_number ?? null,
      totalChapters: chapterData?.totalChapters || 0
    };
  }
};
