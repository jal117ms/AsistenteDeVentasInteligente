import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
        }

        const supabase = await createServerClient()
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || email.split("@")[0],
                },
            },
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            user: data.user,
            message: data.user?.email_confirmed_at
                ? "Cuenta creada exitosamente"
                : "Cuenta creada. Revisa tu email para confirmar tu cuenta.",
        })
    } catch (error) {
        console.error("[API] Error in register:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}