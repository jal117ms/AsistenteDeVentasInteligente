import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export function ChatHeader() {
  return (
    <header className="hidden lg:flex items-center justify-between h-16 border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <Logo size="md" />
        <h1 className="text-lg font-semibold text-foreground">Asistente de Ventas Inteligente</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
