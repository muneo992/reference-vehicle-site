// RFQ Form Handler
class RFQFormHandler {
  constructor() {
    this.form = document.getElementById('rfq-form');
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.loadDestinations();
  }

  async loadDestinations() {
    try {
      const response = await fetch('data/destinations.json');
      const data = await response.json();
      this.populateCountries(data.countries);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  populateCountries(countries) {
    const select = document.getElementById('destination-country');
    if (!select) return;

    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.name;
      select.appendChild(option);
    });

    select.addEventListener('change', () => this.updatePorts(countries));
  }

  updatePorts(countries) {
    const countryCode = document.getElementById('destination-country')?.value;
    const portSelect = document.getElementById('destination-port');
    if (!portSelect) return;

    portSelect.innerHTML = '<option value="">Select a port</option>';
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      country.ports.forEach(port => {
        const option = document.createElement('option');
        option.value = port.code;
        option.textContent = port.name;
        portSelect.appendChild(option);
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = {
      model: document.getElementById('model')?.value || '',
      year_from: document.getElementById('year-from')?.value,
      year_to: document.getElementById('year-to')?.value,
      mileage_max: document.getElementById('mileage-max')?.value,
      budget_from: document.getElementById('budget-from')?.value,
      budget_to: document.getElementById('budget-to')?.value,
      quantity: document.getElementById('quantity')?.value,
      destination_country: document.getElementById('destination-country')?.value,
      destination_port: document.getElementById('destination-port')?.value,
      whatsapp_number: document.getElementById('whatsapp-number')?.value,
      steering: 'RHD only',
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const rfqs = JSON.parse(localStorage.getItem('rfq_submissions') || '[]');
    rfqs.push(formData);
    localStorage.setItem('rfq_submissions', JSON.stringify(rfqs));

    // Redirect to success
    window.location.href = 'rfq-success.html';
  }
}

let rfqFormHandler;
document.addEventListener('DOMContentLoaded', () => {
  rfqFormHandler = new RFQFormHandler();
});
