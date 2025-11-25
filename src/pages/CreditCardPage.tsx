import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardForm } from "@/components/forms/CreditCardForm"

export function CreditCardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Segmentación de Clientes (K-Means)</h1>
        <p className="text-muted-foreground">
          Utiliza clustering no supervisado para segmentar clientes de tarjeta de crédito según sus patrones de uso
        </p>
      </div>

      <CreditCardForm />

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

