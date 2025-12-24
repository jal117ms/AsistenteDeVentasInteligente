import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Eliminar la conversación (los mensajes se eliminan automáticamente por CASCADE)
    const { error: deleteError } = await supabase.from("conversations").delete().eq("id", id).eq("user_id", user.id)

    if (deleteError) {
      console.error("[v0] Error deleting conversation:", deleteError)
      return NextResponse.json({ error: "Error al eliminar la conversación" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/conversations/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
