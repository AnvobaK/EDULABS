document.addEventListener("DOMContentLoaded", function () {
  const videoCards = document.querySelectorAll(".video-card");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const videoModal = document.getElementById("videoModal");
  const videoFrame = document.getElementById("videoFrame");
  const closeButton = document.querySelector(".close-button");

  // Function to filter videos by grade
  function filterVideos(grade) {
    videoCards.forEach((card) => {
      // First hide all cards with a smooth transition
      card.style.display = "none";

      // Show cards that match the selected grade or show all if 'all' is selected
      setTimeout(() => {
        if (grade === "all" || card.getAttribute("data-grade") === grade) {
          card.style.display = "block";
          // Add animation class
          card.style.animation = "none";
          card.offsetHeight; // Trigger reflow
          card.style.animation = "fadeIn 0.5s ease-in-out";
        }
      }, 300);
    });
  }

  // Function to open the modal with the selected video
  function openVideoModal(videoId) {
    videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    videoModal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  }

  // Function to close the modal
  function closeVideoModal() {
    videoFrame.src = "";
    videoModal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }

  // Add click event to each filter button
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get the grade value from the button
      const grade = this.getAttribute("data-grade");

      // Filter videos based on grade
      filterVideos(grade);
    });
  });

  // Add click event to each video card
  videoCards.forEach((card) => {
    card.addEventListener("click", function () {
      const videoId = this.getAttribute("data-video-id");
      openVideoModal(videoId);
    });
  });

  // Close modal when clicking the close button
  closeButton.addEventListener("click", closeVideoModal);

  // Close modal when clicking outside the content
  videoModal.addEventListener("click", function (event) {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && videoModal.style.display === "flex") {
      closeVideoModal();
    }
  });
});
