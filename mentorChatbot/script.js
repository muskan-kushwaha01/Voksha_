// DOM Elements
const analyzeBtn = document.getElementById("analyzeBtn");
const imageUpload = document.getElementById("imageUpload");
const uploadLabel = document.getElementById("uploadLabel");
const imagePreview = document.getElementById("imagePreview");
const languageSelect = document.getElementById("language");
const resultDiv = document.getElementById("result");
const listenBtn = document.getElementById("listenBtn");

// Event Listeners
imageUpload.addEventListener("change", handleImageUpload);
analyzeBtn.addEventListener("click", analyzeImage);
listenBtn.addEventListener("click", handleTTS);

// Handle Image Upload Preview
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.innerHTML = `
      <img src="${event.target.result}" alt="Preview">
      <div class="preview-overlay">Ready to Analyze</div>
    `;
    const span = uploadLabel?.querySelector("span");
    if (span) {
      span.textContent = "Change Image";
    }
  };
  reader.readAsDataURL(file);
}

async function performOCR(imageFile) {
  try {
    const lang = languageSelect.value === 'hi' ? 'hin+eng' : 'eng';
    const result = await Tesseract.recognize(imageFile, lang, {
      logger: progress => {
        if (progress.status === 'recognizing text') {
          const progressBar = document.querySelector(".progress-bar");
          if (progressBar) {
            progressBar.style.width = `${Math.round(progress.progress * 100)}%`;
          }
        }
      }
    });
    return { text: result.data.text };
  } catch (error) {
    throw new Error("Failed to read text. Try a clearer image.");
  }
}
// Core Analysis Function
// Update your analyzeImage function to use the new endpoint
async function analyzeImage() {
  const file = imageUpload.files[0];
  if (!file) {
    alert("Please upload an image first!");
    return;
  }

  // Convert image to base64 for backend processing
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = async () => {
    const base64Image = reader.result.split(',')[1];
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = "Analyzing <span class='loading'></span>";
    resultDiv.innerHTML = "<div class='status-loading'>Processing image...</div>";

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
          language: languageSelect.value
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Analysis failed');

      // Show result
      resultDiv.innerHTML = `
        <h3>Extracted Text:</h3>
        <div class="text-box">${data.extractedText}</div>
        <h3>Explanation:</h3>
        <div class="explanation-box">${data.explanation}</div>
      `;

      // Enable Listen button
      listenBtn.dataset.text = data.explanation;
      listenBtn.dataset.lang = languageSelect.value;
      listenBtn.disabled = false;

    } catch (error) {
      console.error('Analysis Error:', error);
      resultDiv.innerHTML = `
        <div class="error-box">
          <h3>Error</h3>
          <p>${error.message}</p>
          <button onclick="window.location.reload()">Retry</button>
        </div>
      `;
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = "Analyze Image";
    }
  };
}
// Text-to-Speech
function handleTTS() {
  const text = this.dataset.text;
  const lang = this.dataset.lang;

  if (!text) return;

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.9;
    
    this.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/786/786245.png" width="20"> Playing...`;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      this.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/727/727245.png" width="20"> Listen Again`;
    };
  } else {
    alert("Text-to-speech not supported in your browser");
  }
}

