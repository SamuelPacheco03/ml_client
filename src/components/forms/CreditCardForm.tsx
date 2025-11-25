import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export function CreditCardForm() {
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

    // Frecuencias / proporciones entre 0 y 1
    if (formData.FRECUENCIA_SALDO < 0 || formData.FRECUENCIA_SALDO > 1) {
      newErrors.FRECUENCIA_SALDO = "Debe estar entre 0 y 1"
    }
    if (formData.PURCHASES_FREQUENCY < 0 || formData.PURCHASES_FREQUENCY > 1) {
      newErrors.PURCHASES_FREQUENCY = "Debe estar entre 0 y 1"
    }
    if (formData.FREC_COMPRAS_CONTADO < 0 || formData.FREC_COMPRAS_CONTADO > 1) {
      newErrors.FREC_COMPRAS_CONTADO = "Debe estar entre 0 y 1"
    }
    if (formData.FREC_COMPRAS_CUOTAS < 0 || formData.FREC_COMPRAS_CUOTAS > 1) {
      newErrors.FREC_COMPRAS_CUOTAS = "Debe estar entre 0 y 1"
    }
    if (formData.FREC_AVANCES < 0 || formData.FREC_AVANCES > 1) {
      newErrors.FREC_AVANCES = "Debe estar entre 0 y 1"
    }
    if (formData.PRC_FULL_PAYMENT < 0 || formData.PRC_FULL_PAYMENT > 1) {
      newErrors.PRC_FULL_PAYMENT = "Debe estar entre 0 y 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

      const res = await fetch(`${import.meta.env.VITE_API_URL}/credit/kmeans`, {
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
    } catch (err: any) {
      console.error(err)
      setApiError(err.message ?? "Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
          <CardDescription>
            Completa todos los campos para asignar el cluster y obtener la segmentación del cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Saldo */}
              <div className="space-y-2">
                <Label htmlFor="BALANCE">Saldo</Label>
                <Input
                  id="BALANCE"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.BALANCE || ""}
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
                  max="1"
                  step="0.01"
                  value={formData.FRECUENCIA_SALDO || ""}
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
                  step="0.01"
                  value={formData.COMPRAS_TOTALES || ""}
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
                  step="0.01"
                  value={formData.COMPRAS_CONTADO || ""}
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
                  step="0.01"
                  value={formData.COMPRAS_CUOTAS || ""}
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
                  step="0.01"
                  value={formData.CASH_ADVANCE || ""}
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
                  max="1"
                  step="0.01"
                  value={formData.PURCHASES_FREQUENCY || ""}
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
                  max="1"
                  step="0.01"
                  value={formData.FREC_COMPRAS_CONTADO || ""}
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
                  max="1"
                  step="0.01"
                  value={formData.FREC_COMPRAS_CUOTAS || ""}
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
                  max="1"
                  step="0.01"
                  value={formData.FREC_AVANCES || ""}
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
                  step="1"
                  value={formData.TRANSACCIONES_AVANCE || ""}
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
                  step="1"
                  value={formData.TRANSACCIONES_COMPRA || ""}
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
                  step="0.01"
                  value={formData.CREDIT_LIMIT || ""}
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
                  step="0.01"
                  value={formData.PAYMENTS || ""}
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
                  step="0.01"
                  value={formData.MINIMUM_PAYMENTS || ""}
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
                  max="1"
                  step="0.01"
                  value={formData.PRC_FULL_PAYMENT || ""}
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Procesando..." : "Asignar Cluster"}
            </Button>
          </form>

          {apiError && (
            <p className="mt-4 text-sm text-destructive">
              {apiError}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ✅ Resultado de la segmentación */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado de Segmentación</CardTitle>
            <CardDescription>
              Modelo: {result.model.toUpperCase()} · Cluster asignado: {result.cluster}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold">
              {result.segmentacion.nombre_segmento}
            </p>
            <p className="text-sm text-muted-foreground">
              {result.segmentacion.descripcion}
            </p>
            <div className="mt-4 space-y-1">
              <p>
                <span className="font-semibold">Riesgo:</span>{" "}
                <span className="capitalize">{result.segmentacion.detalles.riesgo}</span>
              </p>
              <p>
                <span className="font-semibold">Tipo de cliente:</span>{" "}
                {result.segmentacion.detalles.tipo_cliente}
              </p>
              <p>
                <span className="font-semibold">Recomendación:</span>{" "}
                {result.segmentacion.detalles.recomendacion}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
