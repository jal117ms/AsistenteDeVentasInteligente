"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

type ChatInputProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-2">
          <Textarea
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje aquí..."
            className="min-h-[60px] max-h-[200px] resize-none"
            rows={2}
            disabled={disabled}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim() || disabled}
            className="h-[60px] w-[60px] flex-shrink-0"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
