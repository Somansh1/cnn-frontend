"use client"

import type React from "react"

import { useState } from "react"
import { CloudUpload, Upload, Leaf, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setImage(file)
    setError(null)
    setResult(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
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
      setError("Failed to analyze the image. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PlantHealth AI</h1>
              <p className="text-sm text-gray-600">Potato Plant Disease Detection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Detect Potato Plant Diseases Instantly</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload an image of a potato plant leaf and our AI will analyze it for diseases, helping you maintain
              healthy crops and maximize your harvest.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="border-2 border-dashed border-green-200 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudUpload className="w-5 h-5 text-green-600" />
                  Upload Plant Image
                </CardTitle>
                <CardDescription>Drag and drop or click to select a potato plant leaf image</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragging ? "border-green-400 bg-green-50" : "border-green-200 hover:border-green-300"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      </div>
                      <p className="text-sm text-gray-600">{image?.name}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetUpload}
                        className="text-gray-600 bg-transparent"
                      >
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CloudUpload className="w-12 h-12 text-green-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">Drop your image here</p>
                        <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, and other image formats</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                          id="file-input"
                        />
                        <label htmlFor="file-input">
                          <Button variant="outline" className="cursor-pointer bg-transparent">
                            <Upload className="w-4 h-4 mr-2" />
                            Browse Files
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {image && (
                  <div className="mt-6">
                    <Button
                      onClick={handleUpload}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Leaf className="w-4 h-4 mr-2" />
                          Analyze Plant Health
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Analysis Results
                </CardTitle>
                <CardDescription>AI-powered disease detection results</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600">Analyzing your plant image...</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {result.error ? (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">{result.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-800 mb-2">Detection Complete</h3>
                          <div className="bg-white p-3 rounded border">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center text-gray-500">
                      <Leaf className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Upload an image to see analysis results</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="mt-8 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Upload Image</h3>
                  <p className="text-sm text-gray-600">Take a clear photo of a potato plant leaf and upload it</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Loader2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600">Our trained model analyzes the image for disease patterns</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Get Results</h3>
                  <p className="text-sm text-gray-600">Receive instant diagnosis and recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-100 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 PlantHealth AI. Helping farmers grow healthier crops.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
