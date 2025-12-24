import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const supabase = await createServerClient()
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[API] Error in logout:", error)
        return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
    }
}