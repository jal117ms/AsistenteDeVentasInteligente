"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Conversation } from "@/lib/api-client"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlusCircle, MessageSquare, LogOut, X, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type ChatSidebarProps = {
  isOpen: boolean
  onClose: () => void
  chats: Conversation[]
  user: User
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  currentChatId: string | null
  onChatDeleted: () => void
}

export function ChatSidebar({
  isOpen,
  onClose,
  chats,
  user,
  onNewChat,
  onSelectChat,
  currentChatId,
  onChatDeleted,
}: ChatSidebarProps) {
  const router = useRouter()
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("¿Estás seguro de que quieres eliminar este chat?")) {
      return
    }

    setDeletingChatId(chatId)

    try {
      await apiClient.deleteConversation(chatId)

      onChatDeleted()

      if (currentChatId === chatId) {
        onNewChat()
      }
    } catch (error) {
      console.error("[v0] Error deleting chat:", error)
      alert("Error al eliminar el chat. Por favor intenta de nuevo.")
    } finally {
      setDeletingChatId(null)
    }
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Usuario"
  const userEmail = user.email || ""
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="lg:hidden flex justify-end p-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <Button className="w-full justify-start gap-2" size="lg" onClick={onNewChat}>
            <PlusCircle className="h-5 w-5" />
            Nuevo Chat
          </Button>
        </div>

        <div className="flex-1 px-4">
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-2">CHATS RECIENTES</h2>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors group relative",
                    currentChatId === chat.id && "bg-accent",
                  )}
                >
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                    <span className="truncate text-foreground">{chat.title}</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    disabled={deletingChatId === chat.id}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-destructive/10 transition-all flex-shrink-0"
                    title="Eliminar chat"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  )
}
