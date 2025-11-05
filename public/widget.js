(function () {
  const botId = document.currentScript.getAttribute("data-bot-id");
  const API_BASE = "https://t5u8yd0o9j.execute-api.ap-south-1.amazonaws.com/api/bot"; 

  if (!botId) {
    console.error("⚠️ Asklyy widget: Missing bot ID");
    return;
  }

  // ✅ Fetch bot info before rendering
  fetch(`${API_BASE}/${botId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || !data.data) throw new Error("Bot not found");
      initChatWidget(data.data);
    })
    .catch((err) => {
      console.error("⚠️ Failed to load bot info:", err);
    });

  // ✅ Initialize widget once bot info is available
  function initChatWidget(bot) {
    // Inject CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .asklyy-button {
        position: fixed;
        bottom: 22px;
        right: 22px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--asklyy-primary, #1A1E34), #6AA8E9);
        border-radius: 50%;
        color: #fff;
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 9999;
      }
      .asklyy-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 14px rgba(0,0,0,0.3);
      }

      .asklyy-box {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 360px;
        height: 400px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .asklyy-header {
        background: var(--asklyy-primary, #1A1E34);
        color: #fff;
        padding: 14px 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .asklyy-close {
        cursor: pointer;
        font-size: 18px;
        opacity: 0.8;
      }

      .asklyy-messages {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        background: #f9fafb;
      }

      .asklyy-message {
        margin: 8px 0;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        word-wrap: break-word;
        animation: fadeIn 0.3s ease;
        width: fit-content;
        max-width: 85%;
      }

      .asklyy-message.user {
        background: #1A1E34;
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 2px;
      }

      .asklyy-message.bot {
        background: #e5e7eb;
        color: #333;
        border-bottom-left-radius: 2px;
      }

      .asklyy-input {
        display: flex;
        border-top: 1px solid #ddd;
        background: #fff;
        padding: 10px;
      }

      .asklyy-input input {
        flex: 1;
        border: none;
        padding: 12px;
        font-size: 14px;
        outline: none;
      }

      .asklyy-input button {
        background: var(--asklyy-primary, #1A1E34);
        color: white;
        border: none;
        padding: 0 18px;
        font-weight: 500;
        cursor: pointer;
        border-radius: 12px;
      }

      /* Typing dots animation */
      .asklyy-thinking {
        display: inline-block;
        background: #e5e7eb;
        color: #333;
        border-radius: 12px;
        padding: 10px 14px;
        margin: 8px 0;
        width: fit-content;
        animation: fadeIn 0.3s ease;
      }

      .asklyy-thinking span {
        display: inline-block;
        width: 6px;
        height: 6px;
        margin-right: 4px;
        background: #666;
        border-radius: 50%;
        animation: blink 1.4s infinite both;
      }
      .asklyy-thinking span:nth-child(2) { animation-delay: 0.2s; }
      .asklyy-thinking span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes blink {
        0%, 80%, 100% { opacity: 0; }
        40% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // ✅ Create button
    const button = document.createElement("div");
    button.className = "asklyy-button";
    button.innerText = "💬";
    document.body.appendChild(button);

    // ✅ Create chat box
    const box = document.createElement("div");
    box.className = "asklyy-box";
    box.innerHTML = `
      <div class="asklyy-header">
        ${bot.name || "Asklyy Chatbot"}
        <span class="asklyy-close">&times;</span>
      </div>
      <div class="asklyy-messages" id="asklyy-chat-messages"></div>
      <div class="asklyy-input">
        <input id="asklyy-chat-input" placeholder="Type your message..." />
        <button id="asklyy-chat-send">Send</button>
      </div>
    `;
    document.body.appendChild(box);

    const closeBtn = box.querySelector(".asklyy-close");
    const messagesDiv = box.querySelector("#asklyy-chat-messages");
    const input = box.querySelector("#asklyy-chat-input");
    const sendBtn = box.querySelector("#asklyy-chat-send");

    let isOpen = false;
    button.onclick = () => {
      isOpen = !isOpen;
      box.style.display = isOpen ? "flex" : "none";
    };
    closeBtn.onclick = () => {
      isOpen = false;
      box.style.display = "none";
    };

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      messagesDiv.innerHTML += `<div class="asklyy-message user">${text}</div>`;
      input.value = "";

      const thinkingEl = document.createElement("div");
      thinkingEl.className = "asklyy-thinking";
      thinkingEl.innerHTML = `<span></span><span></span><span></span>`;
      messagesDiv.appendChild(thinkingEl);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      try {
        const res = await fetch(`${API_BASE}/message/${botId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        const reply = data?.reply || "No response";

        thinkingEl.remove();
        messagesDiv.innerHTML += `<div class="asklyy-message bot">${reply}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      } catch (err) {
        thinkingEl.remove();
        console.error("Chatbot error:", err);
        messagesDiv.innerHTML += `<div class="asklyy-message bot" style="color:red;">Error: Unable to connect.</div>`;
      }
    }

    sendBtn.onclick = sendMessage;
    input.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());
  }
})();
