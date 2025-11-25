export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 ASTRO AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Developed by <span className="font-semibold text-primary">Samuel</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

