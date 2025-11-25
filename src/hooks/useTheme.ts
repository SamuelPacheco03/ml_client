import { useEffect, useState } from "react"

type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Leer del localStorage o usar 'dark' por defecto
    const savedTheme = localStorage.getItem("theme") as Theme | null
    return savedTheme || "dark"
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Aplicar el tema al HTML
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    
    // Guardar en localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme, setTheme }
}

