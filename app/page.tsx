"use client"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, CheckCircle, Clock, AlertTriangle, MapPin, Eye, Settings, BarChart } from "lucide-react"
import { TPSTable } from "@/components/tps-table"
import { AdminPanel } from "@/components/admin-panel"
import { CandidateCards } from "@/components/candidate-cards"
import { RealtimeProvider } from "@/components/realtime-provider"
import { EnhancedResults } from "@/components/enhanced-results"
import { MonitoringTab } from "@/components/monitoring-tab"
import { EnhancedCharts } from "@/components/enhanced-charts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Mock data for candidates
const candidates = [
  { id: 1, name: "Anies Baswedan", party: "Partai Keadilan Rakyat", color: "#3b82f6", votes: 45230 },
  { id: 2, name: "Prabowo Subianto", party: "Partai Gerakan Nasional", color: "#ef4444", votes: 38750 },
  { id: 3, name: "Ganjar Pranowo", party: "Partai Demokrasi Indonesia", color: "#10b981", votes: 42100 },
  { id: 4, name: "Ridwan Kamil", party: "Partai Persatuan Bangsa", color: "#f59e0b", votes: 35890 },
  { id: 5, name: "Sandiaga Uno", party: "Partai Amanat Rakyat", color: "#8b5cf6", votes: 28340 },
]

