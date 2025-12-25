// Tipos para las respuestas de la API
export type Conversation = {
    id: string
    title: string
    lastMessage: Date
}

export type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    created_at?: string
}

export type ApiResponse<T> = {
    success: boolean
    data?: T
    error?: string
}

import { createAppError, type AppError } from './error-handler'




class ApiClient {
    private async fetchWithAuth(url: string, options: RequestInit = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    error: response.status === 401 ? "Sesión expirada" : "Error de conexión"
                }))

                // Crear error personalizado con más información
                throw createAppError(errorData.error || `HTTP ${response.status}`, {
                    status: response.status,
                    isAuthError: response.status === 401
                })
            }

            return response.json()
        } catch (error) {
            // Si es un AppError, re-lanzarlo
            if ((error as AppError).message !== undefined) {
                throw error
            }

            // Si es un error de red o fetch
            if (error instanceof TypeError) {
                throw createAppError("Error de conexión a internet", {
                    status: 0,
                    isNetworkError: true,
                    originalError: error
                })
            }

            // Para otros errores desconocidos
            throw createAppError("Error inesperado", {
                originalError: error
            })
        }
    }

    // Conversaciones
    async getConversations(): Promise<Conversation[]> {
        try {
            const response = await this.fetchWithAuth("/api/conversations")
            return response.conversations || []
        } catch (error: AppError | any) {
            // Agregar contexto al error
            const contextError = createAppError(error.message || "Error desconocido", {
                ...error,
                context: 'conversations'
            })
            throw contextError
        }
    }

    async createConversation(title?: string): Promise<Conversation> {
        try {
            const response = await this.fetchWithAuth("/api/conversations", {
                method: "POST",
                body: JSON.stringify({ title }),
            })
            return response.conversation
        } catch (error: AppError | any) {
            const contextError = createAppError(error.message || "Error desconocido", {
                ...error,
                context: 'create-conversation'
            })
            throw contextError
        }
    }

    async deleteConversation(id: string): Promise<void> {
        try {
            await this.fetchWithAuth(`/api/conversations/${id}`, {
                method: "DELETE",
            })
        } catch (error: AppError | any) {
            const contextError = createAppError(error.message || "Error desconocido", {
                ...error,
                context: 'delete-conversation',
                conversationId: id
            })
            throw contextError
        }
    }

    // Mensajes
    async getMessages(conversationId: string): Promise<Message[]> {
        try {
            const response = await this.fetchWithAuth(`/api/conversations/${conversationId}/messages`)
            return response.messages || []
        } catch (error: AppError | any) {
            // Agregar contexto al error
            const contextError = createAppError(error.message || "Error desconocido", {
                ...error,
                context: 'messages',
                conversationId
            })
            throw contextError
        }
    }

    async createMessage(conversationId: string, role: "user" | "assistant", content: string): Promise<Message> {
        try {
            const response = await this.fetchWithAuth(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                body: JSON.stringify({ role, content }),
            })
            return response.message
        } catch (error: AppError | any) {
            // Agregar contexto al error
            const contextError = createAppError(error.message || "Error desconocido", {
                ...error,
                context: 'create-message',
                conversationId
            })
            throw contextError
        }
    }

    // Autenticación
    async login(email: string, password: string): Promise<any> {
        const response = await this.fetchWithAuth("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        return response
    }

    async register(email: string, password: string, name?: string): Promise<any> {
        const response = await this.fetchWithAuth("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
        })
        return response
    }

    async logout(): Promise<void> {
        await this.fetchWithAuth("/api/auth/logout", {
            method: "POST",
        })
    }
}

export const apiClient = new ApiClient()