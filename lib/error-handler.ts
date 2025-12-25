/**
 * Utilidades para manejar errores de manera consistente en toda la aplicación
 */

export type AppError = {
    message: string
    status?: number
    isAuthError?: boolean
    isNetworkError?: boolean
    originalError?: any
    context?: string
}

/**
 * Maneja errores de autenticación de manera consistente
 */
export function handleAuthError(error: AppError, redirectDelay = 2000) {
    if (error.isAuthError) {
        console.warn("Sesión expirada, redirigiendo al login...")
        setTimeout(() => {
            if (typeof window !== 'undefined') {
                window.location.href = '/'
            }
        }, redirectDelay)
        return true
    }
    return false
}

/**
 * Convierte errores de API en mensajes amigables para el usuario
 */
export function getErrorMessage(error: AppError): string {
    if (error.isAuthError) {
        return "Sesión expirada. Serás redirigido al inicio de sesión."
    }

    if (error.isNetworkError) {
        return "Error de conexión. Verifica tu internet e intenta de nuevo."
    }

    // Mensajes específicos según el contexto
    if (error.context === 'conversations') {
        return "No se pudieron cargar las conversaciones."
    }

    if (error.context === 'messages') {
        return "No se pudieron cargar los mensajes de esta conversación."
    }

    if (error.context === 'create-conversation') {
        return "No se pudo crear una nueva conversación."
    }

    if (error.context === 'delete-conversation') {
        return "No se pudo eliminar la conversación."
    }

    return error.message || "Ha ocurrido un error inesperado."
}

/**
 * Crea un error estándar de la aplicación
 */
export function createAppError(
    message: string,
    options: Partial<AppError> = {}
): AppError {
    return {
        message,
        ...options
    }
}

/**
 * Verifica si un error es recuperable (no requiere redirigir o recargar)
 */
export function isRecoverableError(error: AppError): boolean {
    return !error.isAuthError && !error.isNetworkError
}