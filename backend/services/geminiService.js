// backend\services\geminiService.js

import fetch from 'node-fetch';

export const analyzeRisk = async (region, environmentalData, diseaseHistory) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const prompt = `
You are a world-class epidemiologist and public health expert with 20 years of experience in water-borne disease surveillance, environmental health, and outbreak prediction. Your analysis is used by WHO, CDC, and national health ministries.

## CONTEXT
Analyze ${region} for water-borne disease outbreak risk. Consider:
- Environmental factors (temperature, rainfall, humidity, water quality)
- Historical disease patterns
- Socioeconomic factors (sanitation infrastructure, population density, healthcare access)
- Climate change impacts
- Seasonal patterns

## DATA RECEIVED

**Current Environmental Conditions:**
- Temperature: ${environmentalData.temperature}°C
- Rainfall: ${environmentalData.rainfall} mm (last 24h)
- Humidity: ${environmentalData.humidity}%
- Water pH: ${environmentalData.water_ph} (optimal: 6.5-8.5)
- Water Turbidity: ${environmentalData.water_turbidity} NTU (safe: <5 NTU)

**Historical Disease Data:**
${JSON.stringify(diseaseHistory, null, 2)}

## ANALYSIS FRAMEWORK

Consider ALL water-borne diseases including but not limited to:
- **Cholera** (Vibrio cholerae) - thrives in warm, contaminated water with pH 6-9
- **Typhoid Fever** (Salmonella typhi) - associated with poor sanitation, fecal contamination
- **Hepatitis A & E** - viral infections, linked to contaminated food/water
- **Dysentery** (Shigella, Amoebic) - spreads in crowded, unsanitary conditions
- **Leptospirosis** - after floods, contact with contaminated water
- **Cryptosporidiosis** - chlorine-resistant parasite, outbreaks in treated water
- **Giardiasis** - common in areas with untreated surface water
- **Rotavirus** - leading cause of childhood diarrhea, seasonal patterns
- **Norovirus** - highly infectious, outbreaks in communities
- **E. coli O157:H7** - fecal contamination, severe complications

## RISK ASSESSMENT CRITERIA

**Calculate risk score (0-100) based on:**
- Temperature >25°C increases bacterial growth (+15 points)
- Rainfall >50mm increases runoff contamination (+20 points)
- Humidity >70% supports pathogen survival (+10 points)
- Water pH outside 6.5-8.5 reduces treatment effectiveness (+15 points)
- Turbidity >5 NTU indicates contamination (+20 points)
- Historical cases >50 in last 6 months (+15 points)
- Increasing trend in cases (+10 points)

## OUTPUT FORMAT

Respond with ONLY valid JSON:

{
  "risk_level": "Low/Medium/High/Critical",
  "risk_score": 0-100,
  "primary_concern": "The most critical water-borne threat",
  "predicted_diseases": [
    {"disease": "Cholera", "probability": 0-100, "reasoning": "brief scientific rationale"},
    {"disease": "Typhoid", "probability": 0-100, "reasoning": "brief scientific rationale"},
    {"disease": "Hepatitis A", "probability": 0-100, "reasoning": "brief scientific rationale"},
    {"disease": "Dysentery", "probability": 0-100, "reasoning": "brief scientific rationale"}
  ],
  "analysis_summary": "Comprehensive 2-3 paragraph analysis covering environmental factors, disease mechanisms, population vulnerability, and outbreak probability with specific scientific reasoning",
  "recommendations": [
    "Short-term intervention (next 24-72 hours)",
    "Medium-term public health measures (next 1-4 weeks)",
    "Long-term infrastructure improvements (3-12 months)",
    "Surveillance and monitoring protocol",
    "Community engagement strategy"
  ],
  "vulnerable_populations": ["elderly", "children under 5", "immunocompromised", "pregnant women"],
  "climate_factors": "How current climate conditions influence outbreak potential",
  "sanitation_assessment": "Assessment of likely sanitation challenges in this region"
}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    let cleaned = text.trim();
    if (cleaned.includes('```json')) {
      cleaned = cleaned.split('```json')[1].split('```')[0].trim();
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.split('```')[1].split('```')[0].trim();
    }
    
    const analysis = JSON.parse(cleaned);
    
    return {
      success: true,
      region,
      ...analysis,
      environmental_conditions: environmentalData,
      analysis_timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getFallbackAnalysis(region, environmentalData);
  }
};

