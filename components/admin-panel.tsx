"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Edit, Trash2, Phone, MapPin, Settings, Download, Upload, RefreshCw, Eye } from "lucide-react"
import { toast } from "sonner"

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

interface AdminPanelProps {
  tpsData: TPSData[]
}

export function AdminPanel({ tpsData }: AdminPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedTPS, setSelectedTPS] = useState<TPSData | null>(null)
  const [editingTPS, setEditingTPS] = useState<TPSData | null>(null)
  const [newSupervisor, setNewSupervisor] = useState({
    name: "",
    phone: "",
    tpsId: "",
    location: "",
  })

  const handleAddSupervisor = () => {
    console.log("Adding supervisor:", newSupervisor)
    toast.success("Penanggung jawab berhasil ditambahkan")
    setIsAddDialogOpen(false)
    setNewSupervisor({ name: "", phone: "", tpsId: "", location: "" })
  }

  const handleEditSupervisor = () => {
    if (!editingTPS) return
    console.log("Editing supervisor for TPS:", editingTPS.id)
    toast.success("Penanggung jawab berhasil diperbarui")
    setIsEditDialogOpen(false)
    setEditingTPS(null)
  }

  const handleDeleteSupervisor = (tpsId: number) => {
    console.log("Deleting supervisor for TPS:", tpsId)
    toast.success("Penanggung jawab berhasil dihapus")
  }

  const handleViewDetail = (tps: TPSData) => {
    setSelectedTPS(tps)
    setIsDetailDialogOpen(true)
  }

  const handleResetTPS = (tpsId: number) => {
    console.log("Resetting TPS:", tpsId)
    toast.success("Data TPS berhasil direset")
  }

  const handleExportData = () => {
    console.log("Exporting data...")
    toast.success("Data berhasil diekspor")
  }

  const handleImportData = () => {
    console.log("Importing data...")
    toast.success("Data berhasil diimpor")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Proses</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Panel Administrasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Tambah Penanggung Jawab
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Penanggung Jawab TPS</DialogTitle>
                  <DialogDescription>Tambahkan penanggung jawab baru untuk TPS tertentu</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nama
                    </Label>
                    <Input
                      id="name"
                      value={newSupervisor.name}
                      onChange={(e) => setNewSupervisor((prev) => ({ ...prev, name: e.target.value }))}
                      className="col-span-3"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      No. HP
                    </Label>
                    <Input
                      id="phone"
                      value={newSupervisor.phone}
                      onChange={(e) => setNewSupervisor((prev) => ({ ...prev, phone: e.target.value }))}
                      className="col-span-3"
                      placeholder="+62812xxxxxxxx"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tps" className="text-right">
                      TPS
                    </Label>
                    <Select onValueChange={(value) => setNewSupervisor((prev) => ({ ...prev, tpsId: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih TPS" />
                      </SelectTrigger>
                      <SelectContent>
                        {tpsData.slice(0, 10).map((tps) => (
                          <SelectItem key={tps.id} value={tps.id.toString()}>
                            {tps.name} - {tps.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Lokasi
                    </Label>
                    <Input
                      id="location"
                      value={newSupervisor.location}
                      onChange={(e) => setNewSupervisor((prev) => ({ ...prev, location: e.target.value }))}
                      className="col-span-3"
                      placeholder="Kelurahan/Desa"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddSupervisor}>
                    Tambah Penanggung Jawab
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Data
            </Button>

            <Button variant="outline" onClick={handleImportData} className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Supervisor Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Penanggung Jawab TPS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TPS</TableHead>
                  <TableHead>Penanggung Jawab</TableHead>
                  <TableHead>No. HP</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tpsData.slice(0, 15).map((tps) => (
                  <TableRow key={tps.id}>
                    <TableCell className="font-medium">{tps.name}</TableCell>
                    <TableCell>{tps.supervisor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {tps.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {tps.location}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(tps.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetail(tps)}>
                          <Eye className="h-3 w-3" />
                        </Button>

                        <Dialog
                          open={isEditDialogOpen && editingTPS?.id === tps.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setEditingTPS(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingTPS(tps)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Penanggung Jawab</DialogTitle>
                              <DialogDescription>Perbarui informasi penanggung jawab TPS</DialogDescription>
                            </DialogHeader>
                            {editingTPS && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-name" className="text-right">
                                    Nama
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={editingTPS.supervisor}
                                    onChange={(e) =>
                                      setEditingTPS((prev) => (prev ? { ...prev, supervisor: e.target.value } : null))
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-phone" className="text-right">
                                    No. HP
                                  </Label>
                                  <Input
                                    id="edit-phone"
                                    value={editingTPS.phone}
                                    onChange={(e) =>
                                      setEditingTPS((prev) => (prev ? { ...prev, phone: e.target.value } : null))
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-location" className="text-right">
                                    Lokasi
                                  </Label>
                                  <Input
                                    id="edit-location"
                                    value={editingTPS.location}
                                    onChange={(e) =>
                                      setEditingTPS((prev) => (prev ? { ...prev, location: e.target.value } : null))
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={handleEditSupervisor}>Simpan Perubahan</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={() => handleResetTPS(tps.id)}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Penanggung Jawab</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus penanggung jawab untuk {tps.name}? Tindakan ini tidak
                                dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSupervisor(tps.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* TPS Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail {selectedTPS?.name}</DialogTitle>
            <DialogDescription>Informasi lengkap TPS dan penanggung jawab</DialogDescription>
          </DialogHeader>
          {selectedTPS && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">TPS</Label>
                  <p className="text-sm text-gray-600">{selectedTPS.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTPS.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Penanggung Jawab</Label>
                  <p className="text-sm text-gray-600">{selectedTPS.supervisor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">No. Telepon</Label>
                  <p className="text-sm text-gray-600">{selectedTPS.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Lokasi</Label>
                <p className="text-sm text-gray-600">{selectedTPS.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Suara</Label>
                  <p className="text-sm text-gray-600">
                    {selectedTPS.status === "completed"
                      ? selectedTPS.totalVotes.toLocaleString("id-ID")
                      : "Belum tersedia"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Foto C1</Label>
                  <p className="text-sm text-gray-600">{selectedTPS.photoUploaded ? "Sudah upload" : "Belum upload"}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Update Terakhir</Label>
                <p className="text-sm text-gray-600">{new Date(selectedTPS.lastUpdate).toLocaleString("id-ID")}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">WhatsApp Bot Configuration</h4>
              <div className="space-y-2">
                <Label htmlFor="bot-token">Bot Token</Label>
                <Input id="bot-token" type="password" placeholder="••••••••••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://api.example.com/webhook" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">AI Processing Settings</h4>
              <div className="space-y-2">
                <Label htmlFor="ai-confidence">Confidence Threshold</Label>
                <Input id="ai-confidence" type="number" placeholder="0.85" min="0" max="1" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auto-confirm">Auto Confirm Threshold</Label>
                <Input id="auto-confirm" type="number" placeholder="0.95" min="0" max="1" step="0.01" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={() => toast.success("Pengaturan berhasil disimpan")}>Simpan Pengaturan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
