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

class ApiClient {
    private async fetchWithAuth(url: string, options: RequestInit = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Error de conexión" }))
            throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        return response.json()
    }

    // Conversaciones
    async getConversations(): Promise<Conversation[]> {
        const response = await this.fetchWithAuth("/api/conversations")
        return response.conversations
    }

    async createConversation(title?: string): Promise<Conversation> {
        const response = await this.fetchWithAuth("/api/conversations", {
            method: "POST",
            body: JSON.stringify({ title }),
        })
        return response.conversation
    }

    async deleteConversation(id: string): Promise<void> {
        await this.fetchWithAuth(`/api/conversations/${id}`, {
            method: "DELETE",
        })
    }

    // Mensajes
    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await this.fetchWithAuth(`/api/conversations/${conversationId}/messages`)
        return response.messages
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