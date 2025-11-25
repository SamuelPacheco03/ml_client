import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Inicializar tema antes de renderizar
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme")
  const root = document.documentElement
  
  // Si no hay tema guardado, usar 'dark' por defecto
  if (!savedTheme) {
    root.classList.add("dark")
    localStorage.setItem("theme", "dark")
  } else {
    if (savedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }
}

// Inicializar tema inmediatamente
initializeTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

