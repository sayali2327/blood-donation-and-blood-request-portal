// ====== CONFIG (replace with your auth integration) ======
const API_BASE = '/api/donor';
// Put your real JWT from your login system here during integration:
const JWT_TOKEN = localStorage.getItem('jwt_token') || ''; // e.g., 'eyJhbGciOi...'

let map, donorMarker;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 20.5937, lng: 78.9629 }, // India centroid
    zoom: 5
  });
  donorMarker = new google.maps.Marker({ map, draggable: true });
  donorMarker.addListener('dragend', (e) => {
    document.getElementById('lat').value = e.latLng.lat().toFixed(6);
    document.getElementById('lng').value = e.latLng.lng().toFixed(6);
  });
}
window.initMap = initMap;

// ====== Helpers ======
async function api(path, options={}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JWT_TOKEN,
      ...(options.headers || {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function setAvailabilityUI(isAvailable) {
  document.getElementById('availabilityToggle').checked = !!isAvailable;
  document.getElementById('availabilityText').textContent = isAvailable ? 'Available' : 'Unavailable';
}

// ====== Load Profile ======
async function loadProfile() {
  try {
    const me = await api('/me');
    document.getElementById('name').value = me.name || '';
    document.getElementById('age').value = me.age || '';
    document.getElementById('gender').value = me.gender || 'other';
    document.getElementById('bloodGroup').value = me.bloodGroup || 'O+';
    document.getElementById('email').value = me.contact?.email || '';
    document.getElementById('phone').value = me.contact?.phone || '';
    document.getElementById('lastDonationDate').value = me.lastDonationDate ? me.lastDonationDate.substring(0,10) : '';
    setAvailabilityUI(me.availability);

    const [lng, lat] = me.location?.coordinates || [78.9629, 20.5937];
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    if (map && donorMarker) {
      const pos = { lat: Number(lat), lng: Number(lng) };
      map.setCenter(pos); map.setZoom(11);
      donorMarker.setPosition(pos);
    }
  } catch (e) {
    console.warn('Load profile failed (you need a valid JWT):', e.message);
  }
}

// ====== Save Profile ======
async function saveProfile(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value,
    age: Number(document.getElementById('age').value || 0),
    gender: document.getElementById('gender').value,
    bloodGroup: document.getElementById('bloodGroup').value,
    contact: { email: document.getElementById('email').value, phone: document.getElementById('phone').value },
    location: {
      type: 'Point',
      coordinates: [ Number(document.getElementById('lng').value), Number(document.getElementById('lat').value) ]
    },
    availability: document.getElementById('availabilityToggle').checked,
    lastDonationDate: document.getElementById('lastDonationDate').value || null
  };
  await api('/profile', { method: 'PUT', body: JSON.stringify(payload) });
  await loadMatches();
  alert('Profile saved');
}

// ====== Locate ======
function locateMe() {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(6);
    const lng = pos.coords.longitude.toFixed(6);
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    if (map && donorMarker) {
      const position = { lat: Number(lat), lng: Number(lng) };
      map.setCenter(position); map.setZoom(12);
      donorMarker.setPosition(position);
    }
  }, err => alert('Failed to get location: ' + err.message));
}

// ====== Matching Requests ======
async function loadMatches() {
  const radiusKm = Number(document.getElementById('radiusKm').value || 5);
  document.getElementById('radiusLabel').textContent = `(within ${radiusKm} km)`;
  const data = await api(`/requests?radiusKm=${radiusKm}`);
  const ul = document.getElementById('requestsList');
  ul.innerHTML = '';
  data.requests.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <div><strong>${r.hospital || 'Hospital'}</strong> • <span class="badge">${r.urgency}</span></div>
        <div class="small">${r.units} unit(s) • Blood: ${r.bloodGroup}</div>
      </div>
      <div>
        <button data-act="accept" data-id="${r._id}">Accept</button>
        <button data-act="reject" data-id="${r._id}">Reject</button>
      </div>`;
    ul.appendChild(li);
  });
}

// ====== Accept/Reject ======
async function handleListClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const act = btn.getAttribute('data-act');
  if (act === 'accept') {
    await api(`/requests/${id}/accept`, { method: 'POST' });
    await loadMatches();
    await loadHistory();
    alert('Accepted. We notified the recipient!');
  } else if (act === 'reject') {
    await api(`/requests/${id}/reject`, { method: 'POST' });
    await loadMatches();
  }
}

// ====== History ======
async function loadHistory() {
  const data = await api('/history');
  const ul = document.getElementById('historyList');
  ul.innerHTML = '';
  data.history.forEach(h => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <div><strong>${h.hospital || 'Hospital'}</strong> • <span class="badge">${h.status}</span></div>
        <div class="small">Blood: ${h.bloodGroup} • ${new Date(h.createdAt).toLocaleString()}</div>
      </div>`;
    ul.appendChild(li);
  });
}

// ====== Availability toggle ======
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('availabilityToggle').addEventListener('change', async (e) => {
    setAvailabilityUI(e.target.checked);
    await saveProfile(new Event('submit')); // quick persist
  });

  document.getElementById('profileForm').addEventListener('submit', saveProfile);
  document.getElementById('locateBtn').addEventListener('click', locateMe);
  document.getElementById('refreshBtn').addEventListener('click', () => loadMatches());
  document.getElementById('requestsList').addEventListener('click', handleListClick);

  loadProfile().then(() => {
    loadMatches();
    loadHistory();
  });
});
