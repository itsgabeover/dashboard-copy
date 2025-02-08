"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, X, Send, Mic, Paperclip, MinimizeIcon } from "lucide-react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface QuickAction {
  label: string
  query: string
}

export function SageChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, chatContainerRef]) //Fixed unnecessary dependency

  const quickActions: QuickAction[] = [
    { label: "Policy Overview", query: "Show me my policy overview" },
    { label: "Health Score Details", query: "Explain my health score" },
    { label: "Investment Options", query: "What are my investment options?" },
  ]

  // Create a type-safe handler for quick action clicks
  const handleQuickActionClick = (query: string) => {
    handleInputChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <Card className="w-[400px] shadow-xl border-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/sage-avatar.png" alt="Sage" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-semibold">Chat with Sage</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(true)}>
                      <MinimizeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div ref={chatContainerRef} className="space-y-4 h-[400px] overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Hi! I&apos;m Sage, your AI assistant. I can help you understand your policy details and answer
                          any questions you have.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickActionClick(action.query)}
                              className="text-sm"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex gap-2">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce delay-100">●</span>
                            <span className="animate-bounce delay-200">●</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-10 w-10">
                            <Paperclip className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach file</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-10 w-10">
                            <Mic className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Voice input</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="h-10 w-10">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setIsOpen(true)
                setIsMinimized(false)
              }}
              size="icon"
              className={`h-14 w-14 rounded-full shadow-lg ${
                isOpen ? "bg-primary/90 hover:bg-primary/100" : "bg-primary hover:bg-primary/90"
              }`}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="sr-only">Open chat with Sage</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chat with Sage</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

