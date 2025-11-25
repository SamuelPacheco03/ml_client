import { Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Home } from "@/pages/Home"
import { ChurnPage } from "@/pages/ChurnPage"
import { CreditCardPage } from "@/pages/CreditCardPage"

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/churn" element={<ChurnPage />} />
          <Route path="/credit-card" element={<CreditCardPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

