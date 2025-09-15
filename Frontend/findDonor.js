const donorList = document.getElementById("donorList");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const bloodGroup = document.getElementById("bloodGroup").value.trim();

  if (!bloodGroup) {
    alert("Please select a blood group");
    return;
  }

  // 🔹 Hardcoded Pune coordinates for testing
  const lat = 18.454;
  const lng = 73.87221;
  console.log("Using location:", lat, lng, "Blood Group:", bloodGroup);

  fetch(`http://localhost:5000/api/users/nearby?lat=${lat}&lng=${lng}&bloodGroup=${bloodGroup}&maxDistance=500000`)
    .then(res => res.json())
    .then(data => {
      console.log("API Response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        donorList.innerHTML = `<p class="text-gray-600">No donors found nearby.</p>`;
        return;
      }

      donorList.innerHTML = `
        <table class="w-full border mt-4">
          <thead>
            <tr class="bg-red-100">
              <th class="border p-2">Name</th>
              <th class="border p-2">Blood Group</th>
              <th class="border p-2">Distance (km)</th>
              <th class="border p-2">Contact</th>
              <th class="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(donor => `
              <tr>
                <td class="border p-2">${donor.fullName}</td>
                <td class="border p-2">${donor.bloodGroup}</td>
                <td class="border p-2">${(donor.distance / 1000).toFixed(2)} km</td>
                <td class="border p-2">${donor.phone || 'N/A'}</td>
                <td class="border p-2">
                  <button class="bg-green-600 text-white px-3 py-1 rounded" 
                    onclick="sendRequest('${donor.email}')">Send Request</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    })
    .catch(err => {
      console.error(err);
      donorList.innerHTML = `<p class="text-red-600">Error loading donors</p>`;
    });
});

function sendRequest(email) {
  alert(`Blood request sent to ${email}`);
}
