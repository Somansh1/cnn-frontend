"use client"

import { useState } from "react"
import { CloudUpload, Upload, Leaf, CheckCircle, AlertCircle, Loader2, Languages } from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Alert, AlertDescription } from "./components/ui/alert"
import { translations } from "./translations"
import "./App.css"

// Import the new ResultsDisplay component at the top
import { ResultsDisplay } from "./components/ResultsDisplay"

// Import the CSS for ResultsDisplay
import "./components/ResultsDisplay.css"

function App() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState("en") // 'en' for English, 'hi' for Hindi

  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  const handleFileSelect = (file) => {
    setImage(file)
    setError(null)
    setResult(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!image) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", image)

    try {
      const response = await fetch("https://cnn-backend-hh6c.onrender.com/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(t.uploadError)
      console.error("Upload error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const resetUpload = () => {
    setImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <Leaf className="logo-icon" />
              </div>
              <div className="header-text">
                <h1>{t.appName}</h1>
                <p>{t.appSubtitle}</p>
              </div>
            </div>
            <div className="header-right">
              <button className="language-toggle" onClick={toggleLanguage}>
                <Languages className="language-icon" />
                {language === "en" ? "हिंदी" : "English"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Hero Section */}
          <div className="hero">
            <h2>{t.heroTitle}</h2>
            <p>{t.heroDescription}</p>
          </div>

          <div className="content-grid">
            {/* Upload Section */}
            <Card className="upload-card">
              <CardHeader>
                <CardTitle className="card-title">
                  <CloudUpload className="title-icon" />
                  {t.uploadTitle}
                </CardTitle>
                <CardDescription>{t.uploadDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`upload-area ${dragging ? "dragging" : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  {imagePreview ? (
                    <div className="preview-container">
                      <div className="image-preview">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                      </div>
                      <p className="file-name">{image?.name}</p>
                      <Button variant="outline" size="sm" onClick={resetUpload} className="reset-button bg-transparent">
                        {t.chooseDifferent}
                      </Button>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <CloudUpload className="upload-icon" />
                      <div>
                        <p className="upload-title">{t.dropImage}</p>
                        <p className="upload-subtitle">{t.supportedFormats}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="file-input"
                          id="file-input"
                        />
                        <Button
                          variant="outline"
                          className="browse-button bg-transparent"
                          onClick={() => document.getElementById("file-input").click()}
                        >
                          <Upload className="button-icon" />
                          {t.browseFiles}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {image && (
                  <div className="analyze-section">
                    <Button onClick={handleUpload} disabled={loading} className="analyze-button">
                      {loading ? (
                        <>
                          <Loader2 className="button-icon spinning" />
                          {t.analyzing}
                        </>
                      ) : (
                        <>
                          <Leaf className="button-icon" />
                          {t.analyzeButton}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert className="error-alert">
                    <AlertCircle className="alert-icon" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="results-card">
              <CardHeader>
                <CardTitle className="card-title">
                  <CheckCircle className="title-icon" />
                  {t.resultsTitle}
                </CardTitle>
                <CardDescription>{t.resultsDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-content">
                      <Loader2 className="loading-icon spinning" />
                      <p>{t.analyzingImage}</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="results-content">
                    {result.error ? (
                      <Alert className="error-alert">
                        <AlertCircle className="alert-icon" />
                        <AlertDescription>{result.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <ResultsDisplay result={result} language={language} />
                    )}
                  </div>
                ) : (
                  <div className="empty-results">
                    <div className="empty-content">
                      <Leaf className="empty-icon" />
                      <p>{t.uploadToSeeResults}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="info-card">
            <CardHeader>
              <CardTitle>{t.howItWorks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="steps-grid">
                <div className="step">
                  <div className="step-icon">
                    <Upload />
                  </div>
                  <h3>{t.step1Title}</h3>
                  <p>{t.step1Description}</p>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <Loader2 />
                  </div>
                  <h3>{t.step2Title}</h3>
                  <p>{t.step2Description}</p>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <CheckCircle />
                  </div>
                  <h3>{t.step3Title}</h3>
                  <p>{t.step3Description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default App
