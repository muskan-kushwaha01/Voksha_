import React, { useState } from "react";

const Chatbot = () => {
  const [language, setLanguage] = useState("hi");

  const languageOptions = [
    { label: "Hindi", value: "hi" },
    { label: "Tamil", value: "ta" },
    { label: "Bengali", value: "bn" },
    { label: "Telugu", value: "te" },
    { label: "Marathi", value: "mr" },
  ];

  const [messages, setMessages] = useState([
    "Bot: Hi! Ask me anything about financial schemes.",
  ]);
  const [input, setInput] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const botReply = "This is a sample reply about the scheme."; 
    setMessages([...messages, `You: ${input}`, `Bot: ${botReply}`]);
    setInput("");
    setTranslatedText("");
  };

  const handleTranslate = () => {
    
    const dummyTranslation = {
      hi: "यह योजना महिलाओं को ₹5000 की मदद देती है।",
      ta: "இந்தத் திட்டம் பெண்களுக்கு ₹5000 உதவி அளிக்கிறது.",
      bn: "এই প্রকল্পটি মহিলাদের ₹৫০০০ সহায়তা দেয়।",
      te: "ఈ పథకం మహిళలకు ₹5000 సాయాన్ని అందిస్తుంది.",
      mr: "ही योजना महिलांना ₹5000 मदत देते.",
    };

    setTranslatedText(dummyTranslation[language]);

  };

  const handleSpeak = () => {
    if (!translatedText) {
      alert("Please translate something first.");
      return;
    }

    
  };

  return (
    <div>
      
      <h2 style={{ color: "rgb(34, 49, 49)" }}>
        EmpowerAI Chatbot
      </h2>


      <div
        style={{
          background: "rgb(7, 42, 44)",
          padding: 10,
          margin: 20,
          height: 200,
          overflowY: "scroll",
          borderRadius: 9,
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
        {translatedText && <p>Translated: {translatedText}</p>}
      </div>

      <input
        type="text"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
        {languageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <button onClick={sendMessage}>Send</button>
      <button onClick={handleTranslate}>Translate</button>
      <button onClick={handleSpeak}>Speak</button>
    </div>
  );
};

export default Chatbot;
