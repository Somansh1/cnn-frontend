import { CheckCircle, AlertTriangle, Info, TrendingUp } from "lucide-react"

export const ResultsDisplay = ({ result, language }) => {
  if (!result) return null

  // Handle different response formats
  const parseResult = (data) => {
    // If it's a string, try to parse it
    if (typeof data === "string") {
      try {
        return JSON.parse(data)
      } catch {
        return { class_name: data }
      }
    }
    return data
  }

  const parsedResult = parseResult(result)

  // Extract fields from your specific JSON format
  const prediction =
    parsedResult.class_name || parsedResult.prediction || parsedResult.class || parsedResult.label || "Unknown"
  const confidence = parsedResult.confidence || parsedResult.probability || parsedResult.score
  const disease = prediction

  // Fix confidence calculation - ensure proper percentage
  const confidencePercentage = confidence ? Math.floor(confidence * 100 * 100) / 100 : 0

  // Determine severity based on disease name or confidence
  const getSeverity = (pred, conf) => {
    const predLower = pred.toLowerCase()
    if (predLower.includes("healthy") || predLower.includes("normal")) {
      return { level: "healthy", color: "green", icon: CheckCircle }
    } else if (predLower.includes("mild") || (conf && conf < 0.7)) {
      return { level: "mild", color: "yellow", icon: Info }
    } else if (predLower.includes("severe") || predLower.includes("critical")) {
      return { level: "severe", color: "red", icon: AlertTriangle }
    } else {
      return { level: "moderate", color: "orange", icon: TrendingUp }
    }
  }

  const severity = getSeverity(prediction, confidence)
  const SeverityIcon = severity.icon

  // Add disease-specific recommendations
  const getDiseaseRecommendations = (diseaseName, lang) => {
    const diseaseRecommendations = {
      en: {
        "black rot":
          "Apply fungicide immediately. Remove infected fruits and leaves. Improve air circulation around trees.",
        "apple scab": "Use fungicide spray. Remove fallen leaves. Prune for better air circulation.",
        "cedar apple rust": "Apply preventive fungicide in spring. Remove nearby cedar trees if possible.",
        healthy: "Your apple plant appears healthy! Continue with regular care and monitoring.",
        default: "Disease detected. Consult with agricultural experts for specific treatment options.",
      },
      hi: {
        "black rot": "तुरंत ففूंदनाशक लगाएं। संक्रमित फल और पत्तियों को हटा दें। पेड़ों के चारों ओर हवा का संचार बेहतर बनाएं।",
        "apple scab": "फफूंदनाशक स्प्रे का उपयोग करें। गिरी हुई पत्तियों को हटा दें। बेहतर हवा के संचार के लिए छंटाई करें।",
        "cedar apple rust": "वसंत में रोकथाम फफूंदनाशक लगाएं। यदि संभव हो तो पास के देवदार के पेड़ों को हटा दें।",
        healthy: "आपका सेब का पौधा स्वस्थ दिखता है! नियमित देखभाल और निगरानी जारी रखें।",
        default: "बीमारी का पता चला है। विशिष्ट उपचार विकल्पों के लिए कृषि विशेषज्ञों से सलाह लें।",
      },
    }

    const recommendations = diseaseRecommendations[lang] || diseaseRecommendations.en
    const diseaseKey = diseaseName.toLowerCase()

    return recommendations[diseaseKey] || recommendations.default
  }

  const translations = {
    en: {
      detectedCondition: "Detected Condition",
      confidenceLevel: "Confidence Level",
      severity: "Severity",
      recommendation: "Recommendation",
      healthy: "Healthy",
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",
    },
    hi: {
      detectedCondition: "पहचानी गई स्थिति",
      confidenceLevel: "विश्वास स्तर",
      severity: "गंभीरता",
      recommendation: "सुझाव",
      healthy: "स्वस्थ",
      mild: "हल्का",
      moderate: "मध्यम",
      severe: "गंभीर",
    },
  }

  const t = translations[language] || translations.en

  return (
    <div className="results-display">
      {/* Main Result Card */}
      <div className={`result-card ${severity.color}`}>
        <div className="result-header">
          <SeverityIcon className="result-icon" />
          <div className="result-info">
            <h3 className="result-title">{disease}</h3>
            <p className="result-subtitle">{t.detectedCondition}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="details-grid">
        {/* Confidence */}
        {confidence && (
          <div className="detail-item">
            <h4>{t.confidenceLevel}</h4>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${confidencePercentage}%` }}></div>
            </div>
            <span className="confidence-text">{confidencePercentage}%</span>
          </div>
        )}

        {/* Severity */}
        <div className="detail-item">
          <h4>{t.severity}</h4>
          <div className={`severity-badge ${severity.color}`}>{t[severity.level]}</div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="recommendation-card">
        <h4>{t.recommendation}</h4>
        <p>{getDiseaseRecommendations(disease, language)}</p>
      </div>

      {/* Raw Data (Collapsible) */}
      <details className="raw-data">
        <summary>Technical Details</summary>
        <pre>{JSON.stringify(parsedResult, null, 2)}</pre>
      </details>
    </div>
  )
}
