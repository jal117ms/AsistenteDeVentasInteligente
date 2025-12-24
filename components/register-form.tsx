"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await apiClient.register(email, password, name)

      // Show success message
      setSuccess(true)
      // Wait a moment then redirect
      setTimeout(() => {
        router.push("/chat")
        router.refresh()
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Nombre</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Contraseña</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
        <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
      </div>
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md p-3">
          ¡Cuenta creada!.
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>
    </form>
  )
}
