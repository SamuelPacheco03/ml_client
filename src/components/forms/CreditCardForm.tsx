import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_URL = import.meta.env.VITE_API_URL

// ⬇️ Datos que captura el formulario
export interface CreditCardFormData {
  BALANCE: number
  FRECUENCIA_SALDO: number
  COMPRAS_TOTALES: number
  COMPRAS_CONTADO: number
  COMPRAS_CUOTAS: number
  CASH_ADVANCE: number
  PURCHASES_FREQUENCY: number
  FREC_COMPRAS_CONTADO: number
  FREC_COMPRAS_CUOTAS: number
  FREC_AVANCES: number
  TRANSACCIONES_AVANCE: number
  TRANSACCIONES_COMPRA: number
  CREDIT_LIMIT: number
  PAYMENTS: number
  MINIMUM_PAYMENTS: number
  PRC_FULL_PAYMENT: number
}

// ⬇️ Interfaces de la respuesta de tu servicio K-Means
type RiesgoNivel = "bajo" | "medio" | "alto"

interface ClusterDetails {
  riesgo: RiesgoNivel
  tipo_cliente: string
  recomendacion: string
}

interface SegmentacionCliente {
  cluster: number
  nombre_segmento: string
  descripcion: string
  detalles: ClusterDetails
}

interface KMeansResponse {
  model: "kmeans"
  cluster: number
  segmentacion: SegmentacionCliente
}

interface CreditCardFormProps {
  onSubmit?: (data: CreditCardFormData) => Promise<void>
  isLoading?: boolean
}

