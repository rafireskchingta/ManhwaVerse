import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { comicModel } from './comicModel.js';

// Hook cerita & cuplikan ala Webtoon untuk memancing rasa penasaran pembaca
const WEBTOON_HOOKS = {
  '11111111-1111-1111-1111-111111111101': {
    newTitle: "Omniscient Reader’s Viewpoint • Dunia Berubah Jadi Novel!",
    newMsg:
      "\"Cuma aku yang baca novel ini sampai tamat...\" Saat dunia mendadak hancur persis seperti isi cerita favoritnya, mampukah Kim Dokja selamat?",
    updateTitle: "Omniscient Reader’s Viewpoint • Skenario Baru Dimulai!",
    updateMsg:
      "\"Aku bukan protagonisnya, aku pembacanya.\" Tipu daya Kim Dokja di chapter baru bikin para Rasi Bintang ikut tercengang! Sudah baca belum?"
  },
  '11111111-1111-1111-1111-111111111102': {
    newTitle: "The Villainess’s Blind Date • Duh, Keceplosan Pinjam Duit?!",
    newMsg:
      "Bangun-bangun jadi tokoh antagonis yang dibenci satu istana, eh pas kencan buta sama Duke Utara malah pinjam uang banyak banget?!",
    updateTitle: "The Villainess’s Blind Date Is Too Perfect • Baper Banget!",
    updateMsg:
      "Niatnya cuma pengen hidup baik-baik biar nggak kena akhir buruk, tapi kok sang Duke malah makin manis tiap ketemu?!"
  },
  '11111111-1111-1111-1111-111111111103': {
    newTitle: "The Beginning After The End • Raja Terkuat Terlahir Kembali",
    newMsg:
      "Dulu raja yang dingin dan kesepian, kini Arthur membuka mata di dunia penuh sihir dan monster. Kesempatan kedua dimulai di sini!",
    updateTitle: "TBATE • Ancaman di Balik Kedamaian Dicathen!",
    updateMsg:
      "\"Kali ini aku pasti melindungi orang-orang yang kucintai.\" Tapi bayangan perang besar mulai mengintai dari balik layar—cek kelanjutannya!"
  },
  '11111111-1111-1111-1111-111111111104': {
    newTitle: "I’m a Contract Stepmother • Dinikahi Kaisar Tiran?!",
    newMsg:
      "Harusnya cuma karakter figuran yang bakal mati di malam pernikahan, tapi kenapa Kaisar Tiran yang kejam itu tiba-tiba tertarik padaku?!",
    updateTitle: "Contract Stepmother • Kaisar Tiran Makin Overprotektif!",
    updateMsg:
      "Rencananya cuma mau manjain anak tiri favorit, eh malah sang Kaisar yang ikut posesif menjaga istrinya!"
  },
  '11111111-1111-1111-1111-111111111105': {
    newTitle: "The Return Of the Crazy Demon • Si Gila Balik Lagi!",
    newMsg:
      "Jatuh dari tebing gara-gara nyuri mutiara suci, Yi Zaha malah kembali ke masa saat ia masih jadi pelayan yang dipukulin... Habislah mereka semua!",
    updateTitle: "Crazy Demon • Aksi Brutal Tapi Bikin Ngakak!",
    updateMsg:
      "Musuh kira dia cuma pelayan lemah, padahal isinya pendekar gila nomor satu di murim! Jangan sampai ketinggalan chapter terbarunya!"
  },
  '11111111-1111-1111-1111-111111111106': {
    newTitle: "Iron-Blooded Sword Hound • Waktunya Membalas Dendam!",
    newMsg:
      "Sudah mengabdi sebagai anjing pemburu paling setia malah dieksekusi klan sendiri... Kini Vikir kembali 40 tahun ke masa lalu!",
    updateTitle: "Sword Hound • Mangsa Berikutnya Sudah Ditandai!",
    updateMsg:
      "\"Sekarang giliran kalian yang jadi mangsaku!\" Langkah demi langkah balas dendam Vikir terhadap klan Baskerville makin menegangkan!"
  },
  '11111111-1111-1111-1111-111111111107': {
    newTitle: "Solo Leveling • Dari Hunter Paling Lemah di Dunia...",
    newMsg:
      "Hampir mati di ruang bawah tanah tersembunyi, Sung Jinwoo tiba-tiba terpilih oleh 'Sistem' misterius untuk terus naik level tanpa batas!",
    updateTitle: "Solo Leveling • Satu Kata yang Bikin Merinding: 'Bangkitlah!'",
    updateMsg:
      "Dulu selalu diremehkan sebagai Hunter Rank-E paling lemah, sekarang pasukan bayangannya siap bikin musuh gemetar!"
  },
  '11111111-1111-1111-1111-111111111108': {
    newTitle: "The Greatest Estate Developer • Insinyur Nyasar ke Novel!",
    newMsg:
      "Mahasiswa teknik sipil bangun di tubuh bangsawan pemalas yang terlilit hutang raksasa. Senjata andalannya: sekop dan wajah super licik!",
    updateTitle: "Greatest Estate Developer • Ekspresi Legendaris Lloyd Hadir!",
    updateMsg:
      "Niat hati cuma mau bangun proyek biar cepat kaya, eh ujung-ujungnya harus nyelametin seluruh kerajaan! Siap-siap ketawa~"
  },
  '11111111-1111-1111-1111-111111111109': {
    newTitle: "Eleceed • Awas, Kucing Gendut Ini Galak Banget!",
    newMsg:
      "Seo Jiwoo cuma berniat menolong kucing jalanan yang terluka... Nggak tahunya di dalam tubuh kucing itu bersembunyi pengguna kekuatan legendaris!",
    updateTitle: "Eleceed • Latihan Maut Bersama Master Kayden!",
    updateMsg:
      "\"Kalau mau bertahan hidup, tunjukkan kekuatanmu!\" Pertarungan antar pengguna kemampuan super makin panas di chapter baru!"
  },
  '11111111-1111-1111-1111-111111111110': {
    newTitle: "Mercenary Enrollment • Jangan Pernah Sentuh Keluargaku!",
    newMsg:
      "Selamat dari kecelakaan pesawat lalu hidup 10 tahun sebagai tentara bayaran elit 001... Kini Yu Ijin pulang hanya demi satu hal: melindungi keluarganya.",
    updateTitle: "Mercenary Enrollment • Anak Baru Ini Bukan Siswa Biasa!",
    updateMsg:
      "Para perundung mengira bisa menindas adiknya sesuka hati—mereka belum tahu masa lalu kelam seorang Yu Ijin!"
  },
  '11111111-1111-1111-1111-111111111111': {
    newTitle: "Nano Machine • Teknologi Masa Depan di Dunia Persilatan!",
    newMsg:
      "Yatim piatu Sekte Iblis yang nyaris mati mendadak dikunjungi keturunannya dari masa depan dan disuntik mesin nano canggih!",
    updateTitle: "Nano Machine • 'Aktifkan Mode Tempur!'",
    updateMsg:
      "Dari murid terbuang yang terus diinjak-injak, kini Cheon Yeo-woon melesat menguasai teknik terlarang Sekte Iblis!"
  },
  '11111111-1111-1111-1111-111111111112': {
    newTitle: "Lookism • Keajaiban Dua Tubuh Park Hyung Suk!",
    newMsg:
      "Tiap hari dirundung gara-gara penampilannya, lalu suatu pagi dia terbangun dengan tubuh kedua yang tampan dan atletis sempurna!",
    updateTitle: "Lookism • Rahasia Empat Kru Besar Makin Memanas!",
    updateMsg:
      "Apa sebenarnya asal-usul kedua tubuh itu?! Pertarungan sengit antargenerasi kini sampai di titik penentuan!"
  },
  '11111111-1111-1111-1111-111111111113': {
    newTitle: "Pick Me Up • Terjebak Jadi Hero Bintang 1!",
    newMsg:
      "Master ranking 5 dunia malah tersedot ke dalam game gacha super kejam sebagai karakter level 1 bintang 1 yang mudah mati!",
    updateTitle: "Pick Me Up • Salah Pilih Lawan di Lantai Menara!",
    updateMsg:
      "\"Kalian macam-macam dengan orang yang salah.\" Saksikan bagaimana Loki memimpin tim pemula menembus lantai mematikan!"
  },
  '11111111-1111-1111-1111-111111111114': {
    newTitle: "SSS-Class Suicide Hunter • Mati Demi Menyalin Skill?!",
    newMsg:
      "Skill peringkat SSS akhirnya didapat... tapi cuma aktif kalau dia terbunuh dan memutar waktu 24 jam ke belakang?!",
    updateTitle: "SSS-Class Suicide Hunter • Harga Sebuah Kemenangan!",
    updateMsg:
      "Berapa kali pun harus mengulang kematian, Kim Gongja takkan berhenti sampai menyalip semua pemburu di puncak Menara!"
  },
  '11111111-1111-1111-1111-111111111115': {
    newTitle: "Swordmaster’s Youngest Son • Putra Bungsu yang Terbuang",
    newMsg:
      "Diusir dari keluarga pendekar pedang terhebat sampai menemui ajal tragis... sebelum dewa memberinya kesempatan kedua!",
    updateTitle: "Swordmaster’s Youngest Son • Pedang Runcandel Menggila!",
    updateMsg:
      "Kali ini tak ada lagi yang bisa menghentikan Jin Runcandel merebut takhta pendekar pedang terkuat di dunia!"
  },
  '11111111-1111-1111-1111-111111111116': {
    newTitle: "One Piece • Menuju Harta Karun Legendaris!",
    newMsg:
      "Ikuti pelayaran Monkey D. Luffy bersama Bajak Laut Topi Jerami menantang lautan Grand Line demi mimpi menjadi Raja Bajak Laut!",
    updateTitle: "One Piece • Rahasia Dunia Mulai Terungkap!",
    updateMsg:
      "\"Aku akan menjadi Raja Bajak Laut!\" Petualangan kru Topi Jerami makin mendebarkan di chapter terbaru—langsung cek!"
  },
  '11111111-1111-1111-1111-111111111117': {
    newTitle: "One Punch Man • Masalahnya: Terlalu Kuat!",
    newMsg:
      "Latihan keras tiap hari sampai rambut rontok semua, sekarang setiap monster langsung tumbang cuma gara-gara satu tinjuan!",
    updateTitle: "One Punch Man • Satu Pukulan Penentu!",
    updateMsg:
      "Para pahlawan kelas-S kewalahan menghadapi ancaman monster raksasa... Tinggal tunggu Saitama datang ke lokasi!"
  },
  '11111111-1111-1111-1111-111111111118': {
    newTitle: "Jujutsu Kaisen • Menelan Jari Raja Kutukan!",
    newMsg:
      "Hanya karena ingin menyelamatkan teman sekolahnya dari roh kutukan, hidup Yuji Itadori berubah total dalam satu malam!",
    updateTitle: "Jujutsu Kaisen • Pertarungan Kutukan Memasuki Puncak!",
    updateMsg:
      "Teknik perluasan domain demi menyelamatkan dunia penyihir jujutsu... Siapa yang sanggup bertahan kali ini?!"
  },
  '11111111-1111-1111-1111-111111111119': {
    newTitle: "Blue Lock • Lahirnya Striker Paling Egois!",
    newMsg:
      "300 striker SMA terbaik dikurung dalam fasilitas ekstrem. Cuma satu orang yang boleh berdiri sebagai striker nomor satu di dunia!",
    updateTitle: "Blue Lock • Gol Penentu atau Tersingkir Selamanya!",
    updateMsg:
      "\"Di lapangan, egois adalah senjata terbaik!\" Aksi Isagi Youichi melampaui batasnya berlanjut di chapter terbaru!"
  },
  '11111111-1111-1111-1111-111111111120': {
    newTitle: "Tower Of God • Apa yang Paling Kau Inginkan?",
    newMsg:
      "Anak yang awalnya nggak bisa apa-apa dan cuma masuk Menara demi mengejar sahabatnya, ternyata menyimpan takdir yang bikin penguasa Menara ketakutan!",
    updateTitle: "Tower Of God • Anak Lemah Itu Kini Mengguncang Menara!",
    updateMsg:
      "Dari yang awalnya nggak bisa apa-apa di lantai terbawah, kini Twenty-Fifth Bam berdiri menantang para High Ranker! Apa rahasia sebenarnya di puncak Menara?"
  },
  '11111111-1111-1111-1111-111111111121': {
    newTitle: "Chainsaw Man • Hidup Lagi Bersama Iblis Gergaji!",
    newMsg:
      "Dikhianati setelah bekerja mati-matian demi melunasi hutang, Denji bangkit kembali setelah menyatu dengan anjing iblis kesayangannya, Pochita!",
    updateTitle: "Chainsaw Man • Kekuatan Sebenarnya Mulai Lepas Kendali!",
    updateMsg:
      "Misi baru Pemburu Iblis makin kacau dan penuh kejutan—berani buka chapter terbarunya?"
  },
  '11111111-1111-1111-1111-111111111122': {
    newTitle: "Demonic Emperor • Kaisar Iblis Jadi Pengurus Rumah Tangga?!",
    newMsg:
      "Dikhianati murid kepercayaan saat memegang warisan terlarang, Zhuo Yifan terlahir ulang tanpa kultivasi dan terpaksa jadi pelayan bangsawan!",
    updateTitle: "Demonic Emperor • Jangan Pernah Remehkan Pelayan Satu Ini!",
    updateMsg:
      "Tampak seperti pengurus rumah tangga biasa, padahal sekali bergerak musuh seketika rata! Saksikan akal bulusnya di chapter baru!"
  }
};

