import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// Fallback seed data jika Supabase belum dihubungkan pengguna
let fallbackComics = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    title: "Omniscient Reader's Viewpoint",
    alternative_title: 'Sudut Pandang Pembaca Serba Tahu',
    synopsis: 'Kim Dokja adalah pekerja kantoran biasa yang menjadi satu-satunya pembaca novel web apokaliptik selama 10 tahun. Saat chapter terakhir novel tersebut dirilis, dunia tiba-tiba berubah persis seperti skenario novel fiksi tersebut. Hanya Dokja yang mengetahui akhir dari kehancuran dunia ini.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/omniscient-readers-viewpoint/manga_thumbnail-Komik-Omniscient-Readers-Viewpoint.jpg?w=500',
    author: 'Sing Shong, Sleepy-C',
    status: 'Ongoing',
    total_chapters: 317,
    created_at: new Date('2024-01-01').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    title: 'The Time-Limited Villainess Who Makes Medicine',
    alternative_title: 'Villainess Pembuat Obat',
    synopsis: 'Seorang perempuan tiba-tiba terbangun dalam tubuh tokoh antagonis di sebuah novel. Ia mengetahui bahwa hidupnya tidak akan berlangsung lama, sementara akhir cerita telah menetapkannya sebagai penjahat yang dibenci semua orang. Berbekal pengetahuan tentang pengobatan dan kemampuan meracik obat, ia memutuskan untuk mengubah nasibnya sebelum waktu yang tersisa habis.',
    cover_url: 'https://thumbnail.komiku.org/new/img/images/2026/11/24/20261124221519_38508ca8ab4d7447_9b7c3d33.webp?w=500',
    author: 'Komiku',
    status: 'Ongoing',
    total_chapters: 6,
    created_at: new Date('2024-01-02').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    title: 'The Beginning After the End',
    alternative_title: 'Awal Dari Akhir / TBATE',
    synopsis: 'Raja Grey memiliki kekuatan, kekayaan, dan prestise yang tak tertandingi di dunia militer, namun kesepian menyelimutinya. Bereinkarnasi di dunia sihir dan monster yang asing sebagai Arthur Leywin, ia memiliki kesempatan kedua untuk melindungi orang-orang yang dicintainya dan menebus kesalahan masa lalunya.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/the-beginning-after-the-end/manga_thumbnail-Manhwa-The-Beginning-After-The-End-1.jpg?w=500',
    author: 'TurtleMe, Fuyuki23',
    status: 'Ongoing',
    total_chapters: 259,
    created_at: new Date('2024-01-03').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    title: 'I’m a Contract Stepmother, but the Tyrant Is Way Too Overprotective',
    alternative_title: 'Ibu Tiri Kontrak Kaisar Tiran',
    synopsis: 'Seorang wanita modern terlempar ke dunia aristokrat dan menerima tawaran pernikahan kontrak dengan kaisar yang dijuluki tiran. Target utamanya sederhana: menjadi ibu tiri yang baik, jaga jarak, lalu pamit setelah masa kontrak berakhir. Namun sang kaisar tiran justru menunjukkan proteksi berlebihan di tengah tajamnya intrik politik istana.',
    cover_url: 'https://thumbnail.komiku.org/new/img/images/2026/07/21/20260721174513_eb6f6b3b177f21e6_5b13d7f6.jpg?w=500',
    author: 'Komiku',
    status: 'Ongoing',
    total_chapters: 60,
    created_at: new Date('2024-01-04').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    title: 'The Boxer',
    alternative_title: 'Sang Petinju',
    synopsis: 'Yoon Jiho (Yu) adalah pemuda dengan refleks dan bakat tinju luar biasa namun memiliki kepribadian dingin dan hampa akibat masa lalu kelam. Di bawah pelatihan pelatih legendaris K, ia menapaki ring tinju menghadapi berbagai juara dunia demi menemukan makna kehidupan dan kemanusiaan.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/the-boxer/manga_thumbnail-Manhwa-The-Boxer.jpg?w=500',
    author: 'JH',
    status: 'Completed',
    total_chapters: 104,
    created_at: new Date('2024-01-05').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    title: 'I’ll Be a Villain in This Life',
    alternative_title: 'Menjadi Penjahat di Kehidupan Ini',
    synopsis: 'Terlahir kembali di dunia penuh intrik dan perebutan kekuasaan, sang tokoh utama bertekad mengambil peran sebagai penjahat demi mengubah takdirnya. Dengan strategi tajam dan pengalaman masa lalu, ia bertahan dari pengkhianatan demi merebut kendali hidupnya.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/ill-be-a-villain-in-this-life/manga_thumbnail-Head-Ill-Be-a-Villain-in-This-Life.jpeg?w=500',
    author: 'Jina Pak',
    status: 'Ongoing',
    total_chapters: 50,
    created_at: new Date('2024-01-06').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    title: 'Solo Leveling',
    alternative_title: 'Naik Level Sendiri / Only I Level Up',
    synopsis: 'Di dunia di mana para pemburu bertarung melawan makhluk dari dunia lain melalui portal misterius, Sung Jinwoo adalah pemburu dengan kekuatan yang sangat lemah. Namun, semuanya berubah ketika ia mendapatkan kemampuan khusus dari Sistem yang memungkinkannya untuk naik level secara mandiri dan menjadi semakin kuat tanpa batas.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/solo-leveling-sub-indo/manga_thumbnail-Head-I-Alone-Leveling.png?w=500',
    author: 'Chugong, DUBU',
    status: 'Completed',
    total_chapters: 180,
    created_at: new Date('2024-01-07').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    title: 'The World’s Best Engineer',
    alternative_title: 'The Greatest Estate Developer / Insinyur Terbaik di Dunia',
    synopsis: 'Suho Kim, mahasiswa teknik sipil Korea, terbangun di dalam novel fantasi sebagai Lloyd Frontera—bangsawan pemalas dengan wilayah kekuasaan yang terlilit hutang raksasa. Berbekal ilmu teknik sipil modern dan makhluk kontrak sihir, ia membangun infrastruktur megah dan mengubah nasib wilayahnya.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/the-worlds-best-engineer/manga_thumbnail-The-Greatest-Estate-Developer.jpg?w=500',
    author: 'BK_Moon, Min Jae',
    status: 'Ongoing',
    total_chapters: 222,
    created_at: new Date('2024-01-08').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111109',
    title: 'Return of the Flowery Mountain Sect',
    alternative_title: 'Kembalinya Sekte Gunung Mekar / Return of the Mount Hua Sect',
    synopsis: 'Chung Myung, Tetua Agung Sekte Gunung Hua bergelar Santo Pedang Bunga Plum, terlahir kembali seratus tahun setelah perang besar. Mendapati sektenya kini telah runtuh dan dilupakan, ia bertekad mengembalikan kejayaan Sekte Gunung Mekar ke puncak dunia seni bela diri.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/return-of-the-flowery-mountain-sect/manga_thumbnail-Manhwa-Return-of-the-Flowery-Mountain-Sect.jpg?w=500',
    author: 'Biga, LICO',
    status: 'Ongoing',
    total_chapters: 189,
    created_at: new Date('2024-01-09').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111110',
    title: 'Mercenary Enrollment',
    alternative_title: 'Pendaftaran Tentara Bayaran / Teenage Mercenary',
    synopsis: 'Yu Ijin kembali ke kehidupan sekolah biasa di Korea Selatan setelah menghabiskan masa mudanya sebagai tentara bayaran elit. Ia menggunakan kemampuan tempurnya untuk melindungi kakek, adik perempuannya, serta teman-teman sekolahnya dari berbagai ancaman masa lalu.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/mercenary-enrollment/manga_thumbnail-Manhwa-Mercenary-Enrollment.jpg?w=500',
    author: 'YC, Rakhyun',
    status: 'Ongoing',
    total_chapters: 280,
    created_at: new Date('2024-01-10').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Nano Machine',
    alternative_title: 'Mesin Nano',
    synopsis: 'Cheon Yeo-woon, pewaris klan yang diremehkan oleh anggota keluarganya sendiri, mengalami perubahan nasib drastis setelah menerima suntikan teknologi mesin nano canggih dari keturunannya di masa depan demi memulihkan kehormatan dan menguasai kultus iblis.',
    cover_url: 'https://thumbnail.komiku.org/img/upload/nano_machine/img_693126dac89353.00003505.jpg?w=500',
    author: 'Hwang Yongjae, Han Joong-Wueol-Ya',
    status: 'Ongoing',
    total_chapters: 339,
    created_at: new Date('2024-01-11').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    title: 'Lookism',
    alternative_title: 'Penampilan',
    synopsis: 'Park Hyung Suk adalah remaja yang kerap dirundung karena penampilannya. Suatu hari ia terbangun memiliki tubuh kedua yang tampan dan atletis sempurna, lalu menghadapi konflik sosial sekolah, pertarungan geng, hingga misteri di balik kedua tubuhnya.',
    cover_url: 'https://thumbnail.komiku.org/img/upload/lookism/img_683169399d3869.32259029.jpg?w=500',
    author: 'Park Tae-jun',
    status: 'Ongoing',
    total_chapters: 635,
    created_at: new Date('2024-01-12').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    title: 'Pick Me Up',
    alternative_title: 'Pick Me Up, Infinite Gacha',
    synopsis: 'Han Islat, pemain nomor satu di game gacha tingkat kesulitan mustahil, tiba-tiba ditarik masuk ke dalam dunia gamenya sendiri sebagai karakter hero bintang 1 yang harus bertahan hidup menaklukkan lantai menara mematikan.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/pick-me-up/manga_thumbnail-Pick-Me-Up-1.png?w=500',
    author: 'Hermod, Wasak Basak',
    status: 'Ongoing',
    total_chapters: 229,
    created_at: new Date('2024-01-13').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    title: 'SSS-Class Suicide Hunter',
    alternative_title: 'Pemburu Bunuh Diri Kelas SSS',
    synopsis: 'Kim Gong-ja mendapatkan skill peringkat SSS yang memungkinkannya meniru kekuatan orang yang membunuhnya dan memutar kembali waktu 24 jam ke belakang setiap kali ia mati. Bertekad mengubah nasibnya di Menara, ia memanfaatkan kematian untuk menjadi pemburu terkuat.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/sss-class-suicide-hunter/manga_thumbnail-Manhwa-SSS-Class-Suicide-Hunter.jpg?w=500',
    author: 'Shin Noah, Bill K',
    status: 'Ongoing',
    total_chapters: 160,
    created_at: new Date('2024-01-14').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111115',
    title: 'Overgeared New',
    alternative_title: 'Kerja Keras Tanpa Henti',
    synopsis: 'Shin Youngwoo menemukan game realitas virtual Satisfy dan memperoleh kelas tersembunyi pandai besi legendaris Pagma. Memanfaatkan kreativitas dan kerja kerasnya, ia menempa senjata terkuat sekaligus menjadi pemain papan atas.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/overgeared-new/manga_thumbnail-Manhua-Overgeared-New.jpg?w=500',
    author: 'Park Saenal',
    status: 'Ongoing',
    total_chapters: 349,
    created_at: new Date('2024-01-15').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111116',
    title: 'One Piece',
    alternative_title: 'One Piece: Harta Karun Legendaris',
    synopsis: 'One Piece mengikuti petualangan Monkey D. Luffy dan kru Bajak Laut Topi Jerami mengarungi lautan Grand Line demi menemukan harta karun legendaris One Piece dan meraih gelar Raja Bajak Laut.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/komik-one-piece-indo/manga_thumbnail-Komik-One-Piece.jpg?w=500',
    author: 'Eiichiro Oda',
    status: 'Ongoing',
    total_chapters: 1199,
    created_at: new Date('2024-01-16').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111117',
    title: 'One Punch Man',
    alternative_title: 'Satu Pukulan',
    synopsis: 'Saitama adalah pahlawan super yang mampu mengalahkan musuh manapun hanya dengan satu pukulan. Merasa bosan karena tak kunjung menemukan lawan sepadan, ia bergabung dengan Asosiasi Pahlawan menghadapi berbagai ancaman monster.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/manga-one-punch-man/manga_thumbnail-Komik-One-Punch-Man.jpg?w=500',
    author: 'ONE, Yusuke Murata',
    status: 'Ongoing',
    total_chapters: 314,
    created_at: new Date('2024-01-17').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111118',
    title: 'Jujutsu Kaisen',
    alternative_title: 'Kutukan Pemburu',
    synopsis: 'Yuji Itadori terlibat dalam dunia ilmu kutukan setelah menelan jari terkutuk Raja Kutukan Sukuna. Bersama Megumi dan Nobara di bawah bimbingan Satoru Gojo, ia bertempur melawan roh kutukan berbahaya.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/jujutsu-kaisen-indo/manga_thumbnail-Manhua-Jujutsu-Kaisen.jpg?w=500',
    author: 'Gege Akutami',
    status: 'Completed',
    total_chapters: 271,
    created_at: new Date('2024-01-18').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111119',
    title: 'Blue Lock',
    alternative_title: 'Penjara Biru',
    synopsis: 'Setelah kegagalan di Piala Dunia, Jepang meluncurkan fasilitas pelatihan ekstrem Blue Lock untuk mencetak striker paling egois dan mematikan di dunia. Yoichi Isagi berjuang menyingkirkan ratusan rival demi bertahan.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/blue-lock/manga_thumbnail-Manga-Blue-Lock.jpg?w=500',
    author: 'Muneyuki Kaneshiro',
    status: 'Ongoing',
    total_chapters: 370,
    created_at: new Date('2024-01-19').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111120',
    title: 'Kimetsu no Yaiba',
    alternative_title: 'Pembasmi Iblis / Demon Slayer',
    synopsis: 'Tanjiro Kamado bergabung dengan Korps Pembasmi Iblis setelah keluarganya dibantai iblis dan adiknya Nezuko berubah menjadi iblis. Ia mengembara mencari cara menyembuhkan Nezuko dan memburu Muzan Kibutsuji.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/kimetsu-no-yaiba-indonesia/manga_thumbnail-Komik-Kimetsu-no-Yaiba.jpg?w=500',
    author: 'Koyoharu Gotouge',
    status: 'Completed',
    total_chapters: 205,
    created_at: new Date('2024-01-20').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111121',
    title: 'Chainsaw Man',
    alternative_title: 'Manusia Gergaji Mesin',
    synopsis: 'Denji, pemuda miskin yang hidup bersama iblis gergaji Pochita, hidup kembali sebagai manusia setengah iblis Chainsaw Man setelah dikhianati yakuza. Ia direkrut oleh Divisi Khusus Pemburu Iblis.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/123213-chainsaw-man/manga_thumbnail-Manga-Chainsaw-Man.jpg?w=500',
    author: 'Tatsuki Fujimoto',
    status: 'Completed',
    total_chapters: 232,
    created_at: new Date('2024-01-21').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111122',
    title: 'Absolute Sword Sense',
    alternative_title: 'Indra Pedang Mutlak',
    synopsis: 'So Woon-hwi, mantan mata-mata klan darah yang dikhianati setelah kehilangan energi dalamnya, bereinkarnasi 10 tahun ke masa lalu saat baru diculik. Kali ini ia memperoleh kemampuan misterius untuk mendengar suara para pedang kuno.',
    cover_url: 'https://thumbnail.komiku.org/uploads/manga/absolute-sword-sense/manga_thumbnail-Manhwa-Absolute-Sword-Sense.jpg?w=500',
    author: 'Joo-seok Kang',
    status: 'Ongoing',
    total_chapters: 211,
    created_at: new Date('2024-01-22').toISOString(),
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' },
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' }
    ]
  }
];

