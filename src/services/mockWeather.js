export const WEATHER_RISKS = [
  {
    location: "Pune, Maharashtra",
    risk: "high",
    disease: "Late Blight",
    reason: "High humidity (82%) + Temperature 28°C ideal for fungal spread",
    alert: "🔴 HIGH RISK: Late Blight outbreak possible in next 3-5 days",
    temp: "28°C",
    humidity: "82%",
    rainfall: "12mm expected",
  },
  {
    location: "Nagpur, Maharashtra", 
    risk: "medium",
    disease: "Powdery Mildew",
    reason: "Dry conditions with moderate temperatures — mildew risk moderate",
    alert: "🟡 MEDIUM RISK: Monitor your wheat crop for powdery mildew",
    temp: "32°C",
    humidity: "55%",
    rainfall: "2mm expected",
  },
  {
    location: "Nashik, Maharashtra",
    risk: "low",
    disease: "None",
    reason: "Weather conditions favorable for crop growth",
    alert: "🟢 LOW RISK: Weather looks good for your crops this week",
    temp: "25°C",
    humidity: "60%",
    rainfall: "5mm expected",
  },
];

export const getMockWeatherRisk = (lat, lon) => {
  // Simulate location-based risk (mock)
  const risks = WEATHER_RISKS;
  const randomRisk = risks[Math.floor(Math.random() * risks.length)];
  return randomRisk;
};
