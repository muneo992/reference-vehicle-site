document.addEventListener("DOMContentLoaded", () => {
  const vehicleGrid = document.getElementById("vehicle-grid");
  const resultsCount = document.getElementById("results-count");

  const filterMake = document.getElementById("filter-make");
  const filterBody = document.getElementById("filter-body");
  const filterFuel = document.getElementById("filter-fuel");
  const filterTransmission = document.getElementById("filter-transmission");
  const filterYearFrom = document.getElementById("filter-year-from");
  const filterYearTo = document.getElementById("filter-year-to");
  const filterMileage = document.getElementById("filter-mileage");
  const sortSelect = document.getElementById("sort-select");
  const resetFiltersBtn = document.getElementById("reset-filters");

  let vehicles = [];
  let filteredVehicles = [];

  fetch("data/vehicles.json")
    .then(response => response.json())
    .then(data => {
      vehicles = data;
      filteredVehicles = vehicles;
      renderVehicles();
    });

  function renderVehicles() {
    vehicleGrid.innerHTML = "";

    filteredVehicles.forEach(v => {
      const hasImage = v.gallery && v.gallery.length > 0;
      const imageSrc = hasImage ? v.gallery[0] : "";

      const card = document.createElement("div");
      card.className = "vehicle-card";

      card.innerHTML = `
        <div class="vehicle-image ${hasImage ? "" : "no-image"}">
          ${
            hasImage
              ? `<img src="${imageSrc}" alt="${v.display_name_en}">`
              : `<span>No Image</span>`
          }
        </div>

        <div class="vehicle-info">
          <h3>${v.display_name_en}</h3>

          <div class="vehicle-specs">
            <p><strong>Ref:</strong> ${v.ref}</p>
            <p><strong>Year:</strong> ${v.year}</p>
            <p><strong>Mileage:</strong> ${v.mileage_km.toLocaleString()} km</p>
            <p><strong>Fuel:</strong> ${v.fuel_type}</p>
            <p><strong>Transmission:</strong> ${v.transmission}</p>
          </div>

          <div class="vehicle-price">
            <span class="price-range">$${v.price_low_usd.toLocaleString()} - $${v.price_high_usd.toLocaleString()}</span>
            <span class="price-period">(${v.basis})</span>
          </div>

          <a href="vehicle-detail.html?ref=${v.ref}" class="btn btn-primary btn-block">
            Request Quote for Similar
          </a>
        </div>
      `;

      vehicleGrid.appendChild(card);
    });

    resultsCount.textContent = `${filteredVehicles.length} vehicles found`;
  }

  function applyFilters() {
    filteredVehicles = vehicles.filter(v => {
      if (filterMake.value && v.make !== filterMake.value) return false;
      if (filterBody.value && v.body_type !== filterBody.value) return false;
      if (filterFuel.value && v.fuel_type !== filterFuel.value) return false;
      if (filterTransmission.value && v.transmission !== filterTransmission.value) return false;

      if (filterYearFrom.value && v.year < parseInt(filterYearFrom.value)) return false;
      if (filterYearTo.value && v.year > parseInt(filterYearTo.value)) return false;

      if (filterMileage.value && v.mileage_km > parseInt(filterMileage.value)) return false;

      return true;
    });

    applySorting();
    renderVehicles();
  }

  function applySorting() {
    const sortValue = sortSelect.value;

    if (sortValue === "price_asc") {
      filteredVehicles.sort((a, b) => a.price_low_usd - b.price_low_usd);
    } else if (sortValue === "price_desc") {
      filteredVehicles.sort((a, b) => b.price_high_usd - a.price_high_usd);
    } else if (sortValue === "year_desc") {
      filteredVehicles.sort((a, b) => b.year - a.year);
    } else if (sortValue === "mileage_asc") {
      filteredVehicles.sort((a, b) => a.mileage_km - b.mileage_km);
    }
  }

  filterMake.addEventListener("change", applyFilters);
  filterBody.addEventListener("change", applyFilters);
  filterFuel.addEventListener("change", applyFilters);
  filterTransmission.addEventListener("change", applyFilters);
  filterYearFrom.addEventListener("change", applyFilters);
  filterYearTo.addEventListener("change", applyFilters);
  filterMileage.addEventListener("input", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  resetFiltersBtn.addEventListener("click", () => {
    filterMake.value = "";
    filterBody.value = "";
    filterFuel.value = "";
    filterTransmission.value = "";
    filterYearFrom.value = "";
    filterYearTo.value = "";
    filterMileage.value = "";
    sortSelect.value = "";

    filteredVehicles = vehicles;
    renderVehicles();
  });
});
// Catalog Filter Manager
class CatalogManager {
  constructor() {
    this.vehicles = [];
    this.filteredVehicles = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.init();
  }

  async init() {
    await this.loadVehicles();
    this.setupEventListeners();
    this.applyFilters();
  }

  async loadVehicles() {
    try {
      const response = await fetch('data/vehicles.json');
      const data = await response.json();
      this.vehicles = data.vehicles;
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  }

  setupEventListeners() {
    document.getElementById('filter-make')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-body-type')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-fuel-type')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-transmission')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-year-from')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-year-to')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-mileage-max')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('sort-by')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-apply')?.addEventListener('click', () => this.applyFilters());
    document.getElementById('filter-reset')?.addEventListener('click', () => this.resetFilters());
  }

  applyFilters() {
    const make = document.getElementById('filter-make')?.value || '';
    const bodyType = document.getElementById('filter-body-type')?.value || '';
    const fuelType = document.getElementById('filter-fuel-type')?.value || '';
    const transmission = document.getElementById('filter-transmission')?.value || '';
    const yearFrom = document.getElementById('filter-year-from')?.value || '';
    const yearTo = document.getElementById('filter-year-to')?.value || '';
    const mileageMax = document.getElementById('filter-mileage-max')?.value || '';
    const sortBy = document.getElementById('sort-by')?.value || 'date_desc';

    this.filteredVehicles = this.vehicles.filter(v => {
      if (make && v.make !== make) return false;
      if (bodyType && v.body_type !== bodyType) return false;
      if (fuelType && v.fuel_type !== fuelType) return false;
      if (transmission && v.transmission !== transmission) return false;
      if (yearFrom && v.year < parseInt(yearFrom)) return false;
      if (yearTo && v.year > parseInt(yearTo)) return false;
      if (mileageMax && v.mileage_km > parseInt(mileageMax)) return false;
      return true;
    });

    // Sort
    if (sortBy === 'price_asc') {
      this.filteredVehicles.sort((a, b) => a.price_low_usd - b.price_low_usd);
    } else if (sortBy === 'price_desc') {
      this.filteredVehicles.sort((a, b) => b.price_high_usd - a.price_high_usd);
    } else if (sortBy === 'year_desc') {
      this.filteredVehicles.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'mileage_asc') {
      this.filteredVehicles.sort((a, b) => a.mileage_km - b.mileage_km);
    }

    this.currentPage = 1;
    this.renderVehicles();
  }

  renderVehicles() {
    const grid = document.getElementById('vehicle-grid');
    if (!grid) return;

    if (this.filteredVehicles.length === 0) {
      grid.innerHTML = '<div class="no-results"><p>No vehicles found.</p></div>';
      return;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const vehicles = this.filteredVehicles.slice(start, end);

    grid.innerHTML = vehicles.map(v => `
      <div class="vehicle-card">
        <div class="vehicle-image" style="position: relative;">
          <img src="${v.gallery[0] || 'images/placeholder.jpg'}" alt="${v.display_name_en}">
          <span class="badge badge-reference" style="position: absolute; top: 10px; left: 10px; background: #000; color: #fff; padding: 4px 8px; font-size: 10px; font-weight: bold;">REFERENCE</span>
        </div>
        <div class="vehicle-info">
          <p class="ref-id" style="font-size: 0.75rem; color: #999; margin-bottom: 5px;">Ref ID: ${v.ref_id}</p>
          <h3 style="margin-top: 0;">${v.display_name_en}</h3>
          
          <div class="vehicle-specs" style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">
            <span><strong>Year:</strong> ${v.year}</span> | 
            <span><strong>Mileage:</strong> ${v.mileage_km.toLocaleString()} km</span><br>
            <span class="rhd-tag" style="color: #d94141; font-weight: bold; font-size: 0.8rem;">Right-Hand Drive (RHD) Only</span>
          </div>

          <div class="vehicle-price" style="background: #f4f4f4; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
            <p style="font-size: 0.75rem; color: #666; margin: 0;">Est. Price Range (USD)</p>
            <p class="price-range" style="font-size: 1.1rem; font-weight: bold; margin: 0;">$${v.price_low_usd.toLocaleString()} – $${v.price_high_usd.toLocaleString()}</p>
            <p class="basis-period" style="font-size: 0.7rem; color: #999; margin-top: 5px;">Basis: ${v.basis_from} – ${v.basis_to}</p>
          </div>

          <p class="stock-disclaimer" style="font-size: 0.75rem; color: #888; font-style: italic; margin-bottom: 15px;">Not in stock. Past transaction example.</p>
          
          <a href="vehicle-detail.html?ref=${v.ref_id}" class="btn btn-primary btn-block">Request Quote for Similar</a>
        </div>
      </div>
    `).join('');

    document.getElementById('results-count').textContent = this.filteredVehicles.length;
  }

  resetFilters() {
    document.getElementById('filter-make').value = '';
    document.getElementById('filter-body-type').value = '';
    document.getElementById('filter-fuel-type').value = '';
    document.getElementById('filter-transmission').value = '';
    document.getElementById('filter-year-from').value = '';
    document.getElementById('filter-year-to').value = '';
    document.getElementById('filter-mileage-max').value = '';
    this.applyFilters();
  }
}

let catalogManager;
document.addEventListener('DOMContentLoaded', () => {
  catalogManager = new CatalogManager();
});
