import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface CreditCardFormData {
  BALANCE: number
  PURCHASES_FREQUENCY: number
  CASH_ADVANCE: number
  PAYMENTS: number
  MINIMUM_PAYMENTS: number
  PRC_FULL_PAYMENT: number
  CREDIT_LIMIT: number
}

interface CreditCardFormProps {
  onSubmit: (data: CreditCardFormData) => void
  isLoading: boolean
}

export function CreditCardForm({ onSubmit, isLoading }: CreditCardFormProps) {
  const [formData, setFormData] = useState<CreditCardFormData>({
    BALANCE: 0,
    PURCHASES_FREQUENCY: 0,
    CASH_ADVANCE: 0,
    PAYMENTS: 0,
    MINIMUM_PAYMENTS: 0,
    PRC_FULL_PAYMENT: 0,
    CREDIT_LIMIT: 0,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreditCardFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreditCardFormData, string>> = {}

    if (formData.BALANCE < 0) {
      newErrors.BALANCE = "Debe ser mayor o igual a 0"
    }
    if (formData.PURCHASES_FREQUENCY < 0 || formData.PURCHASES_FREQUENCY > 1) {
      newErrors.PURCHASES_FREQUENCY = "Debe estar entre 0 y 1"
    }
    if (formData.CASH_ADVANCE < 0) {
      newErrors.CASH_ADVANCE = "Debe ser mayor o igual a 0"
    }
    if (formData.PAYMENTS < 0) {
      newErrors.PAYMENTS = "Debe ser mayor o igual a 0"
    }
    if (formData.MINIMUM_PAYMENTS < 0) {
      newErrors.MINIMUM_PAYMENTS = "Debe ser mayor o igual a 0"
    }
    if (formData.PRC_FULL_PAYMENT < 0 || formData.PRC_FULL_PAYMENT > 1) {
      newErrors.PRC_FULL_PAYMENT = "Debe estar entre 0 y 1"
    }
    if (formData.CREDIT_LIMIT < 0) {
      newErrors.CREDIT_LIMIT = "Debe ser mayor o igual a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Cliente</CardTitle>
        <CardDescription>
          Completa todos los campos para asignar el cluster
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="BALANCE">Balance</Label>
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

            <div className="space-y-2">
              <Label htmlFor="CASH_ADVANCE">Adelanto en Efectivo</Label>
              <Input
                id="CASH_ADVANCE"
                type="number"
                min="0"
                step="0.01"
                value={formData.CASH_ADVANCE || ""}
                onChange={(e) =>
                  setFormData({ ...formData, CASH_ADVANCE: Number(e.target.value) })
                }
              />
              {errors.CASH_ADVANCE && (
                <p className="text-sm text-destructive">{errors.CASH_ADVANCE}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="PAYMENTS">Pagos</Label>
              <Input
                id="PAYMENTS"
                type="number"
                min="0"
                step="0.01"
                value={formData.PAYMENTS || ""}
                onChange={(e) =>
                  setFormData({ ...formData, PAYMENTS: Number(e.target.value) })
                }
              />
              {errors.PAYMENTS && (
                <p className="text-sm text-destructive">{errors.PAYMENTS}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="MINIMUM_PAYMENTS">Pagos Mínimos</Label>
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

            <div className="space-y-2">
              <Label htmlFor="PRC_FULL_PAYMENT">
                Porcentaje de Pago Completo (0-1)
              </Label>
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="CREDIT_LIMIT">Límite de Crédito</Label>
              <Input
                id="CREDIT_LIMIT"
                type="number"
                min="0"
                step="0.01"
                value={formData.CREDIT_LIMIT || ""}
                onChange={(e) =>
                  setFormData({ ...formData, CREDIT_LIMIT: Number(e.target.value) })
                }
              />
              {errors.CREDIT_LIMIT && (
                <p className="text-sm text-destructive">{errors.CREDIT_LIMIT}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Asignar Cluster"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

