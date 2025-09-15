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
    if (document.getElementById("lat")) document.getElementById("lat").value = lat.toFixed(5);
    if (document.getElementById("lng")) document.getElementById("lng").value = lng.toFixed(5);
    // Optional: Reverse geocode to fill address (see below)
    reverseGeocode(lat, lng);
  });
}
// ...existing code...

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('donorForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevents page reload
            // You can collect form data here and send to backend or show a message
            alert('Thank you for registering as a donor!');
        });
    }
});

// ...existing code...

// Optional: Reverse geocode to auto-fill address
function reverseGeocode(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    .then(response => response.json())
    .then(data => {
      if (data.address) {
        let city = data.address.city || data.address.town || data.address.village || "";
        let state = data.address.state || "";
        let locationString = city && state ? `${city}, ${state}` : data.display_name;
        const addressInput = document.getElementById("address");
        if (addressInput) addressInput.value = locationString;
      }
    });
}
// Global state
let isAvailable = true;
let zoomLevel = 13;
let userLocation = null;

// DOM elements
let availabilitySwitch, mapGrid, zoomInBtn, zoomOutBtn, donorForm, mapLoading, locationText, coordinates;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    availabilitySwitch = document.getElementById('availabilitySwitch');
    mapGrid = document.getElementById('mapGrid');
    zoomInBtn = document.getElementById('zoomIn');
    zoomOutBtn = document.getElementById('zoomOut');
    donorForm = document.getElementById('donorForm');
    mapLoading = document.getElementById('mapLoading');
    locationText = document.getElementById('locationText');
    coordinates = document.getElementById('coordinates');

    // Initialize components
    initializeAvailabilitySwitch();
    initializeMapControls();
    initializeForm();
    initializeGeolocation();
    initializeSmoothScrolling();
    initializeCardHoverEffects();
    initializeFormInputEffects();
    initializePhoneNumberFormatting();
});

// Availability switch functionality
function initializeAvailabilitySwitch() {
    if (!availabilitySwitch) return;

    availabilitySwitch.addEventListener('click', function() {
        isAvailable = !isAvailable;
        if (isAvailable) {
            availabilitySwitch.classList.add('active');
        } else {
            availabilitySwitch.classList.remove('active');
        }
    });
}

// Map controls functionality
function initializeMapControls() {
    if (!mapGrid || !zoomInBtn || !zoomOutBtn) return;

    updateMapGrid();

    zoomInBtn.addEventListener('click', function() {
        if (zoomLevel < 18) {
            zoomLevel++;
            updateMapGrid();
            updateButtonStates();
        }
    });

    zoomOutBtn.addEventListener('click', function() {
        if (zoomLevel > 1) {
            zoomLevel--;
            updateMapGrid();
            updateButtonStates();
        }
    });

    updateButtonStates();
}

function updateMapGrid() {
    if (!mapGrid) return;
    const gridSize = 20 + zoomLevel * 2;
    mapGrid.style.backgroundSize = `${gridSize}px ${gridSize}px`;
}

function updateButtonStates() {
    if (!zoomInBtn || !zoomOutBtn) return;

    zoomInBtn.disabled = zoomLevel >= 18;
    zoomOutBtn.disabled = zoomLevel <= 1;
}

// Geolocation functionality
function initializeGeolocation() {
    if (!mapLoading) return;

    mapLoading.classList.remove('hidden');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                updateLocationDisplay();
                mapLoading.classList.add('hidden');
            },
            function(error) {
                console.log('Geolocation error:', error);
                // Use default location (San Francisco)
                userLocation = { lat: 37.7749, lng: -122.4194 };
                updateLocationDisplay();
                mapLoading.classList.add('hidden');
            }
        );
    } else {
        userLocation = { lat: 37.7749, lng: -122.4194 };
        updateLocationDisplay();
        mapLoading.classList.add('hidden');
    }
}

function updateLocationDisplay() {
    if (!userLocation || !coordinates || !locationText) return;

    const lat = userLocation.lat.toFixed(4);
    const lng = userLocation.lng.toFixed(4);
    coordinates.textContent = `${lat}, ${lng}`;
    
    // Update text based on whether it's the user's actual location or default
    if (userLocation.lat === 37.7749 && userLocation.lng === -122.4194) {
        locationText.textContent = 'Default Location';
    } else {
        locationText.textContent = 'Your Current Location';
    }
}

// Form functionality
function initializeForm() {
    if (!donorForm) return;

    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            bloodGroup: document.getElementById('bloodGroup').value,
            address: document.getElementById('address').value,
            isAvailable: isAvailable,
            location: userLocation
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Simulate form submission
        submitForm(formData);
    });
}

function validateForm(data) {
    // Basic validation (browser will handle required fields)
    if (!data.gender) {
        showAlert('Please select a gender.');
        return false;
    }

    if (!data.bloodGroup) {
        showAlert('Please select your blood group.');
        return false;
    }

    // Validate age range
    const age = parseInt(data.age);
    if (age < 18 || age > 65) {
        showAlert('Age must be between 18 and 65 years.');
        return false;
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showAlert('Please enter a valid email address.');
        return false;
    }

    // Validate phone number (basic)
    if (data.phone.length < 10) {
        showAlert('Please enter a valid phone number.');
        return false;
    }

    return true;
}

