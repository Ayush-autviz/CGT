"use client"

import * as React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BotIcon as Robot, X } from "lucide-react"
import Image from "next/image"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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

interface FileAttachment {
  file_id: string
  file_url: string
  filename: string
  openai_file_id: string
}

interface Message {
  id: string | number
  content: string
  role: "assistant" | "user"
  attachments?: File[]  // For optimistic updates
  image?: string
  file_url?: string     // For backward compatibility
  file_urls?: string[]  // For backward compatibility
  session_title?: string
  // New API response fields
  files?: FileAttachment[]
  created_at?: string
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
    onError: (error: any) => {
      // Display error message using the error.response.data.error format
      const errorMessage = error?.response?.data?.error || "Failed to create session";
      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
      });
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
    mutationFn: ({ sessionId, content, files }: { sessionId: number; content: string; files?: File[] }) =>
      createSessionMessage(sessionId, { content, files }),
    onMutate: async ({ sessionId, content, files }) => {
      // Show typing indicator when mutation starts
      setIsTyping(true)
      // Optimistic update
      const optimisticMessage: Message = {
        id: Date.now(),
        content,
        role: "user",
        attachments: files && files.length > 0 ? files : undefined,
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
    onError: (error: any) => {
      setIsTyping(false) // Hide typing indicator on error

      // Display error message using the error.response.data.error format
      const errorMessage = error?.response?.data?.error || "Failed to send message";
      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
      });
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

    // Use all attachments (up to 4)
    const files = attachments.length > 0 ? attachments.slice(0, 4) : undefined

    // Send message to API
    createMessageMutation.mutate({
      sessionId: activeSessionId,
      content: input,
      files,
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
      const newFiles = Array.from(e.target.files);

      // Filter to only allow image or PDF files
      const validFiles = newFiles.filter(file =>
        file.type.indexOf('image/') !== -1 || file.type === 'application/pdf'
      );

      if (validFiles.length === 0) {
        toast.error("Error", {
          description: "Unsupported file type(s). Only images and PDF files are supported.",
          duration: 3000,
        });
        return;
      }

      // Check if adding these files would exceed the limit of 4
      const totalFiles = [...attachments, ...validFiles];

      if (totalFiles.length > 4) {
        toast.info("Maximum 4 files allowed", {
          description: `Only the first ${4 - attachments.length} file(s) will be added`,
          duration: 3000,
        });
      }

      // Take only what we can add (up to 4 total)
      const filesToAdd = validFiles.slice(0, 4 - attachments.length);

      if (filesToAdd.length > 0) {
        // Add the new files to existing attachments (up to 4 total)
        const updatedAttachments = [...attachments, ...filesToAdd].slice(0, 4);
        setAttachments(updatedAttachments);

        toast.success(`${filesToAdd.length} file(s) attached`, {
          description: filesToAdd.length === 1
            ? `${filesToAdd[0].name} (${(filesToAdd[0].size / 1024).toFixed(1)} KB)`
            : `${filesToAdd.length} files added (${updatedAttachments.length} total)`,
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
      const pastedFiles: File[] = [];

      // Collect all valid files from clipboard
      for (let i = 0; i < items.length; i++) {
        // Only process image or PDF files
        if (items[i].type.indexOf('image/') !== -1 || items[i].type === 'application/pdf') {
          const file = items[i].getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      // If we found valid files
      if (pastedFiles.length > 0) {
        e.preventDefault(); // Prevent the default paste behavior

        // Check if adding these files would exceed the limit of 4
        const totalFiles = [...attachments, ...pastedFiles];

        if (totalFiles.length > 4) {
          toast.info("Maximum 4 files allowed", {
            description: `Only the first ${4 - attachments.length} file(s) will be added`,
            duration: 3000,
          });
        }

        // Take only what we can add (up to 4 total)
        const filesToAdd = pastedFiles.slice(0, 4 - attachments.length);

        if (filesToAdd.length > 0) {
          // Add the new files to existing attachments (up to 4 total)
          const updatedAttachments = [...attachments, ...filesToAdd].slice(0, 4);
          setAttachments(updatedAttachments);

          toast.success(`${filesToAdd.length} file(s) attached`, {
            description: filesToAdd.length === 1
              ? `${filesToAdd[0].name} (${(filesToAdd[0].size / 1024).toFixed(1)} KB)`
              : `${filesToAdd.length} files added (${updatedAttachments.length} total)`,
            duration: 3000,
          });
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
                } rounded-t-[10px] break-words`}
              >
                {/* Render markdown for assistant messages */}
                {message.role === "assistant" ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  // Regular text for user messages
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}

                {/* Display files from new API response format */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.files.length > 1 && (
                      <div className="text-xs text-[#A4A4A4] mb-2">
                        {message.files.length} attachments
                      </div>
                    )}

                    {message.files.map((file: FileAttachment, index: number) => {
                      const isImage = file.filename.match(/\.(jpeg|jpg|gif|png)$/i) || file.file_url.match(/\.(jpeg|jpg|gif|png)$/i);
                      const isPdf = file.filename.match(/\.(pdf)$/i) || file.file_url.match(/\.(pdf)$/i);
                      const isWord = file.filename.match(/\.(doc|docx)$/i) || file.file_url.match(/\.(doc|docx)$/i);

                      return (
                        <div key={file.file_id} className="rounded overflow-hidden">
                          <div className="text-xs text-[#A4A4A4] mb-1">
                            {file.filename}
                          </div>

                          {isImage ? (
                            // Image files
                            <Image
                              src={file.file_url}
                              width={300}
                              height={200}
                              alt={file.filename}
                              className="rounded object-cover"
                            />
                          ) : isPdf ? (
                            // PDF files
                            <a
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-[#2a3447] rounded text-sm hover:bg-[#3a4457] transition-colors"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100">
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
                              <div className="flex flex-col">
                                <span className="font-medium text-white">
                                  {file.filename}
                                </span>
                                <span className="text-xs text-[#A4A4A4]">
                                  Click to open PDF
                                </span>
                              </div>
                            </a>
                          ) : isWord ? (
                            // Word documents
                            <a
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-[#2a3447] rounded text-sm hover:bg-[#3a4457] transition-colors"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-blue-600"
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
                              <div className="flex flex-col">
                                <span className="font-medium text-white">
                                  {file.filename}
                                </span>
                                <span className="text-xs text-[#A4A4A4]">
                                  Click to open document
                                </span>
                              </div>
                            </a>
                          ) : (
                            // Other file types
                            <a
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-[#2a3447] rounded text-sm hover:bg-[#3a4457] transition-colors"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-gray-600"
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
                              <div className="flex flex-col">
                                <span className="font-medium text-white">
                                  {file.filename}
                                </span>
                                <span className="text-xs text-[#A4A4A4]">
                                  Click to open file
                                </span>
                              </div>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* For backward compatibility - single file */}
                {!message.files && message.file_url && (
                  <div className="mt-3 space-y-2">
                    <div className="rounded overflow-hidden">
                      {message.filename && (
                        <div className="text-xs text-[#A4A4A4] mb-1">
                          {message.filename}
                        </div>
                      )}

                      {/* Handle different file types */}
                      {message.file_url.match(/\.(jpeg|jpg|gif|png)$/i) ||
                       (message.filename && message.filename.match(/\.(jpeg|jpg|gif|png)$/i)) ? (
                        // Image files
                        <Image
                          src={message.file_url}
                          width={300}
                          height={200}
                          alt={message.filename || "Attached image"}
                          className="rounded object-cover"
                        />
                      ) : message.file_url.match(/\.(pdf)$/i) ||
                          (message.filename && message.filename.match(/\.(pdf)$/i)) ? (
                        // PDF files
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-[#2a3447] rounded text-sm hover:bg-[#3a4457] transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100">
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
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {message.filename || "PDF Document"}
                            </span>
                            <span className="text-xs text-[#A4A4A4]">
                              Click to open PDF
                            </span>
                          </div>
                        </a>
                      ) : (
                        // Other file types
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-[#2a3447] rounded text-sm hover:bg-[#3a4457] transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-600"
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
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {message.filename || "Attachment"}
                            </span>
                            <span className="text-xs text-[#A4A4A4]">
                              Click to open file
                            </span>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* For backward compatibility - multiple file URLs */}
                {!message.files && message.file_urls && message.file_urls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.file_urls.map((url: string, index: number) => {
                      const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
                      return (
                        <div key={index} className="rounded overflow-hidden">
                          {isImage ? (
                            <Image
                              src={url}
                              width={300}
                              height={200}
                              alt={`Attached image ${index + 1}`}
                              className="rounded object-cover"
                            />
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-[#2a3447] rounded text-sm hover:bg-[#3a4457] transition-colors"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-gray-600"
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
                              <div className="flex flex-col">
                                <span className="font-medium text-white">Attachment {index + 1}</span>
                                <span className="text-xs text-[#A4A4A4]">Click to open file</span>
                              </div>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Display attachments from optimistic updates */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
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
          <div className="text-xs text-[#A4A4A4] mb-2">
            Attachments: {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
          </div>
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="relative rounded bg-[#2D3748] p-3 text-xs text-white">
                <div className="flex items-center gap-3">
                  {/* Preview for image files */}
                  {file.type.startsWith('image/') && (
                    <div className="h-12 w-12 rounded overflow-hidden">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Image preview"
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Icon for PDF files */}
                  {file.type === 'application/pdf' && (
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
                    <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                    <span className="text-[#A4A4A4] text-xs mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Remove this specific file
                      setAttachments(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="ml-2 rounded-full bg-[#3D4A60] p-1 text-[#A4A4A4] hover:text-white hover:bg-[#4D5A70]"
                    title="Remove attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear all button if multiple files */}
            {attachments.length > 1 && (
              <button
                onClick={removeAttachment}
                className="mt-2 text-xs text-[#A4A4A4] hover:text-white flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear all attachments
              </button>
            )}
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