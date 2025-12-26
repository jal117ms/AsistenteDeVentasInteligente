"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "El email es requerido"
    }
    if (!emailRegex.test(email)) {
      return "Formato de email incorrecto"
    }
    return null
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return "La contraseña es requerida"
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }
    return null
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(null)
    setError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setPasswordError(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)
    
    setEmailError(emailValidation)
    setPasswordError(passwordValidation)
    
    if (emailValidation || passwordValidation) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await apiClient.login(email, password)

      // Navigate to chat on success
      router.push("/chat")
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión"
      
      // Mejorar mensajes de error específicos
      if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('usuario')) {
        setError("Email o contraseña incorrectos. Verifica tus credenciales.")
      } else if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('contraseña')) {
        setError("Email o contraseña incorrectos. Verifica tus credenciales.")
      } else if (errorMessage.toLowerCase().includes('invalid')) {
        setError("Credenciales inválidas. Verifica tu email y contraseña.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={handleEmailChange}
          required
          disabled={isLoading}
          className={emailError ? "border-red-500 focus:border-red-500" : ""}
        />
        {emailError && (
          <p className="text-sm text-red-500">{emailError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={isLoading}
            className={`pr-10 ${passwordError ? "border-red-500 focus:border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
        {passwordError && (
          <p className="text-sm text-red-500">{passwordError}</p>
        )}
      </div>
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Iniciar Sesión"}
      </Button>
    </form>
  )
}
