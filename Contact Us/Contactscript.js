document.addEventListener("DOMContentLoaded", () => {
  // Initialize dropdown functionality
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    // For mobile: toggle dropdown on click
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        menu.classList.remove("show");
      }
    });
  });

  // Contact form validation
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  const closeSuccessMessage = document.getElementById("closeSuccessMessage");

  // Form validation
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Reset error messages
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((message) => {
      message.style.display = "none";
    });

    let isValid = true;

    // Validate first name
    const firstName = document.getElementById("firstName");
    if (!firstName.value.trim()) {
      showError("firstNameError", "First name is required");
      isValid = false;
    }

    // Validate last name
    const lastName = document.getElementById("lastName");
    if (!lastName.value.trim()) {
      showError("lastNameError", "Last name is required");
      isValid = false;
    }

    // Validate email
    const email = document.getElementById("email");
    if (!email.value.trim()) {
      showError("emailError", "Email is required");
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError("emailError", "Please enter a valid email address");
      isValid = false;
    }

    // Validate inquiry type
    const inquiryType = document.getElementById("inquiryType");
    if (inquiryType.value === "") {
      showError("inquiryTypeError", "Please select an inquiry type");
      isValid = false;
    }

    // Validate message
    const message = document.getElementById("message");
    if (!message.value.trim()) {
      showError("messageError", "Message is required");
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError("messageError", "Message must be at least 10 characters");
      isValid = false;
    }

    // If form is valid, submit it
    if (isValid) {
      // In a real application, you would send the form data to a server here
      // For this example, we'll just show the success message

      // Reset the form
      contactForm.reset();

      // Show success message
      successMessage.classList.add("show");
    }
  });

  // Close success message
  closeSuccessMessage.addEventListener("click", () => {
    successMessage.classList.remove("show");
  });

  // Helper function to show error messages
  function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add input event listeners for real-time validation
  const formInputs = contactForm.querySelectorAll("input, select, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Clear error message when user starts typing
      const errorId = this.id + "Error";
      const errorElement = document.getElementById(errorId);
      if (errorElement) {
        errorElement.style.display = "none";
      }
    });
  });

  // Initialize Leaflet Map
  var L = window.L;
  const map = L.map("map").setView([40.7128, -74.006], 15); // New York coordinates as example

  // Add OpenStreetMap tile layer (completely free)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Add a custom marker
  const customIcon = L.divIcon({
    className: "custom-map-marker",
    html: '<div class="marker-pin"><i class="fas fa-map-marker-alt"></i></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

  // Add marker to the map
  const marker = L.marker([40.7128, -74.006], {
    icon: customIcon,
  }).addTo(map);

  // Add a popup to the marker
  marker
    .bindPopup(
      `
    <div style="text-align: center; padding: 10px;">
      <h3 style="margin: 0 0 5px; color: #0b5868;">EduLabs</h3>
      <p style="margin: 0; font-size: 14px;">123 Education Street<br>Learning City, ED 12345</p>
    </div>
  `
    )
    .openPopup();

  // Add custom CSS for the marker
  const style = document.createElement("style");
  style.textContent = `
    .custom-map-marker {
      background: transparent;
      border: none;
    }
    .marker-pin {
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      background: #0b5868;
      position: absolute;
      transform: rotate(-45deg);
      left: 50%;
      top: 50%;
      margin: -15px 0 0 -15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .marker-pin::after {
      content: '';
      width: 24px;
      height: 24px;
      margin: 3px 0 0 3px;
      background: white;
      position: absolute;
      border-radius: 50%;
    }
    .marker-pin i {
      transform: rotate(45deg);
      color: #0b5868;
      position: relative;
      z-index: 1;
      font-size: 16px;
    }
  `;
  document.head.appendChild(style);
});
