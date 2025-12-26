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
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => { })
  const [confirmMessage, setConfirmMessage] = useState('')

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

    setConfirmMessage("¿Estás seguro de que quieres eliminar este chat?")
    setConfirmAction(() => () => executeDeleteChat(chatId))
    setShowConfirmModal(true)
  }

  const executeDeleteChat = async (chatId: string) => {
    setDeletingChatId(chatId)

    try {
      await apiClient.deleteConversation(chatId)
      onChatDeleted()

      if (currentChatId === chatId) {
        onNewChat()
      }
    } catch (error) {
      console.error("[v0] Error deleting chat:", error)
      // Aquí podrías mostrar otro modal de error si quisieras
    } finally {
      setDeletingChatId(null)
    }
  }

  const handleDeleteAllChats = async () => {
    setConfirmMessage("¿Estás seguro de que quieres eliminar TODOS los chats? Esta acción no se puede deshacer.")
    setConfirmAction(() => () => executeDeleteAllChats())
    setShowConfirmModal(true)
  }

  const executeDeleteAllChats = async () => {
    try {
      // Eliminar todos los chats uno por uno
      for (const chat of chats) {
        await apiClient.deleteConversation(chat.id)
      }

      onChatDeleted()
      onNewChat() // Crear un nuevo chat después de eliminar todo
    } catch (error) {
      console.error("[v0] Error deleting all chats:", error)
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
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header en móvil */}
        <div className="lg:hidden flex justify-end p-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Botones principales */}
        <div className="p-4 flex-shrink-0">
          <Button className="w-full justify-start gap-2 mb-3" size="lg" onClick={onNewChat}>
            <PlusCircle className="h-5 w-5" />
            Nuevo Chat
          </Button>
          {chats.length > 0 && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              size="sm"
              onClick={handleDeleteAllChats}
            >
              <Trash2 className="h-4 w-4" />
              Borrar Todo
            </Button>
          )}
        </div>

        {/* Área de chats con scroll limitado */}
        <div className="flex-1 flex flex-col px-4 min-h-0 overflow-hidden">
          <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex-shrink-0">CHATS RECIENTES</h2>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-1 pr-2 pb-4">
                {chats.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No hay chats aún</p>
                ) : (
                  chats.slice(0, 10).map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "w-full rounded-lg text-sm hover:bg-accent transition-colors group",
                        currentChatId === chat.id && "bg-accent",
                      )}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 32px',
                        gap: '8px',
                        alignItems: 'center',
                        padding: '8px 12px'
                      }}
                    >
                      <button
                        onClick={() => onSelectChat(chat.id)}
                        className="flex items-center gap-3 text-left"
                        style={{
                          minWidth: 0,
                          overflow: 'hidden'
                        }}
                      >
                        <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                        <span
                          className="text-foreground"
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                          }}
                        >
                          {chat.title}
                        </span>
                      </button>

                      {/* Botón de eliminar minimalista */}
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all duration-200 rounded p-1"
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                        title="Eliminar chat"
                        disabled={deletingChatId === chat.id}
                      >
                        {deletingChatId === chat.id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-b-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))
                )}
                
                {/* Mostrar indicador si hay más de 10 chats */}
                {chats.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    Mostrando 10 de {chats.length} chats
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Usuario y cerrar sesión - siempre visible */}
        <div className="p-4 border-t border-border flex-shrink-0 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="flex-shrink-0">
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

      {/* Modal de confirmación personalizado */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-foreground mb-3">Confirmar acción</h3>
            <p className="text-muted-foreground mb-6">{confirmMessage}</p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="px-4"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowConfirmModal(false)
                  confirmAction()
                }}
                className="px-4"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
