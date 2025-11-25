# ML Demo App

Aplicación frontend para consumir modelos de machine learning desde un backend.

## Stack Tecnológico

- **React** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **shadcn/ui** - Componentes UI
- **React Router DOM** - Navegación

## Funcionalidades

### Modelos Supervisados (Churn)
- **KNN** - K-Nearest Neighbors
- **Regresión Logística** - Logistic Regression

Predicción de abandono de clientes basado en características del servicio.

### Modelo No Supervisado (Tarjeta de Crédito)
- **K-Means** - Clustering

Segmentación de clientes de tarjeta de crédito según patrones de uso.

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
VITE_API_URL=http://localhost:8000
```

Ajusta la URL según la configuración de tu backend.

## Desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── forms/
│   │   ├── ChurnForm.tsx
│   │   └── CreditCardForm.tsx
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/          # Componentes de shadcn/ui
├── lib/
│   └── utils.ts
├── pages/
│   ├── Home.tsx
│   ├── ChurnPage.tsx
│   └── CreditCardPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Endpoints del Backend

La aplicación espera los siguientes endpoints (la URL base se configura con `VITE_API_URL`):

### Churn
- `POST {VITE_API_URL}/churn/knn` - Predicción con KNN
- `POST {VITE_API_URL}/churn/logreg` - Predicción con Regresión Logística

**Request Body:**
```json
{
  "meses_como_cliente": 12,
  "cargo_mensual": 70.35,
  "adulto_mayor": 0,
  "tiene_pareja": "Yes",
  "dependientes": "No",
  "tipo_internet": "Fiber optic",
  "seguridad_en_linea": "No",
  "respaldo_en_linea": "No",
  "proteccion_dispositivo": "No",
  "soporte_tecnico": "No",
  "tipo_contrato": "Month-to-month",
  "facturacion_electronica": "No",
  "metodo_pago": "Electronic check"
}
```

**Campos numéricos:**
- `meses_como_cliente` (number) - Meses como cliente (tenure)
- `cargo_mensual` (number) - Cargo mensual del servicio
- `adulto_mayor` (number) - 0 = No, 1 = Sí

**Campos categóricos:**
- `tiene_pareja` - "Yes" | "No"
- `dependientes` - "Yes" | "No"
- `tipo_internet` - "DSL" | "Fiber optic" | "None"
- `seguridad_en_linea` - "Yes" | "No" | "No internet service"
- `respaldo_en_linea` - "Yes" | "No" | "No internet service"
- `proteccion_dispositivo` - "Yes" | "No" | "No internet service"
- `soporte_tecnico` - "Yes" | "No" | "No internet service"
- `tipo_contrato` - "Month-to-month" | "One year" | "Two year"
- `facturacion_electronica` - "Yes" | "No"
- `metodo_pago` - "Electronic check" | "Mailed check" | "Bank transfer" | "Credit card"

**Response:**
```json
{
  "prediccion": 0,
  "probabilidad": 0.78
}
```

### Tarjeta de Crédito
- `POST {VITE_API_URL}/credit/kmeans` - Asignación de cluster

**Request Body:**
```json
{
  "BALANCE": 1000.5,
  "FRECUENCIA_SALDO": 0.5,
  "COMPRAS_TOTALES": 5000,
  "COMPRAS_CONTADO": 2000,
  "COMPRAS_CUOTAS": 3000,
  "CASH_ADVANCE": 0,
  "PURCHASES_FREQUENCY": 0.5,
  "FREC_COMPRAS_CONTADO": 0.3,
  "FREC_COMPRAS_CUOTAS": 0.7,
  "FREC_AVANCES": 0,
  "TRANSACCIONES_AVANCE": 0,
  "TRANSACCIONES_COMPRA": 50,
  "CREDIT_LIMIT": 10000,
  "PAYMENTS": 2000,
  "MINIMUM_PAYMENTS": 100,
  "PRC_FULL_PAYMENT": 0.2
}
```

**Campos del formulario:**
- `BALANCE` (number) - Balance de la tarjeta
- `FRECUENCIA_SALDO` (number, 0-1) - Frecuencia de uso del saldo
- `COMPRAS_TOTALES` (number) - Total de compras
- `COMPRAS_CONTADO` (number) - Compras al contado
- `COMPRAS_CUOTAS` (number) - Compras a cuotas
- `CASH_ADVANCE` (number) - Adelantos en efectivo
- `PURCHASES_FREQUENCY` (number, 0-1) - Frecuencia de compras
- `FREC_COMPRAS_CONTADO` (number, 0-1) - Frecuencia de compras al contado
- `FREC_COMPRAS_CUOTAS` (number, 0-1) - Frecuencia de compras a cuotas
- `FREC_AVANCES` (number, 0-1) - Frecuencia de adelantos
- `TRANSACCIONES_AVANCE` (number) - Número de transacciones de adelanto
- `TRANSACCIONES_COMPRA` (number) - Número de transacciones de compra
- `CREDIT_LIMIT` (number) - Límite de crédito
- `PAYMENTS` (number) - Pagos realizados
- `MINIMUM_PAYMENTS` (number) - Pagos mínimos
- `PRC_FULL_PAYMENT` (number, 0-1) - Porcentaje de pago completo

**Response:**
```json
{
  "cluster": 2,
  "descripcion": "Cliente con uso moderado, balance medio y buena conducta de pago"
}
```

## Notas

- Asegúrate de que el backend esté corriendo y accesible desde el frontend
- Configura la variable de entorno `VITE_API_URL` con la URL base de tu backend
- El frontend no incluye el prefijo `/api` en las rutas, asegúrate de que tu backend esté configurado correctamente
- Todos los formularios incluyen validación de campos requeridos
- Los campos numéricos deben ser mayores a 0 (excepto cuando el valor puede ser 0)
- Los campos con rango 0-1 deben estar dentro de ese intervalo