// Helper untuk membersihkan struktur relasi comic_genres
const formatComicWithGenres = (comic) => {
  if (!comic) return null;
  const genres =
    comic.comic_genres && Array.isArray(comic.comic_genres)
      ? comic.comic_genres.map((cg) => cg.genres).filter(Boolean)
      : comic.genres || [];

  const { comic_genres, ...rest } = comic;
  return {
    ...rest,
    genres
  };
};

export const comicModel = {
  async getAll({ search = '', genre = '', status = '', limit = 50, offset = 0, isDeleted = false } = {}) {
    if (!isSupabaseConfigured()) {
      let filtered = [...fallbackComics];

      if (isDeleted) {
        filtered = filtered.filter((c) => Boolean(c.deleted_at));
      } else {
        filtered = filtered.filter((c) => !c.deleted_at);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            (c.alternative_title && c.alternative_title.toLowerCase().includes(q)) ||
            (c.author && c.author.toLowerCase().includes(q))
        );
      }

      if (genre) {
        const gQuery = genre.toLowerCase();
        filtered = filtered.filter((c) =>
          c.genres.some((g) => g.name.toLowerCase() === gQuery || g.id === genre)
        );
      }

      if (status) {
        filtered = filtered.filter((c) => c.status.toLowerCase() === status.toLowerCase());
      }

      return filtered.slice(offset, offset + limit);
    }

    let query = supabaseAdmin
      .from('comics')
      .select('*, comic_genres(genres(*))')
      .order('created_at', { ascending: false });

    if (isDeleted) {
      query = query.not('deleted_at', 'is', null);
    } else {
      query = query.is('deleted_at', null);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,alternative_title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    let { data, error } = await query;
    if (error) {
      // Jika kolom deleted_at belum dibuat di tabel Supabase
      if (error.code === '42703' && !isDeleted) {
        let fallbackQuery = supabaseAdmin
          .from('comics')
          .select('*, comic_genres(genres(*))')
          .order('created_at', { ascending: false });
        if (search) {
          fallbackQuery = fallbackQuery.or(`title.ilike.%${search}%,alternative_title.ilike.%${search}%,author.ilike.%${search}%`);
        }
        if (status) fallbackQuery = fallbackQuery.eq('status', status);
        const res = await fallbackQuery;
        if (res.error) throw res.error;
        data = res.data;
      } else if (error.code === '42703' && isDeleted) {
        return [];
      } else {
        throw error;
      }
    }

    let result = (data || []).map(formatComicWithGenres);

    if (genre) {
      const gQuery = genre.toLowerCase();
      result = result.filter((c) =>
        c.genres.some((g) => g.name.toLowerCase() === gQuery || g.id === genre)
      );
    }

    return result.slice(offset, offset + limit);
  },

  async getById(id) {
    if (!isSupabaseConfigured()) {
      const comic = fallbackComics.find((c) => c.id === id);
      return comic ? { ...comic } : null;
    }

    const { data, error } = await supabaseAdmin
      .from('comics')
      .select('*, comic_genres(genres(*)), characters(*)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return formatComicWithGenres(data);
  },

  async create({
    title,
    alternative_title = '',
    synopsis = '',
    cover_url = '',
    author = '',
    status = 'Ongoing',
    total_chapters = 0,
    genre_ids = []
  }) {
    if (!isSupabaseConfigured()) {
      const newComic = {
        id: `mock-comic-${Date.now()}`,
        title,
        alternative_title,
        synopsis,
        cover_url: cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        author,
        status,
        total_chapters: Number(total_chapters) || 0,
        created_at: new Date().toISOString(),
        genres: genre_ids.map((gid) => ({ id: gid, name: 'Genre' }))
      };
      fallbackComics.unshift(newComic);
      return newComic;
    }

    // Insert komik baru
    const { data: comic, error: comicError } = await supabaseAdmin
      .from('comics')
      .insert([
        {
          title,
          alternative_title,
          synopsis,
          cover_url,
          author,
          status,
          total_chapters: Number(total_chapters) || 0
        }
      ])
      .select()
      .single();

    if (comicError) throw comicError;

    // Hubungkan genre jika ada
    if (genre_ids && genre_ids.length > 0) {
      const relationRows = genre_ids.map((genre_id) => ({
        comic_id: comic.id,
        genre_id
      }));

      const { error: genreRelError } = await supabaseAdmin
        .from('comic_genres')
        .insert(relationRows);

      if (genreRelError) console.error('Gagal menghubungkan genre:', genreRelError);
    }

    return this.getById(comic.id);
  },

  async update(id, {
    title,
    alternative_title,
    synopsis,
    cover_url,
    author,
    status,
    total_chapters,
    genre_ids
  }) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      fallbackComics[idx] = {
        ...fallbackComics[idx],
        ...(title !== undefined && { title }),
        ...(alternative_title !== undefined && { alternative_title }),
        ...(synopsis !== undefined && { synopsis }),
        ...(cover_url !== undefined && { cover_url }),
        ...(author !== undefined && { author }),
        ...(status !== undefined && { status }),
        ...(total_chapters !== undefined && { total_chapters: Number(total_chapters) })
      };
      return fallbackComics[idx];
    }

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (alternative_title !== undefined) updatePayload.alternative_title = alternative_title;
    if (synopsis !== undefined) updatePayload.synopsis = synopsis;
    if (cover_url !== undefined) updatePayload.cover_url = cover_url;
    if (author !== undefined) updatePayload.author = author;
    if (status !== undefined) updatePayload.status = status;
    if (total_chapters !== undefined) updatePayload.total_chapters = Number(total_chapters);
    updatePayload.last_updated = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from('comics')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) throw updateError;

    // Perbarui relasi genre jika genre_ids diberikan
    if (genre_ids && Array.isArray(genre_ids)) {
      await supabaseAdmin.from('comic_genres').delete().eq('comic_id', id);
      if (genre_ids.length > 0) {
        const relationRows = genre_ids.map((genre_id) => ({
          comic_id: id,
          genre_id
        }));
        await supabaseAdmin.from('comic_genres').insert(relationRows);
      }
    }

    return this.getById(id);
  },

  async softDelete(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackComics[idx].deleted_at = new Date().toISOString();
      return true;
    }

    const { error } = await supabaseAdmin
      .from('comics')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async restore(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackComics[idx].deleted_at = null;
      return true;
    }

    const { error } = await supabaseAdmin
      .from('comics')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async hardDelete(id) {
    if (!isSupabaseConfigured()) {
      const idx = fallbackComics.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      fallbackComics.splice(idx, 1);
      return true;
    }

    // Bersihkan relasi terlebih dahulu
    try {
      await supabaseAdmin.from('comic_genres').delete().eq('comic_id', id);
      await supabaseAdmin.from('characters').delete().eq('comic_id', id);
      await supabaseAdmin.from('reading_tracker').delete().eq('comic_id', id);
    } catch (e) {
      console.warn('Pembersihan relasi komik:', e.message);
    }

    const { error } = await supabaseAdmin.from('comics').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async delete(id, { hard = false } = {}) {
    if (hard) {
      return this.hardDelete(id);
    }
    return this.softDelete(id);
  }
};
