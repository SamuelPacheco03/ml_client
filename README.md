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

La aplicación espera los siguientes endpoints:

### Churn
- `POST /api/churn/knn` - Predicción con KNN
- `POST /api/churn/logreg` - Predicción con Regresión Logística

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
  "soporte_tecnico": "No",
  "tipo_contrato": "Month-to-month",
  "facturacion_electronica": "No",
  "metodo_pago": "Electronic check"
}
```

**Response:**
```json
{
  "prediccion": 0,
  "probabilidad": 0.78
}
```

### Tarjeta de Crédito
- `POST /api/credit/kmeans` - Asignación de cluster

**Request Body:**
```json
{
  "BALANCE": 1000.5,
  "PURCHASES_FREQUENCY": 0.5,
  "CASH_ADVANCE": 0,
  "PAYMENTS": 2000,
  "MINIMUM_PAYMENTS": 100,
  "PRC_FULL_PAYMENT": 0.2,
  "CREDIT_LIMIT": 10000
}
```

**Response:**
```json
{
  "cluster": 2,
  "descripcion": "Cliente con uso moderado, balance medio y buena conducta de pago"
}
```

## Notas

- Asegúrate de que el backend esté corriendo y accesible desde el frontend
- Si el backend está en un puerto diferente, configura un proxy en `vite.config.ts` o usa variables de entorno

