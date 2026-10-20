/**
 * ============================================================================
 * CONTROLLER APLIKASI UTAMA — KARAPYAK TRAVEL (karapyakgo.github.io)
 * ============================================================================
 * File ini merupakan pengendali utama (Controller) dari antarmuka web Karapyak Travel.
 * Mengintegrasikan:
 * 1. Inisialisasi data & engine kalkulator dinamis (Slide 4 Langkah 4 & Slide 6).
 * 2. Manipulasi DOM, rendering komponen kartu (Paket, Pemandu, Destinasi, UMKM).
 * 3. Mekanisme langganan reaktif (Reactive Two-Way Sync) antara kalkulator dan struk biaya.
 * 4. Navigasi drawer mobile & sticky floating action bar di smartphone.
 * 5. Alur pemesanan interaktif (Langkah 5) & generator E-Voucher digital kode booking resmi.
 * 6. Isolated Iframe Printer Engine untuk cetak tiket 1 halaman A4 bersih & rapi.
 * 7. Integrasi pengiriman konfirmasi instan via pesan WhatsApp otomatis terformat.
 * 8. Animasi performa tinggi: IntersectionObserver Scroll Reveal & Dynamic Scroll Spy 5 Alur.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. INISIALISASI DATA & ENGINE KALKULATOR
  // --------------------------------------------------------------------------
  const data = window.KARAPYAK_DATA;
  if (!data) {
    console.error("KARAPYAK_DATA belum dimuat. Pastikan scripts/data.js dipanggil sebelum app.js.");
    return;
  }

  // Inisialisasi instance kalkulator dengan nilai awal (sesuai simulasi Slide 6: Paket Keluarga Rp 350.000)
  const calc = new window.KarapyakCalculator(data);

  // Atur tanggal kunjungan bawaan ke hari esok (H+1)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split("T")[0];
  calc.setState({ visitDate: formattedDate });

  // --------------------------------------------------------------------------
  // 2. REFERENSI ELEMEN DOM (KONTROL INPUT KALKULATOR)
  // --------------------------------------------------------------------------
  const visitDateInput = document.getElementById("visitDateInput");
  const adultsVal = document.getElementById("adultsVal");
  const adultsInc = document.getElementById("adultsInc");
  const adultsDec = document.getElementById("adultsDec");

  const childrenVal = document.getElementById("childrenVal");
  const childrenInc = document.getElementById("childrenInc");
  const childrenDec = document.getElementById("childrenDec");

  const parkingSelect = document.getElementById("parkingSelect");
  const guideSelect = document.getElementById("guideSelect");
  const transportContainer = document.getElementById("transportContainer");
  const activitiesContainer = document.getElementById("activitiesContainer");

  // --------------------------------------------------------------------------
  // 3. REFERENSI ELEMEN DOM (PANEL STRUK BIAYA & OUTPUT)
  // --------------------------------------------------------------------------
  const receiptItemsBody = document.getElementById("receiptItemsBody");
  const receiptTotalDisplay = document.getElementById("receiptTotalDisplay");
  const receiptItemCount = document.getElementById("receiptItemCount");
  const appliedPackageBadge = document.getElementById("appliedPackageBadge");
  const btnOpenBooking = document.getElementById("btnOpenBooking");

  // --------------------------------------------------------------------------
  // 4. REFERENSI ELEMEN DOM (CONTAINER DINAMIS)
  // --------------------------------------------------------------------------
  const packagesContainer = document.getElementById("packagesContainer");
  const guidesContainer = document.getElementById("guidesContainer");
  const destinationsContainer = document.getElementById("destinationsContainer");
  const msmeContainer = document.getElementById("msmeContainer");

  // --------------------------------------------------------------------------
  // 5. REFERENSI ELEMEN DOM (MODAL PEMESANAN & E-TIKET)
  // --------------------------------------------------------------------------
  const bookingModal = document.getElementById("bookingModal");
  const closeBookingModal = document.getElementById("closeBookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const modalSummaryList = document.getElementById("modalSummaryList");
  const modalTotalDisplay = document.getElementById("modalTotalDisplay");

  const ticketModal = document.getElementById("ticketModal");
  const closeTicketModal = document.getElementById("closeTicketModal");
  const voucherContent = document.getElementById("voucherContent");
  const btnPrintTicket = document.getElementById("btnPrintTicket");
  const btnWhatsAppConfirm = document.getElementById("btnWhatsAppConfirm");

  // --------------------------------------------------------------------------
  // 6. REFERENSI ELEMEN DOM (NAVIGASI MOBILE DRAWER & FLOATING BAR)
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawerOverlay = document.getElementById("mobileDrawerOverlay");
  const closeMobileDrawer = document.getElementById("closeMobileDrawer");
  const mobileStickyPrice = document.getElementById("mobileStickyPrice");
  const btnMobileStickyBooking = document.getElementById("btnMobileStickyBooking");

  // --------------------------------------------------------------------------
  // PENGENDALI DRAWER NAVIGASI KHUSUS PERAMBAN MOBILE / PONSEL
  // --------------------------------------------------------------------------
  // Membuka menu slide-out drawer dan mengunci scroll body agar tidak bergeser
  function openMobileDrawer() {
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  // Menutup menu slide-out drawer dan mengembalikan scroll normal
  function closeMobileDrawerFn() {
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Event listener tombol hamburger menu di header mobile
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileDrawer);
  }
  // Tombol close (silang) di dalam drawer
  if (closeMobileDrawer) {
    closeMobileDrawer.addEventListener("click", closeMobileDrawerFn);
  }
  // Menutup drawer saat pengguna mengklik area backdrop gelap di luar panel menu
  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === mobileDrawerOverlay) {
        closeMobileDrawerFn();
      }
    });
  }

  // Menutup drawer secara otomatis ketika salah satu tautan menu di dalamnya diklik
  document.querySelectorAll(".mobile-nav-link, #btnDrawerCta").forEach((link) => {
    link.addEventListener("click", closeMobileDrawerFn);
  });

  // Tombol CTA pemesanan di sticky bottom bar mobile langsung memicu modal booking
  if (btnMobileStickyBooking && btnOpenBooking) {
    btnMobileStickyBooking.addEventListener("click", () => {
      btnOpenBooking.click();
    });
  }

  // --------------------------------------------------------------------------
  // INISIALISASI INPUT TANGGAL KUNJUNGAN
  // --------------------------------------------------------------------------
  // Membatasi tanggal minimal adalah hari ini agar pengguna tidak memilih tanggal masa lalu
  if (visitDateInput) {
    visitDateInput.min = new Date().toISOString().split("T")[0];
    visitDateInput.value = formattedDate;
    visitDateInput.addEventListener("change", (e) => {
      calc.setState({ visitDate: e.target.value });
    });
  }

  // --------------------------------------------------------------------------
  // 1. POPULASI OPSI PEMANDU PADA DROPDOWN FORM KALKULATOR
  // --------------------------------------------------------------------------
  // Menghasilkan daftar opsi tour guide secara dinamis berdasarkan data master
  if (guideSelect) {
    guideSelect.innerHTML = `
      <option value="none">-- Tanpa Pemandu Wisata (Mandiri) --</option>
      ${data.tourGuides
        .map(
          (g) => `
        <option value="${g.id}">
          ${g.name} (${g.role}) - ${calc.formatRupiah(g.price)} / ${g.duration}
        </option>
      `
        )
        .join("")}
    `;
    guideSelect.value = calc.state.selectedGuideId;
    // Mengubah pemandu di kalkulator sekaligus menyorot kartu pemandu yang sesuai
    guideSelect.addEventListener("change", (e) => {
      calc.setState({ selectedGuideId: e.target.value, appliedPackageId: null });
      highlightSelectedGuideCard(e.target.value);
    });
  }

  // --------------------------------------------------------------------------
  // 2. RENDERING PILIHAN TRANSPORTASI LOKAL (RADIO CHOICE CHIPS)
  // --------------------------------------------------------------------------
  // Menampilkan kartu pilihan transportasi (tanpa transport, shuttle PP, ATV, e-bike)
  if (transportContainer) {
    transportContainer.innerHTML = data.transportOptions
      .map(
        (t) => `
      <label class="choice-chip ${calc.state.selectedTransId === t.id ? "selected" : ""}" data-trans-id="${t.id}">
        <div class="choice-chip-left">
          <input type="radio" name="transChoice" class="choice-radio" value="${t.id}" ${calc.state.selectedTransId === t.id ? "checked" : ""}>
          <div class="choice-info">
            <strong>${t.name}</strong>
            <small>${t.description}</small>
          </div>
        </div>
        <div class="choice-price">
          ${t.price === 0 ? "Gratis" : calc.formatRupiah(t.price)}
        </div>
      </label>
    `
      )
      .join("");

    // Event listener saat pengguna memilih moda transportasi
    transportContainer.querySelectorAll(".choice-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const transId = chip.getAttribute("data-trans-id");
        calc.setState({ selectedTransId: transId, appliedPackageId: null });
        updateTransportChipsUI(transId);
      });
    });
  }

  // Sinkronisasi status visual (class 'selected' & atribut checked) pada chip transportasi
  function updateTransportChipsUI(transId) {
    if (!transportContainer) return;
    transportContainer.querySelectorAll(".choice-chip").forEach((chip) => {
      const isMatch = chip.getAttribute("data-trans-id") === transId;
      chip.classList.toggle("selected", isMatch);
      const radio = chip.querySelector("input[type='radio']");
      if (radio) radio.checked = isMatch;
    });
  }

  // --------------------------------------------------------------------------
  // 3. RENDERING PILIHAN AKTIVITAS TAMBAHAN & KULINER (CHECKBOX CARDS)
  // --------------------------------------------------------------------------
  // Menampilkan add-on aktivitas (snorkeling karang, kelapa muda, ikan bakar, gazebo, camping)
  if (activitiesContainer) {
    activitiesContainer.innerHTML = data.customActivities
      .map((act) => {
        const isChecked = calc.state.selectedActivities.includes(act.id);
        return `
        <label class="checkbox-card ${isChecked ? "selected" : ""}" data-act-id="${act.id}">
          <input type="checkbox" value="${act.id}" ${isChecked ? "checked" : ""}>
          <div class="checkbox-card-body">
            <div class="checkbox-title-row">
              <strong>${act.name}</strong>
              <span class="choice-price">${calc.formatRupiah(act.price)}</span>
            </div>
            <p>${act.description}</p>
          </div>
        </label>
      `;
      })
      .join("");

    // Event listener checkbox saat add-on dicentang atau dilepas
    activitiesContainer.querySelectorAll(".checkbox-card").forEach((card) => {
      const checkbox = card.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", (e) => {
        const actId = e.target.value;
        calc.toggleActivity(actId);
        card.classList.toggle("selected", e.target.checked);
      });
    });
  }

  // Sinkronisasi status visual kartu checkbox aktivitas dengan state kalkulator
  function updateActivitiesUI(selectedActIds) {
    if (!activitiesContainer) return;
    activitiesContainer.querySelectorAll(".checkbox-card").forEach((card) => {
      const actId = card.getAttribute("data-act-id");
      const isSelected = selectedActIds.includes(actId);
      card.classList.toggle("selected", isSelected);
      const checkbox = card.querySelector("input[type='checkbox']");
      if (checkbox) checkbox.checked = isSelected;
    });
  }

  // --------------------------------------------------------------------------
  // 4. KONTROL STEPPER JUMLAH PENGUNJUNG (DEWASA & ANAK-ANAK)
  // --------------------------------------------------------------------------
  // Menambah jumlah tiket dewasa (+1)
  if (adultsInc) {
    adultsInc.addEventListener("click", () => {
      const current = parseInt(calc.state.adults, 10) || 0;
      calc.setState({ adults: current + 1, appliedPackageId: null });
    });
  }
  // Mengurangi jumlah tiket dewasa (-1), batas minimum 1 orang
  if (adultsDec) {
    adultsDec.addEventListener("click", () => {
      const current = parseInt(calc.state.adults, 10) || 0;
      if (current > 1) {
        calc.setState({ adults: current - 1, appliedPackageId: null });
      }
    });
  }
  // Menambah jumlah tiket anak-anak (+1)
  if (childrenInc) {
    childrenInc.addEventListener("click", () => {
      const current = parseInt(calc.state.children, 10) || 0;
      calc.setState({ children: current + 1, appliedPackageId: null });
    });
  }
  // Mengurangi jumlah tiket anak-anak (-1), batas minimum 0 orang
  if (childrenDec) {
    childrenDec.addEventListener("click", () => {
      const current = parseInt(calc.state.children, 10) || 0;
      if (current > 0) {
        calc.setState({ children: current - 1, appliedPackageId: null });
      }
    });
  }

  // Event listener pilihan retribusi parkir kendaraan
  if (parkingSelect) {
    parkingSelect.addEventListener("change", (e) => {
      calc.setState({ parkingType: e.target.value });
    });
  }

  // --------------------------------------------------------------------------
  // 5. RENDERING KATALOG PAKET WISATA SIAP PAKAI (Slide 5 & Simulasi Slide 6)
  // --------------------------------------------------------------------------
  // Menampilkan kartu paket wisata (Keluarga, Solo, Rombongan, Edukasi)
  if (packagesContainer) {
    packagesContainer.innerHTML = data.tourPackages
      .map(
        (pkg, idx) => `
      <div class="package-card ${pkg.featured ? "featured-package" : ""} reveal reveal-delay-${(idx % 4) + 1}" data-pkg-id="${pkg.id}">
        <div class="package-card-header">
          <span class="badge ${pkg.featured ? "badge-warm" : "badge-primary"}">${pkg.badge}</span>
          <h3>${pkg.title}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${pkg.category}</p>
        </div>
        <p style="font-size: 0.825rem; margin-bottom: 0.75rem;">${pkg.description}</p>
        <div class="package-price-wrap">
          <span style="font-size: 0.725rem; color: var(--text-muted); display: block;">Total Estimasi Paket</span>
          <div class="package-price">${calc.formatRupiah(pkg.price)}</div>
        </div>
        <ul class="package-includes-list">
          ${pkg.includes
            .map(
              (inc) => `
            <li>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>${inc}</span>
            </li>
          `
            )
            .join("")}
        </ul>
        <button class="btn ${pkg.featured ? "btn-primary" : "btn-secondary"} btn-block btn-apply-package" data-id="${pkg.id}">
          Pilih & Terapkan ke Estimasi
        </button>
      </div>
    `
      )
      .join("");

    // Tombol "Pilih & Terapkan ke Estimasi" langsung mengisi seluruh form kalkulator otomatis
    packagesContainer.querySelectorAll(".btn-apply-package").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pkgId = btn.getAttribute("data-id");
        calc.applyPackage(pkgId);
        showToast(
          `Paket "${data.tourPackages.find((p) => p.id === pkgId).title}" berhasil diterapkan ke kalkulator!`
        );
        scrollToElement("#kalkulator");
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. RENDERING DIREKTORI TOUR GUIDE LOKAL (Slide 4 Langkah 3 & Slide 5)
  // --------------------------------------------------------------------------
  // Menampilkan profil lengkap 4 pemandu lokal dengan avatar, sertifikasi, rating, dan keahlian
  if (guidesContainer) {
    guidesContainer.innerHTML = data.tourGuides
      .map(
        (g, idx) => `
      <div class="guide-card reveal reveal-delay-${(idx % 4) + 1}" id="card-${g.id}" data-guide-id="${g.id}">
        <div class="guide-avatar-wrap">
          <img src="${g.avatar}" alt="${g.name}">
          <span class="badge badge-success guide-badge-pill">${g.badge}</span>
        </div>
        <div class="guide-card-content">
          <h4 class="guide-name">${g.name}</h4>
          <span class="guide-role">${g.role}</span>
          <div class="guide-rating-row">
            <span class="star-icon">★</span>
            <span>${g.rating}</span>
            <span style="color: var(--text-muted); font-weight: 400;">(${g.reviewCount} ulasan)</span>
          </div>
          <p class="guide-specialty">${g.specialty}</p>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            Bahasa: <strong>${g.languages.join(", ")}</strong>
          </div>
          <div class="guide-footer-row">
            <span class="guide-rate">${calc.formatRupiah(g.price)} <small style="font-weight: 400; color: var(--text-muted);">/ ${g.duration}</small></span>
            <button class="btn btn-sm btn-secondary btn-select-guide" data-id="${g.id}">
              Pilih Guide
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Tombol "Pilih Guide" pada kartu pemandu memilih guide dan mengarahkan ke kalkulator
    guidesContainer.querySelectorAll(".btn-select-guide").forEach((btn) => {
      btn.addEventListener("click", () => {
        const gId = btn.getAttribute("data-id");
        calc.setState({ selectedGuideId: gId, appliedPackageId: null });
        highlightSelectedGuideCard(gId);
        showToast(`Pemandu "${data.tourGuides.find((g) => g.id === gId).name}" dipilih!`);
        scrollToElement("#kalkulator");
      });
    });
  }

  // Memberikan penanda visual (highlight border dan tombol "Dipilih ✓") pada pemandu yang sedang aktif
  function highlightSelectedGuideCard(guideId) {
    if (!guidesContainer) return;
    guidesContainer.querySelectorAll(".guide-card").forEach((c) => {
      const isMatch = c.getAttribute("data-guide-id") === guideId;
      c.classList.toggle("selected-guide", isMatch);
      const btn = c.querySelector(".btn-select-guide");
      if (btn) {
        btn.textContent = isMatch ? "Dipilih ✓" : "Pilih Guide";
        btn.className = isMatch
          ? "btn btn-sm btn-primary btn-select-guide"
          : "btn btn-sm btn-secondary btn-select-guide";
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. RENDERING DESTINASI SEKITAR PANTAI KARAPYAK (Slide 4 Langkah 1 & Slide 5)
  // --------------------------------------------------------------------------
  // Menampilkan kartu spot wisata sekitar (Tebing Karang, Sunset Deck, Mangrove, Lembah Putri)
  if (destinationsContainer) {
    destinationsContainer.innerHTML = data.destinationsAround
      .map(
        (dest, idx) => `
      <div class="dest-card reveal reveal-delay-${(idx % 4) + 1}">
        <div class="dest-card-image">
          <img src="${dest.image}" alt="${dest.name}">
          <span class="dest-tag">${dest.tag}</span>
        </div>
        <div class="dest-content">
          <h4 class="dest-title">${dest.name}</h4>
          <span class="dest-distance">📍 ${dest.distance}</span>
          <p class="dest-desc">${dest.desc}</p>
        </div>
      </div>
    `
      )
      .join("");
  }

  // --------------------------------------------------------------------------
  // 8. RENDERING MITRA UMKM LOKAL PESISIR BAGOLO (Slide 7)
  // --------------------------------------------------------------------------
  // Menampilkan kartu mitra UMKM warga pesisir beserta keuntungan bagi pemegang voucher
  if (msmeContainer) {
    msmeContainer.innerHTML = data.localPartners
      .map(
        (p, idx) => `
      <div class="msme-card reveal reveal-delay-${(idx % 4) + 1}">
        <span class="msme-cat">${p.category}</span>
        <h4 class="msme-name">${p.name}</h4>
        <p class="msme-desc">${p.desc}</p>
        <div class="msme-benefit">
          🎁 ${p.benefit}
        </div>
      </div>
    `
      )
      .join("");
  }

  // --------------------------------------------------------------------------
  // 9. LANGGANAN REAKTIF KALKULATOR (REACTIVE TWO-WAY UI SYNC)
  // --------------------------------------------------------------------------
  // Callback ini dijalankan otomatis SETIAP KALI ada perubahan pada state kalkulator,
  // memastikan form, rincian tabel struk, total harga, dan mobile bar selalu selaras.
  calc.subscribe((summary) => {
    // Sinkronisasi teks angka pada stepper dan nilai dropdown
    if (adultsVal) adultsVal.textContent = summary.state.adults;
    if (childrenVal) childrenVal.textContent = summary.state.children;
    if (parkingSelect) parkingSelect.value = summary.state.parkingType || "none";
    if (guideSelect) guideSelect.value = summary.state.selectedGuideId || "none";

    // Sinkronisasi chip radio transportasi, kartu aktivitas, dan kartu guide
    updateTransportChipsUI(summary.state.selectedTransId);
    updateActivitiesUI(summary.state.selectedActivities);
    highlightSelectedGuideCard(summary.state.selectedGuideId);

    // Tampilkan / sembunyikan badge nama paket aktif di atas panel kalkulator
    if (appliedPackageBadge) {
      if (summary.appliedPackage) {
        appliedPackageBadge.textContent = summary.appliedPackage.title;
        appliedPackageBadge.style.display = "inline-flex";
      } else {
        appliedPackageBadge.style.display = "none";
      }
    }

    // Pembaruan total nominal harga di struk desktop dan sticky action bar ponsel
    if (receiptTotalDisplay) {
      receiptTotalDisplay.textContent = summary.totalFormatted;
    }
    if (mobileStickyPrice) {
      mobileStickyPrice.textContent = summary.totalFormatted;
    }
    if (receiptItemCount) {
      receiptItemCount.textContent = `${summary.itemCount} Komponen Terverifikasi`;
    }

    // Pembaruan baris rincian pada tabel struk (Receipt Table)
    if (receiptItemsBody) {
      if (summary.items.length === 0) {
        receiptItemsBody.innerHTML = `
          <tr>
            <td colspan="2" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">
              Belum ada komponen dipilih. Silakan tentukan jumlah tiket atau paket.
            </td>
          </tr>
        `;
      } else {
        receiptItemsBody.innerHTML = summary.items
          .map(
            (item) => `
          <tr>
            <td>
              <span class="receipt-category-tag">${item.category}</span>
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">${item.label}</div>
              ${item.details ? `<div style="font-size: 0.725rem; color: var(--text-muted);">${item.details}</div>` : ""}
            </td>
            <td class="price-col">
              ${calc.formatRupiah(item.subtotal)}
            </td>
          </tr>
        `
          )
          .join("");
      }
    }
  });

  // --------------------------------------------------------------------------
  // 10. INTERAKSI MODAL PEMESANAN ONLINE (Langkah 5 Alur Wisatawan)
  // --------------------------------------------------------------------------
  // Membuka modal formulir pemesanan ketika tombol "Lanjut ke Pemesanan Online" diklik
  if (btnOpenBooking) {
    btnOpenBooking.addEventListener("click", () => {
      const summary = calc.calculate();
      if (summary.total === 0) {
        alert("Pilih minimal 1 tiket masuk untuk melanjutkan pemesanan.");
        return;
      }

      // Mengisi ringkasan komponen biaya di bagian atas formulir modal
      if (modalSummaryList) {
        modalSummaryList.innerHTML = summary.items
          .map(
            (item) => `
          <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 0.4rem;">
            <span style="color: var(--text-secondary);">${item.label}</span>
            <strong style="color: var(--text-main);">${calc.formatRupiah(item.subtotal)}</strong>
          </div>
        `
          )
          .join("");
      }
      if (modalTotalDisplay) {
        modalTotalDisplay.textContent = summary.totalFormatted;
      }

      // Sinkronisasi tanggal kunjungan yang dipilih ke input tanggal modal
      const modalDateInput = document.getElementById("modalDateInput");
      if (modalDateInput) {
        modalDateInput.value = calc.state.visitDate || formattedDate;
      }

      bookingModal.classList.add("active");
    });
  }

  // Menutup modal pemesanan via tombol silang
  if (closeBookingModal) {
    closeBookingModal.addEventListener("click", () => {
      bookingModal.classList.remove("active");
    });
  }

  // Variabel penampung data voucher aktif untuk keperluan pencetakan isolated iframe
  let currentVoucherData = null;

  // --------------------------------------------------------------------------
  // PENANGANAN PENGIRIMAN FORMULIR BOOKING -> PENERBITAN E-VOUCHER TIKET
  // --------------------------------------------------------------------------
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Mengambil dan membersihkan input pengguna
      const guestName = document.getElementById("guestName").value.trim();
      const guestPhone = document.getElementById("guestPhone").value.trim();
      const guestEmail = document.getElementById("guestEmail").value.trim();
      const guestNotes = document.getElementById("guestNotes").value.trim();
      const visitDate = document.getElementById("modalDateInput").value;

      if (!guestName || !guestPhone) {
        alert("Mohon lengkapi nama dan nomor WhatsApp Anda.");
        return;
      }

      const summary = calc.calculate();
      // Pembuatan kode booking resmi acak dengan format KRP-XXXXXX
      const bookingCode = "KRP-" + Math.floor(100000 + Math.random() * 900000);

      // Simpan data voucher untuk dicetak mandiri
      currentVoucherData = {
        bookingCode,
        guestName,
        guestPhone,
        guestEmail,
        guestNotes,
        visitDate: formatDateIndo(visitDate),
        items: summary.items,
        totalFormatted: summary.totalFormatted,
      };

      // Render tampilan visual E-Voucher di dalam dialog modal
      if (voucherContent) {
        voucherContent.innerHTML = `
          <div class="voucher-card">
            <div class="voucher-top">
              <div>
                <span class="badge badge-primary">E-Tiket Terverifikasi</span>
                <h3 style="font-size: 1.1rem; margin-top: 0.25rem;">Karapyak Travel Voucher</h3>
              </div>
              <div class="booking-code">${bookingCode}</div>
            </div>

            <div class="voucher-info-grid">
              <div class="voucher-field">
                <strong>Nama Pemesan:</strong>
                <span>${guestName}</span>
              </div>
              <div class="voucher-field">
                <strong>Tanggal Kunjungan:</strong>
                <span>${formatDateIndo(visitDate)}</span>
              </div>
              <div class="voucher-field">
                <strong>No. Kontak / WhatsApp:</strong>
                <span>${guestPhone}</span>
              </div>
              <div class="voucher-field">
                <strong>Status Pemesanan:</strong>
                <span style="color: var(--success); font-weight: 700;">Terkonfirmasi (Bayar di Mitra)</span>
              </div>
            </div>

            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle);">
              <strong style="font-size: 0.775rem; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">Rincian Komponen Terpilih:</strong>
              <div style="font-size: 0.825rem; display: flex; flex-direction: column; gap: 0.35rem;">
                ${summary.items
                  .map(
                    (it) => `
                  <div style="display: flex; justify-content: space-between;">
                    <span>• ${it.label}</span>
                    <strong>${calc.formatRupiah(it.subtotal)}</strong>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 2px solid var(--border-strong); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.9rem; font-weight: 600;">Total Estimasi Biaya:</span>
              <strong style="font-size: 1.35rem; color: var(--primary);">${summary.totalFormatted}</strong>
            </div>

            ${
              guestNotes
                ? `
              <div style="margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted); background: var(--bg-surface); padding: 0.5rem; border-radius: var(--radius-sm);">
                <em>Catatan Pemesan: "${guestNotes}"</em>
              </div>
            `
                : ""
            }
          </div>
          
          <div style="background-color: var(--bg-subtle); padding: 0.875rem; border-radius: var(--radius-md); font-size: 0.785rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            <strong>Mekanisme Pembayaran (Sesuai SOP Mitra Karapyak):</strong><br>
            Tiket dan layanan pemandu dibayarkan langsung saat tiba di pos resmi Pantai Karapyak atau transfer rekening mitra yang dikonfirmasikan via WhatsApp pengelola.
          </div>
        `;
      }

      // Konfigurasi tautan otomatis ke WhatsApp resmi pengelola wisata
      if (btnWhatsAppConfirm) {
        const waText = encodeURIComponent(
          `Halo Mitra Karapyak Travel! Saya ingin mengonfirmasi pesanan tiket/layanan:\n` +
            `- Kode Booking: ${bookingCode}\n` +
            `- Nama: ${guestName}\n` +
            `- Tanggal: ${formatDateIndo(visitDate)}\n` +
            `- Total Estimasi: ${summary.totalFormatted}\n` +
            `- Rincian: ${summary.items.map((i) => i.label).join(", ")}\n` +
            `Mohon informasi penjemputan dan panduan kedatangan. Terima kasih!`
        );
        const waNumber = (data.info && data.info.contactWhatsApp) || "628158899181";
        btnWhatsAppConfirm.href = `https://wa.me/${waNumber}?text=${waText}`;
      }

      // Beralih dari modal formulir ke modal tampilan tiket berhasil
      bookingModal.classList.remove("active");
      ticketModal.classList.add("active");
    });
  }

  // Menutup modal voucher digital
  if (closeTicketModal) {
    closeTicketModal.addEventListener("click", () => {
      ticketModal.classList.remove("active");
    });
  }

  // --------------------------------------------------------------------------
  // ISOLATED IFRAME PRINTER ENGINE (CETAK TIKET BERSIH 1 HALAMAN A4)
  // --------------------------------------------------------------------------
  // Mencetak voucher melalui iframe terisolasi agar styling web luar tidak merusak
  // proporsi cetak, menjamin hasil print/PDF persis 1 lembar A4 portrait resmi.
  function printCleanTicket(voucher) {
    if (!voucher) {
      window.print();
      return;
    }

    let printFrame = document.getElementById("cleanTicketPrintFrame");
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "cleanTicketPrintFrame";
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "none";
      printFrame.style.visibility = "hidden";
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>E-Tiket Resmi - ${voucher.bookingCode} - Karapyak Travel</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 1.2cm 1.5cm;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html, body {
            background: #FFFFFF !important;
            color: #0F172A !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 10.5pt;
            line-height: 1.45;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ticket-card {
            max-width: 660px;
            margin: 0 auto;
            border: 2px solid #0C647C;
            border-radius: 12px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .ticket-head {
            background-color: #0C647C !important;
            color: #FFFFFF !important;
            padding: 1.25rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ticket-head h1 {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0 0 0.2rem 0;
            color: #FFFFFF !important;
          }
          .ticket-head p {
            font-size: 0.8rem;
            opacity: 0.9;
            margin: 0;
            color: #E2E8F0 !important;
          }
          .status-badge {
            background-color: #059669 !important;
            color: #FFFFFF !important;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.35rem 0.75rem;
            border-radius: 9999px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }
          .ticket-content {
            padding: 1.5rem;
          }
          .code-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #F0F9FF !important;
            border: 1.5px dashed #0C647C;
            padding: 0.875rem 1.25rem;
            border-radius: 8px;
            margin-bottom: 1.25rem;
          }
          .code-label {
            font-size: 0.75rem;
            color: #0C647C;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .code-number {
            font-family: monospace;
            font-size: 1.35rem;
            font-weight: 800;
            color: #0C647C;
            letter-spacing: 0.08em;
          }
          .meta-table {
            width: 100%;
            margin-bottom: 1.25rem;
            border-collapse: collapse;
          }
          .meta-table td {
            padding: 0.4rem 0.5rem;
            vertical-align: top;
            font-size: 0.9rem;
          }
          .meta-table td.col-title {
            width: 38%;
            color: #64748B;
            font-weight: 500;
          }
          .meta-table td.col-val {
            width: 62%;
            color: #0F172A;
            font-weight: 700;
          }
          .breakdown-box {
            background: #F8FAFC !important;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 1rem 1.25rem;
            margin-bottom: 1.25rem;
          }
          .breakdown-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #475569;
            margin-bottom: 0.6rem;
            padding-bottom: 0.4rem;
            border-bottom: 1px solid #E2E8F0;
          }
          .breakdown-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            padding: 0.35rem 0;
            border-bottom: 1px solid #F1F5F9;
          }
          .breakdown-row:last-child {
            border-bottom: none;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0 0 0;
            border-top: 2px solid #0C647C;
            margin-top: 0.6rem;
          }
          .total-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0F172A;
          }
          .total-amount {
            font-size: 1.35rem;
            font-weight: 800;
            color: #0C647C;
          }
          .notes-alert {
            background: #FEF3C7 !important;
            border: 1px solid #FCD34D;
            padding: 0.6rem 0.85rem;
            border-radius: 6px;
            font-size: 0.8rem;
            color: #92400E;
            margin-bottom: 1.25rem;
          }
          .sop-alert {
            background: #F8FAFC !important;
            border-left: 3.5px solid #0C647C;
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
            color: #475569;
            margin-bottom: 0.5rem;
            border-radius: 0 6px 6px 0;
          }
          .ticket-foot {
            background: #F1F5F9 !important;
            border-top: 1px solid #E2E8F0;
            padding: 0.75rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: #64748B;
          }
        </style>
      </head>
      <body>
        <div class="ticket-card">
          <div class="ticket-head">
            <div>
              <h1>Pantai Karapyak Travel</h1>
              <p>Platform Digital Resmi Wisata Bahari Bagolo, Pangandaran</p>
            </div>
            <span class="status-badge">Terkonfirmasi</span>
          </div>

          <div class="ticket-content">
            <div class="code-banner">
              <span class="code-label">Kode Booking Resmi:</span>
              <span class="code-number">${voucher.bookingCode}</span>
            </div>

            <table class="meta-table">
              <tr>
                <td class="col-title">Nama Pemesan:</td>
                <td class="col-val">${voucher.guestName}</td>
              </tr>
              <tr>
                <td class="col-title">No. Kontak / WhatsApp:</td>
                <td class="col-val">${voucher.guestPhone}</td>
              </tr>
              ${
                voucher.guestEmail
                  ? `
              <tr>
                <td class="col-title">Alamat Email:</td>
                <td class="col-val">${voucher.guestEmail}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td class="col-title">Tanggal Kunjungan:</td>
                <td class="col-val">${voucher.visitDate}</td>
              </tr>
              <tr>
                <td class="col-title">Lokasi Destinasi:</td>
                <td class="col-val">Pantai Karapyak, Desa Bagolo, Kec. Kalipucang, Kab. Pangandaran</td>
              </tr>
            </table>

            <div class="breakdown-box">
              <div class="breakdown-title">Rincian Komponen & Layanan Terverifikasi:</div>
              ${voucher.items
                .map(
                  (item) => `
                <div class="breakdown-row">
                  <span>• ${item.label}</span>
                  <strong>${calc.formatRupiah(item.subtotal)}</strong>
                </div>
              `
                )
                .join("")}
              <div class="total-row">
                <span class="total-title">Total Estimasi Biaya:</span>
                <span class="total-amount">${voucher.totalFormatted}</span>
              </div>
            </div>

            ${
              voucher.guestNotes
                ? `
              <div class="notes-alert">
                <strong>Catatan Pemesan:</strong> "${voucher.guestNotes}"
              </div>
            `
                : ""
            }

            <div class="sop-alert">
              <strong>Panduan Kedatangan (SOP Resmi Pengelola):</strong><br>
              Tunjukkan lembar E-Voucher ini kepada petugas di Pos Gerbang Tiket Masuk Karapyak atau kepada pemandu lokal Anda saat tiba. Pembayaran diselesaikan langsung saat tiba di pos resmi Pantai Karapyak atau transfer rekening mitra yang dikonfirmasi via WhatsApp pengelola.
            </div>
          </div>

          <div class="ticket-foot">
            <span>Diterbitkan resmi oleh Pengelola Wisata Pantai Karapyak</span>
            <span>karapyakgo.github.io</span>
          </div>
        </div>
      </body>
      </html>
    `);
    frameDoc.close();

    // Picu dialog print browser setelah iframe selesai merender konten
    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (err) {
        console.error("Gagal mencetak lewat iframe, beralih ke window.print:", err);
        window.print();
      }
    }, 280);
  }

  // Tombol "Cetak / Simpan E-Tiket" memanggil engine print iframe
  if (btnPrintTicket) {
    btnPrintTicket.addEventListener("click", () => {
      printCleanTicket(currentVoucherData);
    });
  }

  // Menutup dialog modal ketika pengguna mengklik area backdrop di luar kartu modal
  [bookingModal, ticketModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        if (typeof updateFlowStepOnScroll === "function") {
          updateFlowStepOnScroll();
        }
      }
    });
  });

  if (closeBookingModal) {
    closeBookingModal.addEventListener("click", () => {
      bookingModal.classList.remove("active");
      if (typeof updateFlowStepOnScroll === "function") {
        updateFlowStepOnScroll();
      }
    });
  }

  // --------------------------------------------------------------------------
  // FUNGSI HELPER: NOTIFIKASI TOAST MELAYANG
  // --------------------------------------------------------------------------
  // Menampilkan pesan pop-up ringan di pojok kanan bawah selama 3 detik
  function showToast(message) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="#10B981">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 300ms ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Menggulir tampilan layar ke elemen target secara halus (smooth scroll)
  function scrollToElement(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Mengubah format tanggal ISO (YYYY-MM-DD) ke bahasa Indonesia formal (Contoh: "Selasa, 21 Oktober 2026")
  function formatDateIndo(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // ==========================================================================
  // 11. ANIMASI SCROLL REVEAL (INTERSECTION OBSERVER BERPERFORMA TINGGI)
  // ==========================================================================
  // Memunculkan kartu secara bertahap saat digulir ke dalam viewport pengguna.
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal, .reveal-scale");
    if (!revealElements.length) return;

    // Fallback jika peramban lawas tidak mendukung IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // Lepas observer agar hemat memori
          }
        });
      },
      {
        root: null,
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ==========================================================================
  // 12. PENGENDALI SCROLL SPY & STICKY 5-STEP TOURIST FLOW RIBBON
  // ==========================================================================
  // Memantau posisi gulir dan memperbarui status aktif langkah 1 s/d 5 di pita alur,
  // serta menggeser posisi aktif ke tengah layar secara otomatis pada ponsel.
  let updateFlowStepOnScroll = null;

  function initFlowScrollSpy() {
    const stepItems = document.querySelectorAll(".flow-step-item");
    const flowStep5 = document.getElementById("flowStep5");
    if (!stepItems.length) return;

    let isProgrammatic = false; // Flag untuk mencegah konflik saat scroll otomatis dipicu tombol
    let timer = null;

    // Menandai langkah aktif pada pita navigasi alur
    function setActiveStep(stepNum) {
      stepItems.forEach((item) => {
        const s = parseInt(item.getAttribute("data-step"), 10);
        if (s === stepNum) {
          if (!item.classList.contains("active")) {
            item.classList.add("active");
            // Auto-center posisi tab di layar HP agar langkah aktif selalu terlihat
            item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        } else {
          item.classList.remove("active");
        }
      });
    }

    // Klik langsung pada Langkah 5 ("Pemesanan & Konfirmasi") otomatis membuka modal booking
    if (flowStep5) {
      flowStep5.addEventListener("click", (e) => {
        e.preventDefault();
        isProgrammatic = true;
        clearTimeout(timer);
        setActiveStep(5);
        scrollToElement("#receiptCard");
        setTimeout(() => {
          if (btnOpenBooking) {
            btnOpenBooking.click();
          }
          isProgrammatic = false;
        }, 500);
      });
    }

    // Klik pada langkah 1 s/d 4: Menggulir mulus ke section yang dituju
    stepItems.forEach((item) => {
      const stepNum = parseInt(item.getAttribute("data-step"), 10);
      if (stepNum === 5) return;

      item.addEventListener("click", (e) => {
        const targetHref = item.getAttribute("href");
        if (targetHref && targetHref.startsWith("#")) {
          e.preventDefault();
          isProgrammatic = true;
          clearTimeout(timer);
          setActiveStep(stepNum);
          scrollToElement(targetHref);
          timer = setTimeout(() => {
            isProgrammatic = false;
          }, 800);
        }
      });
    });

    // Kalkulasi posisi gulir untuk menentukan section mana yang sedang dibaca pengunjung
    updateFlowStepOnScroll = function () {
      if (isProgrammatic) return;

      // Jika modal booking sedang aktif terbuka, kunci langkah ke nomor 5
      if (bookingModal && bookingModal.classList.contains("active")) {
        setActiveStep(5);
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const navOffset = 140; // Offset kompensasi tinggi sticky header + ribbon

      const secInfo = document.getElementById("informasi");
      const secCalc = document.getElementById("kalkulator");
      const secPemandu = document.getElementById("pemandu");
      const receiptCard = document.getElementById("receiptCard");

      const infoTop = secInfo ? secInfo.offsetTop - navOffset : 0;
      const calcTop = secCalc ? secCalc.offsetTop - navOffset : 600;
      const pemanduTop = secPemandu ? secPemandu.offsetTop - navOffset : 1400;
      const receiptTop = receiptCard ? receiptCard.offsetTop - navOffset : calcTop + 250;

      if (scrollY < calcTop - 60) {
        setActiveStep(1); // 1. Eksplorasi Informasi Pantai
      } else if (scrollY >= calcTop - 60 && scrollY < pemanduTop - 80) {
        if (scrollY >= receiptTop - 120) {
          setActiveStep(4); // 4. Kalkulator Estimasi (Panel Struk Biaya)
        } else {
          setActiveStep(2); // 2. Tiket & Tanggal (Form Kunjungan)
        }
      } else if (
        scrollY >= pemanduTop - 80 &&
        scrollY < pemanduTop + (secPemandu ? secPemandu.offsetHeight : 600) - 80
      ) {
        setActiveStep(3); // 3. Pemandu Wisata Lokal
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollY >= totalHeight - 220) {
          setActiveStep(5); // 5. Pemesanan & Konfirmasi
        } else {
          setActiveStep(4); // Estimasi Biaya
        }
      }
    };

    // Pemanfaatan requestAnimationFrame untuk optimasi event scroll 60 FPS
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateFlowStepOnScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Jalankan pemeriksaan awal saat halaman pertama kali dimuat
    updateFlowStepOnScroll();
  }

  // Menjalankan sistem animasi dan scroll spy
  initScrollReveal();
  initFlowScrollSpy();
});
