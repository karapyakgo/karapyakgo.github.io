/**
 * Calculator Engine for Karapyak Travel
 * Implements real-time price estimation, transparent cost breakdown,
 * and seamless package prefilling according to the PDF flow (Step 4 & Slide 6).
 */

class KarapyakCalculator {
  constructor(data) {
    this.data = data;
    this.state = {
      visitDate: "",
      adults: 4, // Default to 4 to reflect slide 6 simulation
      children: 0,
      parkingType: "none", // Default none to match exact Rp 350.000 simulation in PDF
      selectedGuideId: "guide-asep", // Kang Asep Rp 150.000
      selectedTransId: "trans-shuttle", // Shuttle Rp 100.000
      selectedActivities: ["act-snorkeling"], // Snorkeling Rp 40.000
      appliedPackageId: "pkg-keluarga"
    };

    // Listeners for state change
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.calculate());
  }

  notify() {
    const summary = this.calculate();
    this.subscribers.forEach(cb => cb(summary));
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  applyPackage(packageId) {
    const pkg = this.data.tourPackages.find(p => p.id === packageId);
    if (!pkg) return;

    this.state.appliedPackageId = pkg.id;
    this.state.adults = pkg.prefill.adults;
    this.state.children = pkg.prefill.children;
    this.state.selectedGuideId = pkg.prefill.guideId;
    this.state.selectedTransId = pkg.prefill.transId;
    this.state.selectedActivities = [...pkg.prefill.activities];
    this.notify();
  }

  toggleActivity(activityId) {
    const exists = this.state.selectedActivities.includes(activityId);
    if (exists) {
      this.state.selectedActivities = this.state.selectedActivities.filter(id => id !== activityId);
    } else {
      this.state.selectedActivities.push(activityId);
    }
    this.state.appliedPackageId = null; // Custom configuration
    this.notify();
  }

  calculate() {
    const items = [];
    let total = 0;

    // 1. Adult Tickets
    const adultCount = Math.max(0, parseInt(this.state.adults, 10) || 0);
    const adultRate = this.data.ticketPricing.adult;
    const adultTotal = adultCount * adultRate;
    if (adultCount > 0) {
      items.push({
        category: "Tiket Masuk",
        label: `Tiket Dewasa (${adultCount} orang × ${this.formatRupiah(adultRate)})`,
        qty: adultCount,
        unitPrice: adultRate,
        subtotal: adultTotal
      });
      total += adultTotal;
    }

    // 2. Child Tickets
    const childCount = Math.max(0, parseInt(this.state.children, 10) || 0);
    const childRate = this.data.ticketPricing.child;
    const childTotal = childCount * childRate;
    if (childCount > 0) {
      items.push({
        category: "Tiket Masuk",
        label: `Tiket Anak-anak (${childCount} orang × ${this.formatRupiah(childRate)})`,
        qty: childCount,
        unitPrice: childRate,
        subtotal: childTotal
      });
      total += childTotal;
    }

    // 3. Parking (optional)
    const parkingType = this.state.parkingType || "none";
    const parkingCost = this.data.ticketPricing.parking[parkingType] || 0;
    if (parkingCost > 0) {
      const parkingNameMap = {
        motor: "Parkir Motor",
        mobil: "Parkir Mobil Pribadi",
        bus: "Parkir Bus / Minibus"
      };
      items.push({
        category: "Retribusi Parkir",
        label: parkingNameMap[parkingType] || "Parkir",
        qty: 1,
        unitPrice: parkingCost,
        subtotal: parkingCost
      });
      total += parkingCost;
    }

    // 4. Tour Guide (Optional)
    let selectedGuide = null;
    if (this.state.selectedGuideId && this.state.selectedGuideId !== "none") {
      selectedGuide = this.data.tourGuides.find(g => g.id === this.state.selectedGuideId);
      if (selectedGuide) {
        items.push({
          category: "Pemandu Lokal",
          label: `Jasa Pemandu: ${selectedGuide.name} (${selectedGuide.duration})`,
          qty: 1,
          unitPrice: selectedGuide.price,
          subtotal: selectedGuide.price,
          details: selectedGuide.specialty
        });
        total += selectedGuide.price;
      }
    }

    // 5. Local Transportation (Optional)
    let selectedTrans = null;
    if (this.state.selectedTransId && this.state.selectedTransId !== "trans-none") {
      selectedTrans = this.data.transportOptions.find(t => t.id === this.state.selectedTransId);
      if (selectedTrans && selectedTrans.price > 0) {
        items.push({
          category: "Transportasi",
          label: selectedTrans.name,
          qty: 1,
          unitPrice: selectedTrans.price,
          subtotal: selectedTrans.price,
          details: selectedTrans.description
        });
        total += selectedTrans.price;
      }
    }

    // 6. Additional Activities / MSME Services
    this.state.selectedActivities.forEach(actId => {
      const act = this.data.customActivities.find(a => a.id === actId);
      if (act) {
        items.push({
          category: "Aktivitas & Kuliner",
          label: act.name,
          qty: 1,
          unitPrice: act.price,
          subtotal: act.price,
          details: act.description
        });
        total += act.price;
      }
    });

    return {
      state: { ...this.state },
      items,
      total,
      totalFormatted: this.formatRupiah(total),
      itemCount: items.length,
      selectedGuide,
      selectedTrans,
      appliedPackage: this.data.tourPackages.find(p => p.id === this.state.appliedPackageId) || null
    };
  }

  formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  }
}

// Export to window or module
if (typeof window !== "undefined") {
  window.KarapyakCalculator = KarapyakCalculator;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = KarapyakCalculator;
}
