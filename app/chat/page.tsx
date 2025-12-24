import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatPageClient } from "@/components/chat-page-client"

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/")
  }

  return <ChatPageClient user={user} />
}
