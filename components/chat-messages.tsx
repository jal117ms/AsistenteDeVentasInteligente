"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ChatMessagesProps = {
  messages: Message[]
  isTyping: boolean
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <ScrollArea className="h-full">
        <div className="max-w-3xl mx-auto space-y-6 p-4 pb-6 min-h-full">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[98%] sm:max-w-[80%] min-w-0 overflow-visible",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "text-sm leading-relaxed prose prose-sm max-w-none",
                    message.role === "user" ? "prose-invert" : "prose-slate dark:prose-invert",
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      table: ({ children }) => (
                        <div className="my-4 -mx-2 sm:-mx-4 px-2 sm:px-4">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-border rounded-lg">
                              {children}
                            </table>
                          </div>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-muted/80">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="bg-card">{children}</tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-1 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-3 text-left font-semibold text-card-foreground border-r border-border/50 last:border-r-0 text-xs sm:text-sm lg:text-sm">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-1 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-3 text-card-foreground border-r border-border/50 last:border-r-0 text-xs sm:text-sm lg:text-sm">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl px-4 py-3 bg-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
