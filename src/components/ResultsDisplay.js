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
          "Use Captan or Topsin-M during early fruit development and after pruning. Remove any infected fruit or twigs.",
        "apple scab": "Apply Myclobutanil (e.g., Spectracide Immunox) or Captan early in the season. Ensure thorough coverage and follow label directions.",
        "cedar apple rust": Apply Myclobutanil at 7–10 day intervals during spring. Remove nearby cedar trees if possible.",
        healthy: "Your apple plant appears healthy! Continue with regular care and monitoring.",
        default: "Disease detected. Consult with agricultural experts for specific treatment options.",
      },
      hi: {
        "black rot": "फल बनने की शुरुआती अवस्था और कटाई के बाद कैप्टन या टॉपसिन-एम का उपयोग करें। संक्रमित फल या टहनियों को हटा दें",
        "apple scab": "सीज़न की शुरुआत में मायक्लोब्यूटानिल (जैसे Spectracide Immunox) या कैप्टन का छिड़काव करें। अच्छी तरह से छिड़काव करें और दवा के निर्देशों का पालन करें",
        "cedar apple rust": "वसंत ऋतु में हर 7–10 दिनों में मायक्लोब्यूटानिल का छिड़काव करें। यदि संभव हो तो पास के देवदार के पेड़ हटा दें।",
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
