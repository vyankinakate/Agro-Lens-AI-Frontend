/**
 * API client for AgroLens AI backend.
 * Falls back to mock services when the backend is unreachable.
 */

const API_BASE = 'http://localhost:8000';

/**
 * Predict disease from an image file.
 * @param {File} imageFile - The image file to analyse
 * @param {string} language - Response language: 'en', 'hi', 'mr'
 * @returns {Promise<object>} - Detection result with AI insights
 */
export async function predictDisease(imageFile, language = 'en') {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const res = await fetch(`${API_BASE}/predict?language=${encodeURIComponent(language)}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[API] predict failed, using mock fallback:', err.message)
    // Dynamic import of the existing mock service
    const { mockAIAnalysis } = await import('./mockAI.js');
    return mockAIAnalysis(imageFile);
  }
}

/**
 * Download a PDF report based on prediction results.
 * @param {object} predictionData - The full prediction result object
 * @returns {Promise<Blob>} - The PDF file blob
 */
export async function downloadReport(predictionData) {
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: predictionData }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${res.status}`);
    }

    return await res.blob();
  } catch (err) {
    console.error('[API] downloadReport failed:', err.message);
    throw err;
  }
}

/**
 * Send a chat query to the backend chatbot.
 * @param {string} query - User's question
 * @returns {Promise<string>} - Bot response text
 */
export async function chatWithBot(query) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  } catch (err) {
    console.warn('[API] chat failed, using mock fallback:', err.message);
    return getMockChatResponse(query);
  }
}

/**
 * Send a chat query with native multilingual support.
 * Backend detects language and responds natively.
 * @param {string} query - User's question (in any language)
 * @param {string} userLanguage - User's language: 'auto', 'en', 'hi', 'mr'
 * @returns {Promise<{response: string, detectedLanguage: string, isAgriculture: boolean}>}
 */
export async function chatWithBotMultilingual(query, userLanguage = 'auto') {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        user_language: userLanguage,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return {
      response: data.response,
      detectedLanguage: data.detected_language || userLanguage,
      isAgriculture: data.is_agriculture !== false,
    };
  } catch (err) {
    console.warn('[API] multilingual chat failed, using mock fallback:', err.message);
    return { response: getMockChatResponse(query), detectedLanguage: 'en', isAgriculture: true };
  }
}

/**
 * Translate text between languages.
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>}
 */
export async function translateText(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) return text;
  try {
    const res = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
      }),
    });

    if (!res.ok) throw new Error('Translation failed');

    const data = await res.json();
    return data.translated;
  } catch (err) {
    console.warn('[API] translate failed:', err.message);
    return text; // Return original on failure
  }
}

/**
 * Check backend health.
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Mock chat fallback ──────────────────────────────────────────────────────

const MOCK_RESPONSES = {
  pest: "For pest control, try neem oil spray (5ml/L water) every 5 days. For severe infestations, use approved insecticides like Imidacloprid. Always identify the pest first before applying any chemical treatment.",
  water: "Most crops need 25-50mm of water per week. Use drip irrigation to save water and reduce disease risk. Water early morning or late evening. Avoid waterlogging as it promotes root diseases.",
  fertilizer: "Apply balanced NPK fertilizer based on soil test results. For most vegetables, use 120:60:60 kg/ha NPK ratio. Apply nitrogen in 2-3 split doses for better absorption.",
  soil: "Test your soil pH every season. Most crops prefer pH 6.0-7.0. Add lime for acidic soil, gypsum for alkaline. Regular compost improves soil structure and water retention.",
  blight: "For blight: 1) Remove infected leaves immediately. 2) Spray Mancozeb at 2.5g/L water. 3) Repeat after 7 days. 4) Use drip irrigation to prevent moisture on leaves.",
  mildew: "For powdery mildew: spray sulfur-based fungicide in evening. Repeat after 5-7 days. Ensure good ventilation. Avoid excess nitrogen fertilizer.",
  blast: "Rice blast is urgent! Stop irrigation, spray Tricyclazole 75% WP at 0.6g/L immediately. Re-inspect after 3 days. Contact agricultural officer if damage exceeds 30%.",
  tomato: "For healthy tomatoes: use crop rotation, drip irrigation, and ensure 60cm spacing between plants. Common diseases include Early Blight and Late Blight — monitor leaves regularly.",
  wheat: "For wheat care: sow in well-drained soil, apply first irrigation 21 days after sowing. Watch for rust and powdery mildew. Use seed treatment with Carboxin + Thiram.",
  rice: "For rice: maintain 5cm water depth during vegetative stage. Watch for blast disease and stem borer. Use resistant varieties and balanced NPK fertilizer.",
  organic: "Organic farming tips: use vermicompost, neem cake, and bio-fertilizers like Rhizobium. Crop rotation and green manuring improve soil fertility naturally.",
  harvest: "Harvest tips: pick tomatoes at breaker stage for longer shelf life. Harvest grains at 18-20% moisture content. Dry produce properly before storage.",
};

function getMockChatResponse(query) {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (q.includes(key)) return response;
  }
  return "I recommend monitoring your crops regularly and maintaining proper watering and fertilization. For specific guidance, you can call the Kisan Helpline at 1800-180-1551 (Toll Free). Upload a photo of your crop for AI-powered disease detection!";
}
