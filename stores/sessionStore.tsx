import { create } from "zustand"

interface SessionState {
  activeSessionId: number | null
  setActiveSessionId: (id: number | null) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSessionId: null,
  setActiveSessionId: (id) => set({ activeSessionId: id }),
}))