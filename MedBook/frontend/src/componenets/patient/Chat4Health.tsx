import React, { useState } from "react";

interface ChatMessage {
  sender: string;
  text: string;
}

const Chat4Health: React.FC = () => {
  const [pdf, setPdf] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setChatHistory([...chatHistory, { sender: "You", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Chat4Health</h2>
      <div style={{ marginBottom: 24 }}>
        <input type="file" accept="application/pdf" onChange={handlePdfChange} />
        {pdf && <span style={{ marginLeft: 10 }}>{pdf.name}</span>}
      </div>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, minHeight: 200, marginBottom: 16 }}>
        {chatHistory.length === 0 && <div style={{ color: '#aaa' }}>No messages yet.</div>}
        {chatHistory.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "You" ? "right" : "left", margin: "8px 0" }}>
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleSend} disabled={!chatInput.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat4Health;
