import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json()

        // Validaciones de entrada
        if (!email || !password) {
            return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Formato de email incorrecto" }, { status: 400 })
        }

        // Validar contraseña
        if (password.length < 6) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
        }
        if (!/[A-Z]/.test(password)) {
            return NextResponse.json({ error: "La contraseña debe contener al menos una mayúscula" }, { status: 400 })
        }
        if (!/[0-9]/.test(password)) {
            return NextResponse.json({ error: "La contraseña debe contener al menos un número" }, { status: 400 })
        }

        // Validar nombre
        if (name && (name.trim().length < 2 || name.length > 50)) {
            return NextResponse.json({ error: "El nombre debe tener entre 2 y 50 caracteres" }, { status: 400 })
        }

        const supabase = await createServerClient()
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name?.trim() || email.split("@")[0],
                },
            },
        })

        if (error) {
            // Mapear errores de Supabase a mensajes más amigables
            let errorMessage = "Error al crear la cuenta"
            
            if (error.message.includes('User already registered')) {
                errorMessage = "Este email ya está registrado. Prueba con otro email o inicia sesión"
            } else if (error.message.includes('Password should be')) {
                errorMessage = "La contraseña no cumple con los requisitos de seguridad"
            } else if (error.message.includes('email')) {
                errorMessage = "Email inválido o ya registrado"
            } else if (error.message.includes('rate limit')) {
                errorMessage = "Demasiados intentos. Intenta nuevamente en unos minutos"
            }
            
            return NextResponse.json({ error: errorMessage }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            user: data.user,
            message: "Cuenta creada exitosamente",
        })
    } catch (error) {
        console.error("[API] Error in register:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}