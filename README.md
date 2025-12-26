# 🤖 Asistente de Ventas Inteligente

Un asistente de IA especializado en estrategias de ventas, análisis de clientes y soporte comercial construido con Next.js, Supabase y tecnologías modernas.

![Asistente de Ventas](https://img.shields.io/badge/Next.js-16.0.10-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8) ![Supabase](https://img.shields.io/badge/Supabase-2.48.0-green)

## ✨ Características

- 🎯 **IA Especializada**: Asistente entrenado específicamente para ventas y estrategias comerciales
- 💬 **Chat Inteligente**: Conversaciones contextuales con historial persistente
- 📱 **Responsive Design**: Interfaz optimizada para móviles y desktop
- 🔐 **Autenticación Segura**: Sistema de login/registro con Supabase
- 📊 **Tablas Dinámicas**: Visualización responsiva de datos y comparativas
- 🌙 **Modo Oscuro**: Tema claro/oscuro automático
- ⚡ **Real-time**: Actualización en tiempo real de conversaciones

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI, Lucide Icons
- **Base de Datos**: Supabase (PostgreSQL)
- **IA**: Google AI SDK (@ai-sdk/google)
- **Autenticación**: Supabase Auth
- **Deployment**: Vercel (recomendado)

## 📋 Prerrequisitos

- Node.js 18.0.0 o superior
- npm, yarn o pnpm
- Cuenta de Supabase
- API Key de Google AI (Gemini)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/AsistenteDeVentasInteligente.git
cd AsistenteDeVentasInteligente
```

### 2. Instalar dependencias

```bash
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm
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

# Next.js
NEXTAUTH_SECRET=tu_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configurar Supabase

#### 4.1 Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales a tu `.env.local`

#### 4.2 Ejecutar migraciones de base de datos

Ejecuta el script SQL en el editor de Supabase:

```bash
# El archivo está en: scripts/001_create_tables.sql
```

O ejecuta directamente en el SQL Editor de Supabase:

```sql
-- Crear la tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva conversación',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear la tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices y políticas RLS
-- (Ver archivo completo en scripts/001_create_tables.sql)
```

### 5. Configurar Google AI

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Obtén tu API key
3. Agrégala a tu `.env.local`

## 🏃‍♂️ Ejecutar el proyecto

### Modo desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo producción

```bash
# Construir
npm run build

# Ejecutar
npm run start
```

## 📁 Estructura del Proyecto

```
AsistenteDeVentasInteligente/
├── app/                          # App Router de Next.js
│   ├── api/                     # API Routes
│   │   ├── auth/               # Autenticación
│   │   ├── chat/              # Endpoint del chat
│   │   └── conversations/     # Gestión de conversaciones
│   ├── chat/                  # Página principal del chat
│   ├── globals.css           # Estilos globales
│   └── layout.tsx           # Layout principal
├── components/              # Componentes React
│   ├── ui/                 # Componentes de UI (shadcn)
│   ├── chat-*.tsx         # Componentes del chat
│   └── *.tsx             # Otros componentes
├── lib/                  # Utilidades y configuración
│   ├── supabase/        # Cliente de Supabase
│   ├── api-client.ts   # Cliente API
│   └── utils.ts       # Utilidades
├── scripts/           # Scripts de base de datos
└── public/           # Archivos estáticos
```

## 🎯 Funcionalidades Principales

### Chat Inteligente
- Conversaciones contextuales con IA
- Historial persistente
- Mensajes en tiempo real
- Soporte para tablas y markdown

### Gestión de Conversaciones
- Crear nuevas conversaciones
- Eliminar conversaciones
- Buscar en historial
- Sidebar responsivo

### Autenticación
- Registro de usuarios
- Login seguro
- Sesiones persistentes
- Protección de rutas

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en producción
- `npm run lint` - Linter de código

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático

### Variables de entorno para producción

Asegúrate de configurar todas las variables en tu plataforma de deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=tu_dominio_production
```

## 📱 Características Responsivas

- **Mobile-first**: Diseñado primero para móviles
- **Tablas responsivas**: Scroll horizontal automático
- **Sidebar colapsable**: Navegación optimizada
- **Touch-friendly**: Interfaces táctiles

## 🔒 Seguridad

- **Row Level Security (RLS)**: Políticas de seguridad en Supabase
- **Autenticación JWT**: Tokens seguros
- **Sanitización**: Contenido seguro en markdown
- **CORS configurado**: Acceso controlado a APIs

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

¿Tienes preguntas? Crea un [issue](https://github.com/tu-usuario/AsistenteDeVentasInteligente/issues) o contacta al equipo de desarrollo.

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!