window.onload = function () {
  document.querySelector(".title").classList.add("visible");
  document.querySelector(".subtitle").classList.add("visible");
};

// Define isMathProblem globally
function isMathProblem(message) {
  // Basic check for math problems (e.g., contains numbers and operators)
  return /[\d+\-*/^=]/.test(message);
}

// Define sendMessage globally
async function sendMessage() {
  const inputField = document.querySelector(".input-field");
  const chatContainer = document.querySelector(".chat-container");
  const suggestionGrid = document.querySelector(".suggestion-grid");
  const message = inputField.value.trim();

  if (message) {
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

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (isMathProblem(message)) {
      const result = await solveMathProblem(message);

      // Add AI's response as a chat bubble
      const aiBubble = document.createElement("div");
      aiBubble.className = "chat-bubble ai";
      aiBubble.textContent = `Math Solution: ${result}`;
      chatContainer.appendChild(aiBubble);
    } else {
      // Add AI's response for non-math messages
      const aiBubble = document.createElement("div");
      aiBubble.className = "chat-bubble ai";
      aiBubble.textContent = `I'm not sure how to solve that, but I received your message: "${message}"`;
      chatContainer.appendChild(aiBubble);
    }

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Clear the input field
    inputField.value = "";
  }
}

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

function goBack() {
  window.history.back(); // Takes the user back to the previous page
}

const callApi = () => {
  console.log("callAPI. API called");
};
