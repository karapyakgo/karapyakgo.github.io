/**
 * ============================================================================
 * ENGINE KALKULATOR BIAYA WISATA — KARAPYAK TRAVEL
 * ============================================================================
 * Kelas KarapyakCalculator bertanggung jawab mengelola state pemilihan wisata,
 * menghitung estimasi biaya secara dinamis dan 100% transparan, serta menyediakan
 * pola reaktif (Observer Pattern) agar tampilan UI selalu terbarui seketika.
 * Sesuai acuan Alur Wisatawan Langkah 4 & Simulasi Paket Keluarga Slide 6.
 */

class KarapyakCalculator {
  /**
   * Konstruktor inisialisasi kalkulator dengan data master
   * @param {Object} data - Objek master KARAPYAK_DATA dari scripts/data.js
   */
  constructor(data) {
    this.data = data;

    // State internal: Menyimpan seluruh preferensi perjalanan yang dipilih wisatawan.
    // Nilai bawaan (default) disesuaikan persis dengan Simulasi Resmi Slide 6 (Total: Rp 350.000).
    this.state = {
      visitDate: "", // Tanggal rencana kunjungan
      adults: 4, // 4 Orang dewasa (4 × Rp 15.000 = Rp 60.000)
      children: 0, // 0 Anak-anak
      parkingType: "none", // Bawaan tanpa parkir (diantar shuttle lokal)
      selectedGuideId: "guide-asep", // Kang Asep Hidayat: Rp 150.000 (3 jam)
      selectedTransId: "trans-shuttle", // Shuttle antar-jemput lokal PP: Rp 100.000
      selectedActivities: ["act-snorkeling"], // Snorkeling karang dangkal: Rp 40.000
      appliedPackageId: "pkg-keluarga", // ID paket bawaan yang aktif
    };

    // Daftar fungsi listener/callback yang berlangganan pada perubahan state (Observer Pattern)
    this.subscribers = [];
  }

  /**
   * Mendaftarkan callback untuk merespons perubahan state kalkulator
   * @param {Function} callback - Fungsi yang menerima objek ringkasan kalkulasi terbaru
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    // Langsung jalankan sekali saat pendaftaran awal agar UI tersinkronisasi
    callback(this.calculate());
  }

  /**
   * Memancarkan data kalkulasi terbaru ke seluruh subscriber yang terdaftar
   */
  notify() {
    const summary = this.calculate();
    this.subscribers.forEach((cb) => cb(summary));
  }

  /**
   * Memperbarui sebagian nilai pada state dan memicu notifikasi pembaruan UI
   * @param {Object} partialState - Objek berisi properti state yang ingin diperbarui
   */
  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  /**
   * Menerapkan konfigurasi dari paket wisata siap pakai (auto-prefill)
   * Mengisi otomatis jumlah orang, pilihan pemandu, transportasi, dan aktivitas.
   * @param {string} packageId - ID paket wisata (misal: "pkg-keluarga")
   */
  applyPackage(packageId) {
    const pkg = this.data.tourPackages.find((p) => p.id === packageId);
    if (!pkg) return;

    this.state.appliedPackageId = pkg.id;
    this.state.adults = pkg.prefill.adults;
    this.state.children = pkg.prefill.children;
    this.state.selectedGuideId = pkg.prefill.guideId;
    this.state.selectedTransId = pkg.prefill.transId;
    this.state.selectedActivities = [...pkg.prefill.activities];
    this.notify();
  }

  /**
   * Menambah atau menghapus pilihan aktivitas add-on / kuliner pesisir
   * @param {string} activityId - ID aktivitas (misal: "act-snorkeling")
   */
  toggleActivity(activityId) {
    const exists = this.state.selectedActivities.includes(activityId);
    if (exists) {
      // Hapus jika sudah ada di daftar
      this.state.selectedActivities = this.state.selectedActivities.filter(
        (id) => id !== activityId
      );
    } else {
      // Tambahkan jika belum ada
      this.state.selectedActivities.push(activityId);
    }
    // Jika pengguna mengubah aktivitas secara manual, tandai paket sebagai kustom
    this.state.appliedPackageId = null;
    this.notify();
  }

