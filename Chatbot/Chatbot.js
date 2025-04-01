// Import the module using a CDN for browser compatibility
import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.6.1/+esm";

let client;

async function initializeClient() {
  try {
    client = new HfInference("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");
    console.log("Hugging Face client initialized");
  } catch (error) {
    console.error("Error initializing client:", error);
  }
}

// Initialize the client before anything else
await initializeClient();

window.onload = function () {
  const title = document.querySelector(".title");
  const subtitle = document.querySelector(".subtitle");

  if (title && subtitle) {
    title.classList.add("visible");
    subtitle.classList.add("visible");
  }
};

// Define isMathProblem globally
function isMathProblem(message) {
  // Basic check for math problems (e.g., contains numbers and operators)
  return /[\d+\-*/^=]/.test(message);
}

// Make sendMessage available globally
window.sendMessage = async function () {
  const inputField = document.querySelector(".input-field");
  const chatContainer = document.querySelector(".chat-container");
  const suggestionGrid = document.querySelector(".suggestion-grid");
  const message = inputField.value.trim();

  if (message && client) {
    // Replace the suggestion grid with the chat container if not already done
    if (suggestionGrid.style.display !== "none") {
      suggestionGrid.style.display = "none";
      chatContainer.style.display = "flex";
    }

    // Add user's message as a chat bubble
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = message;
    chatContainer.appendChild(userBubble);

    // Add AI's temporary response bubble
    const aiBubble = document.createElement("div");
    aiBubble.className = "chat-bubble ai";
    aiBubble.textContent = "Thinking...";
    chatContainer.appendChild(aiBubble);

    try {
      const response = await client.textGeneration({
        model: "Qwen/QwQ-32B",
        inputs: message,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false,
        },
      });

      // Update AI bubble with the response
      aiBubble.textContent = response.generated_text;
    } catch (error) {
      console.error("Error getting AI response:", error);
      aiBubble.textContent = "Sorry, I couldn't process your request.";
    }

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Clear the input field
    inputField.value = "";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector(".input-field");
  const sendButton = document.querySelector(".send-button");
  const micButton = document.querySelector(".mic-button");
  const cards = document.querySelectorAll(".card");

  // Handle send button click
  sendButton.addEventListener("click", sendMessage);

  // Handle enter key press in input field
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Handle microphone button click
  micButton.addEventListener("click", function () {
    alert("Voice input feature would be activated here");
  });

  // Handle suggestion card clicks
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const title = this.querySelector(".card-title").textContent;
      const subtitle = this.querySelector(".card-subtitle").textContent;
      inputField.value = `${title} ${subtitle}`.trim();
    });
  });
});

async function solveMathProblem(problem) {
  try {
    const url = `http://localhost:3000/solve?problem=${encodeURIComponent(
      problem
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.queryresult && data.queryresult.success) {
      const pods = data.queryresult.pods;
      const solutionPod = pods.find(
        (pod) => pod.title === "Result" || pod.title === "Exact result"
      );
      if (solutionPod) {
        return solutionPod.subpods[0].plaintext;
      } else {
        return "Solution not found.";
      }
    } else {
      return "Unable to solve the problem.";
    }
  } catch (error) {
    console.error("Error solving math problem:", error);
    return "Error solving the problem.";
  }
}

// Change the goBack function to be globally accessible
window.goBack = function () {
  window.history.back();
};

const callApi = () => {
  console.log("callAPI. API called");
};