function submitForm(data) {
    // Show loading state
    const submitBtn = donorForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(function() {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showAlert('Thank you for registering as a blood donor! We will contact you soon with donation opportunities.', 'success');

        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted:', data);

        // Optionally reset form
        // resetForm();
    }, 2000);
}

function resetForm() {
    if (!donorForm) return;
    
    donorForm.reset();
    isAvailable = true;
    if (availabilitySwitch) {
        availabilitySwitch.classList.add('active');
    }
}

function showAlert(message, type = 'error') {
    // Simple alert for now - in a real app, you'd want a nicer modal/toast
    if (type === 'success') {
        alert('✓ ' + message);
    } else {
        alert('⚠ ' + message);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects to cards
function initializeCardHoverEffects() {
    document.querySelectorAll('.benefit-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Phone number formatting
function initializePhoneNumberFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Remove leading 1 if present
        if (value.startsWith('1') && value.length > 1) {
            value = value.substring(1);
        }
        
        // Format the number
        if (value.length >= 6) {
            value = `+1 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `+1 (${value.slice(0, 3)}) ${value.slice(3)}`;
        } else if (value.length > 0) {
            value = `+1 (${value}`;
        }
        
        e.target.value = value;
    });

    // Prevent non-numeric input (except backspace, delete, etc.)
    phoneInput.addEventListener('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

// Add focus effects to form inputs
function initializeFormInputEffects() {
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#E53935';
            this.style.boxShadow = '0 0 0 3px rgba(229, 57, 53, 0.1)';
        });

        input.addEventListener('blur', function() {
            this.style.borderColor = '#d1d5db';
            this.style.boxShadow = 'none';
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidAge(age) {
    const numAge = parseInt(age);
    return !isNaN(numAge) && numAge >= 18 && numAge <= 65;
}

function isValidPhone(phone) {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Should have 10 or 11 digits (11 if includes country code)
    return digitsOnly.length >= 10;
}

// Add real-time validation feedback (optional enhancement)
function addRealTimeValidation() {
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    const phoneInput = document.getElementById('phone');

    if (emailInput) {
        emailInput.addEventListener('blur', debounce(function() {
            validateEmailField(this);
        }, 300));
    }

    if (ageInput) {
        ageInput.addEventListener('blur', debounce(function() {
            validateAgeField(this);
        }, 300));
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', debounce(function() {
            validatePhoneField(this);
        }, 300));
    }
}

function validateEmailField(input) {
    const isValid = isValidEmail(input.value);
    updateFieldValidation(input, isValid, 'Please enter a valid email address');
}

function validateAgeField(input) {
    const isValid = isValidAge(input.value);
    updateFieldValidation(input, isValid, 'Age must be between 18 and 65 years');
}

function validatePhoneField(input) {
    const isValid = isValidPhone(input.value);
    updateFieldValidation(input, isValid, 'Please enter a valid phone number');
}

function updateFieldValidation(input, isValid, errorMessage) {
    // Remove existing validation classes and messages
    input.classList.remove('error', 'success');
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    if (input.value.trim() === '') {
        return; // Don't validate empty fields on blur
    }

    if (isValid) {
        input.classList.add('success');
        input.style.borderColor = '#10b981';
    } else {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
        
        // Add error message
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = errorMessage;
        input.parentNode.appendChild(errorElement);
    }
}

// Initialize real-time validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment to enable real-time validation
    // addRealTimeValidation();
});

// Handle form reset
function handleFormReset() {
    const form = document.getElementById('donorForm');
    if (!form) return;

    // Reset form fields
    form.reset();
    
    // Reset availability switch
    isAvailable = true;
    if (availabilitySwitch) {
        availabilitySwitch.classList.add('active');
    }
    
    // Remove any validation classes
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.classList.remove('error', 'success');
        input.style.borderColor = '#d1d5db';
        input.style.boxShadow = 'none';
    });
    
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

// Export functions for potential external use
window.BloodCareApp = {
    resetForm: handleFormReset,
    validateForm: validateForm,
    updateLocation: updateLocationDisplay,
    setAvailability: function(available) {
        isAvailable = available;
        if (availabilitySwitch) {
            if (available) {
                availabilitySwitch.classList.add('active');
            } else {
                availabilitySwitch.classList.remove('active');
            }
        }
    }
};
// ...existing code...

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('donorForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('number').value, // Change input id to 'phone' in HTML later
        age: document.getElementById('age').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        bloodGroup: document.getElementById('bloodGroup').value,
        address: document.getElementById('address').value,
        lat: parseFloat(document.getElementById('lat').value),
        lng: parseFloat(document.getElementById('lng').value),
      };

      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert('Donor registered successfully!');
          form.reset();
        } else {
          const error = await response.json();
          alert('Registration failed: ' + (error.error || 'Please try again.'));
        }
      } catch (error) {
        alert('Error connecting to server.');
      }
    });
  }
});
