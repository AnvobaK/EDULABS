// Your Hugging Face API token - you should store this securely in a production environment
const HF_API_TOKEN = "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"; // Replace with your actual token
// Change this line in your Chatbot.js file
const HF_API_URL =
  "https://api-inference.huggingface.co/deepset/roberta-base-squad2"; // More accessible model

window.onload = function () {
  document.querySelector(".title").classList.add("visible");
  document.querySelector(".subtitle").classList.add("visible");
};

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector(".input-field");
  const sendButton = document.querySelector(".send-button");
  const micButton = document.querySelector(".mic-button");
  const cards = document.querySelectorAll(".card");
  const chatHistory = document.getElementById("chatHistory");
  const suggestionGrid = document.getElementById("suggestionGrid");

  // Create typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.className = "typing-indicator";
  typingIndicator.innerHTML = "<span></span><span></span><span></span>";
  chatHistory.appendChild(typingIndicator);

  // Handle send button click
  sendButton.addEventListener("click", function () {
    sendMessage();
  });

  // Handle enter key press in input field
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Handle microphone button click
  micButton.addEventListener("click", function () {
    // In a real implementation, this would trigger speech recognition
    alert("Voice input feature would be activated here");
  });

  // Handle suggestion card clicks
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const title = this.querySelector(".card-title").textContent;
      const subtitle = this.querySelector(".card-subtitle").textContent;
      inputField.value = `${title} ${subtitle}`.trim();
      // Optional: Auto-send the message
      // sendMessage();
    });
  });

  async function sendMessage() {
    const message = inputField.value.trim();
    if (message) {
      // Show chat history if it's the first message
      if (!chatHistory.classList.contains("active")) {
        chatHistory.classList.add("active");
        suggestionGrid.classList.add("hidden");
      }

      // Add user message to chat
      addMessageToChat(message, "user");

      // Clear input field
      inputField.value = "";

      // Show typing indicator
      typingIndicator.classList.add("active");

      try {
        // Call Hugging Face API
        const response = await fetchHuggingFaceResponse(message);

        // Hide typing indicator
        typingIndicator.classList.remove("active");

        // Add AI response to chat
        addMessageToChat(response, "ai");

        // Scroll to bottom of chat
        chatHistory.scrollTop = chatHistory.scrollHeight;
      } catch (error) {
        console.error("Error:", error);

        // Hide typing indicator
        typingIndicator.classList.remove("active");

        // Add error message to chat
        addMessageToChat(
          "Sorry, I encountered an error. Please try again.",
          "ai"
        );
      }
    }
  }

  function addMessageToChat(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = text;

    // Insert before typing indicator
    chatHistory.insertBefore(messageElement, typingIndicator);

    // Scroll to bottom of chat
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  async function fetchHuggingFaceResponse(message) {
    try {
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract the generated text from the response
      // The exact format depends on the model being used
      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        return data[0].generated_text;
      } else if (data.generated_text) {
        return data.generated_text;
      } else {
        console.log("Unexpected response format:", data);
        return "I received your message, but I'm having trouble formulating a response.";
      }
    } catch (error) {
      console.error("Error calling Hugging Face API:", error);
      throw error;
    }
  }
});

function goBack() {
  window.history.back(); // Takes the user back to the previous page
}
