import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
        }

        const supabase = await createServerClient()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            // Mapear errores de Supabase a mensajes más amigables
            let errorMessage = "Email o contraseña incorrectos"
            
            if (error.message.includes('Email not confirmed')) {
                errorMessage = "Debes confirmar tu email antes de iniciar sesión"
            } else if (error.message.includes('Invalid login credentials')) {
                errorMessage = "Email o contraseña incorrectos"
            } else if (error.message.includes('Too many requests')) {
                errorMessage = "Demasiados intentos. Intenta nuevamente en unos minutos"
            }
            
            return NextResponse.json({ error: errorMessage }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            user: data.user,
        })
    } catch (error) {
        console.error("[API] Error in login:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}