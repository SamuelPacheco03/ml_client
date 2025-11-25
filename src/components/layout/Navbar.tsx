import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="ASTRO AI Logo" 
                className="h-16 w-16 object-contain transition-transform group-hover:scale-110"
                onError={(e) => {
                  // Fallback si no existe el logo
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground tracking-tight">ASTRO</span>
              <span className="text-2xl font-bold astro-text-gradient tracking-tight">AI</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              asChild
              className={isActive("/") ? "astro-glow" : ""}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={isActive("/churn") ? "default" : "ghost"}
              asChild
              className={isActive("/churn") ? "astro-glow" : ""}
            >
              <Link to="/churn">Churn</Link>
            </Button>
            <Button
              variant={isActive("/credit-card") ? "default" : "ghost"}
              asChild
              className={isActive("/credit-card") ? "astro-glow" : ""}
            >
              <Link to="/credit-card">Tarjeta de Crédito</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

