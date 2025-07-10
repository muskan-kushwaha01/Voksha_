import React, { useState } from "react";
import Tesseract from "tesseract.js";


const DocumentScanner = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [language, setLanguage] = useState("en");
  const [analyzing, setAnalyzing] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [ttsPlaying, setTtsPlaying] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreviewUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const performOCR = async (file) => {
    const lang = language === "hi" ? "hin+eng" : "eng";
    const result = await Tesseract.recognize(file, lang, {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      alert("Please upload an image first!");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      alert("Image too large! Please use images <5MB.");
      return;
    }

    setAnalyzing(true);
    setExplanation("Processing image...");

    try {
      const text = await performOCR(imageFile);

      const response = await fetch("http://localhost:3000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation(
        `❌ Error: ${error.message}. Try uploading a clearer image or checking your connection.`
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTTS = () => {
    if (!explanation) return;

    const utterance = new SpeechSynthesisUtterance(explanation);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.9;

    setTtsPlaying(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => setTtsPlaying(false);
  };

  return (
    <div className="app-container">
      <header className="headered">
        <h1>Document Reader</h1>
        <p>Understand financial documents with ease</p>
      </header>

      <main className="main-section">
        <div className="upload-section">
          <label htmlFor="imageUpload" className="upload-box">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
            <img
              src="https://cdn-icons-png.freepik.com/256/15484/15484654.png?semt=ais_hybrid"
              alt="Upload"
              width="60"
            />
            <span style={{ color: 'black' }}>
  {imagePreviewUrl ? "Change Image" : "Click to upload image"}
</span>
</label>
          {imagePreviewUrl && (
            <div className="image-preview">
              <img src={imagePreviewUrl} alt="Preview" />
              <div className="preview-overlay">Ready to Analyze</div>
            </div>
          )}
        </div>

        <div className="options">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <button onClick={analyzeImage} disabled={analyzing}>
            🔍 {analyzing ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        <section className="result-box">
          {explanation && (
            <div className="explanation-box">
              <h3>Explanation:</h3>
              <p>{explanation}</p>
            </div>
          )}
        </section>

        <button
          className="listen-btn"
          onClick={handleTTS}
          disabled={!explanation}
        >
          <img
            src={
              ttsPlaying
                ? "https://cdn-icons-png.flaticon.com/512/786/786245.png"
                : "https://cdn-icons-png.flaticon.com/512/727/727245.png"
            }
            alt="Listen"
            width="20"
          />
          {ttsPlaying ? "Playing..." : "Listen to Explanation"}
        </button>
      </main>

      <footer className="footer">
        <p>Made with ❤️ for Financial Empowerment</p>
      </footer>
    </div>
  );
};

export default DocumentScanner;
