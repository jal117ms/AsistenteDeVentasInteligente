"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { Eye, EyeOff } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "El nombre es requerido"
    }
    if (name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres"
    }
    if (name.length > 50) {
      return "El nombre no puede tener más de 50 caracteres"
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      return "El nombre solo puede contener letras y espacios"
    }
    return null
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "El email es requerido"
    }
    if (!emailRegex.test(email)) {
      return "El formato del email es incorrecto (ejemplo: usuario@dominio.com)"
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
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una mayúscula"
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número"
    }
    return null
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setNameError(null)
    setError(null)
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
    
    // Validar todos los campos
    const nameValidation = validateName(name)
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)
    
    setNameError(nameValidation)
    setEmailError(emailValidation)
    setPasswordError(passwordValidation)
    
    if (nameValidation || emailValidation || passwordValidation) {
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await apiClient.register(email, password, name.trim())

      // Show success message
      setSuccess(true)
      // Wait a moment then redirect
      setTimeout(() => {
        router.push("/chat")
        router.refresh()
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la cuenta"
      
      // Manejar errores específicos
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already')) {
        setError("Este email ya está registrado. Prueba con otro email o inicia sesión.")
      } else if (errorMessage.toLowerCase().includes('weak') || errorMessage.toLowerCase().includes('password')) {
        setError("La contraseña no cumple con los requisitos de seguridad.")
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
        <Label htmlFor="register-name">Nombre</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={handleNameChange}
          required
          disabled={isLoading}
          maxLength={50}
          className={nameError ? "border-red-500 focus:border-red-500" : ""}
        />
        {nameError && (
          <p className="text-sm text-red-500">{nameError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password">Contraseña</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={isLoading}
            minLength={6}
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
        {passwordError ? (
          <p className="text-sm text-red-500">{passwordError}</p>
        ) : (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Requisitos de la contraseña:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li className={password.length >= 6 ? "text-green-600" : ""}>Mínimo 6 caracteres</li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>Al menos una mayúscula</li>
              <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>Al menos un número</li>
            </ul>
          </div>
        )}
      </div>
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md p-3">
          ¡Cuenta creada exitosamente! Redirigiendo...
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>
    </form>
  )
}
