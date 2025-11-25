import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">ML Demo App</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Aplicación frontend para consumir modelos de machine learning
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Modelo de Churn (Supervisado)</CardTitle>
            <CardDescription>
              Predicción de abandono de clientes usando modelos supervisados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Utiliza modelos de aprendizaje supervisado (KNN o Regresión Logística) 
              para predecir si un cliente abandonará el servicio.
            </p>
            <Button 
              onClick={() => navigate("/churn")}
              className="w-full"
            >
              Ir a Churn
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Modelo de Tarjeta de Crédito (No supervisado)</CardTitle>
            <CardDescription>
              Segmentación de clientes de tarjeta de crédito usando K-Means
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Utiliza clustering con K-Means para segmentar clientes según 
              sus patrones de uso de tarjeta de crédito.
            </p>
            <Button 
              onClick={() => navigate("/credit-card")}
              className="w-full"
            >
              Ir a Tarjeta de Crédito
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Funcionalidades</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• <strong>Predicción de abandono de clientes:</strong> Modelos supervisados para predecir churn</li>
          <li>• <strong>Segmentación de clientes de tarjeta de crédito:</strong> Clustering no supervisado con K-Means</li>
        </ul>
      </div>
    </div>
  )
}

