import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChurnForm } from "@/components/forms/ChurnForm"
import type { ChurnFormData } from "@/components/forms/ChurnForm"

const API_URL = import.meta.env.VITE_API_URL

type ModelType = "knn" | "logreg"

export function ChurnPage() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("knn")
  const [result, setResult] = useState<{ prediccion: number; probabilidad: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ChurnFormData) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const endpoint = selectedModel === "knn" 
        ? "/churn/knn" 
        : "/churn/logreg"

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const resultData = await response.json()
      setResult(resultData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al realizar la predicción")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 pb-8 border-b border-primary/20">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-2">
          <span className="text-4xl">📊</span>
        </div>
        <h1 className="text-5xl font-bold astro-text-gradient">
          Predicción de Abandono (Churn)
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Selecciona un modelo supervisado y completa el formulario para predecir si un cliente abandonará el servicio
        </p>
      </div>

      <Card className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="text-2xl">🤖</span>
            Seleccionar Modelo
          </CardTitle>
          <CardDescription>
            Elige el algoritmo de machine learning para la predicción
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelType)} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="knn" id="knn" />
              <Label htmlFor="knn" className="cursor-pointer flex-1">
                <span className="font-semibold">KNN</span>
                <span className="text-sm text-muted-foreground ml-2">(K-Nearest Neighbors - Supervisado)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="logreg" id="logreg" />
              <Label htmlFor="logreg" className="cursor-pointer flex-1">
                <span className="font-semibold">Regresión Logística</span>
                <span className="text-sm text-muted-foreground ml-2">(Supervisado)</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <ChurnForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <Card className="border-2 border-destructive/50 bg-destructive/5 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-destructive font-semibold text-lg">Error</p>
                <p className="text-destructive/80">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className={`border-2 ${result.prediccion === 1 ? "border-destructive/50" : "border-primary/50"} bg-card/80 backdrop-blur-sm shadow-xl ${result.prediccion === 1 ? "shadow-destructive/20" : "shadow-primary/20"}`}>
          <CardHeader className={`${result.prediccion === 1 ? "bg-gradient-to-r from-destructive/20 to-destructive/10" : "bg-gradient-to-r from-primary/20 to-primary/10"} pb-4`}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className={`p-2 rounded-lg ${result.prediccion === 1 ? "bg-destructive/20" : "bg-primary/20"}`}>
                  <span className="text-3xl">{result.prediccion === 1 ? "⚠️" : "✅"}</span>
                </div>
                <span>Resultado de la Predicción</span>
              </CardTitle>
              <div className={`px-4 py-2 rounded-full ${result.prediccion === 1 ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"} font-semibold`}>
                {selectedModel === "knn" ? "KNN" : "LogReg"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="text-center space-y-6">
              <div className={`inline-block px-10 py-6 rounded-2xl ${result.prediccion === 1 ? "bg-gradient-to-br from-destructive/30 to-destructive/10" : "bg-gradient-to-br from-primary/30 to-primary/10"} border-2 ${result.prediccion === 1 ? "border-destructive/40" : "border-primary/40"} shadow-lg`}>
                <h3 className={`text-4xl font-bold ${result.prediccion === 1 ? "text-destructive" : "text-primary"} mb-2`}>
                  {result.prediccion === 1 ? "El cliente ABANDONA" : "El cliente NO ABANDONA"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {result.prediccion === 1 
                    ? "Se recomienda tomar acciones preventivas" 
                    : "Cliente con alta probabilidad de permanencia"}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 bg-muted/50 rounded-xl p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Probabilidad</p>
                  <p className={`text-5xl font-bold ${result.prediccion === 1 ? "text-destructive" : "text-primary"}`}>
                    {(result.probabilidad * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="h-16 w-px bg-border" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Confianza</p>
                  <p className="text-3xl font-bold text-foreground">
                    {result.probabilidad >= 0.8 ? "Alta" : result.probabilidad >= 0.6 ? "Media" : "Baja"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Nivel de confianza del modelo</span>
                <span className="font-semibold text-foreground">{(result.probabilidad * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-8 overflow-hidden shadow-inner border border-border">
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    result.prediccion === 1 
                      ? "bg-gradient-to-r from-red-500 via-red-500 to-red-600" 
                      : "astro-gradient"
                  } flex items-center justify-end pr-2`}
                  style={{ width: `${result.probabilidad * 100}%` }}
                >
                  <span className="text-xs font-bold text-white drop-shadow">
                    {(result.probabilidad * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">ℹ️</span>
            Información del Modelo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedModel === "knn" 
                ? "K-Nearest Neighbors (KNN) es un algoritmo de aprendizaje supervisado que clasifica basándose en la similitud con los k vecinos más cercanos en el espacio de características."
                : "La Regresión Logística es un modelo de clasificación supervisado que utiliza una función logística para predecir la probabilidad de pertenencia a una clase."}
            </p>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                {selectedModel === "knn" ? "Algoritmo: KNN" : "Algoritmo: Regresión Logística"}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                Tipo: Supervisado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