// Berita & sorotan menarik bagi pembaca (masing-masing langsung mengarah ke komik terkait)
let customNotifications = [
  {
    id: 'news-spotlight-tog',
    type: 'news',
    title: "Sorotan Pembaca • Kenapa 'Anak Biasa' Ini Ditakuti Isi Menara?",
    message:
      "Ingat waktu Bam masih nggak bisa apa-apa dan cuma bilang 'Aku cuma mau ketemu Rachel'? Sekarang setiap langkahnya justru bikin para High Ranker gemetar! Cek perjalanan serunya di Tower Of God!",
    comic_id: '11111111-1111-1111-1111-111111111120',
    comic_title: 'Tower Of God',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/5c4da8f0047f.webp',
    link_url: '/comics/11111111-1111-1111-1111-111111111120',
    created_at: '2026-11-27T10:00:00.000Z'
  },
  {
    id: 'news-quote-orv',
    type: 'news',
    title: "Cuplikan Ikonik • \"Hanya Aku yang Tahu Akhir Cerita Ini\"",
    message:
      "Bayangin novel web yang cuma kamu baca sendirian selama 10 tahun mendadak jadi kenyataan... Kalau pengen manhwa dengan plot twist paling gila, Omniscient Reader’s Viewpoint wajib masuk bacaanmu!",
    comic_id: '11111111-1111-1111-1111-111111111101',
    comic_title: 'Omniscient Reader’s Viewpoint',
    cover_url: 'https://cdn.shinigami.gg/assets/image/93e85535-1327-49ed-8acd-afaaf4a18978.jpg',
    link_url: '/comics/11111111-1111-1111-1111-111111111101',
    created_at: '2026-11-27T08:30:00.000Z'
  },
  {
    id: 'news-finished-estate',
    type: 'news',
    title: "Kabar Gembira • The Greatest Estate Developer Sudah Tamat!",
    message:
      "Buat yang nungguin maraton tanpa digantung cliffhanger, kisah insinyur kocak Lloyd Frontera dari awal bangun wilayah sampai ending legendarisnya sekarang bisa dibaca penuh!",
    comic_id: '11111111-1111-1111-1111-111111111108',
    comic_title: 'The Greatest Estate Developer',
    cover_url: 'https://cdn.shinigami.gg/assets/image/1fc811da-99f2-4fe8-9c34-c9d7f12185ec.jpg',
    link_url: '/comics/11111111-1111-1111-1111-111111111108',
    created_at: '2026-11-27T06:00:00.000Z'
  },
  {
    id: 'news-recommend-crazydemon',
    type: 'news',
    title: "Rekomendasi Pekan Ini • Aksi Brutal Tapi Bikin Ngakak!",
    message:
      "\"Kau berani memukulku saat aku cuma pelayan?\" Dari pelayan rendahan yang diremehkan sampai jadi iblis paling nyeleneh di dunia murim—yuk kenalan dengan Yi Zaha di The Return Of the Crazy Demon!",
    comic_id: '11111111-1111-1111-1111-111111111105',
    comic_title: 'The Return Of the Crazy Demon',
    cover_url: 'https://cdn.shinigami.gg/assets/image/7448838a-7456-450a-bd9e-248097e92cea.jpg',
    link_url: '/comics/11111111-1111-1111-1111-111111111105',
    created_at: '2026-11-26T20:00:00.000Z'
  }
];

