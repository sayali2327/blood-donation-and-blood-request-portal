// Initialize Leaflet map
var map = L.map('map').setView([28.6139, 77.2090], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var marker = L.marker([28.6139, 77.2090]).addTo(map)
  .bindPopup('Hospital Location')
  .openPopup();

map.on('click', function(e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  marker.setLatLng([lat, lng]).bindPopup("Selected Location").openPopup();
  document.getElementById("lat").value = lat.toFixed(5);
  document.getElementById("lng").value = lng.toFixed(5);
});

// Use browser location
document.getElementById("locateBtn").addEventListener("click", function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      map.setView([lat, lng], 14);
      marker.setLatLng([lat, lng]).bindPopup("Hospital Location").openPopup();
      document.getElementById("lat").value = lat.toFixed(5);
      document.getElementById("lng").value = lng.toFixed(5);
    });
  } else alert("Geolocation not supported");
});

// Submit request
document.getElementById("requestForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const data = {
    patientName: document.getElementById("patientName").value,
    bloodGroup: document.getElementById("bloodGroup").value,
    units: document.getElementById("units").value,
    hospital: document.getElementById("hospital").value,
    urgency: document.getElementById("urgency").value,
    location: {
      type: "Point",
      coordinates: [
        parseFloat(document.getElementById("lng").value),
        parseFloat(document.getElementById("lat").value)
      ]
    }
  };

  const token = localStorage.getItem("jwt_token"); // must be set after login

  const res = await fetch("/api/recipient/request", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
  loadMatchingDonors(); // refresh donors list
});

// Load matching donors
async function loadMatchingDonors() {
  const token = localStorage.getItem("jwt_token");
  const res = await fetch("/api/recipient/donors", {
    headers: { "Authorization": "Bearer " + token }
  });
  const donors = await res.json();
  const list = document.getElementById("donorsList");
  list.innerHTML = "";
  donors.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.fullName} (${d.bloodGroup}) - ${d.phoneNumber}`;
    list.appendChild(li);
  });
}
loadMatchingDonors();
