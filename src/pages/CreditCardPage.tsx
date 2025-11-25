import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardForm } from "@/components/forms/CreditCardForm"
import type { CreditCardFormData } from "@/components/forms/CreditCardForm"

const API_URL = import.meta.env.VITE_API_URL

export function CreditCardPage() {
  const [result, setResult] = useState<{ cluster: number; descripcion: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<CreditCardFormData | null>(null)

  const handleSubmit = async (data: CreditCardFormData) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setSubmittedData(data)

    try {
      const response = await fetch(`${API_URL}/credit/kmeans`, {
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
      setError(err instanceof Error ? err.message : "Error al asignar el cluster")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Segmentación de Clientes (K-Means)</h1>
        <p className="text-muted-foreground">
          Utiliza clustering no supervisado para segmentar clientes de tarjeta de crédito según sus patrones de uso
        </p>
      </div>

      <CreditCardForm onSubmit={handleSubmit} isLoading={isLoading} />

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
            <CardTitle>Resultado de la Segmentación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">
                Cluster asignado: #{result.cluster}
              </h3>
              <p className="text-lg text-muted-foreground">
                {result.descripcion}
              </p>
            </div>

            {submittedData && (
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Resumen de Datos Enviados</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-medium">{submittedData.BALANCE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frecuencia de Compras:</span>
                    <span className="font-medium">{(submittedData.PURCHASES_FREQUENCY * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adelanto en Efectivo:</span>
                    <span className="font-medium">{submittedData.CASH_ADVANCE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagos:</span>
                    <span className="font-medium">{submittedData.PAYMENTS.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagos Mínimos:</span>
                    <span className="font-medium">{submittedData.MINIMUM_PAYMENTS.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago Completo:</span>
                    <span className="font-medium">{(submittedData.PRC_FULL_PAYMENT * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between md:col-span-2">
                    <span className="text-muted-foreground">Límite de Crédito:</span>
                    <span className="font-medium">{submittedData.CREDIT_LIMIT.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Información del Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            K-Means es un algoritmo de clustering no supervisado que agrupa clientes en clusters basándose 
            en similitudes en sus patrones de uso de tarjeta de crédito. Cada cluster representa un segmento 
            de clientes con características similares.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