const isMissingTableError = (error) =>
  error && (error.code === '42P01' || error.code === 'PGRST205');

export const notificationModel = {
  /**
   * Menggabungkan berita menarik pembaca dan notifikasi otomatis Manhwa Baru
   * serta Update Chapter Baru bergaya Webtoon yang mengarah langsung ke detail komiknya.
   */
  async getAll({ type = '', limit = 40 } = {}) {
    let storedItems = [...customNotifications];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) {
          if (!isMissingTableError(error)) throw error;
        } else if (Array.isArray(data) && data.length > 0) {
          const existingIds = new Set(data.map((d) => d.id));
          storedItems = [
            ...data,
            ...storedItems.filter((item) => !existingIds.has(item.id))
          ];
        }
      } catch (err) {
        if (!isMissingTableError(err)) {
          console.warn('[notificationModel] Gagal membaca tabel notifications:', err.message);
        }
      }
    }

    const comics = await comicModel.getAll({ limit: 50 });
    const comicById = new Map(comics.map((c) => [c.id, c]));

    // Lengkapi cover & judul terbaru pada item berita yang menaut ke komik
    storedItems = storedItems.map((item) => {
      const linked = item.comic_id ? comicById.get(item.comic_id) : null;
      return linked
        ? {
            ...item,
            comic_title: item.comic_title || linked.title,
            cover_url: item.cover_url || linked.cover_url || null,
            link_url: item.link_url || `/comics/${linked.id}`
          }
        : item;
    });

    // 1. Notifikasi Manhwa Baru (gaya teaser bikin penasaran)
    const newestComics = [...comics]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 6);

    const newComicNotifications = newestComics.map((comic) => {
      const hook = WEBTOON_HOOKS[comic.id];
      return {
        id: `new-comic-${comic.id}`,
        type: 'new_comic',
        title: hook?.newTitle || `Manhwa Baru • ${comic.title}`,
        message:
          hook?.newMsg ||
          `Ada cerita baru nih! Yuk kenalan dengan ${comic.title}${comic.author ? ` karya ${comic.author}` : ''} dan rasakan sendiri keseruannya dari chapter pertama~`,
        comic_id: comic.id,
        comic_title: comic.title,
        cover_url: comic.cover_url || null,
        link_url: `/comics/${comic.id}`,
        created_at: comic.created_at || new Date().toISOString()
      };
    });

    // 2. Notifikasi Update Chapter Baru (gaya cuplikan / cliffhanger Webtoon)
    const updatedComics = [...comics]
      .filter((c) => Number(c.total_chapters) > 0)
      .sort(
        (a, b) =>
          new Date(b.last_updated || b.created_at || 0) -
          new Date(a.last_updated || a.created_at || 0)
      )
      .slice(0, 8);

    const chapterUpdateNotifications = updatedComics.map((comic) => {
      const hook = WEBTOON_HOOKS[comic.id];
      return {
        id: `chapter-update-${comic.id}-ch${comic.total_chapters}`,
        type: 'chapter_update',
        title:
          hook?.updateTitle ||
          `${comic.title} • Chapter ${comic.total_chapters} Makin Tegang!`,
        message:
          hook?.updateMsg ||
          `Kelanjutan ${comic.title} di Chapter ${comic.total_chapters} sudah rilis! Kira-kira kejutan apa lagi yang bakal terjadi kali ini? Langsung baca sekarang~`,
        comic_id: comic.id,
        comic_title: comic.title,
        cover_url: comic.cover_url || null,
        link_url: `/comics/${comic.id}`,
        created_at: comic.last_updated || comic.created_at || new Date().toISOString()
      };
    });

    // Gabungkan & hindari duplikasi ID
    const mergedMap = new Map();
    for (const item of [...storedItems, ...chapterUpdateNotifications, ...newComicNotifications]) {
      if (item && item.id && !mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    }

    let combined = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    if (type && type !== 'all') {
      combined = combined.filter((item) => item.type === type);
    }

    return combined.slice(0, limit);
  },

  /**
   * Mencatat notifikasi bergaya Webtoon otomatis saat Admin menambah komik / update chapter.
   */
  async recordComicEvent(eventType, comic) {
    if (!comic || !comic.id) return null;

    const isNew = eventType === 'new_comic';
    const hook = WEBTOON_HOOKS[comic.id];

    const item = {
      id: isNew
        ? `new-comic-${comic.id}`
        : `chapter-update-${comic.id}-ch${comic.total_chapters || 0}`,
      type: isNew ? 'new_comic' : 'chapter_update',
      title: isNew
        ? hook?.newTitle || `Manhwa Baru • ${comic.title}`
        : hook?.updateTitle || `${comic.title} • Chapter ${comic.total_chapters || 0} Telah Rilis!`,
      message: isNew
        ? hook?.newMsg ||
          `Pendatang baru siap memikat hatimu! Jangan lewatkan awal kisah ${comic.title}${comic.author ? ` karya ${comic.author}` : ''} mulai dari chapter pertama!`
        : hook?.updateMsg ||
          `Ada kejutan baru di ${comic.title} Chapter ${comic.total_chapters || 0}! Yuk lanjutkan bacaanmu sekarang sebelum kena spoiler~`,
      comic_id: comic.id,
      comic_title: comic.title,
      cover_url: comic.cover_url || null,
      link_url: `/comics/${comic.id}`,
      created_at: new Date().toISOString()
    };

    return this.create(item);
  },

  async create({
    id,
    type = 'news',
    title,
    message,
    comic_id = null,
    comic_title = null,
    cover_url = null,
    link_url = null,
    created_at
  }) {
    const newItem = {
      id: id || `${type}-${Date.now()}`,
      type,
      title,
      message,
      comic_id: comic_id || null,
      comic_title: comic_title || null,
      cover_url: cover_url || null,
      link_url: link_url || (comic_id ? `/comics/${comic_id}` : null),
      created_at: created_at || new Date().toISOString()
    };

    customNotifications = [
      newItem,
      ...customNotifications.filter((n) => n.id !== newItem.id)
    ];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from('notifications')
          .upsert([newItem], { onConflict: 'id' })
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        if (!isMissingTableError(err)) {
          console.warn('[notificationModel] Fallback ke penyimpanan lokal:', err.message);
        }
      }
    }

    return newItem;
  },

  async remove(id) {
    const beforeLen = customNotifications.length;
    customNotifications = customNotifications.filter((n) => n.id !== id);
    let removed = customNotifications.length < beforeLen;

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabaseAdmin.from('notifications').delete().eq('id', id);
        if (!error) removed = true;
      } catch (err) {
        if (!isMissingTableError(err)) {
          console.warn('[notificationModel] Gagal hapus notifikasi di Supabase:', err.message);
        }
      }
    }

    return removed;
  }
};
