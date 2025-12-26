"use client"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo size="xl" priority className="!w-24 !h-24" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">Asistente de Ventas Inteligente</CardTitle>
            <CardDescription>Ingresa para acceder a tu asistente de IA</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
