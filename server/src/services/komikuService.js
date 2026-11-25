import axios from 'axios';

const KOMIKU_BASE_URL = 'https://komiku.org';
const KOMIKU_API_URL = 'https://api.komiku.org';

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
};

// Mapping slug terverifikasi untuk judul yang URL Komiku-nya berbeda dari judul standar
const VERIFIED_KOMIKU_SLUGS = {
  "omniscient reader's viewpoint": '/manga/omniscient-readers-viewpoint/',
  'omniscient readers viewpoint': '/manga/omniscient-readers-viewpoint/',
  'solo leveling': '/manga/solo-leveling-id/',
  'the beginning after the end': '/manga/the-beginning-after-the-end/',
  'the greatest estate developer': '/manga/the-worlds-best-engineer/',
  "the world's best engineer": '/manga/the-worlds-best-engineer/',
  'the world’s best engineer': '/manga/the-worlds-best-engineer/',
  'return of the mount hua sect': '/manga/return-of-the-flowery-mountain-sect/',
  'return of the flowery mountain sect': '/manga/return-of-the-flowery-mountain-sect/',
  'mercenary enrollment': '/manga/mercenary-enrollment/',
  'nano machine': '/manga/nano-machine/',
  'lookism': '/manga/lookism/',
  'pick me up': '/manga/pick-me-up/',
  'sss-class suicide hunter': '/manga/sss-class-suicide-hunter/',
  'overgeared new': '/manga/overgeared-new/',
  'overgeared': '/manga/overgeared-new/',
  'one piece': '/manga/komik-one-piece-indo/',
  'one punch man': '/manga/manga-one-punch-man/',
  'jujutsu kaisen': '/manga/jujutsu-kaisen-indo/',
  'blue lock': '/manga/blue-lock/',
  'chainsaw man': '/manga/123213-chainsaw-man/',
  'kimetsu no yaiba': '/manga/kimetsu-no-yaiba-indonesia/',
  'demon slayer': '/manga/kimetsu-no-yaiba-indonesia/',
  'solo max-level newbie': '/manga/131241-solo-max-level-newbie/',
  'the god of high school': '/manga/the-god-of-high-school/',
  'wind breaker': '/manga/wind-breaker/',
  'sakamoto days': '/manga/sakamoto-days/',
  'dandadan': '/manga/dandadan/',
  'solo leveling: ragnarok': '/manga/alone-leveling-ragnarok/',
  'the time-limited villainess who makes medicine': '/manga/the-time-limited-villainess-who-makes-medicine/',
  'i’m a contract stepmother, but the tyrant is way too overprotective': '/manga/im-a-contract-stepmother-but-the-tyrant-is-way-too-overprotective/',
  "i'm a contract stepmother, but the tyrant is way too overprotective": '/manga/im-a-contract-stepmother-but-the-tyrant-is-way-too-overprotective/',
  'the boxer': '/manga/the-boxer/',
  'i’ll be a villain in this life': '/manga/ill-be-a-villain-in-this-life/',
  "i'll be a villain in this life": '/manga/ill-be-a-villain-in-this-life/',
  'absolute sword sense': '/manga/absolute-sword-sense/'
};

// Cache daftar chapter di memori selama 30 menit agar respons cepat & tidak spam ke Komiku
const chapterCache = new Map();
const slugSearchCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

const toAbsoluteKomikuUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${KOMIKU_BASE_URL}${normalized}`;
};

const parseChapterNumber = (text, href) => {
  if (text) {
    // Contoh: "Chapter 180", "Chapter 259.5", "Chapter 00", "Chapter .1"
    const match = text.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  if (href) {
    const hrefMatch = href.match(/chapter-(\d+(?:-\d+)?)/i);
    if (hrefMatch) {
      return parseFloat(hrefMatch[1].replace('-', '.'));
    }
  }
  return null;
};

export const komikuService = {
  async findMangaSlug(title = '', alternativeTitle = '') {
    const cleanTitle = (title || '').trim().toLowerCase();
    const cleanAlt = (alternativeTitle || '').trim().toLowerCase();

    if (VERIFIED_KOMIKU_SLUGS[cleanTitle]) {
      return VERIFIED_KOMIKU_SLUGS[cleanTitle];
    }
    if (cleanAlt && VERIFIED_KOMIKU_SLUGS[cleanAlt]) {
      return VERIFIED_KOMIKU_SLUGS[cleanAlt];
    }

    const cached = slugSearchCache.get(cleanTitle);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached.slugPath;
    }

    const queries = [title, alternativeTitle].filter((q) => q && q.trim().length > 1);
    for (const q of queries) {
      try {
        const searchUrl = `${KOMIKU_API_URL}/?post_type=manga&s=${encodeURIComponent(q.trim())}`;
        const res = await axios.get(searchUrl, { headers: REQUEST_HEADERS, timeout: 8000 });
        const html = String(res.data || '');
        const matches = [...new Set(html.match(/\/manga\/[a-zA-Z0-9_-]+\/?/g) || [])].filter(
          (p) => !p.includes('/page/')
        );

        if (matches.length > 0) {
          slugSearchCache.set(cleanTitle, { slugPath: matches[0], cachedAt: Date.now() });
          return matches[0];
        }
      } catch (err) {
        console.warn(`[komikuService] Search gagal untuk "${q}":`, err.message);
      }
    }

    return null;
  },

  async fetchChapterList(slugPath) {
    if (!slugPath) return null;

    const cached = chapterCache.get(slugPath);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached;
    }

    const mangaUrl = toAbsoluteKomikuUrl(slugPath);
    try {
      const res = await axios.get(mangaUrl, { headers: REQUEST_HEADERS, timeout: 10000 });
      const html = String(res.data || '');

      const tableMatch = html.match(/<table[^>]*id="Daftar_Chapter"[\s\S]*?<\/table>/i)?.[0] || '';
      const rawLinks = [
        ...tableMatch.matchAll(
          /<td class="judulseries">[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
        )
      ];

      const chapters = rawLinks
        .map((m) => {
          const href = m[1].trim();
          const label = m[2].replace(/<[^>]+>/g, '').trim();
          return {
            href: toAbsoluteKomikuUrl(href),
            label,
            number: parseChapterNumber(label, href)
          };
        })
        .filter((ch) => Boolean(ch.href));

      // Urutan di Komiku dari terbaru (index 0) ke terlama (index terakhir)
      const latestChapter = chapters[0] || null;
      const firstChapter = chapters[chapters.length - 1] || null;

      const payload = {
        mangaUrl,
        chapters,
        firstChapter,
        latestChapter,
        totalChapters: chapters.length,
        cachedAt: Date.now()
      };

      chapterCache.set(slugPath, payload);
      return payload;
    } catch (err) {
      console.warn(`[komikuService] Gagal fetch daftar chapter dari ${mangaUrl}:`, err.message);
      return {
        mangaUrl,
        chapters: [],
        firstChapter: null,
        latestChapter: null,
        totalChapters: 0,
        cachedAt: Date.now()
      };
    }
  },

  async resolveReadLink({ title, alternative_title = '', chapter = 0 }) {
    const slugPath = await this.findMangaSlug(title, alternative_title);
    const searchFallbackUrl = `${KOMIKU_BASE_URL}/?post_type=manga&s=${encodeURIComponent(
      (title || '').trim()
    )}`;

    if (!slugPath) {
      return {
        found: false,
        source: 'komiku',
        mangaUrl: searchFallbackUrl,
        readUrl: searchFallbackUrl,
        targetChapter: Number(chapter) || 0
      };
    }

    const chapterData = await this.fetchChapterList(slugPath);
    const mangaUrl = chapterData?.mangaUrl || toAbsoluteKomikuUrl(slugPath);
    const requestedCh = Number(chapter) || 0;

    let selectedChapter = null;

    if (chapterData?.chapters?.length > 0) {
      if (requestedCh <= 0) {
        // Jika belum pernah baca, arahkan ke chapter 1 jika ada, atau firstChapter (misal prologue/00-1)
        selectedChapter =
          chapterData.chapters.find((c) => c.number === 1) || chapterData.firstChapter;
      } else {
        // Cari kecocokan persis dulu (misal Ch. 10 -> number === 10)
        selectedChapter =
          chapterData.chapters.find((c) => c.number === requestedCh) ||
          chapterData.chapters.find((c) => c.number !== null && Math.floor(c.number) === Math.floor(requestedCh));

        // Jika nomor chapter melebihi chapter tersedia di Komiku, arahkan ke chapter terbaru atau halaman komik
        if (!selectedChapter) {
          selectedChapter = chapterData.latestChapter;
        }
      }
    }

    return {
      found: true,
      source: 'komiku',
      mangaUrl,
      readUrl: selectedChapter?.href || mangaUrl,
      selectedChapterLabel: selectedChapter?.label || null,
      targetChapter: requestedCh > 0 ? requestedCh : 1,
      latestChapter: chapterData?.latestChapter?.number || null,
      totalChapters: chapterData?.totalChapters || 0
    };
  }
};