export const analyzeSymptoms = async (symptoms, region) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const prompt = `
You are a senior infectious disease specialist with expertise in water-borne diseases.

## PATIENT SYMPTOMS
${symptoms}

## LOCATION
${region}

## TASK
Analyze these symptoms and provide:
1. Most likely water-borne diseases (with probability %)
2. Severity assessment (Mild/Moderate/Severe/Emergency)
3. Immediate home treatment recommendations
4. When to seek medical help
5. Prevention measures for others in household

## OUTPUT FORMAT (JSON only):
{
  "diagnoses": [
    {"disease": "Cholera", "probability": 75, "key_symptoms_matched": ["diarrhea", "vomiting"]},
    {"disease": "Typhoid", "probability": 45, "key_symptoms_matched": ["fever", "headache"]}
  ],
  "severity": "Moderate",
  "immediate_actions": ["Prepare ORS: 1L boiled water + 6 tsp sugar + 0.5 tsp salt", "Continue feeding if able"],
  "seek_medical_if": ["Blood in stool", "High fever >102°F for >24h", "Signs of dehydration"],
  "household_prevention": ["Boil all drinking water", "Separate utensils", "Hand hygiene after contact"],
  "confidence_note": "This is AI-assisted advice. Always consult a healthcare provider."
}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    let cleaned = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const analysis = JSON.parse(cleaned);
    
    return { success: true, ...analysis, region };
  } catch (error) {
    return {
      success: false,
      diagnoses: [{ disease: "Possible water-borne infection", probability: 60 }],
      severity: "Moderate",
      immediate_actions: ["Drink clean boiled water", "Rest and monitor symptoms"],
      seek_medical_if: ["Symptoms worsen", "High fever develops", "Unable to keep fluids down"],
      household_prevention: ["Boil water", "Practice hand hygiene"],
      confidence_note: "Please consult a doctor for proper diagnosis."
    };
  }
};

const getFallbackAnalysis = (region, environmentalData) => {
  let riskScore = 50;
  let riskLevel = 'Medium';
  
  if (environmentalData.temperature > 30) riskScore += 15;
  if (environmentalData.rainfall > 50) riskScore += 20;
  if (environmentalData.humidity > 70) riskScore += 10;
  if (environmentalData.water_turbidity > 5) riskScore += 15;
  
  if (riskScore > 75) riskLevel = 'High';
  else if (riskScore > 50) riskLevel = 'Medium';
  else riskLevel = 'Low';
  
  return {
    success: false,
    region,
    risk_level: riskLevel,
    risk_score: Math.min(riskScore, 100),
    primary_concern: "Potential water contamination from environmental factors",
    predicted_diseases: [
      { disease: "Cholera", probability: Math.min(riskScore, 85), reasoning: "Warm temperatures support bacterial growth" },
      { disease: "Typhoid", probability: Math.min(riskScore, 80), reasoning: "Sanitation concerns in urban areas" },
      { disease: "Hepatitis A", probability: Math.min(riskScore, 70), reasoning: "Fecal-oral transmission risk" },
      { disease: "Dysentery", probability: Math.min(riskScore, 65), reasoning: "Crowded conditions increase spread" }
    ],
    analysis_summary: `Based on environmental analysis of ${region}: Temperature ${environmentalData.temperature}°C, rainfall ${environmentalData.rainfall}mm, and water quality indicators suggest ${riskLevel.toLowerCase()} risk of water-borne disease outbreaks.`,
    recommendations: [
      "Immediately test drinking water sources for bacterial contamination",
      "Distribute chlorine tablets to households in high-risk areas",
      "Enhance sanitation infrastructure in densely populated zones",
      "Activate community health surveillance networks",
      "Launch public awareness campaign on water safety"
    ],
    vulnerable_populations: ["children under 5", "elderly", "pregnant women", "immunocompromised"],
    climate_factors: `Current conditions (${environmentalData.temperature}°C, ${environmentalData.humidity}% humidity) favor pathogen survival and transmission.`,
    sanitation_assessment: "Urban areas may have adequate infrastructure but rural and peri-urban zones face challenges with sewage treatment and water purification.",
    environmental_conditions: environmentalData,
    is_fallback: true
  };
};