"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PlusCircle, Trash2 } from "lucide-react"



import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useSessionStore } from "@/stores/sessionStore"
import { createSession, deleteSession, getSessions } from "@/lib/ApiService"
import { toast } from "sonner"
import { createErrorToast } from "@/lib/errorUtils"

interface Session {
  id: number
  title: string
  created_at: string
}

export function SessionSidebar() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { activeSessionId, setActiveSessionId } = useSessionStore()
  const [newSessionTitle, setNewSessionTitle] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Mock token - in a real app, get this from your auth system
  const token = "your-auth-token"

  // Fetch sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessions(),
  })

  console.log(sessions,'data');

  // Create new session
  const createSessionMutation = useMutation({
    mutationFn: (title: string) => createSession(title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      setActiveSessionId(data.id)
      setNewSessionTitle("")
      setIsDialogOpen(false)
      toast.success("Session created successfully!") // Success toast
    },
    onError: (error) => {
      console.error("Session creation failed:", error);
      toast.error("Session Creation Failed", createErrorToast("Session Creation Failed", error));
    },
  })

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: number) => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      // if (sessions && sessions.length > 0) {
      //   const firstSession = sessions.find((s: any) => s.id !== activeSessionId)
      //   if (firstSession) {
      //     setActiveSessionId(firstSession.id)
      //     router.push(`/?session=${firstSession.id}`)
      //   } else {
          setActiveSessionId(null)
         // router.push("/")
      //   }
      // }
      toast.success("Session deleted successfully!") // Success toast
    },
    onError: (error) => {
      console.error("Session deletion failed:", error);
      toast.error("Session Deletion Failed", createErrorToast("Session Deletion Failed", error));
    },
  })

  const handleCreateSession = () => {
    if (newSessionTitle.trim()) {
      createSessionMutation.mutate(newSessionTitle)
    } else {
      toast.error("Session name cannot be empty.") // Validation toast
    }
  }

  const handleDeleteSession = (sessionId: number, e: React.MouseEvent) => {
 //   e.stopPropagation()
    deleteSessionMutation.mutate(sessionId)
  }

  const handleSessionClick = (sessionId: number) => {
    setActiveSessionId(sessionId)
    // router.push(`/?session=${sessionId}`)
  }

  return (
    <div className="space-y-4 h-full px-6 md:p-6 bg-[#1E293B]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-white font-bold">Chat Sessions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button variant="ghost"  size="icon" className="text-white hover:bg-[#2a3548] hover:text-white h-10 w-10"> */}
              <PlusCircle color="white" className="h-6 w-6" />
            {/* </Button> */}
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

      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-10 w-full bg-[#2a3548]" />
              </div>
            ))
        ) : sessions && sessions.length > 0 ? (
          // Session list
          sessions.map((session: Session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all p-2 hover:bg-[#2a3548] ${
                activeSessionId === session.id ? "bg-[#2a3548] border-2 border-amber-500" : "bg-[#1e2738]"
              }`}
              onClick={() => handleSessionClick(session.id)}
            >
              <CardContent className="flex items-center justify-between ">
                <div className="truncate text-white">{session.title}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#A4A4A4] hover:text-white hover:bg-[#3a4559]"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          // No sessions
          <div className="text-center py-8 text-[#A4A4A4]">
            <p>No sessions yet</p>
            <p className="text-sm mt-2">Create a new session to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

