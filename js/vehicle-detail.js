document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");

  fetch("data/vehicles.json")
    .then(response => response.json())
    .then(data => {
      const vehicle = data.find(v => v.ref === ref);
      if (!vehicle) return;

      document.getElementById("vehicle-title").textContent = vehicle.display_name_en;
      document.getElementById("vehicle-ref").textContent = vehicle.ref;
      document.getElementById("vehicle-year").textContent = vehicle.year;
      document.getElementById("vehicle-mileage").textContent = vehicle.mileage_km.toLocaleString();
      document.getElementById("vehicle-fuel").textContent = vehicle.fuel_type;
      document.getElementById("vehicle-transmission").textContent = vehicle.transmission;

      document.getElementById("price-low").textContent = `$${vehicle.price_low_usd.toLocaleString()}`;
      document.getElementById("price-high").textContent = `$${vehicle.price_high_usd.toLocaleString()}`;
      document.getElementById("price-basis").textContent = vehicle.basis;

      const mainImage = document.getElementById("main-image");

      if (vehicle.gallery && vehicle.gallery.length > 0) {
        mainImage.src = vehicle.gallery[0];
      } else {
        mainImage.classList.add("no-image");
        mainImage.innerHTML = `<span>No Image Available</span>`;
      }

      document.getElementById("rfq-link").href = `rfq.html?ref=${vehicle.ref}`;
    });
});
