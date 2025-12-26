import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Asistente de Ventas Inteligente",
  description: "Chat de IA para ventas profesionales",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/Logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/Logo.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/Logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: "/Logo.png",
    shortcut: "/Logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
