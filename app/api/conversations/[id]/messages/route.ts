import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = await createServerClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const conversationId = params.id

        // Obtener los mensajes de la conversación
        const { data: messages, error } = await supabase
            .from("messages")
            .select("id, role, content, created_at")
            .eq("conversation_id", conversationId)
            .eq("user_id", user.id)
            .order("created_at", { ascending: true })

        if (error) {
            console.error("[API] Error loading messages:", error)
            return NextResponse.json({ error: "Error al cargar mensajes" }, { status: 500 })
        }

        return NextResponse.json({
            messages: messages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at,
            })),
        })
    } catch (error) {
        console.error("[API] Error in messages:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}