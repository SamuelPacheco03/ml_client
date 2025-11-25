import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            ML Demo App
          </Link>
          <div className="flex gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={isActive("/churn") ? "default" : "ghost"}
              asChild
            >
              <Link to="/churn">Churn</Link>
            </Button>
            <Button
              variant={isActive("/credit-card") ? "default" : "ghost"}
              asChild
            >
              <Link to="/credit-card">Tarjeta de Crédito</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

