"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, User, Calendar, Camera, BarChart3, CheckCircle, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TPSData {
  id: number
  name: string
  location: string
  supervisor: string
  phone: string
  status: string
  totalVotes: number
  photoUploaded: boolean
  lastUpdate: string
  votes: { candidateId: number; count: number }[]
}

interface Candidate {
  id: number
  name: string
  party: string
  color: string
}

interface TPSDetailDialogProps {
  tps: TPSData | null
  candidates: Candidate[]
  isOpen: boolean
  onClose: () => void
}

export function TPSDetailDialog({ tps, candidates, isOpen, onClose }: TPSDetailDialogProps) {
  if (!tps) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Proses</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      case "bermasalah": // Changed "error" to "bermasalah"
        return <Badge variant="destructive">Bermasalah</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "processing":
        return <BarChart3 className="h-5 w-5 text-blue-600 animate-pulse" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "bermasalah": // Changed "error" to "bermasalah"
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  // Prepare chart data
  const chartData = tps.votes.map((vote) => {
    const candidate = candidates.find((c) => c.id === vote.candidateId) // Changed candidateId to id
    return {
      name: candidate?.name || `Calon ${vote.candidateId}`,
      votes: vote.count,
      color: candidate?.color || "#gray",
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] md:w-[70vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(tps.status)}
            Detail {tps.name}
          </DialogTitle>
          <DialogDescription>Informasi lengkap dan hasil perhitungan suara TPS</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* TPS Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi TPS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(tps.status)}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Lokasi</div>
                    <div className="text-sm text-gray-600">{tps.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Penanggung Jawab</div>
                    <div className="text-sm text-gray-600">{tps.supervisor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">No. Telepon</div>
                    <div className="text-sm text-gray-600">{tps.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Update Terakhir</div>
                    <div className="text-sm text-gray-600">{new Date(tps.lastUpdate).toLocaleString("id-ID")}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Foto C1</div>
                    <div className="text-sm text-gray-600">
                      {tps.photoUploaded ? (
                        <Badge className="bg-green-100 text-green-800">Sudah Upload</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Belum Upload</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vote Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hasil Perhitungan Suara</CardTitle>
            </CardHeader>
            <CardContent>
              {tps.status === "completed" ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{tps.totalVotes}</div>
                    <div className="text-sm text-gray-600">Total Suara</div>
                  </div>

                  <div className="space-y-2">
                    {chartData.map((candidate, index) => {
                      const percentage = tps.totalVotes > 0 ? (candidate.votes / tps.totalVotes) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: candidate.color }}></div>
                            <span className="font-medium">{candidate.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{candidate.votes}</div>
                            <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Data perhitungan suara belum tersedia</p>
                  <p className="text-sm">Status: {tps.status}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Visualization */}
        {tps.status === "completed" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Visualisasi Hasil Suara</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: any, name: any, props: any) => [`${value} suara`, props.payload.name]} />
                  <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Bar key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Photo Preview */}
        {tps.photoUploaded && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto C1 Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={`/placeholder.svg?height=300&width=500&text=Form+C1+${tps.name}+Total:${tps.totalVotes}`}
                  alt={`Form C1 ${tps.name}`}
                  className="w-full h-48 object-cover rounded border"
                />
                <div className="mt-2 text-sm text-gray-600 text-center">Form C1 - {tps.name}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button>
            <Camera className="h-4 w-4 mr-2" />
            Lihat Foto C1
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
