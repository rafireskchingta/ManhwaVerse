import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// Fallback seed data jika Supabase belum dihubungkan pengguna
let fallbackComics = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    title: 'Omniscient Reader’s Viewpoint',
    alternative_title: 'Prespektif Pembaca Mahatahu / 전지적 독자 시점',
    synopsis: 'Kim Dokja adalah pekerja kantoran biasa yang minat satusatunya adalah membaca novel web favoritnya Tiga Cara untuk Bertahan dari Kiamat Tetapi ketika novel itu tibatiba menjadi kenyataan dia adalah satusatunya orang yang tahu bagaimana dunia akan berakhir Berbekal hal tersebut Dokja menggunakan pemahamannya untuk mengubah jalannya cerita dan dunia seperti yang dia tahu',
    cover_url: 'https://cdn.shinigami.gg/assets/image/93e85535-1327-49ed-8acd-afaaf4a18978.jpg',
    author: 'Sing N Song, Redice Studio, UMI',
    status: 'Ongoing',
    total_chapters: 317,
    deleted_at: null,
    created_at: '2024-01-01T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    title: 'The Villainess’s Blind Date Is Too Perfect',
    alternative_title: '악녀의 맞선남이 너무 완벽하다 / Der perfekte Verlobungskandidat für die Bösewichtin',
    synopsis: 'Aku masuk ke novel fantasi romansa yang sering kubaca dan menjadi tokoh antagonis, Yvonne Argentrose yang cintanya pada putra mahkota tidak terbalaskan. Ayah dan kakakku takut melihat aku berubah jadi baik dan penurut sampai akhirnya menjodohkanku dengan duke tampan dari utara. Tapi, di awal pertemuan kami, aku meminjam banyak uang padanya karena tubuh penyihir yang kumasuki mengalami amnesia sihir. Aku akan melakukan semua hal agar bisa memperbaiki kondisi tubuhku dan menjadi baik!',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/banner_1784711567308_abkhs6.jpg',
    author: 'Chae Jooah',
    status: 'Ongoing',
    total_chapters: 150,
    deleted_at: null,
    created_at: '2024-01-02T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    title: 'The Beginning After The End',
    alternative_title: 'TBATE, 끝이 아닌 시작 / The Beginning After the End',
    synopsis: 'Raja Gray memiliki kekuatan kekayaan dan prestise yang tak tertandingi di dunia yang diatur oleh kemampuan bela diri Namun kesendirian tetap ada di belakang mereka yang memiliki kekuatan besar Di bawah eksterior glamor seorang raja yang kuat mengintai cangkang manusia tanpa tujuan dan kemauan Bereinkarnasi ke dunia baru yang penuh dengan sihir dan monster raja memiliki kesempatan kedua untuk menghidupkan kembali hidupnya Namun memperbaiki kesalahan masa lalunya tidak akan menjadi satusatunya tantangannya Di bawah kedamaian dan kemakmuran dunia baru adalah arus bawah yang mengancam untuk menghancurkan semua yang telah dia kerjakan mempertanyakan peran dan alasannya untuk dilahirkan kembali',
    cover_url: 'https://cdn.shinigami.gg/assets/image/4e96144f-2f24-4fac-b3dc-035bf5625fe1.jpg',
    author: 'TurtleMe',
    status: 'Ongoing',
    total_chapters: 258,
    deleted_at: null,
    created_at: '2024-01-03T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    title: 'I’m a Contract Stepmother, but the Tyrant Is Way Too Overprotective',
    alternative_title: "계약 계모인데, 폭군이 너무 과보호해요 / I'm a Contract Stepmother, but the Tyrant Is Way Too Overprotective",
    synopsis: 'Saya membuka mata saya dan menemukan diri saya di tubuh pengantin massa, karakter sampingan tanpa nama yang ditakdirkan untuk mati pada malam pernikahannya di tangan tiran kejam Kekaisaran, Kaisar Nathan. Untuk menghindari nasib tragis itu, saya memutuskan untuk menghindari masalah dan hidup dengan tenang sebagai figuran latar belakang. Tetapi untuk beberapa alasan, Nathan tiba-tiba tertarik pada saya, dan sebelum saya menyadarinya, kami sudah menikah! Saya pikir semuanya sudah berakhir untuk saya … sampai aku menemukan rahasia terbesar Kaisar, yang menjamin keselamatanku alih-alih kematianku. Sekarang setelah saya aman, saya akhirnya bisa melakukan apa yang benar-benar saya sukai: menghujani putri tiri saya yang menggemaskan (dan karakter favorit mutlak) dengan semua cinta yang pantas dia dapatkan! Itulah rencananya. Kecuali… entah bagaimana, yang disebut tiran yang malah memanjakanku?! Fantasi yang berdebar tentang keluarga, fandom, dan cinta tak terduga dimulai!',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/banner_1785860545719_1j2eld.jpg',
    author: 'Tsuruko.',
    status: 'Ongoing',
    total_chapters: 60,
    deleted_at: null,
    created_at: '2024-01-04T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    title: 'The Return Of the Crazy Demon',
    alternative_title: '광마회귀 , Return of The Mad Demon / Return of the Mad Demon',
    synopsis: 'Yi Zaha Crazy Demon yang tergilagila pada seni bela diri Saat dia melarikan diri setelah mencuri Heavenly Pearl dari Lord Kultus Demonic dia jatuh dari tebing Setelah berpikir bahwa semuanya sudah berakhir dia membuka matanya untuk melihat bahwa dia telah kembali ke saat dia menjadi Servant Dan dia dipukuli karena sesuatu yang tidak dia lakukan Crazy Demon yang kembali ke awal hariharinya sebagai Servant',
    cover_url: 'https://cdn.shinigami.gg/assets/image/7448838a-7456-450a-bd9e-248097e92cea.jpg',
    author: 'JP, Yu Jin Sung',
    status: 'Ongoing',
    total_chapters: 221,
    deleted_at: null,
    created_at: '2024-01-05T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    title: 'Revenge Of The Iron-Blooded Sword Hound',
    alternative_title: '철혈검가 사냥개의 회귀 / Cheolhyeolgeomga Sanyanggaeui Hoegwi',
    synopsis: 'Anjing pemburu dari keluarga Baskerville Dia dicap sebagai seorang pengkhianat dan dieksekusi lau dia ditinggalkan di saat terakhirnya Sekarang dia sudah kembali ke 40 tahun yang lalu Sekarang mereka akan menjadi mangsaku dan aku akan menggigit mereka semua sampai mati',
    cover_url: 'https://cdn.shinigami.gg/assets/image/d96303ba-bada-4003-aba8-08192706a941.jpg',
    author: 'Step on a lego, Seol Arang, Legobalbasseo',
    status: 'Ongoing',
    total_chapters: 190,
    deleted_at: null,
    created_at: '2024-01-06T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    title: 'Solo Leveling',
    alternative_title: 'Na Honjaman Level-Up, Only I Level Up, Ore Dake Level Up na Ken, Тільки я візьму новий рівень, تکرو, 俺だけレベルアップな件, 我独自升级, 나 혼자만 레벨업 / Na Honjaman Level-Up',
    synopsis: 'Manhwa Solo Leveling yang dibuat oleh komikus bernama Chugong ini bercerita tentang 10 tahun yang lalu setelah Gerbang yang menghubungkan dunia nyata dengan dunia monster terbuka beberapa orang biasa setiap hari menerima kekuatan untuk berburu monster di dalam Gerbang Mereka dikenal sebagai Pemburu Namun tidak semua Pemburu kuat Nama saya Sung JinWoo seorang Pemburu peringkatE Saya seseorang yang harus mempertaruhkan nyawanya di ruang bawah tanah paling rendah Terlemah di Dunia Tidak memiliki keterampilan apa pun untuk ditampilkan saya hampir tidak mendapatkan uang yang dibutuhkan dengan bertarung di ruang bawah tanah berlevel rendah Setidaknya sampai saya menemukan ruang bawah tanah tersembunyi dengan kesulitan tersulit dalam ruang bawah tanah peringkatD Pada akhirnya saat aku menerima kematian tibatiba aku menerima kekuatan aneh log pencarian yang hanya bisa kulihat rahasia untuk naik level yang hanya aku yang tahu Jika saya berlatih sesuai dengan pencarian saya dan monster yang diburu level saya akan naik Berubah dari Hunter terlemah menjadi Hunter Srank terkuat',
    cover_url: 'https://cdn.shinigami.gg/assets/image/09919a8b39cb.jpeg',
    author: 'h-goon, Chugong, Gi So-Ryeong',
    status: 'Ongoing',
    total_chapters: 179,
    deleted_at: null,
    created_at: '2024-01-07T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    title: 'The Greatest Estate Developer',
    alternative_title: "The World's Best Engineer, 대급 영지 설계사 / Yeokdaegeum Yeongji Seolgyesa",
    synopsis: 'Kim SooHo seorang insinyur sipil menjadi bangsawan dari sebuah novel Tapi apa ini Harta saya akan segera dihancurkan Kemudian saya harus mendesain membangun dan menjual',
    cover_url: 'https://cdn.shinigami.gg/assets/image/1fc811da-99f2-4fe8-9c34-c9d7f12185ec.jpg',
    author: 'BK_Moon, Mun Baeg Kyeong, Lee Hyunmin',
    status: 'Completed',
    total_chapters: 222,
    deleted_at: null,
    created_at: '2024-01-08T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111109',
    title: 'Eleceed',
    alternative_title: '일렉시드 / Eleceed',
    synopsis: 'Kaiden Pengguna kemampuan misterius yang bersembunyi di dalam tubuh kucing jalanan Dia kemudian dijemput oleh Jiwoo setelah terluka setelah berkelahi dengan pengguna kemampuan lain Ia memiliki kepribadian yang keras kepala dan suka memerintah Jiwoo anak SMA yang energik dan banyak bicara yang suka kucing Ia sangat baik dan juga tampaknya memiliki kemampuan khusus',
    cover_url: 'https://cdn.shinigami.gg/assets/image/6c83f3db-948b-426f-a0ad-7074d8118632.jpg',
    author: 'Son Jae-Ho',
    status: 'Ongoing',
    total_chapters: 428,
    deleted_at: null,
    created_at: '2024-01-09T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111110',
    title: 'Mercenary Enrollment',
    alternative_title: 'High School Mercenary, 입학용병 / Iphak Yongbyeong',
    synopsis: 'Yu Ijin adalah satusatunya yang selamat dari kecelakaan pesawat saat dia masih kecil Setelah menjadi tentara bayaran untuk bertahan hidup selama 10 tahun ia kembali ke keluarganya di kampung halamannya.',
    cover_url: 'https://cdn.shinigami.gg/assets/image/c668834b4847.jpeg',
    author: 'YC',
    status: 'Ongoing',
    total_chapters: 280,
    deleted_at: null,
    created_at: '2024-01-10T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Nano Machine',
    alternative_title: '나노마신 / Nano Machine',
    synopsis: 'Setelah direndahkan dan menghabiskan hidupnya dalam bahaya seorang yatim piatu dari pemuja iblis YeoWoon mendapatkan kunjungan tak terduga dari keturunannya dari masa depan yang memasukkan sebuah mesin nano ke dalam tubuh CheonWoon yang mengubah hidup Cheon Yeo Woon setelah aktivasi Ikuti Cerita tentang perjalanan Cheon YeoWoon di reaperscansid melewati pemujaan setan dan naik menjadi yang ahli beladiri terbaik baru saja dimulai',
    cover_url: 'https://cdn.shinigami.gg/assets/image/38e34bb8-29c2-43f6-a2cc-ec9d4991ff5a.jpg',
    author: 'Hanjung Wolya, Great H',
    status: 'Ongoing',
    total_chapters: 340,
    deleted_at: null,
    created_at: '2024-01-11T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    title: 'Lookism',
    alternative_title: 'Updating / Oemo Jisangjuui',
    synopsis: 'Park Hyungsuk orang yang gendut dan jelek dirundung oleh orangorang di lingkungan sekolahnya setiap hari Namun sebuah keajaiban akan segera terjadi',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/05e8dbb20620.jpeg',
    author: 'Park Taejoon',
    status: 'Ongoing',
    total_chapters: 635,
    deleted_at: null,
    created_at: '2024-01-12T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    title: 'Pick Me Up',
    alternative_title: 'Pick Me Up, Infinite Gacha, 픽 미 업! / Pick Me Up',
    synopsis: 'Dalam game gacha yang terkenal dengan kesulitannya yang mengerikan Master peringkat ke5 di dunia Loki kehilangan kesadaran saat menyerbu Dungeon Apa Aku karakter game sekarang Setelah bangun Loki menyadari bahwa dia telah berubah menjadi Pahlawan Level 1 Bintang 1Han Yslat Untuk kembali ke Bumi dia harus memimpin para master dan hero pemula dan membersihkan lantai 100 Dungeon Kau macammacam dengan orang yang salah Ini adalah kisah perjuangan keras Master Loki yang belum pernah mengalami satu kekalahan pun',
    cover_url: 'https://cdn.shinigami.gg/assets/image/97526c67-93d8-48e2-a287-dfd4f21f9674.jpg',
    author: 'Redice Studio, Hermod, U-Ne Cho, nicesun',
    status: 'Ongoing',
    total_chapters: 229,
    deleted_at: null,
    created_at: '2024-01-13T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    title: 'SSS-Class Suicide Hunter',
    alternative_title: 'SSS급 죽어야 사는 헌터, SSS-Class Hunter that has to Die to Live, SSS-Class Revival Hunter / SSS-geup Jugeoya Saneun Hunter',
    synopsis: 'Di Menara misterius yang mirip dengan dungeon RPG Kim Gongja menjalani kehidupan duniawi yang membuat iri semua star hunter Suatu hari ketamakannya dikabulkan dengan legendary skill untuk menyalin kemampuan orang lain dengan mengorbankan nyawanya sendiri Sebelum dia sadar dia dibunuh oleh hunter 1 Flame Emperor Tapi hal itu mengaktifkan Skill nya dan kemampuan untuk melakukan perjalanan kembali ke masa lalu setelah kematian Bagaimana Gongja menggunakan keterampilan ini untuk mengalahkan kompetisi dan naik ke puncak',
    cover_url: 'https://cdn.shinigami.gg/assets/image/0cc1691a-ca1a-462e-95ea-84dc943d9416.jpg',
    author: 'Neida, Sinnoa',
    status: 'Ongoing',
    total_chapters: 160,
    deleted_at: null,
    created_at: '2024-01-14T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111115',
    title: 'Swordmaster’s Youngest Son',
    alternative_title: "The Swordmaster's Son; The Youngest Son of a Renowned Family of Swordsmen; 검술명가 막내아들 / The Swordmaster's Son",
    synopsis: 'Jin Runcandel adalah putra bungsu dari Swordmaster terhebat Setelah dia ditendang keluar dari klan dia mengalami nasib yang tragis Tapi sebelum dia mati seorang Dewa memberinya kesempatan kedua Sekarang dia harus menggunakan kekuatan barunya untuk kebaikan Akankah Jin menjadi Swordmaster terkuat di dunia dan memenuhi potensi terbesarnya',
    cover_url: 'https://cdn.shinigami.gg/assets/image/9dadcd86-4ee5-4b94-90f3-be19955078a8.jpg',
    author: 'AZI, Emperor Penguin, HWANGZE PENGUIN',
    status: 'Ongoing',
    total_chapters: 222,
    deleted_at: null,
    created_at: '2024-01-15T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111116',
    title: 'One Piece',
    alternative_title: 'Updating / One Piece',
    synopsis: 'Bercerita tentang seorang lakilaki bernama Monkey D Luffy yang menentang arti dari gelar bajak laut Daripada kesannama besar kejahatan kekerasan dia lebih terlihat seperti bajak laut rendahan yang suka bersenangsenang alasanLuffy menjadi bajak laut adalah tekadnya untuk berpetualang di lautan yang menyenangkan dan bertemu orangorangbaru dan menarik sertabersamasama mencari One Piece',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/f9325dbc0a80.jpeg',
    author: 'Oda Eiichirou',
    status: 'Ongoing',
    total_chapters: 1199,
    deleted_at: null,
    created_at: '2024-01-16T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111117',
    title: 'One Punch Man',
    alternative_title: 'Updating / One Punch-Man',
    synopsis: 'Saitama dulunya hanyalah lelaki biasa dalam dunia dimana pahlawan menjadi sebuah pekerjaan Tetapi ketika Ia bertemu dengan seorang anak lelaki yang sedang diserang monster dia mengingat citacita masa kecilnya untuk menjadi pahlawan Lalu dia berlatih setiap hari hingga semua rambutnya rontok Saitama pun menjadi pahlawan yang kuat tetapi ada satu hal yang mencemaskan dia Yaitu dia menjadi terlalu kuat hingga dia dapat mengalahkan setiap monster hanya dengan satu tinjuan',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/c28e5f097294.jpeg',
    author: 'One',
    status: 'Ongoing',
    total_chapters: 314,
    deleted_at: null,
    created_at: '2024-01-17T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111118',
    title: 'Jujutsu Kaisen',
    alternative_title: 'Updating / Jujutsu Kaisen',
    synopsis: 'Yuuji adalah seorang jenius di jalur dan lapangan Tapi dia memiliki minat nol dia senang sebagai clam di Klub Penelitian Ilmu Ghaib Meskipun Dia di Klub hanya untuk Iseng Halhal menjadi serius ketika semangat nyata muncul di sekolah Hidup akan menjadi sangat aneh Di SMA Negeri Sugisawa 3',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/80848fdd124c.jpeg',
    author: 'AKUTAMI Gege',
    status: 'Ongoing',
    total_chapters: 271,
    deleted_at: null,
    created_at: '2024-01-18T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111119',
    title: 'Blue Lock',
    alternative_title: 'Updating / Blue Lock',
    synopsis: 'Cerita berawal dari persatuan sepak bola jepang yang memulai sebuah program pencarian bakat pemain sepak bola SMA yang mulai berlatih untuk piala dunia 2022 Isagi Youichi seorang pemain penyerang mendapatkan undangan untuk program ini setelah kekalahan timnya dan tidak melaju ke tingkat nasional Pelatih program ini adalah Jinpachi yang mempunyai keinginan menghancurkan sepak bola pecundang jepang dengan memperkenalkan jenis pelatihan baru mengisolasi 300 striker muda di dalam penjara yang disebut Blue Lock dan melatih mereka dengan keras untuk menciptakan stiker egois terhebat di dunia',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/9848f5698b1f.jpeg',
    author: 'KANESHIRO Muneyuki',
    status: 'Ongoing',
    total_chapters: 370,
    deleted_at: null,
    created_at: '2024-01-19T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111120',
    title: 'Tower Of God',
    alternative_title: 'Updating / Sinui Tap',
    synopsis: 'Apa yang kau inginkan Uang dan Kekayaan Kehormatan dan Harga Diri Otoritas dan Kekuatan Balas Dendam atau sesuatu yang melebihi semua itu Apa pun yang kau inginkan tersebutSemuanya ada di sini',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/5c4da8f0047f.webp',
    author: 'SIU',
    status: 'Ongoing',
    total_chapters: 651,
    deleted_at: null,
    created_at: '2024-01-20T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111121',
    title: 'Chainsaw Man',
    alternative_title: 'Chainsaw man! / チェンソーマン',
    synopsis: 'Biar nama Yang menjelaskan Kehidupan miskin Denji berubah selamanya ketika ia Menyatu dengan dengan anjing Chainsaw peliharaannya Pochita Sekarang dia tinggal di kota besar dan menjadi Devil Hunter resmi Tapi dia harus banyak belajar tentang pekerjaan barunya dan kekuatan sebenarnya dari Chainsaw',
    cover_url: 'https://cdn.shinigami.gg/assets/cover/5526f3c6c9c7.jpeg',
    author: 'Fujimoto Tatsuki',
    status: 'Ongoing',
    total_chapters: 277,
    deleted_at: null,
    created_at: '2024-01-21T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000002', name: 'Thriller' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
    ]
  },
  {
    id: '11111111-1111-1111-1111-111111111122',
    title: 'Demonic Emperor',
    alternative_title: 'Magic Emperor, 魔皇大管家 / The Servant Is the Demon King?!',
    synopsis: 'Karena dia memiliki warisan Ancient Demonic emperor Demonic Emperor Zhuo Yifan menemui nasib sial karena dikhianati dan dibunuh oleh murid kepercayaannya Setelah terlahir kembali kultivasinya kembali ke nol dan dia terjebak oleh heart demon tidak diberi pilihan selain menjadi pengurus rumah tangga dari satusatunya nona tertua Keluarga Luo Dari menjadi Demonic Emperor menjadi pengurus rumah tangga yang tidak penting bagaimana dia bisa bergaul dengan eart demon eldest miss dan kekuatan apa yang akan dia peroleh untuk memimpin dirinya sendiri dan keluarga yang menurun untuk bangkit kembali ke puncak benuaaa',
    cover_url: 'https://cdn.shinigami.gg/assets/image/d00e4253-656d-481e-b3ef-701e4c6d451e.jpg',
    author: 'Wuer Manhua, Ye Xiao',
    status: 'Ongoing',
    total_chapters: 939,
    deleted_at: null,
    created_at: '2024-01-22T00:00:00.000Z',
    genres: [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Historical' },
      { id: '00000000-0000-0000-0000-000000000003', name: 'Time Travel' },
      { id: '00000000-0000-0000-0000-000000000004', name: 'Romance' },
      { id: '00000000-0000-0000-0000-000000000005', name: 'Fantasy' },
      { id: '00000000-0000-0000-0000-000000000006', name: 'Action' }
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
