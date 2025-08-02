"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"

interface RealtimeContextType {
  isConnected: boolean
  lastUpdate: Date | null
}

const RealtimeContext = createContext<RealtimeContextType | null>(null)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true)
      toast.success("Terhubung ke server real-time")

      // Simulate periodic updates
      const interval = setInterval(() => {
        setLastUpdate(new Date())

        // Occasionally simulate connection issues
        if (Math.random() > 0.95) {
          setIsConnected(false)
          toast.error("Koneksi terputus, mencoba menghubungkan kembali...")

          setTimeout(() => {
            setIsConnected(true)
            toast.success("Koneksi berhasil dipulihkan")
          }, 3000)
        }
      }, 5000)

      return () => clearInterval(interval)
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [])

  return <RealtimeContext.Provider value={{ isConnected, lastUpdate }}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider")
  }
  return context
}
