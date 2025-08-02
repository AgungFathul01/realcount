"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Camera, Brain, CheckCircle, Eye, Edit } from "lucide-react"
import { toast } from "sonner"

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<PhotoProcessing | null>(null)
  const [viewingPhoto, setViewingPhoto] = useState<PhotoProcessing | null>(null)

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
    toast.success("Foto C1 berhasil dikonfirmasi.")
  }

  const handleEdit = (photo: PhotoProcessing) => {
    setEditingPhoto({ ...photo }) // Create a copy to edit
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
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

  const handleView = (photo: PhotoProcessing) => {
    setViewingPhoto(photo)
    setIsViewModalOpen(true)
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
                        <Button size="sm" variant="outline" onClick={() => handleEdit(photo)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {photo.status === "needs_review" && (
                          <Button size="sm" onClick={() => handleConfirm(photo.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Konfirmasi
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleView(photo)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
                    {getStatusBadge(viewingPhoto.status, viewingPhoto.confidence)}
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
    </div>
  )
}
