"use client"

import * as React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BotIcon as Robot } from "lucide-react"
import Image from "next/image"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSessionStore } from "@/stores/sessionStore"
import {  createSession, createSessionMessage, getSessionMessages } from "@/lib/ApiService"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ClipLoader } from "react-spinners"
import { Textarea } from "./ui/textarea"

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex items-center gap-3 p-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
      <Robot className="h-5 w-5 text-black" />
    </div>
    <div className="flex space-x-1">
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  </div>
)

interface Message {
  id: string | number
  content: string
  role: "assistant" | "user"
  attachments?: File[]
  image?: string
}


export function ChatInterface() {

  const queryClient = useQueryClient()
  const { activeSessionId, setActiveSessionId } = useSessionStore()

  const [input, setInput] = React.useState("")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [isTyping, setIsTyping] = React.useState(false) // State for typing indicator
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [newSessionTitle, setNewSessionTitle] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Fetch messages for active session
  const { data: sessionMessages, isLoading } = useQuery({
    queryKey: ["sessionMessages", activeSessionId],
    queryFn: () => (activeSessionId ? getSessionMessages(activeSessionId) : Promise.resolve([])),
    enabled: !!activeSessionId,
  })

  const handleCreateSession = () => {
    if (newSessionTitle.trim()) {
      createSessionMutation.mutate(newSessionTitle)
    }
  }

  const createSessionMutation = useMutation({
    mutationFn: (title: string) => createSession(title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      setActiveSessionId(data.id)
      setNewSessionTitle("")
      setIsDialogOpen(false)
    },
  })

  // Default welcome message when no session is active
  const defaultMessages: Message[] = [
    {
      id: "welcome",
      content: "Hello! I'm your AI trading assistant. How can I help you today with your trading journey?",
      role: "assistant",
    },
  ]

  // Use session messages if available, otherwise use default
  const messages = React.useMemo(() => {
    if (!activeSessionId) return defaultMessages
    return sessionMessages || []
  }, [activeSessionId, sessionMessages])

  // Create new message
  const createMessageMutation = useMutation({
    mutationFn: ({ sessionId, content, file }: { sessionId: number; content: string; file?: File }) =>
      createSessionMessage(sessionId, { content, file }),
    onMutate: async ({ sessionId, content, file }) => {
      // Show typing indicator when mutation starts
      setIsTyping(true)
      // Optimistic update
      const optimisticMessage: Message = {
        id: Date.now(),
        content,
        role: "user",
        attachments: file ? [file] : undefined,
      }
      queryClient.setQueryData(["sessionMessages", activeSessionId], (old: Message[] | undefined) => [
        ...(old || []),
        optimisticMessage,
      ])
      return { optimisticMessage }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessionMessages", activeSessionId] })
      // Simulate typing delay before hiding the indicator
      setIsTyping(false)
      //setTimeout(() => setIsTyping(false), 1000) // Adjust delay as needed
    },
    onError: () => {
      setIsTyping(false) // Hide typing indicator on error
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Auto-resize textarea when input changes
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input])

  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return

    if (!activeSessionId) {
      alert("Please create or select a session first")
      return
    }

    const file = attachments.length > 0 ? attachments[0] : undefined

    // Send message to API
    createMessageMutation.mutate({
      sessionId: activeSessionId,
      content: input,
      file,
    })

    setInput("")
    setAttachments([])
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear the file input
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    // Auto-resize the textarea based on content
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Only allow image or PDF files
      if (file.type.indexOf('image/') !== -1 || file.type === 'application/pdf') {
        // If there's already an attachment, replace it (only one file allowed)
        if (attachments.length > 0) {
          toast.info("Previous attachment replaced", {
            description: "Only one file can be attached at a time",
            duration: 3000,
          });
        } else {
          toast.success("File attached", {
            description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
            duration: 3000,
          });
        }

        // Only allow one file at a time
        setAttachments([file]);
      } else {
        toast.error("Unsupported file type", {
          description: "Only images and PDF files are supported",
          duration: 3000,
        });
      }
    }
  }

  // Handle clipboard paste events
  const handlePaste = (e: React.ClipboardEvent) => {
    const { items } = e.clipboardData;

    // Check if clipboard contains files
    if (items) {
      for (let i = 0; i < items.length; i++) {
        // Only process image or PDF files
        if (items[i].type.indexOf('image/') !== -1 || items[i].type === 'application/pdf') {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault(); // Prevent the default paste behavior

            // If there's already an attachment, replace it (only one file allowed)
            if (attachments.length > 0) {
              toast.info("Previous attachment replaced", {
                description: "Only one file can be attached at a time",
                duration: 3000,
              });
            } else {
              toast.success("File attached", {
                description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
                duration: 3000,
              });
            }

            // Set the new attachment
            setAttachments([file]);
            return;
          }
        }
      }
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleEmojiSelect = (emoji: any) => {
    setInput((prev) => prev + emoji.native)
  }

  const removeAttachment = () => {
    setAttachments([])
  }

  // If no active session, show a prompt to create or select a session
  if (!activeSessionId) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">AI Trading Assistant</h1>
        <p className="text-lg text-[#A4A4A4] mb-6">
          Please create a new session or select an existing one to start chatting.
        </p>
        <div className="flex gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-amber-500 text-black hover:bg-amber-600"
                onClick={handleCreateSession}
              >
                Create New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E293B] z-80 text-white border-[#2a3548]">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
              </DialogHeader>
              <Input
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="Session name"
                className="bg-[#2a3548] border-[#3a4559] text-white"
              />
              <DialogFooter>
                <Button
                  onClick={handleCreateSession}
                  className="bg-amber-500 text-black hover:bg-amber-600"
                  disabled={createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? "Creating..." : "Create Session"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6">
        <ClipLoader
          color="#F59E0B"
          size={50}
          aria-label="Loading Messages"
          data-testid="loader"
        />
        <div className="text-white mt-4">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-4">
        <h1 className="text-2xl text-white font-bold">AI Trading Assistant</h1>
        <p className="text-sm text-[#A4A4A4]">
          Session: {sessionMessages?.[0]?.session_title || "Current Session"}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4 custom-scrollbar">
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] items-end gap-3 rounded-lg p-3 ${
                message.role === "user" ? "bg-transparent" : "bg-transparent text-white"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                  <Robot className="h-5 w-5 text-black" />
                </div>
              )}
              <div
                className={`flex-1 p-3 ${
                  message.role === "user"
                    ? "rounded-bl-[10px] bg-white text-black"
                    : "rounded-br-[10px] bg-[#1E293B] text-white"
                } rounded-t-[10px] break-words whitespace-pre-wrap`}
              >
                {message.content}
                {message.file_url && (
                  <div className="mt-2">
                    <Image
                      src={`${message.file_url}` || "/placeholder.svg"}
                      width={200}
                      height={150}
                      alt="Attached image"
                      className="rounded object-cover"
                    />
                  </div>
                )}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((file: any, index: any) => (
                      <div
                        key={index}
                        className="rounded bg-gray-100 p-2 text-sm text-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                            {file.type.startsWith("image/") ? (
                              <Image
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                width={32}
                                height={32}
                                alt={file.name}
                                className="h-8 w-8 object-cover rounded"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-black">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}

      </div>

      {attachments.length > 0 && (
        <div className="mb-2 rounded-lg bg-[#1E293B] p-3">
          <div className="text-xs text-[#A4A4A4] mb-2">Attachment:</div>
          <div className="flex flex-wrap gap-2">
            <div className="relative rounded bg-[#2D3748] p-3 text-xs text-white">
              <div className="flex items-center gap-3">
                {/* Preview for image files */}
                {attachments[0].type.startsWith('image/') && (
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <Image
                      src={URL.createObjectURL(attachments[0])}
                      alt="Image preview"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Icon for PDF files */}
                {attachments[0].type === 'application/pdf' && (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-red-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="truncate max-w-[200px] font-medium">{attachments[0].name}</span>
                  <span className="text-[#A4A4A4] text-xs mt-1">
                    {(attachments[0].size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <button
                  onClick={removeAttachment}
                  className="ml-2 rounded-full bg-[#3D4A60] p-1 text-[#A4A4A4] hover:text-white hover:bg-[#4D5A70]"
                  title="Remove attachment"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Type your message or paste an image/PDF..."
            className="rounded-xl bg-[#1E293B] text-sm text-white pl-10 py-3 pr-24 placeholder:text-[#A4A4A4] min-h-[40px] max-h-[200px] resize-none"
            disabled={createMessageMutation.isPending}
            rows={1}
            style={{
              overflow: 'auto',
              lineHeight: '1.5'
            }}
          />
          <div className="absolute left-3 top-6 -translate-y-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 mt-1 text-muted-foreground hover:bg-transparent cursor-pointer"
                >
                  <Image src="/emoji.svg" width={20} height={20} alt="Emoji" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none" align="start">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="absolute right-14 top-6 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 mt-1 text-muted-foreground hover:bg-transparent cursor-pointer"
              onClick={handleAttachClick}
            >
              <Image src="/Attach.svg" width={20} height={20} alt="Attach" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="absolute right-4 top-6 -translate-y-1/2">
            <Button
              onClick={handleSendMessage}
              variant="ghost"
              size="icon"
              className="h-6 w-6 mt-1 text-amber-500 hover:bg-transparent cursor-pointer"
              disabled={createMessageMutation.isPending}
            >
              <Image src="/Send.svg" width={20} height={20} alt="Send" />
            </Button>
          </div>
        </div>

      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}