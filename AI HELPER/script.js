document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(`${tabId}-content`).classList.add("active");
    });
  });

  // Dropdown menu functionality
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  dropdownToggle.addEventListener("click", function (e) {
    e.preventDefault();
    dropdownMenu.classList.toggle("show");
  });

  window.addEventListener("click", function (e) {
    if (!dropdownToggle.contains(e.target)) {
      dropdownMenu.classList.remove("show");
    }
  });

  // Math keyboard functionality
  const mathInput = document.getElementById("math-problem");
  const mathKeys = document.querySelectorAll(".math-key");

  mathKeys.forEach((key) => {
    key.addEventListener("click", () => {
      const symbol = key.textContent;
      const cursorPos = mathInput.selectionStart;
      const textBefore = mathInput.value.substring(0, cursorPos);
      const textAfter = mathInput.value.substring(cursorPos);

      mathInput.value = textBefore + symbol + textAfter;

      // Set cursor position after inserted symbol
      mathInput.focus();
      const newCursorPos = cursorPos + symbol.length;
      mathInput.setSelectionRange(newCursorPos, newCursorPos);
    });
  });

  // File upload functionality
  const fileUpload = document.getElementById("file-upload");
  const uploadArea = document.getElementById("upload-area");
  const uploadPreview = document.getElementById("upload-preview");
  const previewImage = document.getElementById("preview-image");
  const removeImageBtn = document.getElementById("remove-image");

  uploadArea.addEventListener("click", () => {
    fileUpload.click();
  });

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#0369b8";
    uploadArea.style.backgroundColor = "rgba(3, 105, 184, 0.05)";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#ccc";
    uploadArea.style.backgroundColor = "transparent";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#ccc";
    uploadArea.style.backgroundColor = "transparent";

    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileUpload.addEventListener("change", () => {
    if (fileUpload.files.length) {
      handleFile(fileUpload.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
      uploadArea.style.display = "none";
      uploadPreview.style.display = "block";
    };

    reader.readAsDataURL(file);
  }

  removeImageBtn.addEventListener("click", () => {
    previewImage.src = "";
    fileUpload.value = "";
    uploadPreview.style.display = "none";
    uploadArea.style.display = "block";
  });

  // Solve button functionality
  const solveButton = document.getElementById("solve-button");
  const analyzeButton = document.getElementById("analyze-button");
  const loadingIndicator = document.getElementById("loading-indicator");
  const solutionSteps = document.getElementById("solution-steps");
  const problemText = document.getElementById("problem-text");

  solveButton.addEventListener("click", () => {
    const problem = mathInput.value.trim();

    if (!problem) {
      alert("Please enter a math problem");
      return;
    }

    // Show loading state
    loadingIndicator.style.display = "flex";
    solutionSteps.style.display = "none";

    // Update problem text
    problemText.textContent = problem;

    // Simulate AI processing
    setTimeout(() => {
      // Hide loading, show solution
      loadingIndicator.style.display = "none";
      solutionSteps.style.display = "flex";

      // In a real implementation, you would send the problem to your AI backend
      // and display the results when they come back
    }, 2000);
  });

  analyzeButton.addEventListener("click", () => {
    if (!previewImage.src) {
      alert("Please upload an image first");
      return;
    }

    // Show loading state
    loadingIndicator.style.display = "flex";
    solutionSteps.style.display = "none";

    // Simulate AI processing
    setTimeout(() => {
      // Hide loading, show solution
      loadingIndicator.style.display = "none";
      solutionSteps.style.display = "flex";

      // In a real implementation, you would send the image to your AI backend
      // and display the results when they come back
    }, 2000);
  });

  // Example problems functionality
  const exampleCards = document.querySelectorAll(".example-card");

  exampleCards.forEach((card) => {
    const tryButton = card.querySelector(".try-button");
    tryButton.addEventListener("click", () => {
      const problem = card.getAttribute("data-problem");

      // Switch to type tab
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      document.querySelector('[data-tab="type"]').classList.add("active");
      document.getElementById("type-content").classList.add("active");

      // Fill in the problem
      mathInput.value = problem;

      // Scroll to input
      mathInput.scrollIntoView({ behavior: "smooth" });
      mathInput.focus();
    });
  });

  // Copy and Save functionality
  const copyButton = document.getElementById("copy-button");
  const saveButton = document.getElementById("save-button");

  copyButton.addEventListener("click", () => {
    // Create a text representation of the solution
    const problem = problemText.textContent;
    const steps = Array.from(document.querySelectorAll(".step"))
      .map((step) => {
        return `${step.querySelector("h3").textContent}\n${
          step.querySelector("p").textContent
        }\n${Array.from(step.querySelectorAll(".step-math"))
          .map((math) => math.textContent)
          .join("\n")}`;
      })
      .join("\n\n");
    const answer = document.querySelector(".answer").textContent;

    const fullText = `Problem: ${problem}\n\n${steps}\n\n${answer}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        alert("Solution copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  });

  saveButton.addEventListener("click", () => {
    // In a real implementation, this would save to user's account
    // For now, just show an alert
    alert("Solution saved to your account!");
  });
});
