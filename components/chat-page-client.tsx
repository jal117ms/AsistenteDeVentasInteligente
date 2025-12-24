"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import type { User } from "@supabase/supabase-js"
import { apiClient } from "@/lib/api-client"
import type { Conversation } from "@/lib/api-client"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

type ChatPageClientProps = {
  user: User
}

export function ChatPageClient({ user }: ChatPageClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chats, setChats] = useState<Conversation[]>([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      chatId: currentChatId,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "¡Hola! Soy tu **Asistente de Ventas Inteligente**. Estoy aquí para ayudarte con:\n\n- Estrategias de ventas\n- Análisis de clientes\n- Preparación de presentaciones\n- Respuestas a objeciones\n\n¿En qué puedo ayudarte hoy?",
      },
    ],
    onResponse: (response) => {
      const chatId = response.headers.get("X-Chat-Id")
      if (chatId && !currentChatId) {
        setCurrentChatId(chatId)
        // Recargar la lista de chats
        loadChats()
      }
    },
  })

  const loadChats = async () => {
    try {
      setIsLoadingChats(true)
      const conversations = await apiClient.getConversations()
      setChats(conversations)
    } catch (error) {
      console.error("[v0] Error loading chats:", error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  useEffect(() => {
    loadChats()
  }, [])

  const handleNewChat = () => {
    setCurrentChatId(null)
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "¡Hola! Soy tu **Asistente de Ventas Inteligente**. Estoy aquí para ayudarte con:\n\n- Estrategias de ventas\n- Análisis de clientes\n- Preparación de presentaciones\n- Respuestas a objeciones\n\n¿En qué puedo ayudarte hoy?",
      },
    ])
  }

  const handleLoadChat = async (chatId: string) => {
    try {
      setCurrentChatId(chatId)

      // Cargar los mensajes de la conversación usando API
      const messages = await apiClient.getMessages(chatId)

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "¡Hola! Soy tu **Asistente de Ventas Inteligente**. Estoy aquí para ayudarte con:\n\n- Estrategias de ventas\n- Análisis de clientes\n- Preparación de presentaciones\n- Respuestas a objeciones\n\n¿En qué puedo ayudarte hoy?",
        },
        ...messages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ])
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
    }
  }

  return (
    <div className="flex h-dvh bg-background">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        user={user}
        onNewChat={handleNewChat}
        onSelectChat={handleLoadChat}
        currentChatId={currentChatId}
        onChatDeleted={loadChats}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2 p-4 border-b border-border bg-card">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-foreground">Asistente de Ventas</h1>
        </div>

        {/* Chat Header */}
        <ChatHeader />

        {/* Messages */}
        <ChatMessages messages={messages} isTyping={isLoading} />

        {/* Input */}
        <ChatInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </div>
  )
}
