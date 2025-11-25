import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ChurnFormData {
  meses_como_cliente: number
  cargo_mensual: number
  adulto_mayor: number
  tiene_pareja: string
  dependientes: string
  tipo_internet: string
  seguridad_en_linea: string
  soporte_tecnico: string
  tipo_contrato: string
  facturacion_electronica: string
  metodo_pago: string
}

interface ChurnFormProps {
  onSubmit: (data: ChurnFormData) => void
  isLoading: boolean
}

export function ChurnForm({ onSubmit, isLoading }: ChurnFormProps) {
  const [formData, setFormData] = useState<ChurnFormData>({
    meses_como_cliente: 0,
    cargo_mensual: 0,
    adulto_mayor: 0,
    tiene_pareja: "",
    dependientes: "",
    tipo_internet: "",
    seguridad_en_linea: "",
    soporte_tecnico: "",
    tipo_contrato: "",
    facturacion_electronica: "",
    metodo_pago: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ChurnFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChurnFormData, string>> = {}

    if (formData.meses_como_cliente <= 0) {
      newErrors.meses_como_cliente = "Debe ser mayor a 0"
    }
    if (formData.cargo_mensual <= 0) {
      newErrors.cargo_mensual = "Debe ser mayor a 0"
    }
    if (formData.adulto_mayor === undefined || formData.adulto_mayor === null) {
      newErrors.adulto_mayor = "Campo requerido"
    }
    if (!formData.tiene_pareja) {
      newErrors.tiene_pareja = "Campo requerido"
    }
    if (!formData.dependientes) {
      newErrors.dependientes = "Campo requerido"
    }
    if (!formData.tipo_internet) {
      newErrors.tipo_internet = "Campo requerido"
    }
    if (!formData.seguridad_en_linea) {
      newErrors.seguridad_en_linea = "Campo requerido"
    }
    if (!formData.soporte_tecnico) {
      newErrors.soporte_tecnico = "Campo requerido"
    }
    if (!formData.tipo_contrato) {
      newErrors.tipo_contrato = "Campo requerido"
    }
    if (!formData.facturacion_electronica) {
      newErrors.facturacion_electronica = "Campo requerido"
    }
    if (!formData.metodo_pago) {
      newErrors.metodo_pago = "Campo requerido"
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
          Completa todos los campos para realizar la predicción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="meses_como_cliente">Meses como Cliente (Tenure)</Label>
              <Input
                id="meses_como_cliente"
                type="number"
                min="0"
                value={formData.meses_como_cliente || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meses_como_cliente: Number(e.target.value) })
                }
              />
              {errors.meses_como_cliente && (
                <p className="text-sm text-destructive">{errors.meses_como_cliente}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo_mensual">Cargo Mensual</Label>
              <Input
                id="cargo_mensual"
                type="number"
                min="0"
                step="0.01"
                value={formData.cargo_mensual || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cargo_mensual: Number(e.target.value) })
                }
              />
              {errors.cargo_mensual && (
                <p className="text-sm text-destructive">{errors.cargo_mensual}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adulto_mayor">Adulto Mayor</Label>
              <Select
                value={formData.adulto_mayor.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, adulto_mayor: Number(value) })
                }
              >
                <SelectTrigger id="adulto_mayor">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Sí</SelectItem>
                </SelectContent>
              </Select>
              {errors.adulto_mayor && (
                <p className="text-sm text-destructive">{errors.adulto_mayor}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiene_pareja">Tiene Pareja</Label>
              <Select
                value={formData.tiene_pareja}
                onValueChange={(value) =>
                  setFormData({ ...formData, tiene_pareja: value })
                }
              >
                <SelectTrigger id="tiene_pareja">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Sí</SelectItem>
                </SelectContent>
              </Select>
              {errors.tiene_pareja && (
                <p className="text-sm text-destructive">{errors.tiene_pareja}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependientes">Dependientes</Label>
              <Select
                value={formData.dependientes}
                onValueChange={(value) =>
                  setFormData({ ...formData, dependientes: value })
                }
              >
                <SelectTrigger id="dependientes">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Sí</SelectItem>
                </SelectContent>
              </Select>
              {errors.dependientes && (
                <p className="text-sm text-destructive">{errors.dependientes}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_internet">Tipo de Internet</Label>
              <Select
                value={formData.tipo_internet}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo_internet: value })
                }
              >
                <SelectTrigger id="tipo_internet">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DSL">DSL</SelectItem>
                  <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_internet && (
                <p className="text-sm text-destructive">{errors.tipo_internet}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seguridad_en_linea">Seguridad en Línea</Label>
              <Select
                value={formData.seguridad_en_linea}
                onValueChange={(value) =>
                  setFormData({ ...formData, seguridad_en_linea: value })
                }
              >
                <SelectTrigger id="seguridad_en_linea">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Sí</SelectItem>
                  <SelectItem value="No internet service">No internet service</SelectItem>
                </SelectContent>
              </Select>
              {errors.seguridad_en_linea && (
                <p className="text-sm text-destructive">{errors.seguridad_en_linea}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="soporte_tecnico">Soporte Técnico</Label>
              <Select
                value={formData.soporte_tecnico}
                onValueChange={(value) =>
                  setFormData({ ...formData, soporte_tecnico: value })
                }
              >
                <SelectTrigger id="soporte_tecnico">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Sí</SelectItem>
                  <SelectItem value="No internet service">No internet service</SelectItem>
                </SelectContent>
              </Select>
              {errors.soporte_tecnico && (
                <p className="text-sm text-destructive">{errors.soporte_tecnico}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_contrato">Tipo de Contrato</Label>
              <Select
                value={formData.tipo_contrato}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo_contrato: value })
                }
              >
                <SelectTrigger id="tipo_contrato">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                  <SelectItem value="One year">One year</SelectItem>
                  <SelectItem value="Two year">Two year</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_contrato && (
                <p className="text-sm text-destructive">{errors.tipo_contrato}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="facturacion_electronica">Facturación Electrónica</Label>
              <Select
                value={formData.facturacion_electronica}
                onValueChange={(value) =>
                  setFormData({ ...formData, facturacion_electronica: value })
                }
              >
                <SelectTrigger id="facturacion_electronica">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Sí</SelectItem>
                </SelectContent>
              </Select>
              {errors.facturacion_electronica && (
                <p className="text-sm text-destructive">{errors.facturacion_electronica}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <Select
                value={formData.metodo_pago}
                onValueChange={(value) =>
                  setFormData({ ...formData, metodo_pago: value })
                }
              >
                <SelectTrigger id="metodo_pago">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronic check">Electronic check</SelectItem>
                  <SelectItem value="Mailed check">Mailed check</SelectItem>
                  <SelectItem value="Bank transfer">Bank transfer</SelectItem>
                  <SelectItem value="Credit card">Credit card</SelectItem>
                </SelectContent>
              </Select>
              {errors.metodo_pago && (
                <p className="text-sm text-destructive">{errors.metodo_pago}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Predecir Abandono"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

