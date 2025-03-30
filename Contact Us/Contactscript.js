document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  const closeSuccessMessage = document.getElementById('closeSuccessMessage');
  
  // Form validation
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
      message.style.display = 'none';
    });
    
    let isValid = true;
    
    // Validate first name
    const firstName = document.getElementById('firstName');
    if (!firstName.value.trim()) {
      showError('firstNameError', 'First name is required');
      isValid = false;
    }
    
    // Validate last name
    const lastName = document.getElementById('lastName');
    if (!lastName.value.trim()) {
      showError('lastNameError', 'Last name is required');
      isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError('emailError', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError('emailError', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate inquiry type
    const inquiryType = document.getElementById('inquiryType');
    if (inquiryType.value === '') {
      showError('inquiryTypeError', 'Please select an inquiry type');
      isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message');
    if (!message.value.trim()) {
      showError('messageError', 'Message is required');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError('messageError', 'Message must be at least 10 characters');
      isValid = false;
    }
    
    // If form is valid, submit it
    if (isValid) {
      // In a real application, you would send the form data to a server here
      // For this example, we'll just show the success message
      
      // Reset the form
      contactForm.reset();
      
      // Show success message
      successMessage.classList.add('show');
    }
  });
  
  // Close success message
  closeSuccessMessage.addEventListener('click', function() {
    successMessage.classList.remove('show');
  });
  
  // Helper function to show error messages
  function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Helper function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Add input event listeners for real-time validation
  const formInputs = contactForm.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', function() {
      // Clear error message when user starts typing
      const errorId = this.id + 'Error';
      const errorElement = document.getElementById(errorId);
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    });
  });
  
  // Optional: Add a map integration
  // This is a placeholder for where you would add a real map integration
  // For example, using Google Maps or Mapbox
  function initMap() {
    // Map initialization code would go here
    console.log('Map would be initialized here in a real application');
    
    // Example of how you might add a Google Map:
    /*
    const mapElement = document.querySelector('.map-placeholder');
    const map = new google.maps.Map(mapElement, {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 14
    });
    
    const marker = new google.maps.Marker({
      position: { lat: 40.7128, lng: -74.0060 },
      map: map,
      title: 'Our Location'
    });
    */
  }
  
  // Call the map initialization function
  // In a real application, this might be called after the Google Maps API loads
  initMap();
});