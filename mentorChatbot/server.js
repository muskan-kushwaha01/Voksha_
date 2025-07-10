require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ip = require('ip');
const Tesseract = require('tesseract.js'); // Added missing Tesseract import

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Configurations
const CONFIG = {
  MODEL: "gpt2",
  BACKUP_MODEL: "distilgpt2",
  MAX_LENGTH: 100,
  TIMEOUT: 30000
};

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true })); // Added for form data
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Improved Hugging Face Handler (moved up for better organization)
async function getAIExplanation(text, language) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${CONFIG.MODEL}`,
      {
        inputs: `[FINANCE] Explain in ${language === 'hi' ? 'Hindi' : 'English'} for a beginner: ${text}`,
        parameters: {
          max_new_tokens: CONFIG.MAX_LENGTH,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: CONFIG.TIMEOUT
      }
    );

    return response.data[0]?.generated_text || "Explanation not available";
  } catch (error) {
    console.error("API Error Details:", {
      status: error.response?.status,
      error: error.response?.data?.error || error.message
    });
    throw new Error("Financial explanation service is currently busy. Please try again in 30 seconds.");
  }
}

async function tryModel(modelName, text, language) {
  const url = `https://api-inference.huggingface.co/models/${modelName}`;
  const prompt = `Explain the following financial concept in simple ${language === 'hi' ? 'Hindi' : 'English'}:\n\n${text}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.post(
        url,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: CONFIG.MAX_LENGTH,
            temperature: 0.7
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`
          },
          timeout: CONFIG.TIMEOUT
        }
      );

      const data = response.data;
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      }
      console.warn("No generated_text found in response:", data);
      return "Explanation not available";
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.error || error.message;
      console.warn(`Attempt ${attempt} failed for ${modelName}:`, msg);

      if (status === 503 && msg?.includes("loading")) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        break;
      }
    }
  }
  return "Explanation not available";
}

// ========== API ENDPOINTS ========== //

// Document Reader API
app.post('/api/analyze-document', async (req, res) => {
  try {
    const { imageUrl, language = 'en' } = req.body; // Default to English
    
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Add validation for base64 images
    if (!imageUrl.startsWith('data:image')) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      language === 'hi' ? 'hin+eng' : 'eng'
    );

    const explanation = await getAIExplanation(text, language);

    res.json({
      success: true,
      extractedText: text,
      explanation: explanation
    });
  } catch (error) {
    console.error('Document analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Document analysis failed'
    });
  }
});

// Text Explanation API
app.post('/api/explain', async (req, res) => {
  const { text, language = 'en' } = req.body; // Default to English

  if (!text || text.trim().length < 3) {
    return res.status(400).json({ 
      error: "Please ask a longer question (min 3 characters)",
      example: { text: "What is stock market?", language: "en" }
    });
  }

  try {
    let explanation = await tryModel(CONFIG.MODEL, text, language);
    if (explanation.includes("not available")) {
      explanation = await tryModel(CONFIG.BACKUP_MODEL, text, language);
    }
    
    res.json({ 
      explanation,
      model: explanation.includes("not available") 
        ? "simple-text-fallback" 
        : CONFIG.MODEL
    });
  } catch (error) {
    res.json({
      explanation: `Basic explanation: ${text} is an economic concept.`,
      model: "emergency-fallback"
    });
  }
});

// ========== BASIC ROUTES ========== //
app.use(express.static(__dirname));  // Serve from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Update path
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    model: CONFIG.MODEL,
    timeout: CONFIG.TIMEOUT + "ms",
    ip: ip.address(),
    version: process.env.npm_package_version
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Using model:", CONFIG.MODEL);
});