import { createServerClient } from "@/lib/supabase/server"
import { streamText } from "ai"
import { google } from "@ai-sdk/google"

// export const runtime = "edge"

const SYSTEM_PROMPT = `
Eres un Asistente de Ventas y Soporte Inteligente. Tu rol es interactuar con clientes potenciales de manera ágil, profesional y persuasiva.
Tu Objetivo Principal es ayudar a los usuarios a vender.

CONTEXTO:
Eres un experto en ventas. Te adaptas dinámicamente al tipo de producto o servicio por el que pregunte el usuario (tecnología, moda, servicios, etc.) en lo cual el usuario
querra vender.

REGLAS DE RESPUESTA (STRICT):
1. BREVEDAD: Tus respuestas deben ser concisas. Evita saludos largos o despedidas repetitivas. Ve al grano.
2. ESTRUCTURA: Usa siempre formato Markdown para facilitar la lectura visual:
   - Usa **negritas** para resaltar beneficios clave o datos importantes.
   - Usa listas (bullet points) para enumerar características o pasos de soporte en caso de que sea necesario.
   - Usa tablas markdown SIEMPRE que necesites comparar productos, precios, características o datos estructurados.
   - FORMATO DE TABLAS: Usa la sintaxis markdown estándar con | separadores y línea de encabezados con ---
     Ejemplo:
     | Producto | Precio | Características |
     |----------|--------|----------------|
     | Item A   | $100   | Descripción    |
     | Item B   | $150   | Descripción    |
3. OBJETIVO:
   - Si el usuario muestra interés: Identifica su necesidad (vender) -> Ofrece una solución atractiva corta paso a paso ->  el usuario te indica si continuas  - > Invita a la acción (Cierre).
   - Si el usuario tiene un problema: Empatiza rápidamente -> Da la solución paso a paso.

TONO:
- Seguro, servicial y moderno.
- No suenes como un robot antiguo. Usa lenguaje natural pero profesional.

IDIOMA:
- Responde siempre en español neutro.
`


export async function POST(request: Request) {
  try {
    // Obtener la sesión del usuario usando Supabase SSR
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { chatId, messages: clientMessages } = await request.json()

    // Si no hay chatId, crear una nueva conversación
    let conversationId = chatId

    if (!conversationId) {
      // Generar título basado en el primer mensaje del usuario
      const firstUserMessage = clientMessages.find((m: any) => m.role === "user")
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
        : "Nueva conversación"

      const { data: newConversation, error: createError } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Error creating conversation:", createError)
        return new Response(JSON.stringify({ error: "Error al crear la conversación" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }

      conversationId = newConversation.id
    }

    // Recuperar los últimos 10 mensajes de la conversación para contexto
    const { data: historyMessages, error: historyError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(10)

    if (historyError) {
      console.error("[v0] Error fetching history:", historyError)
    }

    // Construir el historial de mensajes para la IA
    const messageHistory =
      historyMessages?.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })) || []

    // Obtener el último mensaje del usuario
    const lastUserMessage = clientMessages[clientMessages.length - 1]

    //Guardar el mensaje del usuario en la base de datos
    const { error: userMessageError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: "user",
      content: lastUserMessage.content,
    })

    if (userMessageError) {
      console.error("[v0] Error saving user message:", userMessageError)
      return new Response(JSON.stringify({ error: "Error al guardar el mensaje" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Llamar a Gemini usando el provider de Google con API key
    // Actualizado a gemini-2.5-flash según documentación oficial
    const result = streamText({
      model: google("gemini-2.5-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      system: SYSTEM_PROMPT,
      messages: [
        ...messageHistory,
        {
          role: "user",
          content: lastUserMessage.content,
        },
      ],



      // Guardar la respuesta completa de la IA cuando termine
      onFinish: async ({ text }) => {
        try {
          // Guardar el mensaje del asistente
          const { error: assistantMessageError } = await supabase.from("messages").insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: "assistant",
            content: text,
          })

          if (assistantMessageError) {
            console.error("[v0] Error saving assistant message:", assistantMessageError)
          }

          // Actualizar el timestamp de la conversación
          const { error: updateError } = await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId)

          if (updateError) {
            console.error("[v0] Error updating conversation:", updateError)
          }
        } catch (error) {
          console.error("[v0] Error in onFinish:", error)
        }
      },
    })




    // Retornar el stream con el chatId
    return result.toDataStreamResponse({
      headers: {
        "X-Chat-Id": conversationId,
      },
    })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
