// Vehicle Detail Manager
class VehicleDetailManager {
  constructor() {
    this.vehicle = null;
    this.allVehicles = [];
    this.init();
  }

  async init() {
    await this.loadVehicles();
    const refId = this.getRefIdFromURL();
    if (refId) {
      this.loadVehicleDetail(refId);
    }
    this.setupEventListeners();
  }

  async loadVehicles() {
    try {
      // JSONファイルからデータを取得
      const response = await fetch('data/vehicles.json');
      const data = await response.json();
      this.allVehicles = data.vehicles;
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  }

  getRefIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref');
  }

  loadVehicleDetail(refId) {
    this.vehicle = this.allVehicles.find(v => v.ref_id === refId);
    if (!this.vehicle) {
        console.error('Vehicle not found:', refId);
        return;
    }

    // 基本情報の流し込み
    document.getElementById('vehicle-title').textContent = this.vehicle.display_name_en;
    document.getElementById('ref-id').textContent = this.vehicle.ref_id;
    document.getElementById('price-low').textContent = this.vehicle.price_low_usd.toLocaleString();
    document.getElementById('price-high').textContent = this.vehicle.price_high_usd.toLocaleString();
    document.getElementById('basis-from').textContent = this.vehicle.basis_from;
    document.getElementById('basis-to').textContent = this.vehicle.basis_to;

    // スペック情報の流し込み
    document.getElementById('spec-make').textContent = this.vehicle.make;
    document.getElementById('spec-model').textContent = this.vehicle.model;
    document.getElementById('spec-year').textContent = this.vehicle.year;
    document.getElementById('spec-body-type').textContent = this.vehicle.body_type;
    document.getElementById('spec-fuel-type').textContent = this.vehicle.fuel_type;
    document.getElementById('spec-transmission').textContent = this.vehicle.transmission;
    document.getElementById('spec-mileage').textContent = this.vehicle.mileage_km.toLocaleString() + ' km';

    // 画像の流し込み
    const mainImage = document.getElementById('main-image');
    if (mainImage && this.vehicle.gallery && this.vehicle.gallery[0]) {
      mainImage.src = this.vehicle.gallery[0];
    }

    // RFQリンクにパラメータを付与（詳細情報をフォームに引き継ぐため）
    const rfqLink = document.querySelector('a[href="rfq.html"]');
    if (rfqLink) {
        rfqLink.href = `rfq.html?ref=${this.vehicle.ref_id}`;
    }

    // ブラウザのタイトル更新
    document.title = `${this.vehicle.display_name_en} | Reference Vehicle Marketplace`;
  }

  // イベントリスナーの設定
  setupEventListeners() {
    // もしHTMLにID="wa-button"を付けた場合
    const waBtn = document.getElementById('wa-button');
    if (waBtn) {
        waBtn.addEventListener('click', () => this.handleWhatsApp());
    }
  }

  // 仕様書に基づいたWhatsAppテンプレート生成
  handleWhatsApp() {
    if (!this.vehicle) return;

    const phoneNumber = "YOUR_PHONE_NUMBER_HERE"; // あなたの電話番号（国番号から、+は不要）
    
    const message = `Hi, I am interested in a similar vehicle:\n\n` +
                    `[Reference Details]\n` +
                    `Ref ID: ${this.vehicle.ref_id}\n` +
                    `Model: ${this.vehicle.display_name_en}\n` +
                    `Year: ${this.vehicle.year}\n` +
                    `Est. Price: USD ${this.vehicle.price_low_usd.toLocaleString()} - ${this.vehicle.price_high_usd.toLocaleString()}\n` +
                    `Steering: RHD only\n\n` +
                    `Please provide a current quote for a similar unit.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  }
}

// 初期化
let vehicleDetailManager;
document.addEventListener('DOMContentLoaded', () => {
  vehicleDetailManager = new VehicleDetailManager();
});