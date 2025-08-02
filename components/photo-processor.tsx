"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, Brain, CheckCircle, Eye, Edit } from "lucide-react"

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

export function PhotoProcessor() {
  const [processingQueue, setProcessingQueue] = useState<PhotoProcessing[]>([])
  const [completedProcessing, setCompletedProcessing] = useState<PhotoProcessing[]>([])

  // Simulate photo processing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newPhoto = generateDummyPhoto()
        setProcessingQueue((prev) => [newPhoto, ...prev.slice(0, 4)])

        // Simulate AI processing time
        setTimeout(
          () => {
            setProcessingQueue((prev) => prev.filter((p) => p.id !== newPhoto.id))

            const processedPhoto = {
              ...newPhoto,
              status: newPhoto.confidence > 0.9 ? "completed" : "needs_review",
            } as PhotoProcessing

            setCompletedProcessing((prev) => [processedPhoto, ...prev.slice(0, 9)])
          },
          3000 + Math.random() * 2000,
        )
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleConfirm = (id: string) => {
    setCompletedProcessing((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, status: "confirmed", reviewedBy: "Admin" } : photo)),
    )
  }

  const handleEdit = (id: string) => {
    // In a real app, this would open an edit dialog
    console.log("Edit photo processing:", id)
  }

  const getStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Memproses</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Selesai ({Math.round(confidence * 100)}%)</Badge>
      case "needs_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Perlu Review ({Math.round(confidence * 100)}%)</Badge>
      case "confirmed":
        return <Badge className="bg-purple-100 text-purple-800">Dikonfirmasi</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg">
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

          {/* Completed Processing */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Hasil Proses ({completedProcessing.length})
            </h4>
            <ScrollArea className="h-80">
              <div className="space-y-2">
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
                        {getStatusBadge(photo.status, photo.confidence)}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div>C1: {photo.extractedData.candidate1}</div>
                        <div>C2: {photo.extractedData.candidate2}</div>
                        <div>C3: {photo.extractedData.candidate3}</div>
                        <div>C4: {photo.extractedData.candidate4}</div>
                        <div>C5: {photo.extractedData.candidate5}</div>
                        <div className="font-medium">Total: {photo.extractedData.totalVotes}</div>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(photo.id)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {photo.status === "needs_review" && (
                          <Button size="sm" onClick={() => handleConfirm(photo.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Konfirmasi
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
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
  )
}
