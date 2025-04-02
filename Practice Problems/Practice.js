document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const gradeSections = document.querySelectorAll(".grade-section");
  const options = document.querySelectorAll(".option");
  const resetBtn = document.getElementById("reset-btn");
  const currentScoreElement = document.getElementById("current-score");
  const totalAttemptedElement = document.getElementById("total-attempted");

  let currentScore = 0;
  let totalAttempted = 0;

  // Function to filter problems by grade
  function filterProblems(grade) {
    gradeSections.forEach((section) => {
      // First hide all sections with a smooth transition
      section.style.display = "none";

      // Show sections that match the selected grade or show all if 'all' is selected
      setTimeout(() => {
        if (grade === "all" || section.getAttribute("data-grade") === grade) {
          section.style.display = "block";
          // Add animation class
          section.style.animation = "none";
          section.offsetHeight; // Trigger reflow
          section.style.animation = "fadeIn 0.5s ease-in-out";
        }
      }, 300);
    });
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

      // Filter problems based on grade
      filterProblems(grade);
    });
  });

  // Add click event to each option button
  options.forEach((option) => {
    option.addEventListener("click", function () {
      // Get the parent problem card and feedback element
      const problemCard = this.closest(".problem-card");
      const feedbackElement = problemCard.querySelector(".feedback");
      const allOptions = problemCard.querySelectorAll(".option");

      // Prevent clicking if already answered
      if (
        this.classList.contains("correct") ||
        this.classList.contains("incorrect")
      ) {
        return;
      }

      // Increment total attempted
      totalAttempted++;
      totalAttemptedElement.textContent = totalAttempted;

      // Check if the answer is correct
      const isCorrect = this.getAttribute("data-correct") === "true";

      // Update score if correct
      if (isCorrect) {
        currentScore++;
        currentScoreElement.textContent = currentScore;

        // Add correct class to the option
        this.classList.add("correct");

        // Show correct feedback
        feedbackElement.textContent = "Correct! Great job!";
        feedbackElement.className = "feedback correct";
      } else {
        // Add incorrect class to the option
        this.classList.add("incorrect");

        // Show incorrect feedback
        feedbackElement.textContent = "Incorrect. Try again!";
        feedbackElement.className = "feedback incorrect";

        // Highlight the correct answer
        allOptions.forEach((opt) => {
          if (opt.getAttribute("data-correct") === "true") {
            opt.classList.add("correct");
          }
        });
      }

      // Disable all options in this problem
      allOptions.forEach((opt) => {
        opt.classList.add("disabled");
      });
    });
  });

  // Reset score when reset button is clicked
  resetBtn.addEventListener("click", function () {
    currentScore = 0;
    totalAttempted = 0;
    currentScoreElement.textContent = currentScore;
    totalAttemptedElement.textContent = totalAttempted;

    // Reset all problem cards
    options.forEach((option) => {
      option.classList.remove("correct", "incorrect", "disabled");
    });

    // Hide all feedback
    document.querySelectorAll(".feedback").forEach((feedback) => {
      feedback.className = "feedback";
      feedback.textContent = "";
    });
  });
});
