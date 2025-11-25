import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChurnForm } from "@/components/forms/ChurnForm"
import type { ChurnFormData } from "@/components/forms/ChurnForm"

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
        ? "/api/churn/knn" 
        : "/api/churn/logreg"

      const response = await fetch(endpoint, {
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
      <div>
        <h1 className="text-4xl font-bold mb-2">Predicción de Abandono (Churn)</h1>
        <p className="text-muted-foreground">
          Selecciona un modelo supervisado y completa el formulario para predecir si un cliente abandonará el servicio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Modelo</CardTitle>
          <CardDescription>
            Elige el algoritmo de machine learning para la predicción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelType)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="knn" id="knn" />
              <Label htmlFor="knn" className="cursor-pointer">
                KNN (supervisado)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="logreg" id="logreg" />
              <Label htmlFor="logreg" className="cursor-pointer">
                Regresión Logística (supervisado)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <ChurnForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado de la Predicción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className={`text-3xl font-bold ${result.prediccion === 1 ? "text-destructive" : "text-green-600"}`}>
                {result.prediccion === 1 ? "El cliente ABANDONA" : "El cliente NO ABANDONA"}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-muted-foreground">Probabilidad:</span>
                <span className="text-2xl font-semibold">
                  {(result.probabilidad * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  result.prediccion === 1 ? "bg-destructive" : "bg-green-600"
                }`}
                style={{ width: `${result.probabilidad * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Información del Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {selectedModel === "knn" 
              ? "K-Nearest Neighbors (KNN) es un algoritmo de aprendizaje supervisado que clasifica basándose en la similitud con los k vecinos más cercanos en el espacio de características."
              : "La Regresión Logística es un modelo de clasificación supervisado que utiliza una función logística para predecir la probabilidad de pertenencia a una clase."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

