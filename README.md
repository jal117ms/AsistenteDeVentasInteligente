# 🤖 Asistente de Ventas Inteligente

Aplicación Full Stack de chat con IA especializada en ventas, construida con **Next.js**, **Supabase** y **Google Gemini**.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini_2.5-red?logo=google)

## ✨ Características

- **💬 Chat en tiempo real** con streaming de respuestas de IA
- **🔐 Autenticación completa** (registro, login, logout)
- **💾 Historial persistente** de conversaciones
- **📊 Tablas comparativas** renderizadas desde Markdown
- **🎨 Interfaz moderna** y responsive
- **🛡️ Seguridad RLS** en base de datos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Base de Datos**: PostgreSQL (Supabase) con RLS
- **IA**: Google Gemini 2.5 Flash
- **UI**: Radix UI, React Markdown

## 🚀 Instalación y Configuración

### 1. Clonar e instalar
```bash
git clone <tu-repo>
cd AsistenteDeVentasInteligente
pnpm install  # o npm install
```

### 2. Variables de entorno
Crear `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

### 3. Base de datos
Ejecutar en Supabase SQL Editor:
```sql
-- Crear tablas
CREATE TABLE conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own messages" ON messages FOR ALL USING (auth.uid() = user_id);
```

### 4. Ejecutar
```bash
pnpm dev  # Disponible en http://localhost:3000
```

## 📁 Estructura Esencial

```
app/
├── api/
│   ├── auth/           # Login, register, logout
│   ├── chat/           # IA chat con streaming
│   └── conversations/  # CRUD conversaciones
├── chat/               # Página principal del chat
└── page.tsx           # Login/registro
components/
├── chat-*.tsx         # Componentes del chat
└── ui/               # Componentes base
lib/
├── supabase/         # Configuración Supabase
└── api-client.ts     # Cliente HTTP
```

## 🎮 Uso

1. **Registro/Login** → Crea cuenta o inicia sesión
2. **Chat** → Interactúa con el asistente de ventas
3. **Historial** → Ve conversaciones previas en sidebar
4. **Gestión** → Elimina chats individuales o todos

**Ejemplos de consultas:**
- "Compara laptops gaming de gama media"
- "Dame una tabla de smartphones bajo $500"
- "Estrategia para vender perfumes"

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repo a Vercel
2. Configurar variables de entorno
3. Deploy automático

## 📄 Licencia

MIT License

---

**Desarrollado con Next.js + Supabase + Google AI**

CREATE POLICY "Users can delete their own conversations" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para mensajes
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. **Ejecutar el proyecto**
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
AsistenteDeVentasInteligente/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints de autenticación
│   │   ├── chat/                 # Endpoint principal de chat
│   │   └── conversations/        # CRUD de conversaciones
│   ├── chat/                     # Página principal del chat
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de inicio/login
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes base de UI
│   ├── chat-header.tsx           # Header del chat
│   ├── chat-input.tsx            # Input para enviar mensajes
│   ├── chat-messages.tsx         # Renderizado de mensajes
│   ├── chat-page-client.tsx      # Cliente principal del chat
│   ├── chat-sidebar.tsx          # Sidebar con historial
│   └── ...
├── lib/                          # Utilidades y configuración
│   ├── api-client.ts             # Cliente para APIs internas
│   ├── error-handler.ts          # Manejo centralizado de errores
│   ├── utils.ts                  # Utilidades generales
│   └── supabase/                 # Configuración de Supabase
├── scripts/                      # Scripts de base de datos
│   └── 001_create_tables.sql     # Schema inicial
├── .env.local                    # Variables de entorno (no incluido)
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind
└── tsconfig.json                 # Configuración de TypeScript
```

## 🎮 Uso de la Aplicación

### 1. **Registro/Login**
- Crea una cuenta o inicia sesión con email y contraseña
- El sistema te redirigirá automáticamente al chat

### 2. **Interacción con el Asistente**
- Escribe tu consulta sobre productos o servicios
- El asistente responderá con información estructurada
- Solicita comparaciones para ver tablas visuales elegantes

### 3. **Gestión de Conversaciones**
- **Nuevo Chat**: Botón en la sidebar para comenzar conversación
- **Historial**: Todas tus conversaciones se guardan automáticamente
- **Eliminar**: Botón individual en cada chat o "Borrar Todo"



## 🚀 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Iniciar servidor de desarrollo
pnpm build        # Construir para producción
pnpm start        # Iniciar servidor de producción
pnpm lint         # Ejecutar linting
```

## 🔧 Configuración Avanzada

### **Personalización del Asistente**
Edita el `SYSTEM_PROMPT` en [`app/api/chat/route.ts`](app/api/chat/route.ts) para:
- Cambiar la personalidad del asistente
- Agregar conocimientos específicos de productos
- Modificar el tono y estilo de respuestas

### **Temas y Estilos**
- Modifica [`app/globals.css`](app/globals.css) para personalizar colores
- Usa el sistema de tema integrado para modo oscuro/claro

## 📊 Performance y Optimización

- **Lazy Loading** en componentes pesados
- **Streaming de respuestas** para UX fluida
- **Caché de conversaciones** en cliente
- **Límite de historial** para optimizar consultas
- **Compresión automática** de assets

## 🚀 Despliegue

### **Vercel (Recomendado)**
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### **Variables de Entorno para Producción**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

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

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

### **Próximas Funcionalidades**
- [ ] **Búsqueda en historial** de conversaciones
- [ ] **Categorización automática** de chats
- [ ] **Exportar conversaciones** a PDF/JSON
- [ ] **Integración con APIs de productos reales**
- [ ] **Modo offline** con cache local
- [ ] **Notificaciones push** para respuestas

### **Mejoras Técnicas**
- [ ] **Tests unitarios** con Jest
- [ ] **Tests E2E** con Playwright
- [ ] **Análiticas** con Vercel Analytics
- [ ] **Monitoreo de errores** con Sentry
- [ ] **Rate limiting** en APIs

## 🛡️ Características de Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- **Validación de entrada** en frontend y backend
- **Autenticación JWT** con Supabase Auth
- **Sanitización de datos** antes del procesamiento
- **Variables de entorno** para información sensible

## 🔍 Troubleshooting

### Problemas Comunes

**Error: "No autorizado"**
- Verifica que las variables de entorno de Supabase estén configuradas
- Asegúrate de haber ejecutado las políticas RLS

**Error de conexión a la base de datos**
- Revisa que la URL y claves de Supabase sean correctas
- Verifica que tu proyecto Supabase esté activo

**IA no responde**
- Confirma que la API Key de Google AI esté configurada
- Revisa los límites de quota en Google AI Studio

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/tu-repo/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/tu-repo/discussions)

---

**Desarrollado con ❤️ usando Next.js, Supabase y Google Gemini**

> Un proyecto que demuestra las capacidades modernas del desarrollo Full Stack con IA integrada, enfocado en crear experiencias de usuario excepcionales y arquitecturas escalables.
