const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatHistory = document.getElementById("chatHistory");

// Render a message bubble in the chat history
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatHistory.appendChild(message);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Handle form submit and send the user's message to the backend
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userText = messageInput.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  messageInput.value = "";

  const sendButton = chatForm.querySelector("button");
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });

    const data = await response.json();

    if (!response.ok) {
      addMessage("ai", data.error || "Sorry, something went wrong.");
      return;
    }

    addMessage("ai", data.reply);
  } catch (error) {
    addMessage("ai", "I hit a connection issue. Please try again.");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
    messageInput.focus();
  }
});