  /**
   * Inti Mesin Perhitungan: Menghitung total estimasi dan rincian per komponen.
   * Memproses 6 elemen biaya:
   * 1. Tiket Masuk Dewasa
   * 2. Tiket Masuk Anak-anak
   * 3. Retribusi Parkir Kendaraan
   * 4. Jasa Tour Guide Lokal (3 Jam)
   * 5. Transportasi / Shuttle Lokal PP
   * 6. Aktivitas Tambahan & Layanan UMKM
   * @returns {Object} Ringkasan kalkulasi lengkap untuk UI struk & modal booking
   */
  calculate() {
    const items = [];
    let total = 0;

    // 1. Perhitungan Tiket Masuk Dewasa
    const adultCount = Math.max(0, parseInt(this.state.adults, 10) || 0);
    const adultRate = this.data.ticketPricing.adult;
    const adultTotal = adultCount * adultRate;
    if (adultCount > 0) {
      items.push({
        category: "Tiket Masuk",
        label: `Tiket Dewasa (${adultCount} orang × ${this.formatRupiah(adultRate)})`,
        qty: adultCount,
        unitPrice: adultRate,
        subtotal: adultTotal,
      });
      total += adultTotal;
    }

    // 2. Perhitungan Tiket Masuk Anak-anak
    const childCount = Math.max(0, parseInt(this.state.children, 10) || 0);
    const childRate = this.data.ticketPricing.child;
    const childTotal = childCount * childRate;
    if (childCount > 0) {
      items.push({
        category: "Tiket Masuk",
        label: `Tiket Anak-anak (${childCount} orang × ${this.formatRupiah(childRate)})`,
        qty: childCount,
        unitPrice: childRate,
        subtotal: childTotal,
      });
      total += childTotal;
    }

    // 3. Perhitungan Retribusi Parkir Kendaraan (Opsional)
    const parkingType = this.state.parkingType || "none";
    const parkingCost = this.data.ticketPricing.parking[parkingType] || 0;
    if (parkingCost > 0) {
      const parkingNameMap = {
        motor: "Parkir Motor",
        mobil: "Parkir Mobil Pribadi",
        bus: "Parkir Bus / Minibus",
      };
      items.push({
        category: "Retribusi Parkir",
        label: parkingNameMap[parkingType] || "Parkir",
        qty: 1,
        unitPrice: parkingCost,
        subtotal: parkingCost,
      });
      total += parkingCost;
    }

    // 4. Perhitungan Jasa Pemandu Wisata Lokal (Opsional, durasi 3 jam)
    let selectedGuide = null;
    if (this.state.selectedGuideId && this.state.selectedGuideId !== "none") {
      selectedGuide = this.data.tourGuides.find(
        (g) => g.id === this.state.selectedGuideId
      );
      if (selectedGuide) {
        items.push({
          category: "Pemandu Lokal",
          label: `Jasa Pemandu: ${selectedGuide.name} (${selectedGuide.duration})`,
          qty: 1,
          unitPrice: selectedGuide.price,
          subtotal: selectedGuide.price,
          details: selectedGuide.specialty,
        });
        total += selectedGuide.price;
      }
    }

    // 5. Perhitungan Transportasi Lokal / Antar-Jemput Shuttle (Opsional)
    let selectedTrans = null;
    if (
      this.state.selectedTransId &&
      this.state.selectedTransId !== "trans-none"
    ) {
      selectedTrans = this.data.transportOptions.find(
        (t) => t.id === this.state.selectedTransId
      );
      if (selectedTrans && selectedTrans.price > 0) {
        items.push({
          category: "Transportasi",
          label: selectedTrans.name,
          qty: 1,
          unitPrice: selectedTrans.price,
          subtotal: selectedTrans.price,
          details: selectedTrans.description,
        });
        total += selectedTrans.price;
      }
    }

    // 6. Perhitungan Aktivitas Tambahan & Kuliner UMKM
    this.state.selectedActivities.forEach((actId) => {
      const act = this.data.customActivities.find((a) => a.id === actId);
      if (act) {
        items.push({
          category: "Aktivitas & Kuliner",
          label: act.name,
          qty: 1,
          unitPrice: act.price,
          subtotal: act.price,
          details: act.description,
        });
        total += act.price;
      }
    });

    // Mengembalikan objek rekapitulasi lengkap
    return {
      state: { ...this.state },
      items,
      total,
      totalFormatted: this.formatRupiah(total),
      itemCount: items.length,
      selectedGuide,
      selectedTrans,
      appliedPackage:
        this.data.tourPackages.find(
          (p) => p.id === this.state.appliedPackageId
        ) || null,
    };
  }

  /**
   * Helper untuk memformat angka nominal ke standar mata uang Rupiah Indonesia
   * Contoh: 350000 -> "Rp 350.000"
   * @param {number} amount - Nominal angka
   * @returns {string} String terformat Rupiah
   */
  formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

// ----------------------------------------------------------------------------
// EKSPOR MODULAR
// ----------------------------------------------------------------------------
// Menyediakan akses kelas KarapyakCalculator di peramban dan sistem modul
if (typeof window !== "undefined") {
  window.KarapyakCalculator = KarapyakCalculator;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = KarapyakCalculator;
}
