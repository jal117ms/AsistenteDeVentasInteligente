import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: conversationId } = await params

        if (!conversationId) {
            return NextResponse.json({ error: "ID de conversación requerido" }, { status: 400 })
        }

        const supabase = await createServerClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

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
        console.error("[API] Error in messages GET:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: conversationId } = await params

        if (!conversationId) {
            return NextResponse.json({ error: "ID de conversación requerido" }, { status: 400 })
        }

        const supabase = await createServerClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { role, content } = body

        if (!role || !content) {
            return NextResponse.json({ error: "Rol y contenido son requeridos" }, { status: 400 })
        }

        if (!["user", "assistant"].includes(role)) {
            return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
        }

        // Verificar que la conversación existe y pertenece al usuario
        const { data: conversation, error: convError } = await supabase
            .from("conversations")
            .select("id")
            .eq("id", conversationId)
            .eq("user_id", user.id)
            .single()

        if (convError || !conversation) {
            return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 })
        }

        // Crear el mensaje
        const { data: message, error: messageError } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                user_id: user.id,
                role,
                content
            })
            .select("id, role, content, created_at")
            .single()

        if (messageError) {
            console.error("[API] Error creating message:", messageError)
            return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
        }

        // Actualizar la fecha de actualización de la conversación
        await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId)

        return NextResponse.json({
            message: {
                id: message.id,
                role: message.role,
                content: message.content,
                created_at: message.created_at,
            }
        })
    } catch (error) {
        console.error("[API] Error in messages POST:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}