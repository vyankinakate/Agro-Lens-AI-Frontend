// Mock AI Disease Detection Service
export const DISEASE_DB = [
  {
    id: 1,
    disease: "Early Blight",
    scientific: "Alternaria solani",
    confidence: 91,
    severity: "moderate",
    color: "yellow",
    crop: "Tomato",
    emoji: "🍅",
    solution_steps: [
      { day: "Day 1", action: "Remove all infected leaves immediately. Burn or bury them away from the field." },
      { day: "Day 3", action: "Apply copper-based fungicide (e.g., Blitox 50) at 2.5g/L water. Spray thoroughly on leaves." },
      { day: "Day 7", action: "Check for new infection. Re-spray if required. Add potassium fertilizer to boost immunity." },
      { day: "Day 14", action: "Final check. Harvest unaffected fruits. Clean tools before movement." },
    ],
    prevention: [
      "Practice crop rotation every season",
      "Avoid overhead watering — use drip irrigation",
      "Space plants adequately for air circulation",
      "Use certified disease-free seeds",
    ],
    organic: ["Neem oil spray (5ml/L water)", "Trichoderma viride bio-fungicide", "Garlic + chili extract spray"],
    chemical: ["Mancozeb 75% WP @ 2.5g/L", "Chlorothalonil 75% WP @ 2g/L", "Copper Oxychloride 50% WP"],
    explanation_en: "Your tomato plant has brown spots on its leaves. This is called Early Blight — a fungal disease that spreads in hot and humid weather. Don't panic! Remove the bad leaves, spray medicine water, and your plant will recover in 2 weeks.",
    explanation_hi: "आपके टमाटर के पौधे की पत्तियों पर भूरे धब्बे आए हैं। इसे 'अर्ली ब्लाइट' कहते हैं — यह एक फफूंद की बीमारी है जो गर्म और नम मौसम में फैलती है। घबराएं नहीं! बुरी पत्तियाँ हटाएं, दवाई का पानी छिड़कें, और आपका पौधा 2 हफ्ते में ठीक हो जाएगा।",
  },
  {
    id: 2,
    disease: "Powdery Mildew",
    scientific: "Erysiphe cichoracearum",
    confidence: 87,
    severity: "mild",
    color: "green",
    crop: "Wheat",
    emoji: "🌾",
    solution_steps: [
      { day: "Day 1", action: "Identify and remove the most affected plants or sections." },
      { day: "Day 2", action: "Spray sulfur-based fungicide in the evening (avoid midday heat)." },
      { day: "Day 6", action: "Repeat fungicide application. Ensure good ventilation in the field." },
      { day: "Day 12", action: "Assess crop recovery. Apply foliar nutrients if growth is slow." },
    ],
    prevention: [
      "Plant resistant varieties when possible",
      "Ensure good air circulation between rows",
      "Avoid excess nitrogen fertilization",
      "Water at base of plants, not leaves",
    ],
    organic: ["Baking soda solution (1 tsp/L water)", "Cow urine spray (diluted 1:10)", "Neem oil + soap mixture"],
    chemical: ["Sulfur 80% WP @ 3g/L", "Tebuconazole 25% EW @ 1ml/L", "Propiconazole 25% EC @ 1ml/L"],
    explanation_en: "Your wheat plant has white powdery patches on leaves. This is Powdery Mildew — very common in dry weather. It is a mild disease and easy to treat with simple sulfur spray. 10-12 days and your crop will be fine!",
    explanation_hi: "आपके गेहूं की पत्तियों पर सफेद पाउडर जैसे धब्बे हैं। इसे 'पाउडरी मिल्ड्यू' कहते हैं — सूखे मौसम में यह आम है। यह हल्की बीमारी है, साधारण सल्फर स्प्रे से ठीक होती है। 10-12 दिन में आपकी फसल ठीक हो जाएगी!",
  },
  {
    id: 3,
    disease: "Leaf Blast",
    scientific: "Magnaporthe oryzae",
    confidence: 94,
    severity: "critical",
    color: "red",
    crop: "Rice",
    emoji: "🌾",
    solution_steps: [
      { day: "Day 1", action: "URGENT: Stop irrigation immediately. Drain the field. Alert neighboring farmers." },
      { day: "Day 1-2", action: "Apply Tricyclazole 75% WP @ 0.6g/L as emergency spray. Cover all leaves." },
      { day: "Day 4", action: "Re-inspect field. Apply second round of fungicide if spread continues." },
      { day: "Day 10", action: "Assess damage level. Contact agricultural officer if >30% damage." },
    ],
    prevention: [
      "Use blast-resistant rice varieties (IR64, Samba Mahsuri)",
      "Avoid excess nitrogen — use split application",
      "Maintain shallow flooding to reduce humidity",
      "Remove and destroy blast-infected stubble",
    ],
    organic: ["Silicon soil amendment", "Pseudomonas fluorescens bio-spray", "Compost tea foliar spray"],
    chemical: ["Isoprothiolane 40% EC @ 1.5ml/L", "Carbendazim 50% WP @ 1g/L", "Tricyclazole 75% WP @ 0.6g/L"],
    explanation_en: "URGENT! Your rice plant has Leaf Blast — a very serious disease causing brown spindle-shaped lesions. Act immediately! Stop watering, spray the medicine today, and contact your local agricultural officer. Quick action can save your crop.",
    explanation_hi: "तुरंत ध्यान दें! आपके धान में 'ब्लास्ट' रोग है — यह बहुत गंभीर बीमारी है जो पत्तियों पर भूरे तीर जैसे निशान बनाती है। आज ही कार्रवाई करें! सिंचाई बंद करें, दवाई का छिड़काव करें, और अपने कृषि अधिकारी से संपर्क करें।",
  },
];

export const mockAIAnalysis = (imageFile) => {
  return new Promise((resolve) => {
    // Simulate AI processing time
    setTimeout(() => {
      const randomDisease = DISEASE_DB[Math.floor(Math.random() * DISEASE_DB.length)];
      const confidenceVariation = Math.floor(Math.random() * 10) - 5;
      resolve({
        ...randomDisease,
        confidence: Math.min(99, Math.max(70, randomDisease.confidence + confidenceVariation)),
        timestamp: new Date().toISOString(),
      });
    }, 3000 + Math.random() * 2000);
  });
};

export const SAMPLE_IMAGES = [
  {
    id: 'sample1',
    name: 'Tomato Leaf (Infected)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Tomato_je.jpg/320px-Tomato_je.jpg',
    disease: DISEASE_DB[0],
  },
  {
    id: 'sample2',
    name: 'Wheat Leaf (Mildew)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg',
    disease: DISEASE_DB[1],
  },
  {
    id: 'sample3',
    name: 'Rice Leaf (Blast)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_fruit_ripening.jpg/320px-Simple_fruit_ripening.jpg',
    disease: DISEASE_DB[2],
  },
];
