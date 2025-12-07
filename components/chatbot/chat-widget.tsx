// --- components/chat-widget.tsx ---
"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  FileText,
  Lock,
  ChevronDown,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getSierraAIResponse } from "@/app/actions/sierra-chat"

// Types
type Role = "user" | "assistant"
interface Message {
  id: string
  role: Role
  content: string
}

// Pre-defined suggestions specific to your site
const SUGGESTIONS = [
  { label: "Verify a Deed", icon: ShieldCheck, prompt: "How do I verify a land deed on SierraVault?" },
  { label: "Upload Docs", icon: FileText, prompt: "What file formats can I upload to the vault?" },
  { label: "Security Info", icon: Lock, prompt: "How does the blockchain encryption protect my data?" },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Hello! I'm the SierraVault AI. I can help you secure, manage, and verify your important documents. What would you like to do today?"
    }
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input
    if (!text.trim()) return

    // 1. Add User Message
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages(prev => [...prev, newUserMsg])
    setInput("")
    setIsTyping(true)

    // 2. Prepare History for Server (exclude initial welcome if needed, or map it)
    const historyPayload = messages.map(m => ({ role: m.role, content: m.content }))

    // 3. Server Action Call
    const response = await getSierraAIResponse(historyPayload, text)

    setIsTyping(false)

    if (response.error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: response.error! }])
    } else if (response.success) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: response.success }])
    }
  }

  // Helper to render text with bolding support (**text**)
  const renderContent = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="text-teal-400 font-bold">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <>
      {/* 1. Launcher Button (Floating) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen ? "bg-red-500 rotate-90" : "bg-teal-500 text-slate-900"
        )}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* 2. Main Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 w-[90vw] max-w-[380px] overflow-hidden rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl transition-all duration-300 origin-bottom-right",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">SierraVault Assistant</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                )}
              >
                <div className="whitespace-pre-wrap">{renderContent(msg.content)}</div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions (Only show if history is short) */}
        {messages.length < 3 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.prompt)}
                className="flex items-center gap-2 whitespace-nowrap bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 px-3 py-2 rounded-full transition-colors"
              >
                <s.icon className="w-3 h-3 text-teal-400" />
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about document security..."
              className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-xl p-3 transition-colors flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-600 mt-2">
            SierraVault AI can make mistakes. Verify important info.
          </div>
        </div>
      </div>
    </>
  )
}