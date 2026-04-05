import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabaseStorage } from '../lib/supabaseStorage'

export const useShadowingStore = create(
  persist(
    (set) => ({
      sessions: [],

      addSession(session) {
        set(state => ({
          sessions: [
            { id: `s-${Date.now()}`, createdAt: Date.now(), ...session },
            ...state.sessions.slice(0, 49), // keep last 50
          ],
        }))
      },

      deleteSession(id) {
        set(state => ({ sessions: state.sessions.filter(s => s.id !== id) }))
      },
    }),
    {
      name: 'eng-shadowing-store',
      storage: supabaseStorage,
      version: 1,
    }
  )
)