// Mock TPS data
const generateTPSData = () => {
  const statuses = ["completed", "processing", "pending", "bermasalah"] // Changed "error" to "bermasalah"
  return Array.from({ length: 400 }, (_, i) => ({
    id: i + 1,
    name: `TPS ${String(i + 1).padStart(3, "0")}`,
    location: `Kelurahan ${Math.floor(i / 10) + 1}`,
    supervisor: `PJ-${String(i + 1).padStart(3, "0")}`,
    phone: `+62812${String(Math.floor(Math.random() * 10000000)).padStart(7, "0")}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    totalVotes: Math.floor(Math.random() * 500) + 200,
    photoUploaded: Math.random() > 0.3,
    lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    votes: candidates.map((c) => ({
      candidateId: c.id,
      count: Math.floor(Math.random() * 100) + 20,
    })),
  }))
}

interface WhatsAppMessage {
  id: string
  phone: string
  supervisorName: string
  tpsId: number
  message: string
  timestamp: Date
  status: "received" | "processing" | "completed" | "bermasalah" // Changed "error" to "bermasalah"
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

// Generate dummy C1 photos with realistic vote data
const generateDummyPhoto = (): PhotoProcessing => {
  const tpsId = Math.floor(Math.random() * 400) + 1
  const votes = {
    candidate1: Math.floor(Math.random() * 100) + 20,
    candidate2: Math.floor(Math.random() * 100) + 20,
    candidate3: Math.floor(Math.random() * 100) + 20,
    candidate4: Math.floor(Math.random() * 100) + 20,
    candidate5: Math.floor(Math.random() * 100) + 20,
  }
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0)

  return {
    id: Date.now().toString() + Math.random(),
    tpsId,
    photoUrl: `/placeholder.svg?height=400&width=600&text=Form+C1+TPS+${tpsId.toString().padStart(3, "0")}+Total:${totalVotes}`,
    status: "processing",
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
    extractedData: {
      ...votes,
      totalVotes,
    },
    timestamp: new Date(),
  }
}

export default function Dashboard() {
  const [tpsData, setTPSData] = useState(generateTPSData())
  const [currentTime, setCurrentTime] = useState(new Date())

  // State for WhatsApp Bot and AI Photo Processor
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [processingQueue, setProcessingQueue] = useState<PhotoProcessing[]>([])
  const [completedProcessing, setCompletedProcessing] = useState<PhotoProcessing[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<PhotoProcessing | null>(null)
  const [viewingPhoto, setViewingPhoto] = useState<PhotoProcessing | null>(null)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate real-time TPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTPSData((prev) =>
        prev.map((tps) => {
          if (Math.random() > 0.95 && tps.status !== "completed") {
            return {
              ...tps,
              status: "completed",
              lastUpdate: new Date().toISOString(),
              votes: tps.votes.map((v) => ({
                ...v,
                count: v.count + Math.floor(Math.random() * 5),
              })),
            }
          }
          return tps
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

        setMessages((prev) => [newMessage, ...prev.slice(0, 9)])

        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "processing" } : msg)))
        }, 2000)

        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "completed" } : msg)))
        }, 5000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Simulate photo processing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newPhoto = generateDummyPhoto()
        setProcessingQueue((prev) => [newPhoto, ...prev.slice(0, 2)])

        setTimeout(
          () => {
            setProcessingQueue((prev) => prev.filter((p) => p.id !== newPhoto.id))
            const processedPhoto = {
              ...newPhoto,
              status: newPhoto.confidence > 0.9 ? "completed" : "needs_review",
            } as PhotoProcessing
            setCompletedProcessing((prev) => [processedPhoto, ...prev.slice(0, 4)])
          },
          3000 + Math.random() * 2000,
        )
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleConfirmPhoto = (id: string) => {
    setCompletedProcessing((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, status: "confirmed", reviewedBy: "Admin" } : photo)),
    )
    toast.success("Foto C1 berhasil dikonfirmasi.")
  }

  const handleEditPhoto = (photo: PhotoProcessing) => {
    setEditingPhoto({ ...photo }) // Create a copy to edit
    setIsEditModalOpen(true)
  }

  const handleSaveEditPhoto = () => {
    if (editingPhoto) {
      // Recalculate totalVotes based on edited candidate votes
      const updatedExtractedData = {
        ...editingPhoto.extractedData,
        totalVotes:
          editingPhoto.extractedData.candidate1 +
          editingPhoto.extractedData.candidate2 +
          editingPhoto.extractedData.candidate3 +
          editingPhoto.extractedData.candidate4 +
          editingPhoto.extractedData.candidate5,
      }

      setCompletedProcessing((prev) =>
        prev.map((photo) =>
          photo.id === editingPhoto.id
            ? { ...editingPhoto, extractedData: updatedExtractedData, reviewedBy: "Admin" } // Mark as reviewed
            : photo,
        ),
      )
      toast.success("Data foto berhasil diperbarui.")
      setIsEditModalOpen(false)
      setEditingPhoto(null)
    }
  }

  const handleViewPhoto = (photo: PhotoProcessing) => {
    setViewingPhoto(photo)
    setIsViewModalOpen(true)
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
      case "bermasalah": // Changed "error" to "bermasalah"
        return <Badge variant="destructive">Bermasalah</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const completedTPS = tpsData.filter((tps) => tps.status === "completed").length
  const processingTPS = tpsData.filter((tps) => tps.status === "processing").length
  const pendingTPS = tpsData.filter((tps) => tps.status === "pending").length
  const errorTPS = tpsData.filter((tps) => tps.status === "bermasalah").length // Changed "error" to "bermasalah"
  const photosUploaded = tpsData.filter((tps) => tps.photoUploaded).length

  // Calculate total votes per candidate
  const candidateVotes = candidates.map((candidate) => ({
    ...candidate,
    votes: tpsData
      .filter((tps) => tps.status === "completed")
      .reduce((sum, tps) => {
        const vote = tps.votes.find((v) => v.candidateId === candidate.id)
        return sum + (vote?.count || 0)
      }, 0),
  }))

  const totalVotes = candidateVotes.reduce((sum, c) => sum + c.votes, 0)
  const progressPercentage = (completedTPS / 400) * 100

  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">Dashboard Real Count Pilkada 2024</h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Pemantauan hasil perhitungan suara secara real-time
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-xl md:text-2xl font-mono font-bold text-blue-600">
                  {currentTime.toLocaleTimeString("id-ID")}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {currentTime.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TPS Selesai</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedTPS}</div>
                <p className="text-xs text-muted-foreground">dari 400 TPS</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sedang Proses</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{processingTPS}</div>
                <p className="text-xs text-muted-foreground">TPS dalam proses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingTPS}</div>
                <p className="text-xs text-muted-foreground">TPS belum input</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bermasalah</CardTitle>{" "}
                {/* Changed "Error" to "Bermasalah" */}
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{errorTPS}</div>
                <p className="text-xs text-muted-foreground">Perlu verifikasi</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Foto C1</CardTitle>
                <Camera className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{photosUploaded}</div>
                <p className="text-xs text-muted-foreground">foto terupload</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="results" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden md:block">Hasil Suara</span>
              </TabsTrigger>
              <TabsTrigger value="tps" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden md:block">Data TPS</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="hidden md:block">Monitoring</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden md:block">Admin</span>
              </TabsTrigger>
            </TabsList>

            {/* These TabsContent components must be inside the Tabs component */}
            <TabsContent value="results" className="space-y-4">
              <CandidateCards candidates={candidateVotes} totalVotes={totalVotes} />
              <EnhancedResults
                candidates={candidateVotes}
                totalVotes={totalVotes}
                completedTPS={completedTPS}
                totalTPS={400}
              />
              <EnhancedCharts candidates={candidateVotes} totalVotes={totalVotes} />
            </TabsContent>

            <TabsContent value="tps">
              <TPSTable data={tpsData} candidates={candidates} />
            </TabsContent>

            <TabsContent value="monitoring">
              <MonitoringTab
                completedTPS={completedTPS}
                processingTPS={processingTPS}
                pendingTPS={pendingTPS}
                errorTPS={errorTPS}
                tpsData={tpsData}
                messages={messages}
                processingQueue={processingQueue}
                completedProcessing={completedProcessing}
                handleConfirmPhoto={handleConfirmPhoto}
                handleEditPhoto={handleEditPhoto}
                handleViewPhoto={handleViewPhoto}
              />
            </TabsContent>

            <TabsContent value="admin">
              <AdminPanel tpsData={tpsData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Dialog (moved to app/page.tsx) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Foto C1 TPS {editingPhoto?.tpsId.toString().padStart(3, "0")}</DialogTitle>
            <DialogDescription>Perbarui data yang diekstrak dari foto C1.</DialogDescription>
          </DialogHeader>
          {editingPhoto && (
            <div className="grid gap-4 py-4">
              {Object.keys(editingPhoto.extractedData)
                .filter((key) => key.startsWith("candidate"))
                .map((key) => (
                  <div className="grid grid-cols-4 items-center gap-4" key={key}>
                    <Label htmlFor={key} className="text-right">
                      {key.replace("candidate", "Calon ")}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      value={editingPhoto.extractedData[key as keyof typeof editingPhoto.extractedData]}
                      onChange={(e) =>
                        setEditingPhoto((prev) => {
                          if (!prev) return null
                          const newExtractedData = {
                            ...prev.extractedData,
                            [key]: Number.parseInt(e.target.value) || 0,
                          }
                          // Update totalVotes dynamically
                          newExtractedData.totalVotes = Object.values(newExtractedData)
                            .filter((val, idx, arr) => typeof val === "number" && idx < arr.length - 1) // Exclude totalVotes itself
                            .reduce((sum, val) => sum + (val as number), 0)
                          return { ...prev, extractedData: newExtractedData }
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                ))}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalVotes" className="text-right">
                  Total Suara
                </Label>
                <Input
                  id="totalVotes"
                  type="number"
                  value={editingPhoto.extractedData.totalVotes}
                  readOnly // Make total votes read-only
                  className="col-span-3 bg-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confidence" className="text-right">
                  Confidence
                </Label>
                <Input
                  id="confidence"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={editingPhoto.confidence}
                  onChange={(e) =>
                    setEditingPhoto((prev) =>
                      prev ? { ...prev, confidence: Number.parseFloat(e.target.value) || 0 } : null,
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingPhoto.status}
                  onValueChange={(value: "processing" | "completed" | "needs_review" | "confirmed") =>
                    setEditingPhoto((prev) => (prev ? { ...prev, status: value } : null))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Memproses</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="needs_review">Perlu Review</SelectItem>
                    <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEditPhoto}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog (moved to app/page.tsx) */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Foto C1 TPS {viewingPhoto?.tpsId.toString().padStart(3, "0")}</DialogTitle>
            <DialogDescription>Informasi lengkap dan pratinjau foto C1.</DialogDescription>
          </DialogHeader>
          {viewingPhoto && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <img
                  src={viewingPhoto.photoUrl || "/placeholder.svg"}
                  alt={`Form C1 TPS ${viewingPhoto.tpsId}`}
                  className="w-full max-h-80 object-contain rounded border"
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">TPS ID</Label>
                  <p className="text-sm text-gray-600">{viewingPhoto.tpsId.toString().padStart(3, "0")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-gray-600">
                    {getPhotoStatusBadge(viewingPhoto.status, viewingPhoto.confidence)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Confidence AI</Label>
                  <p className="text-sm text-gray-600">{(viewingPhoto.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Waktu Proses</Label>
                  <p className="text-sm text-gray-600">{viewingPhoto.timestamp.toLocaleString("id-ID")}</p>
                </div>
                {viewingPhoto.reviewedBy && (
                  <div>
                    <Label className="text-sm font-medium">Dikonfirmasi Oleh</Label>
                    <p className="text-sm text-gray-600">{viewingPhoto.reviewedBy}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <h3 className="text-md font-medium mb-2">Data Terekstrak:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  {Object.entries(viewingPhoto.extractedData).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">
                        {key.replace("candidate", "Calon ").replace("totalVotes", "Total Suara")}:
                      </span>{" "}
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RealtimeProvider>
  )
}
