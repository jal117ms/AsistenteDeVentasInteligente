import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = await createServerClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const { data: conversations, error } = await supabase
            .from("conversations")
            .select("id, title, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(20)

        if (error) {
            console.error("[API] Error loading conversations:", error)
            return NextResponse.json({ error: "Error al cargar conversaciones" }, { status: 500 })
        }

        return NextResponse.json({
            conversations: conversations.map((conv) => ({
                id: conv.id,
                title: conv.title,
                lastMessage: new Date(conv.updated_at),
            })),
        })
    } catch (error) {
        console.error("[API] Error in conversations:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const { title } = await request.json()

        const { data: newConversation, error } = await supabase
            .from("conversations")
            .insert({
                user_id: user.id,
                title: title || "Nueva conversación",
            })
            .select()
            .single()

        if (error) {
            console.error("[API] Error creating conversation:", error)
            return NextResponse.json({ error: "Error al crear la conversación" }, { status: 500 })
        }

        return NextResponse.json({
            conversation: {
                id: newConversation.id,
                title: newConversation.title,
                lastMessage: new Date(newConversation.created_at),
            },
        })
    } catch (error) {
        console.error("[API] Error creating conversation:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}