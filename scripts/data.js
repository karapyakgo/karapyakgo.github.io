/**
 * ============================================================================
 * DATA MODEL & KATALOG RESMI — KARAPYAK TRAVEL (karapyakgo.github.io)
 * ============================================================================
 * File ini berfungsi sebagai "Single Source of Truth" (pusat data statis)
 * untuk seluruh informasi wisata, tarif tiket resmi terverifikasi, direktori
 * pemandu lokal, paket perjalanan terpadu, transportasi lokal, dan kemitraan UMKM.
 * Sesuai dokumen acuan: Alur Wisatawan & Simulasi Biaya (PDF Slide 4, 5, 6, 7).
 */

const KARAPYAK_DATA = {
  // --------------------------------------------------------------------------
  // 1. INFORMASI UMUM DESTINASI & FASILITAS PANTAI
  // --------------------------------------------------------------------------
  // Menyimpan identitas destinasi, lokasi administratif, jam operasional,
  // panduan keselamatan karang, serta sarana penunjang yang tersedia.
  info: {
    name: "Karapyak Travel",
    tagline: "Platform Terintegrasi Wisata Pantai Karapyak",
    domain: "karapyakgo.github.io",
    location: "Desa Bagolo, Kec. Kalipucang, Kab. Pangandaran, Jawa Barat",
    operatingHours: "Buka Setiap Hari: 06.00 - 18.00 WIB",
    description:
      "Pantai Karapyak terkenal dengan panorama tebing karang putih mempesona, biota laut saat air surut, serta ketenangan alam yang asri berjarak sekitar 20 km sebelum Pantai Pangandaran.",
    // Aturan wajib demi keselamatan wisatawan dan pelestarian ekosistem karang
    rules: [
      "Wajib mematuhi rambu batas aman saat air pasang",
      "Dilarang merusak biota laut dan karang hidup",
      "Jaga kebersihan dengan membuang sampah pada tempatnya",
      "Awasi anak-anak saat bermain di bibir karang",
    ],
    // Daftar fasilitas pokok yang tersedia di kawasan pantai
    facilities: [
      { name: "Mushola & Toilet Bersih", icon: "mosque" },
      { name: "Area Parkir Luas & Aman", icon: "parking" },
      { name: "Gazebo & Spot Istirahat", icon: "umbrella" },
      { name: "Spot Foto Tebing Karang", icon: "camera" },
      { name: "Sentra Kuliner Ikan Bakar", icon: "utensils" },
      { name: "Pos Pengawas Pantai (Lifeguard)", icon: "shield" },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. SKEMA TARIF TIKET MASUK & RETRIBUSI PARKIR (Slide 4 Langkah 2)
  // --------------------------------------------------------------------------
  // Tarif resmi per orang sudah termasuk asuransi keselamatan pengunjung.
  ticketPricing: {
    adult: 15000, // Rp 15.000 / orang dewasa (sesuai simulasi resmi Slide 6)
    child: 10000, // Rp 10.000 / anak-anak
    // Pilihan retribusi parkir sesuai jenis kendaraan pengunjung
    parking: {
      none: 0, // Tanpa parkir (jalan kaki / diantar shuttle lokal)
      motor: 5000, // Sepeda motor: Rp 5.000
      mobil: 10000, // Mobil pribadi: Rp 10.000
      bus: 25000, // Bus pariwisata / minibus: Rp 25.000
    },
  },

  // --------------------------------------------------------------------------
  // 3. DIREKTORI TOUR GUIDE LOKAL TERVERIFIKASI (Slide 4 Langkah 3 & Slide 5)
  // --------------------------------------------------------------------------
  // Profil 4 pemandu lokal berlisensi dengan keahlian khusus, durasi standar 3 jam,
  // dan tarif jasa transparan untuk mendampingi wisatawan di bibir karang.
  tourGuides: [
    {
      id: "guide-asep",
      name: "Kang Asep Hidayat",
      role: "Pemandu Geowisata & Biota Laut",
      experience: "6 Tahun Pengalaman",
      languages: ["Bahasa Indonesia", "Basa Sunda"],
      rating: 4.9,
      reviewCount: 48,
      duration: "3 Jam",
      price: 150000, // Rp 150.000 (sesuai simulasi paket keluarga Slide 6)
      specialty:
        "Ahli eksplorasi karang surut, spot foto tebing, dan edukasi biota laut aman.",
      avatar: "assets/images/guide-asep.svg",
      phone: "+6281234567801",
      badge: "Pemandu Tersertifikasi",
    },
    {
      id: "guide-rina",
      name: "Teh Rina Nurmalasari",
      role: "Pemandu Edukasi & Budaya Pesisir",
      experience: "4 Tahun Pengalaman",
      languages: ["Bahasa Indonesia", "English", "Basa Sunda"],
      rating: 4.8,
      reviewCount: 35,
      duration: "3 Jam",
      price: 150000,
      specialty:
        "Ramah anak & keluarga, fokus jalur mangrove dan kisah sejarah pesisir Bagolo.",
      avatar: "assets/images/guide-rina.svg",
      phone: "+6281234567802",
      badge: "Favorit Keluarga",
    },
    {
      id: "guide-dedi",
      name: "Kang Dedi Rustandi",
      role: "Pemandu Fotografi & Snorkeling Karang",
      experience: "7 Tahun Pengalaman",
      languages: ["Bahasa Indonesia", "Basa Sunda"],
      rating: 5.0,
      reviewCount: 62,
      duration: "3 Jam",
      price: 175000,
      specialty:
        "Pencari spot angle foto tersembunyi, pendampingan snorkeling dan sunset point.",
      avatar: "assets/images/guide-dedi.svg",
      phone: "+6281234567803",
      badge: "Spesialis Foto",
    },
    {
      id: "guide-yana",
      name: "Kang Yana Mulyana",
      role: "Pemandu Susur Pantai & Spot Mancing",
      experience: "5 Tahun Pengalaman",
      languages: ["Bahasa Indonesia", "Basa Sunda"],
      rating: 4.9,
      reviewCount: 41,
      duration: "3 Jam",
      price: 150000,
      specialty:
        "Menguasai titik memancing karang dan jalur tracking senja Pantai Karapyak.",
      avatar: "assets/images/guide-yana.svg",
      phone: "+6281234567804",
      badge: "Ahli Lapangan",
    },
  ],

  // --------------------------------------------------------------------------
  // 4. PILIHAN TRANSPORTASI LOKAL & MOBILITAS
  // --------------------------------------------------------------------------
  // Menyediakan pilihan mobilitas bagi pengunjung, mulai dari kendaraan pribadi
  // hingga antar-jemput shuttle lokal dari penginapan/titik kumpul ke pantai.
  transportOptions: [
    {
      id: "trans-none",
      name: "Tanpa Transportasi Tambahan (Kendaraan Pribadi)",
      description:
        "Anda tiba menggunakan transportasi sendiri tanpa antar-jemput lokal.",
      price: 0,
    },
    {
      id: "trans-shuttle",
      name: "Transportasi Lokal Antar-Jemput PP",
      description:
        "Shuttle lokal nyaman untuk antar-jemput dari titik temu/penginapan ke spot pantai.",
      price: 100000, // Rp 100.000 (sesuai simulasi paket keluarga Slide 6)
    },
    {
      id: "trans-atv",
      name: "Sewa ATV Pantai (30 Menit)",
      description:
        "Eksplorasi garis pesisir pasir putih dengan wahana ATV berstandar keselamatan.",
      price: 75000,
    },
    {
      id: "trans-ebike",
      name: "Sewa Sepeda Listrik Pantai (1 Jam)",
      description:
        "Menikmati semilir angin laut di jalur pedestrian pantai secara santai.",
      price: 35000,
    },
  ],

  // --------------------------------------------------------------------------
  // 5. AKTIVITAS TAMBAHAN & KULINER PESISIR (ADD-ON)
  // --------------------------------------------------------------------------
  // Pilihan layanan ekstra yang dapat dimasukkan ke kalkulator estimasi biaya,
  // melibatkan langsung jasa sewa alat dan olahan kuliner warga lokal.
  customActivities: [
    {
      id: "act-snorkeling",
      name: "Aktivitas Snorkeling Karang Dangkal",
      description:
        "Termasuk peminjaman kacamata goggle, snorkel, dan pelampung keselamatan.",
      price: 40000, // Rp 40.000 (sesuai simulasi paket keluarga Slide 6)
      perPerson: false,
    },
    {
      id: "act-kelapa",
      name: "Paket Kelapa Muda Segar & Mendoan (4 Porsi)",
      description:
        "Kelapa muda murni segar dipetik langsung dipadukan mendoan hangat tepi pantai.",
      price: 35000,
      perPerson: false,
    },
    {
      id: "act-ikan-bakar",
      name: "Paket Makan Siang Ikan Bakar Khas Bagolo",
      description:
        "Ikan laut segar tangkapan nelayan lokal, nasi timbel, sambal terasi & lalapan.",
      price: 60000,
      perPerson: false,
    },
    {
      id: "act-gazebo",
      name: "Sewa Gazebo Privat Menghadap Laut (3 Jam)",
      description:
        "Tempat bersantai nyaman dan teduh langsung memandang deburan ombak karang.",
      price: 30000,
      perPerson: false,
    },
    {
      id: "act-camping",
      name: "Sewa Tenda Dome & Camping Spot (Malam)",
      description:
        "Kapasitas 4 orang termasuk matras, lampu tenda, dan izin camping area.",
      price: 120000,
      perPerson: false,
    },
  ],

  // --------------------------------------------------------------------------
  // 6. PAKET WISATA SIAP PAKAI / BUNDLING (Slide 5 & Simulasi Slide 6)
  // --------------------------------------------------------------------------
  // Paket terpadu yang dapat langsung diterapkan ke kalkulator (auto-prefill)
  // dengan sekali klik tanpa perlu memilih komponen satu per satu.
  tourPackages: [
    {
      id: "pkg-keluarga",
      title: "Paket Hangat Keluarga Karapyak",
      category: "Keluarga (4 Orang)",
      price: 350000, // Tepat sesuai simulasi pada Slide 6: Rp 350.000
      badge: "Paling Populer (Simulasi PDF)",
      featured: true,
      description:
        "Solusi lengkap dan hemat untuk liburan keluarga tanpa repot. Semua kebutuhan utama sudah diatur rapi.",
      // Rincian komponen transparan 100%
      breakdown: [
        "Tiket Masuk 4 Orang (Rp 60.000)",
        "Jasa Tour Guide Lokal 3 Jam (Rp 150.000)",
        "Transportasi Antar-Jemput Lokal PP (Rp 100.000)",
        "Aktivitas Pilihan Snorkeling / Edukasi (Rp 40.000)",
      ],
      includes: [
        "Tiket masuk 4 pengunjung",
        "Pemandu lokal profesional 3 jam",
        "Shuttle transportasi lokal PP",
        "Aktivitas karang dangkal / pelampung",
        "Pendampingan foto keluarga",
      ],
      // Parameter prefill otomatis untuk kalkulator
      prefill: {
        adults: 4,
        children: 0,
        guideId: "guide-asep",
        transId: "trans-shuttle",
        activities: ["act-snorkeling"],
      },
    },
    {
      id: "pkg-solo",
      title: "Paket Jelajah Solo & Fotografi",
      category: "Individu (1 Orang)",
      price: 165000,
      badge: "Eksplorasi Santai",
      featured: false,
      description:
        "Khusus pelancong solo atau fotografer yang mencari sudut panorama terbaik dan cerita kearifan lokal.",
      breakdown: [
        "Tiket Masuk 1 Orang (Rp 15.000)",
        "Pemandu Khusus Spot Tersembunyi (Rp 150.000)",
      ],
      includes: [
        "Tiket masuk resmi",
        "Pemandu khusus fotogenik spot 3 jam",
        "Bantuan pengambilan foto terbaik",
        "Welcome fresh coconut",
      ],
      prefill: {
        adults: 1,
        children: 0,
        guideId: "guide-dedi",
        transId: "trans-none",
        activities: [],
      },
    },
    {
      id: "pkg-rombongan",
      title: "Paket Komunitas & Gathering",
      category: "Rombongan (Min. 10 Orang)",
      price: 850000,
      badge: "Hemat Rombongan",
      featured: false,
      description:
        "Pilihan terbaik untuk komunitas, reuni, atau arisan yang menginginkan kebersamaan akrab di tepi laut.",
      breakdown: [
        "Tiket Masuk 10 Orang (Rp 150.000)",
        "2 Tour Guide Pendamping (Rp 300.000)",
        "Sewa Gazebo Privat Besar (Rp 100.000)",
        "Paket Ikan Bakar Bersama (Rp 300.000)",
      ],
      includes: [
        "Tiket masuk 10 orang",
        "2 pemandu lokal berpengalaman",
        "Area kumpul & gazebo nyaman",
        "Makan siang prasmanan ikan bakar",
        "Dokumentasi kegiatan",
      ],
      prefill: {
        adults: 10,
        children: 0,
        guideId: "guide-yana",
        transId: "trans-shuttle",
        activities: ["act-gazebo", "act-ikan-bakar"],
      },
    },
    {
      id: "pkg-edukasi",
      title: "Paket Edukasi Konservasi Bahari",
      category: "Wisata Edukasi Pelajar",
      price: 490000,
      badge: "Edukasi & Konservasi",
      featured: false,
      description:
        "Program belajar sambil bertualang mengenal ekosistem terumbu karang dan penanaman mangrove di pesisir Bagolo.",
      breakdown: [
        "Tiket 6 Peserta / Siswa (Rp 90.000)",
        "Pemandu Edukasi Sains & Budaya (Rp 150.000)",
        "Transportasi Shuttle PP (Rp 100.000)",
        "Bibit Mangrove & Lembar Edukasi (Rp 150.000)",
      ],
      includes: [
        "Materi pengenalan biota karang laut",
        "Bibit pohon mangrove untuk ditanam",
        "Pemandu ramah anak & edukator",
        "Sertifikat pelestari bahari cilik",
      ],
      prefill: {
        adults: 6,
        children: 0,
        guideId: "guide-rina",
        transId: "trans-shuttle",
        activities: ["act-snorkeling"],
      },
    },
  ],

  // --------------------------------------------------------------------------
  // 7. REKOMENDASI DESTINASI SEKITAR PANTAI KARAPYAK
  // --------------------------------------------------------------------------
  // Tempat-tempat menarik terdekat yang dapat dijangkau wisatawan saat
  // berlibur di kawasan Pantai Karapyak dan Desa Bagolo.
  destinationsAround: [
    {
      name: "Tebing Karang Putih Karapyak",
      tag: "Spot Ikonik",
      distance: "0 km (Area Utama)",
      desc: "Hamparan tebing karang putih dengan kolam-kolam alami kecil yang menampung ikan hias saat air laut surut.",
      image: "assets/images/dest-tebing.jpg",
    },
    {
      name: "Sunset Deck Karapyak Glamping",
      tag: "Panorama Senja",
      distance: "300 meter",
      desc: "Dek kayu estetik di atas tebing untuk menikmati matahari tenggelam dengan secangkir kopi khas Jawa Barat.",
      image: "assets/images/dest-sunset.jpg",
    },
    {
      name: "Konservasi Hutan Mangrove Bagolo",
      tag: "Wisata Hijau",
      distance: "1.2 km",
      desc: "Jalur jembatan kayu melintasi rimbunnya hutan bakau pencegah abrasi dengan udara pesisir yang sangat sejuk.",
      image: "assets/images/dest-mangrove.svg",
    },
    {
      name: "Spot Pasir Putih & Pantai Lembah Putri",
      tag: "Relaksasi & Foto",
      distance: "3.5 km",
      desc: "Pantai tetangga dengan pasir putih lembut dan miniatur miniatur tebing yang menawan untuk liburan tenang.",
      image: "assets/images/dest-lembah.svg",
    },
  ],

  // --------------------------------------------------------------------------
  // 8. MITRA UMKM & PEMBERDAYAAN WARGA LOKAL (Slide 7 & 8)
  // --------------------------------------------------------------------------
  // Jaringan usaha lokal pesisir Bagolo yang bermitra dengan platform,
  // memberikan potongan harga / keuntungan eksklusif bagi pemegang voucher.
  localPartners: [
    {
      name: "Warung Ikan Bakar Bu Imas",
      category: "Kuliner Seafood Pesisir",
      desc: "Olahan ikan bawal bintang, cumi, dan kakap merah segar dengan sambal bakar khas pesisir Bagolo.",
      benefit: "Diskon 10% untuk pemegang voucher Karapyak Travel",
    },
    {
      name: "Kelapa Muda Segar Mang Ujang",
      category: "Minuman Alami",
      desc: "Kelapa muda organik dipetik langsung dari pohon pesisir, manis alami tanpa pemanis buatan.",
      benefit: "Free isi ulang es batu & sedotan bambu ramah lingkungan",
    },
    {
      name: "Koperasi Pemandu Karapyak Guyub",
      category: "Jasa Wisata Lokal",
      desc: "Asosiasi pemandu pemuda lokal terlatih tanggap darurat dan wawasan keanekaragaman hayati pantai.",
      benefit: "Asuransi keselamatan dan pemanduan berlisensi lokal",
    },
    {
      name: "Ojek Wisata & Mobil Wisata Karapyak",
      category: "Transportasi Lokal",
      desc: "Armada transportasi warga desa siap mengantar wisatawan dari terminal Kalipucang ke Pantai Karapyak.",
      benefit: "Tarif pasti transparan tanpa biaya tersembunyi",
    },
  ],
};

// ----------------------------------------------------------------------------
// EKSPOR MODULAR
// ----------------------------------------------------------------------------
// Menyediakan akses objek data untuk peramban (window) maupun ekosistem Node.js
if (typeof window !== "undefined") {
  window.KARAPYAK_DATA = KARAPYAK_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = KARAPYAK_DATA;
}
