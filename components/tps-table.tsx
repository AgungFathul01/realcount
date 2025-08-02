"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Phone, MapPin, Camera, MessageSquare } from "lucide-react"
import { TPSDetailDialog } from "@/components/tps-detail-dialog"

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

interface TPSTableProps {
  data: TPSData[]
  candidates: Candidate[]
}

export function TPSTable({ data, candidates }: TPSTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTPS, setSelectedTPS] = useState<TPSData | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const itemsPerPage = 20

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

  const handleViewDetail = (tps: TPSData) => {
    setSelectedTPS(tps)
    setIsDetailDialogOpen(true)
  }

  const handleCallSupervisor = (phone: string, supervisorName: string, tpsName: string) => {
    // Format phone number for WhatsApp (remove + and spaces)
    const cleanPhone = phone.replace(/[\s+]/g, "")
    const message = encodeURIComponent(
      `Halo ${supervisorName}, ini terkait dengan ${tpsName}. Mohon konfirmasi status perhitungan suara.`,
    )
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank")
  }

  const filteredData = data.filter((tps) => {
    const matchesSearch =
      tps.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tps.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tps.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tps.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Data TPS ({filteredData.length} dari {data.length})
        </CardTitle>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari TPS, lokasi, atau penanggung jawab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="processing">Proses</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="bermasalah">Bermasalah</SelectItem> {/* Changed "error" to "bermasalah" */}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TPS</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Suara</TableHead>
                <TableHead>Foto C1</TableHead>
                <TableHead>Update Terakhir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((tps) => (
                <TableRow key={tps.id}>
                  <TableCell className="font-medium">{tps.name}</TableCell>
                  <TableCell>{tps.location}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tps.supervisor}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {tps.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(tps.status)}</TableCell>
                  <TableCell>{tps.status === "completed" ? tps.totalVotes.toLocaleString("id-ID") : "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Camera className={`h-4 w-4 ${tps.photoUploaded ? "text-green-600" : "text-gray-400"}`} />
                      {tps.photoUploaded ? "Ada" : "Belum"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(tps.lastUpdate).toLocaleString("id-ID")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="default" onClick={() => handleViewDetail(tps)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallSupervisor(tps.phone, tps.supervisor, tps.name)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
            {filteredData.length} TPS
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </CardContent>
      <TPSDetailDialog
        tps={selectedTPS}
        candidates={candidates}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false)
          setSelectedTPS(null)
        }}
      />
    </Card>
  )
}
