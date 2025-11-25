import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardForm } from "@/components/forms/CreditCardForm"

export function CreditCardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 pb-8 border-b border-primary/20">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-2">
          <span className="text-4xl">💳</span>
        </div>
        <h1 className="text-5xl font-bold astro-text-gradient">
          Segmentación de Clientes (K-Means)
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Utiliza clustering no supervisado para segmentar clientes de tarjeta de crédito según sus patrones de uso
        </p>
      </div>

      <CreditCardForm />

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
              K-Means es un algoritmo de clustering no supervisado que agrupa clientes en clusters basándose 
              en similitudes en sus patrones de uso de tarjeta de crédito. Cada cluster representa un segmento 
              de clientes con características similares.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                Algoritmo: K-Means
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                Tipo: No Supervisado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
