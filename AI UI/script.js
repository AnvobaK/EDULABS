document.addEventListener("DOMContentLoaded", () => {
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

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.preventDefault();
      dropdownMenu.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
      if (!dropdownToggle.contains(e.target)) {
        dropdownMenu.classList.remove("show");
      }
    });
  }

  // Math keyboard functionality
  const mathInput = document.getElementById("math-problem");
  const mathKeys = document.querySelectorAll(".math-key");

  if (mathInput && mathKeys.length > 0) {
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
  }

  // File upload functionality
  const fileUpload = document.getElementById("file-upload");
  const uploadArea = document.getElementById("upload-area");
  const uploadPreview = document.getElementById("upload-preview");
  const previewImage = document.getElementById("preview-image");
  const removeImageBtn = document.getElementById("remove-image");

  if (
    fileUpload &&
    uploadArea &&
    uploadPreview &&
    previewImage &&
    removeImageBtn
  ) {
    uploadArea.addEventListener("click", () => {
      fileUpload.click();
    });

    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = "#0B5868";
      uploadArea.style.backgroundColor = "rgba(161, 227, 216, 0.3)";
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.style.borderColor = "var(--mint)";
      uploadArea.style.backgroundColor = "rgba(161, 227, 216, 0.1)";
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = "var(--mint)";
      uploadArea.style.backgroundColor = "rgba(161, 227, 216, 0.1)";

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

      reader.onload = (e) => {
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
  }

  // Solve button functionality with Newton API integration
  const solveButton = document.getElementById("solve-button");
  const analyzeButton = document.getElementById("analyze-button");
  const loadingIndicator = document.getElementById("loading-indicator");
  const solutionSteps = document.getElementById("solution-steps");
  const problemText = document.getElementById("problem-text");

  if (solveButton && loadingIndicator && solutionSteps && problemText) {
    solveButton.addEventListener("click", async () => {
      const problem = mathInput.value.trim();

      if (!problem) {
        alert("Please enter a math problem");
        return;
      }

      // Show loading state
      loadingIndicator.style.display = "flex";
      solutionSteps.style.display = "none";

      try {
        // Get the server URL from environment or use default
        const serverUrl = "http://localhost:3000";

        // Call our API to solve the problem
        const response = await fetch(`${serverUrl}/api/solve-math`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: problem,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to solve problem");
        }

        const data = await response.json();

        // Update problem text
        problemText.textContent = data.problem || problem;

        // Clear previous solution
        const stepsContainer = document.querySelector(".solution-steps");

        // Keep the problem statement
        const problemStatement =
          stepsContainer.querySelector(".problem-statement");
        const answer = stepsContainer.querySelector(".answer");

        // Remove all steps
        const steps = stepsContainer.querySelectorAll(".step");
        steps.forEach((step) => step.remove());

        // Add new steps
        data.steps.forEach((stepText, index) => {
          const stepElement = document.createElement("div");
          stepElement.className = "step";

          const stepTitle = document.createElement("h3");
          stepTitle.textContent = `Step ${index + 1}:`;
          stepElement.appendChild(stepTitle);

          // Split step text into explanation and math
          const parts = stepText.split("\n");

          if (parts.length > 0) {
            const explanation = document.createElement("p");
            explanation.textContent = parts[0];
            stepElement.appendChild(explanation);

            // Add any math expressions as step-math divs
            for (let i = 1; i < parts.length; i++) {
              if (parts[i].trim()) {
                const mathDiv = document.createElement("div");
                mathDiv.className = "step-math";
                mathDiv.textContent = parts[i].trim();
                stepElement.appendChild(mathDiv);
              }
            }
          }

          // Insert before the answer
          stepsContainer.insertBefore(stepElement, answer);
        });

        // Update answer
        const answerText = answer.querySelector("p");
        answerText.textContent = data.answer || "See steps above";

        // Hide loading, show solution
        loadingIndicator.style.display = "none";
        solutionSteps.style.display = "flex";
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Sorry, there was an error solving your problem. Please try again."
        );
        loadingIndicator.style.display = "none";
      }
    });
  }

  if (
    analyzeButton &&
    loadingIndicator &&
    solutionSteps &&
    problemText &&
    previewImage
  ) {
    analyzeButton.addEventListener("click", async () => {
      if (!previewImage.src || previewImage.src.includes("/placeholder.svg")) {
        alert("Please upload an image first");
        return;
      }

      // Show loading state
      loadingIndicator.style.display = "flex";
      solutionSteps.style.display = "none";

      try {
        // Get the server URL from environment or use default
        const serverUrl = "http://localhost:3000";

        // Call our API to process the image
        const response = await fetch(`${serverUrl}/api/process-math-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: previewImage.src,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to process image");
        }

        const data = await response.json();

        // Update problem text with extracted problem
        problemText.textContent = data.problem || "Math problem from image";

        // Clear previous solution
        const stepsContainer = document.querySelector(".solution-steps");

        // Keep the problem statement
        const problemStatement =
          stepsContainer.querySelector(".problem-statement");
        const answer = stepsContainer.querySelector(".answer");

        // Remove all steps
        const steps = stepsContainer.querySelectorAll(".step");
        steps.forEach((step) => step.remove());

        // Add new steps
        data.steps.forEach((stepText, index) => {
          const stepElement = document.createElement("div");
          stepElement.className = "step";

          const stepTitle = document.createElement("h3");
          stepTitle.textContent = `Step ${index + 1}:`;
          stepElement.appendChild(stepTitle);

          // Split step text into explanation and math
          const parts = stepText.split("\n");

          if (parts.length > 0) {
            const explanation = document.createElement("p");
            explanation.textContent = parts[0];
            stepElement.appendChild(explanation);

            // Add any math expressions as step-math divs
            for (let i = 1; i < parts.length; i++) {
              if (parts[i].trim()) {
                const mathDiv = document.createElement("div");
                mathDiv.className = "step-math";
                mathDiv.textContent = parts[i].trim();
                stepElement.appendChild(mathDiv);
              }
            }
          }

          // Insert before the answer
          stepsContainer.insertBefore(stepElement, answer);
        });

        // Update answer
        const answerText = answer.querySelector("p");
        answerText.textContent = data.answer || "See steps above";

        // Hide loading, show solution
        loadingIndicator.style.display = "none";
        solutionSteps.style.display = "flex";
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Sorry, there was an error processing your image. Please try again."
        );
        loadingIndicator.style.display = "none";
      }
    });
  }

  // Example problems functionality
  const exampleCards = document.querySelectorAll(".example-card");

  if (exampleCards.length > 0 && mathInput) {
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
  }

  // Copy and Save functionality
  const copyButton = document.getElementById("copy-button");
  const saveButton = document.getElementById("save-button");

  if (copyButton && problemText) {
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
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      // In a real implementation, this would save to user's account
      // For now, just show an alert
      alert("Solution saved to your account!");
    });
  }
});
