"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Phone, CheckCircle, Clock, AlertTriangle, Bot } from "lucide-react"

interface WhatsAppMessage {
  id: string
  phone: string
  supervisorName: string
  tpsId: number
  message: string
  timestamp: Date
  status: "received" | "processing" | "completed" | "error"
  photoUrl?: string
}

export function WhatsAppBot() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [isConnected, setIsConnected] = useState(true)

  // Simulate incoming WhatsApp messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newMessage: WhatsAppMessage = {
          id: Date.now().toString(),
          phone: `+6281${Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, "0")}`,
          supervisorName: `PJ-${Math.floor(Math.random() * 400) + 1}`,
          tpsId: Math.floor(Math.random() * 400) + 1,
          message: "Foto C1 TPS telah dikirim",
          timestamp: new Date(),
          status: "received",
          photoUrl: `/placeholder.svg?height=200&width=300&text=C1+Form+TPS+${Math.floor(Math.random() * 400) + 1}`,
        }

        setMessages((prev) => [newMessage, ...prev.slice(0, 19)])

        // Simulate processing
        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "processing" } : msg)))
        }, 2000)

        // Simulate completion
        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "completed" } : msg)))
        }, 5000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "processing":
        return <Bot className="h-4 w-4 text-yellow-600 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-blue-100 text-blue-800">Diterima</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Proses</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full h-96 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Bot
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-xs text-gray-500">{isConnected ? "Online" : "Offline"}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Menunggu pesan masuk...</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium">{message.supervisorName}</span>
                    </div>
                    {getStatusBadge(message.status)}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(message.status)}
                    <span className="text-sm text-gray-600">TPS {message.tpsId.toString().padStart(3, "0")}</span>
                  </div>

                  <p className="text-sm text-gray-800 mb-2">{message.message}</p>

                  {message.photoUrl && (
                    <div className="mb-2">
                      <img
                        src={message.photoUrl || "/placeholder.svg"}
                        alt="C1 Form"
                        className="w-full h-20 object-cover rounded border"
                      />
                    </div>
                  )}

                  <div className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString("id-ID")}</div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
