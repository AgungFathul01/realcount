"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, Phone, CheckCircle, Clock, AlertTriangle, Bot, Camera, Brain, Eye, Edit, Activity, TrendingUp } from 'lucide-react'

interface WhatsAppMessage {
  id: string
  phone: string
  supervisorName: string
  tpsId: number
  message: string
  timestamp: Date
  status: "received" | "processing" | "completed" | "bermasalah"
  photoUrl?: string
}

interface PhotoProcessing {
  id: string
  tpsId: number
  photoUrl: string
  status: "processing" | "completed" | "needs_review" | "confirmed"
  confidence: number
  extractedData: {
    candidate1: number
    candidate2: number
    candidate3: number
    candidate4: number
    candidate5: number
    totalVotes: number
  }
  timestamp: Date
  reviewedBy?: string
}

interface MonitoringTabProps {
  completedTPS: number
  processingTPS: number
  pendingTPS: number
  errorTPS: number
  tpsData: any[]
  messages: WhatsAppMessage[]
  processingQueue: PhotoProcessing[]
  completedProcessing: PhotoProcessing[]
  handleConfirmPhoto: (id: string) => void
  handleEditPhoto: (photo: PhotoProcessing) => void
  handleViewPhoto: (photo: PhotoProcessing) => void
}

export function MonitoringTab({
  completedTPS,
  processingTPS,
  pendingTPS,
  errorTPS,
  tpsData,
  messages,
  processingQueue,
  completedProcessing,
  handleConfirmPhoto,
  handleEditPhoto,
  handleViewPhoto,
}: MonitoringTabProps) {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const connectWebSocket = () => {
      setIsConnected(true)
      const interval = setInterval(() => {
        if (Math.random() > 0.95) {
          setIsConnected(false)
          setTimeout(() => {
            setIsConnected(true)
          }, 3000)
        }
      }, 5000)
      return () => clearInterval(interval)
    }
    const cleanup = connectWebSocket()
    return cleanup
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "processing":
        return <Bot className="h-4 w-4 text-yellow-600 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "bermasalah":
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
      case "bermasalah":
        return <Badge variant="destructive">Bermasalah</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPhotoStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Memproses</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Selesai ({Math.round(confidence * 100)}%)</Badge>
      case "needs_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Perlu Review ({Math.round(confidence * 100)}%)</Badge>
      case "confirmed":
        return <Badge className="bg-purple-100 text-purple-800">Dikonfirmasi</Badge>
      case "bermasalah":
        return <Badge variant="destructive">Bermasalah</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const tpsNeedProcessing = pendingTPS + processingTPS + errorTPS

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TPS Perlu Diproses</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{tpsNeedProcessing}</div>
            <p className="text-xs text-muted-foreground">dari 400 TPS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Foto Diproses</CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{processingQueue.length}</div>
            <p className="text-xs text-muted-foreground">sedang diproses AI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesan WhatsApp</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{messages.length}</div>
            <p className="text-xs text-muted-foreground">pesan hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{((completedTPS / 400) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">TPS selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status TPS Real-time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Selesai</span>
              </div>
              <Badge variant="secondary">{completedTPS}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Proses</span>
              </div>
              <Badge variant="secondary">{processingTPS}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Menunggu</span>
              </div>
              <Badge variant="secondary">{pendingTPS}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Bermasalah</span>
              </div>
              <Badge variant="destructive">{errorTPS}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Bot and AI Processor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Bot */}
        <Card>
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
              <div className="space-y-3 pb-4">
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
                            className="w-full h-16 object-cover rounded border"
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

        {/* AI Photo Processor - Card View (original) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5" />
              AI Photo Processor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Processing Queue */}
            {processingQueue.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Sedang Diproses ({processingQueue.length})
                </h4>
                <div className="space-y-2">
                  {processingQueue.map((photo) => (
                    <div key={photo.id} className="border rounded p-2 bg-blue-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">TPS {photo.tpsId.toString().padStart(3, "0")}</span>
                        <Badge className="bg-blue-100 text-blue-800">Memproses</Badge>
                      </div>
                      <Progress value={Math.random() * 100} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">Mengekstrak data dari foto C1...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Processing - Card List */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Hasil Proses ({completedProcessing.length})
              </h4>
              <ScrollArea className="h-64">
                <div className="space-y-2 pr-4">
                  {completedProcessing.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <Brain className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Belum ada foto yang diproses</p>
                    </div>
                  ) : (
                    completedProcessing.map((photo) => (
                      <div key={photo.id} className="border rounded p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">TPS {photo.tpsId.toString().padStart(3, "0")}</span>
                          {getPhotoStatusBadge(photo.status, photo.confidence)}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div>Paslon 1: {photo.extractedData.candidate1}</div>
                          <div>Paslon 2: {photo.extractedData.candidate2}</div>
                          <div>Paslon 3: {photo.extractedData.candidate3}</div>
                          <div>Paslon 4: {photo.extractedData.candidate4}</div>
                          <div>Paslon 5: {photo.extractedData.candidate5}</div>
                          <div className="font-medium">Total: {photo.extractedData.totalVotes}</div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPhoto(photo)}
                            className="text-xs px-2 py-1 bg-transparent"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          {photo.status === "needs_review" && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPhoto(photo.id)}
                              className="text-xs px-2 py-1"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              OK
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPhoto(photo)}
                            className="text-xs px-2 py-1 bg-transparent"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Lihat
                          </Button>
                        </div>

                        <div className="text-xs text-gray-400 mt-2">
                          {photo.timestamp.toLocaleTimeString("id-ID")}
                          {photo.reviewedBy && ` • Dikonfirmasi oleh ${photo.reviewedBy}`}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Photo Processor - Table View (New Card) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Detail Hasil Proses AI (Tabel)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Removed ScrollArea here */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>TPS</TableHead>
                  <TableHead>Paslon 1</TableHead>
                  <TableHead>Paslon 2</TableHead>
                  <TableHead>Paslon 3</TableHead>
                  <TableHead>Paslon 4</TableHead>
                  <TableHead>Paslon 5</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedProcessing.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-gray-500 py-4">
                      <Brain className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Belum ada foto yang diproses untuk ditampilkan dalam tabel.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  completedProcessing.map((photo) => (
                    <TableRow key={photo.id}>
                      <TableCell className="font-medium">TPS {photo.tpsId.toString().padStart(3, "0")}</TableCell>
                      <TableCell>{photo.extractedData.candidate1}</TableCell>
                      <TableCell>{photo.extractedData.candidate2}</TableCell>
                      <TableCell>{photo.extractedData.candidate3}</TableCell>
                      <TableCell>{photo.extractedData.candidate4}</TableCell>
                      <TableCell>{photo.extractedData.candidate5}</TableCell>
                      <TableCell className="font-medium">{photo.extractedData.totalVotes}</TableCell>
                      <TableCell>{getPhotoStatusBadge(photo.status, photo.confidence)}</TableCell>
                      <TableCell>{(photo.confidence * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-xs">
                        {photo.timestamp.toLocaleTimeString("id-ID")}
                        <br />
                        {photo.timestamp.toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPhoto(photo)}
                            className="text-xs px-2 py-1 bg-transparent"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {photo.status === "needs_review" && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPhoto(photo.id)}
                              className="text-xs px-2 py-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPhoto(photo)}
                            className="text-xs px-2 py-1 bg-transparent"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tpsData
              .filter((tps) => tps.status === "completed")
              .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
              .slice(0, 8)
              .map((tps) => (
                <div key={tps.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {tps.name} - {tps.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tps.lastUpdate).toLocaleTimeString("id-ID")} • {tps.supervisor}
                    </p>
                  </div>
                  <Badge variant="outline">Selesai</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
