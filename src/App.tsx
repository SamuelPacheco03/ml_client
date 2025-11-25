import { Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Home } from "@/pages/Home"
import { ChurnPage } from "@/pages/ChurnPage"
import { CreditCardPage } from "@/pages/CreditCardPage"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/churn" element={<ChurnPage />} />
          <Route path="/credit-card" element={<CreditCardPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

