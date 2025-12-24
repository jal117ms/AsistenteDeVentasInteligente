# 🤖 Asistente de Ventas Inteligente

Una aplicación Full Stack de chat con IA especializada en ventas, construida con Next.js 13+, Supabase y Google Gemini.

## ✨ Características

- **💬 Chat en tiempo real** con streaming de respuestas de IA
- **🔐 Autenticación completa** (registro, login, logout) con Supabase
- **💾 Persistencia de conversaciones** y mensajes en PostgreSQL
- **🎨 Interfaz moderna** y responsive con Tailwind CSS
- **🛡️ Rutas protegidas** con middleware automático
- **🤖 IA especializada** en ventas con Google Gemini 2.0 Flash

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 13+ (App Router) (Version mas etable segun V0 para streaming), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Auth
- **Base de Datos**: Supabase (PostgreSQL) con RLS
- **IA**: Google Gemini 2.0 Flash via Vercel AI SDK
- **UI Components**: Radix UI, Lucide Icons
- **Tipos**: TypeScript

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd AsistenteDeVentasInteligente
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=tu_google_ai_api_key
```

### 4. Configurar base de datos
Ejecuta este SQL en tu proyecto Supabase:

```sql
-- Tabla de conversaciones
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Habilitar RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can manage own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Ejecutar en desarrollo
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
📁 AsistenteDeVentasInteligente/
├── 📁 app/
│   ├── 📁 api/                    # API Routes
│   │   ├── 📁 auth/              # Autenticación (login, register, logout)
│   │   ├── 📁 chat/              # Chat con IA (streaming)
│   │   └── 📁 conversations/     # CRUD de conversaciones
│   ├── 📁 chat/                  # Página principal del chat
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de inicio/login
├── 📁 components/                # Componentes React
│   ├── 📁 ui/                   # Componentes base (Radix UI)
│   ├── chat-*.tsx               # Componentes del chat
│   ├── login-form.tsx           # Formulario de login
│   └── register-form.tsx        # Formulario de registro
├── 📁 lib/                      # Utilidades y configuración
│   ├── 📁 supabase/            # Cliente Supabase
│   ├── api-client.ts           # Cliente HTTP centralizado
│   └── utils.ts                # Utilidades (cn, etc.)
└── middleware.ts               # Middleware de autenticación
```

## 🔑 Funcionalidades Principales

### Autenticación
- **Registro** de nuevos usuarios con email/password
- **Login** con validación y redirección automática
- **Logout** con limpieza de sesión
- **Protección de rutas** automática via middleware

### Chat con IA
- **Streaming en tiempo real** de respuestas
- **Historial persistente** de conversaciones
- **Múltiples chats** por usuario
- **IA especializada** en técnicas de ventas
- **Interfaz responsive** con scroll optimizado

### Gestión de Conversaciones
- **Crear** nuevas conversaciones
- **Listar** conversaciones del usuario
- **Eliminar** conversaciones con confirmación
- **Cargar** historial de mensajes

## 🏗️ Arquitectura

### API Routes Only
El proyecto usa **exclusivamente API Routes** para el backend, sin Server Actions, siguiendo las mejores prácticas de Next.js 13+:

- `GET /api/conversations` - Listar conversaciones
- `POST /api/conversations` - Crear conversación
- `DELETE /api/conversations/[id]` - Eliminar conversación
- `GET /api/conversations/[id]/messages` - Obtener mensajes
- `POST /api/chat` - Chat con IA (streaming)
- `POST /api/auth/*` - Autenticación

### Seguridad
- **Row Level Security (RLS)** en Supabase
- **Middleware de autenticación** en todas las rutas protegidas
- **Validación de usuario** en cada API endpoint
- **Cookies seguras** para manejo de sesión

## 🎨 UI/UX

- **Diseño moderno** y minimalista
- **Tema oscuro** por defecto
- **Responsive** para móvil y desktop
- **Sidebar colapsible** para navegación
- **Estados de carga** y feedback visual
- **Scroll automático** en mensajes nuevos

## 🤖 Personalidad de la IA

El asistente está configurado con un prompt especializado en ventas que incluye:

- Desarrollo de estrategias de ventas efectivas
- Análisis de perfiles de clientes
- Preparación de presentaciones
- Manejo de objeciones
- Técnicas de cierre

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción
pnpm build

# Iniciar producción
pnpm start

# Linting
pnpm lint
```

## 🔧 Configuración Adicional

### Personalizar la IA
Edita el `SYSTEM_PROMPT` en `app/api/chat/route.ts` para modificar la personalidad del asistente.

### Styling
Los estilos se manejan con Tailwind CSS. Configuración en `tailwind.config.js` y variables CSS en `app/globals.css`.

### Base de Datos
Usa Supabase Dashboard para administrar usuarios, conversaciones y mensajes.

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando Next.js, Supabase y Google Gemini**
