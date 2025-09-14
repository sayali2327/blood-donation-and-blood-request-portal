// Initialize the map (centered on India by default)
var map = L.map('map').setView([20.5937, 78.9629], 5);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Marker variable for later use
var marker;

// Try to get user's location on load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    map.setView([lat, lng], 14);
    marker = L.marker([lat, lng]).addTo(map)
      .bindPopup("You are here!").openPopup();
    // If you have hidden lat/lng fields, you can set them here
    if (document.getElementById("lat")) document.getElementById("lat").value = lat.toFixed(5);
    if (document.getElementById("lng")) document.getElementById("lng").value = lng.toFixed(5);
  });
}


// ...existing code...

// Add this function at the top or after marker variable
function reverseGeocode(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    .then(response => response.json())
    .then(data => {
      if (data.address) {
        let city = data.address.city || data.address.town || data.address.village || "";
        let state = data.address.state || "";
        let locationString = city && state ? `${city}, ${state}` : data.display_name;
        const locationInput = document.getElementById("location");
        if (locationInput) locationInput.value = locationString;
      }
    });
}

// ...existing code...

// Try to get user's location on load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    map.setView([lat, lng], 14);
    marker = L.marker([lat, lng]).addTo(map)
      .bindPopup("You are here!").openPopup();
    if (document.getElementById("lat")) document.getElementById("lat").value = lat.toFixed(5);
    if (document.getElementById("lng")) document.getElementById("lng").value = lng.toFixed(5);
    // Auto-fill location field
    reverseGeocode(lat, lng);
  });
}

// ...existing code...
// Optional: Button to locate user again
var locateBtn = document.getElementById("locateBtn");
if (locateBtn) {
  locateBtn.addEventListener("click", function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        map.setView([lat, lng], 14);
        if (!marker) {
          marker = L.marker([lat, lng]).addTo(map);
        } else {
          marker.setLatLng([lat, lng]);
        }
        marker.bindPopup("Hospital Location").openPopup();
        if (document.getElementById("lat")) document.getElementById("lat").value = lat.toFixed(5);
        if (document.getElementById("lng")) document.getElementById("lng").value = lng.toFixed(5);
      });
    } else {
      alert("Geolocation not supported");
    }
  });
}

// Submit request
// ...existing code...

// Submit request
var requestForm = document.getElementById("bloodRequestForm");
if (requestForm) {
  requestForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const data = {
      patientName: document.getElementById("patientName")?.value,
      bloodType: document.getElementById("bloodType")?.value,
      unitsNeeded: document.getElementById("unitsNeeded")?.value,
      urgency: document.getElementById("urgency")?.value,
      hospital: document.getElementById("hospital")?.value,
      location: document.getElementById("location")?.value,
      lat: document.getElementById("lat")?.value,
      lng: document.getElementById("lng")?.value,
      contactName: document.getElementById("contactName")?.value,
      contactPhone: document.getElementById("contactPhone")?.value,
      reason: document.getElementById("reason")?.value,
      additionalNotes: document.getElementById("additionalNotes")?.value
    };

    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Blood request submitted successfully!");
        requestForm.reset();
      } else {
        const error = await response.json();
        alert("Submission failed: " + (error.error || "Please try again."));
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  });
}

// ...existing code...