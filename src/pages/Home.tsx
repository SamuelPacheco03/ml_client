import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6 py-16">
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="ASTRO AI Logo" 
              className="h-32 w-32 object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-7xl font-bold text-foreground tracking-tight">ASTRO</span>
            <span className="text-7xl font-bold astro-text-gradient tracking-tight">AI</span>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Aplicación de Machine Learning para predicción y segmentación de clientes
        </p>
        <p className="text-base text-muted-foreground/80 max-w-xl mx-auto">
          Utiliza modelos supervisados y no supervisados para predecir abandono de clientes 
          y segmentar usuarios de tarjeta de crédito
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary hover:scale-[1.03] hover:astro-glow-strong bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">📊</span>
              <div>
                <div>Modelo de Churn</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">(Supervisado)</div>
              </div>
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Predicción de abandono de clientes usando modelos supervisados
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Utiliza modelos de aprendizaje supervisado (KNN o Regresión Logística) 
              para predecir si un cliente abandonará el servicio.
            </p>
            <Button 
              onClick={() => navigate("/churn")}
              className="w-full astro-gradient text-white hover:opacity-90 font-semibold py-6 text-lg"
              size="lg"
            >
              Ir a Churn
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary hover:scale-[1.03] hover:astro-glow-strong bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">💳</span>
              <div>
                <div>Modelo de Tarjeta de Crédito</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">(No supervisado)</div>
              </div>
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Segmentación de clientes de tarjeta de crédito usando K-Means
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Utiliza clustering con K-Means para segmentar clientes según 
              sus patrones de uso de tarjeta de crédito.
            </p>
            <Button 
              onClick={() => navigate("/credit-card")}
              className="w-full astro-gradient text-white hover:opacity-90 font-semibold py-6 text-lg"
              size="lg"
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