export function CreditCardForm({ onSubmit, isLoading: externalIsLoading }: CreditCardFormProps = {}) {
  const [formData, setFormData] = useState<CreditCardFormData>({
    BALANCE: 0,
    FRECUENCIA_SALDO: 0,
    COMPRAS_TOTALES: 0,
    COMPRAS_CONTADO: 0,
    COMPRAS_CUOTAS: 0,
    CASH_ADVANCE: 0,
    PURCHASES_FREQUENCY: 0,
    FREC_COMPRAS_CONTADO: 0,
    FREC_COMPRAS_CUOTAS: 0,
    FREC_AVANCES: 0,
    TRANSACCIONES_AVANCE: 0,
    TRANSACCIONES_COMPRA: 0,
    CREDIT_LIMIT: 0,
    PAYMENTS: 0,
    MINIMUM_PAYMENTS: 0,
    PRC_FULL_PAYMENT: 0,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreditCardFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<KMeansResponse | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Usar externalIsLoading si está disponible, sino usar el estado interno
  const currentIsLoading = externalIsLoading !== undefined ? externalIsLoading : isLoading

  // ✅ Función para validar campos entre 0 y 1
  const validateRange01 = (value: number): string | null => {
    if (value < 0 || value > 1) {
      return "Debe estar entre 0 y 1"
    }
    return null
  }

  // ✅ Validación del formulario
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreditCardFormData, string>> = {}

    // Montos / cantidades >= 0
    if (formData.BALANCE < 0) newErrors.BALANCE = "Debe ser mayor o igual a 0"
    if (formData.COMPRAS_TOTALES < 0) newErrors.COMPRAS_TOTALES = "Debe ser mayor o igual a 0"
    if (formData.COMPRAS_CONTADO < 0) newErrors.COMPRAS_CONTADO = "Debe ser mayor o igual a 0"
    if (formData.COMPRAS_CUOTAS < 0) newErrors.COMPRAS_CUOTAS = "Debe ser mayor o igual a 0"
    if (formData.CASH_ADVANCE < 0) newErrors.CASH_ADVANCE = "Debe ser mayor o igual a 0"
    if (formData.TRANSACCIONES_AVANCE < 0) newErrors.TRANSACCIONES_AVANCE = "Debe ser mayor o igual a 0"
    if (formData.TRANSACCIONES_COMPRA < 0) newErrors.TRANSACCIONES_COMPRA = "Debe ser mayor o igual a 0"
    if (formData.PAYMENTS < 0) newErrors.PAYMENTS = "Debe ser mayor o igual a 0"
    if (formData.MINIMUM_PAYMENTS < 0) newErrors.MINIMUM_PAYMENTS = "Debe ser mayor o igual a 0"
    if (formData.CREDIT_LIMIT < 0) newErrors.CREDIT_LIMIT = "Debe ser mayor o igual a 0"

    // Frecuencias / proporciones entre 0 y 1 usando función separada
    const freqError = validateRange01(formData.FRECUENCIA_SALDO)
    if (freqError) newErrors.FRECUENCIA_SALDO = freqError

    const purchasesFreqError = validateRange01(formData.PURCHASES_FREQUENCY)
    if (purchasesFreqError) newErrors.PURCHASES_FREQUENCY = purchasesFreqError

    const frecContadoError = validateRange01(formData.FREC_COMPRAS_CONTADO)
    if (frecContadoError) newErrors.FREC_COMPRAS_CONTADO = frecContadoError

    const frecCuotasError = validateRange01(formData.FREC_COMPRAS_CUOTAS)
    if (frecCuotasError) newErrors.FREC_COMPRAS_CUOTAS = frecCuotasError

    const frecAvancesError = validateRange01(formData.FREC_AVANCES)
    if (frecAvancesError) newErrors.FREC_AVANCES = frecAvancesError

    const prcFullError = validateRange01(formData.PRC_FULL_PAYMENT)
    if (prcFullError) newErrors.PRC_FULL_PAYMENT = prcFullError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Función para generar datos aleatorios basados en los rangos del heatmap
  const fillRandomData = () => {
    setErrors({})
    setFormData({
      // Saldo: rango 0-5000 (según heatmap: 660-4754)
      BALANCE: Math.floor(Math.random() * 5000),
      // Frecuencia_Saldo: 0-1
      FRECUENCIA_SALDO: Math.random(),
      // Compras_Totales: rango 0-15000 (según heatmap: 275-14214)
      COMPRAS_TOTALES: Math.floor(Math.random() * 15000),
      // Compras_Contado: rango 0-10000 (según heatmap: 222-9364)
      COMPRAS_CONTADO: Math.floor(Math.random() * 10000),
      // Compras_Cuotas: rango 0-5000 (según heatmap: 53-4850)
      COMPRAS_CUOTAS: Math.floor(Math.random() * 5000),
      // Avances_Efectivo: rango 0-5000 (según heatmap: 184-4626)
      CASH_ADVANCE: Math.floor(Math.random() * 5000),
      // Frecuencia_Compras: 0-1
      PURCHASES_FREQUENCY: Math.random(),
      // Frec_Compras_Contado: 0-1
      FREC_COMPRAS_CONTADO: Math.random(),
      // Frec_Compras_Cuotas: 0-1
      FREC_COMPRAS_CUOTAS: Math.random(),
      // Frec_Avances: rango 0-0.6 (según heatmap: 0.0-0.5)
      FREC_AVANCES: Math.random() * 0.6,
      // Transacciones_Avance: rango 0-20 (según heatmap: 2-15)
      TRANSACCIONES_AVANCE: Math.floor(Math.random() * 20),
      // Transacciones_Compra: rango 0-150 (según heatmap: 3-128)
      TRANSACCIONES_COMPRA: Math.floor(Math.random() * 150),
      // Limite_Credito: rango 3000-15000 (según heatmap: 3221-12102)
      CREDIT_LIMIT: Math.floor(Math.random() * 12000) + 3000,
      // Pagos_Realizados: rango 0-15000 (según heatmap: 941-14325)
      PAYMENTS: Math.floor(Math.random() * 15000),
      // Pago_Minimo: rango 0-4000 (según heatmap: 558-3375)
      MINIMUM_PAYMENTS: Math.floor(Math.random() * 4000),
      // Pct_Pago_Completo: rango 0-0.5 (según heatmap: 0.0-0.3)
      PRC_FULL_PAYMENT: Math.random() * 0.5,
    })
  }

  // ✅ Mapeo de los nombres del form → nombres del backend
  const buildPayload = () => {
    return {
      Saldo: formData.BALANCE,
      Frecuencia_Saldo: formData.FRECUENCIA_SALDO,
      Compras_Totales: formData.COMPRAS_TOTALES,
      Compras_Contado: formData.COMPRAS_CONTADO,
      Compras_Cuotas: formData.COMPRAS_CUOTAS,
      Avances_Efectivo: formData.CASH_ADVANCE,
      Frecuencia_Compras: formData.PURCHASES_FREQUENCY,
      Frec_Compras_Contado: formData.FREC_COMPRAS_CONTADO,
      Frec_Compras_Cuotas: formData.FREC_COMPRAS_CUOTAS,
      Frec_Avances: formData.FREC_AVANCES,
      Transacciones_Avance: formData.TRANSACCIONES_AVANCE,
      Transacciones_Compra: formData.TRANSACCIONES_COMPRA,
      Limite_Credito: formData.CREDIT_LIMIT,
      Pagos_Realizados: formData.PAYMENTS,
      Pago_Minimo: formData.MINIMUM_PAYMENTS,
      Pct_Pago_Completo: formData.PRC_FULL_PAYMENT,
    }
  }

  // ✅ Submit + llamada a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    setApiError(null)

    if (!validate()) return

    try {
      setIsLoading(true)

      const payload = buildPayload()

      const res = await fetch(`${API_URL}/credit/kmeans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Error al obtener la segmentación del cliente")
      }

      const data: KMeansResponse = await res.json()
      setResult(data)
      if (onSubmit) {
        await onSubmit(formData)
      }
    } catch (err: any) {
      console.error(err)
      setApiError(err.message ?? "Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="text-2xl">📝</span>
            Datos del Cliente
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Completa todos los campos para asignar el cluster y obtener la segmentación del cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={fillRandomData}
              className="gap-2 mt-4"
            >
              Llenar con Datos Aleatorios
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Saldo */}
              <div className="space-y-2">
                <Label htmlFor="BALANCE">Saldo</Label>
                <Input
                  id="BALANCE"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.BALANCE.toString()}
                  onChange={(e) =>
                    setFormData({ ...formData, BALANCE: Number(e.target.value) })
                  }
                />
                {errors.BALANCE && (
                  <p className="text-sm text-destructive">{errors.BALANCE}</p>
                )}
              </div>

              {/* Frecuencia de saldo */}
              <div className="space-y-2">
                <Label htmlFor="FRECUENCIA_SALDO">Frecuencia de Saldo (0-1)</Label>
                <Input
                  id="FRECUENCIA_SALDO"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.FRECUENCIA_SALDO.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      FRECUENCIA_SALDO: Number(e.target.value),
                    })
                  }
                />
                {errors.FRECUENCIA_SALDO && (
                  <p className="text-sm text-destructive">
                    {errors.FRECUENCIA_SALDO}
                  </p>
                )}
              </div>

              {/* Compras totales */}
              <div className="space-y-2">
                <Label htmlFor="COMPRAS_TOTALES">Compras Totales</Label>
                <Input
                  id="COMPRAS_TOTALES"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.COMPRAS_TOTALES.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      COMPRAS_TOTALES: Number(e.target.value),
                    })
                  }
                />
                {errors.COMPRAS_TOTALES && (
                  <p className="text-sm text-destructive">
                    {errors.COMPRAS_TOTALES}
                  </p>
                )}
              </div>

              {/* Compras contado */}
              <div className="space-y-2">
                <Label htmlFor="COMPRAS_CONTADO">Compras al Contado</Label>
                <Input
                  id="COMPRAS_CONTADO"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.COMPRAS_CONTADO.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      COMPRAS_CONTADO: Number(e.target.value),
                    })
                  }
                />
                {errors.COMPRAS_CONTADO && (
                  <p className="text-sm text-destructive">
                    {errors.COMPRAS_CONTADO}
                  </p>
                )}
              </div>

              {/* Compras cuotas */}
              <div className="space-y-2">
                <Label htmlFor="COMPRAS_CUOTAS">Compras a Cuotas</Label>
                <Input
                  id="COMPRAS_CUOTAS"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.COMPRAS_CUOTAS.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      COMPRAS_CUOTAS: Number(e.target.value),
                    })
                  }
                />
                {errors.COMPRAS_CUOTAS && (
                  <p className="text-sm text-destructive">
                    {errors.COMPRAS_CUOTAS}
                  </p>
                )}
              </div>

              {/* Adelanto efectivo */}
              <div className="space-y-2">
                <Label htmlFor="CASH_ADVANCE">Avances en Efectivo</Label>
                <Input
                  id="CASH_ADVANCE"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.CASH_ADVANCE.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      CASH_ADVANCE: Number(e.target.value),
                    })
                  }
                />
                {errors.CASH_ADVANCE && (
                  <p className="text-sm text-destructive">
                    {errors.CASH_ADVANCE}
                  </p>
                )}
              </div>

              {/* Frecuencia de compras (global) */}
              <div className="space-y-2">
                <Label htmlFor="PURCHASES_FREQUENCY">
                  Frecuencia de Compras (0-1)
                </Label>
                <Input
                  id="PURCHASES_FREQUENCY"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.PURCHASES_FREQUENCY.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      PURCHASES_FREQUENCY: Number(e.target.value),
                    })
                  }
                />
                {errors.PURCHASES_FREQUENCY && (
                  <p className="text-sm text-destructive">
                    {errors.PURCHASES_FREQUENCY}
                  </p>
                )}
              </div>

              {/* Frec compras contado */}
              <div className="space-y-2">
                <Label htmlFor="FREC_COMPRAS_CONTADO">
                  Frecuencia Compras Contado (0-1)
                </Label>
                <Input
                  id="FREC_COMPRAS_CONTADO"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.FREC_COMPRAS_CONTADO.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      FREC_COMPRAS_CONTADO: Number(e.target.value),
                    })
                  }
                />
                {errors.FREC_COMPRAS_CONTADO && (
                  <p className="text-sm text-destructive">
                    {errors.FREC_COMPRAS_CONTADO}
                  </p>
                )}
              </div>

              {/* Frec compras cuotas */}
              <div className="space-y-2">
                <Label htmlFor="FREC_COMPRAS_CUOTAS">
                  Frecuencia Compras Cuotas (0-1)
                </Label>
                <Input
                  id="FREC_COMPRAS_CUOTAS"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.FREC_COMPRAS_CUOTAS.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      FREC_COMPRAS_CUOTAS: Number(e.target.value),
                    })
                  }
                />
                {errors.FREC_COMPRAS_CUOTAS && (
                  <p className="text-sm text-destructive">
                    {errors.FREC_COMPRAS_CUOTAS}
                  </p>
                )}
              </div>

              {/* Frec avances */}
              <div className="space-y-2">
                <Label htmlFor="FREC_AVANCES">
                  Frecuencia de Avances (0-1)
                </Label>
                <Input
                  id="FREC_AVANCES"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.FREC_AVANCES.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      FREC_AVANCES: Number(e.target.value),
                    })
                  }
                />
                {errors.FREC_AVANCES && (
                  <p className="text-sm text-destructive">
                    {errors.FREC_AVANCES}
                  </p>
                )}
              </div>

              {/* Transacciones avance */}
              <div className="space-y-2">
                <Label htmlFor="TRANSACCIONES_AVANCE">
                  Transacciones de Avance
                </Label>
                <Input
                  id="TRANSACCIONES_AVANCE"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.TRANSACCIONES_AVANCE.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      TRANSACCIONES_AVANCE: Number(e.target.value),
                    })
                  }
                />
                {errors.TRANSACCIONES_AVANCE && (
                  <p className="text-sm text-destructive">
                    {errors.TRANSACCIONES_AVANCE}
                  </p>
                )}
              </div>

              {/* Transacciones compra */}
              <div className="space-y-2">
                <Label htmlFor="TRANSACCIONES_COMPRA">
                  Transacciones de Compra
                </Label>
                <Input
                  id="TRANSACCIONES_COMPRA"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.TRANSACCIONES_COMPRA.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      TRANSACCIONES_COMPRA: Number(e.target.value),
                    })
                  }
                />
                {errors.TRANSACCIONES_COMPRA && (
                  <p className="text-sm text-destructive">
                    {errors.TRANSACCIONES_COMPRA}
                  </p>
                )}
              </div>

              {/* Límite de crédito */}
              <div className="space-y-2">
                <Label htmlFor="CREDIT_LIMIT">Límite de Crédito</Label>
                <Input
                  id="CREDIT_LIMIT"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.CREDIT_LIMIT.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      CREDIT_LIMIT: Number(e.target.value),
                    })
                  }
                />
                {errors.CREDIT_LIMIT && (
                  <p className="text-sm text-destructive">
                    {errors.CREDIT_LIMIT}
                  </p>
                )}
              </div>

              {/* Pagos realizados */}
              <div className="space-y-2">
                <Label htmlFor="PAYMENTS">Pagos Realizados</Label>
                <Input
                  id="PAYMENTS"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.PAYMENTS.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      PAYMENTS: Number(e.target.value),
                    })
                  }
                />
                {errors.PAYMENTS && (
                  <p className="text-sm text-destructive">
                    {errors.PAYMENTS}
                  </p>
                )}
              </div>

              {/* Pago mínimo */}
              <div className="space-y-2">
                <Label htmlFor="MINIMUM_PAYMENTS">Pago Mínimo</Label>
                <Input
                  id="MINIMUM_PAYMENTS"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.MINIMUM_PAYMENTS.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      MINIMUM_PAYMENTS: Number(e.target.value),
                    })
                  }
                />
                {errors.MINIMUM_PAYMENTS && (
                  <p className="text-sm text-destructive">
                    {errors.MINIMUM_PAYMENTS}
                  </p>
                )}
              </div>

              {/* Porcentaje pago completo */}
              <div className="space-y-2">
                <Label htmlFor="PRC_FULL_PAYMENT">% Pago Completo (0-1)</Label>
                <Input
                  id="PRC_FULL_PAYMENT"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.PRC_FULL_PAYMENT.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      PRC_FULL_PAYMENT: Number(e.target.value),
                    })
                  }
                />
                {errors.PRC_FULL_PAYMENT && (
                  <p className="text-sm text-destructive">
                    {errors.PRC_FULL_PAYMENT}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={currentIsLoading}>
              {currentIsLoading ? "Procesando..." : "Asignar Cluster"}
            </Button>
          </form>

          {apiError && (
            <Card className="mt-4 border-2 border-destructive/50 bg-destructive/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="text-destructive font-semibold text-lg">Error</p>
                    <p className="text-destructive/80">{apiError}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* ✅ Resultado de la segmentación */}
      {result && (
        <Card className="border-2 border-primary/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-primary/20">
                  <span className="text-3xl">🎯</span>
                </div>
                <span>Resultado de Segmentación</span>
              </CardTitle>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-full bg-primary/20 text-primary font-semibold">
                  {result.model.toUpperCase()}
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/30 text-primary font-bold text-lg">
                  Cluster #{result.cluster}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-bold text-primary">
                {result.segmentacion.nombre_segmento}
              </h3>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {result.segmentacion.descripcion}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {result.segmentacion.detalles.riesgo === "bajo" ? "🟢" : 
                     result.segmentacion.detalles.riesgo === "medio" ? "🟡" : "🔴"}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground uppercase">Riesgo</span>
                </div>
                <p className="text-lg font-bold capitalize">
                  {result.segmentacion.detalles.riesgo}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-semibold text-muted-foreground">Tipo de Cliente</span>
                </div>
                <p className="text-lg font-bold">
                  {result.segmentacion.detalles.tipo_cliente}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <span className="text-sm font-semibold text-muted-foreground">Recomendación</span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {result.segmentacion.detalles.recomendacion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
