"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Camera, CheckCircle, Clock, AlertTriangle, MapPin, TrendingUp, Eye, Settings, BarChart } from "lucide-react"
import { TPSTable } from "@/components/tps-table"
import { AdminPanel } from "@/components/admin-panel"
import { CandidateCards } from "@/components/candidate-cards"
import { AuthProvider } from "@/components/auth-provider"
import { RealtimeProvider } from "@/components/realtime-provider"
import { EnhancedResults } from "@/components/enhanced-results"
import { MonitoringTab } from "@/components/monitoring-tab"

// Mock data for candidates
const candidates = [
  { id: 1, name: "Calon 1", party: "Partai A", color: "#3b82f6", votes: 45230 },
  { id: 2, name: "Calon 2", party: "Partai B", color: "#ef4444", votes: 38750 },
  { id: 3, name: "Calon 3", party: "Partai C", color: "#10b981", votes: 42100 },
  { id: 4, name: "Calon 4", party: "Partai D", color: "#f59e0b", votes: 35890 },
  { id: 5, name: "Calon 5", party: "Partai E", color: "#8b5cf6", votes: 28340 },
]

// Mock TPS data
const generateTPSData = () => {
  const statuses = ["completed", "processing", "pending", "error"]
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

export default function Dashboard() {
  const [tpsData, setTPSData] = useState(generateTPSData())
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate real-time updates
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

  const completedTPS = tpsData.filter((tps) => tps.status === "completed").length
  const processingTPS = tpsData.filter((tps) => tps.status === "processing").length
  const pendingTPS = tpsData.filter((tps) => tps.status === "pending").length
  const errorTPS = tpsData.filter((tps) => tps.status === "error").length
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
    <AuthProvider>
      <RealtimeProvider>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Real Count Pilkada 2024</h1>
                  <p className="text-gray-600 mt-1">Pemantauan hasil perhitungan suara secara real-time</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-blue-600">
                    {currentTime.toLocaleTimeString("id-ID")}
                  </div>
                  <div className="text-sm text-gray-500">
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
                  <CardTitle className="text-sm font-medium">Error</CardTitle>
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
                  Hasil Suara
                </TabsTrigger>
                <TabsTrigger value="tps" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Data TPS
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Monitoring
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                <CandidateCards candidates={candidateVotes} totalVotes={totalVotes} />
                <EnhancedResults
                  candidates={candidateVotes}
                  totalVotes={totalVotes}
                  completedTPS={completedTPS}
                  totalTPS={400}
                />
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
                />
              </TabsContent>

              <TabsContent value="admin">
                <AdminPanel tpsData={tpsData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </RealtimeProvider>
    </AuthProvider>
  )
}
