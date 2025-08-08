"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, Crown, Award, Target, Users, XCircle, CheckCircle2, UserX } from 'lucide-react' // Added new icons

interface Candidate {
  id: number
  name: string
  party: string
  color: string
  votes: number
}

interface EnhancedResultsProps {
  candidates: Candidate[]
  totalVotes: number // This is total valid votes
  completedTPS: number
  totalTPS: number
  totalInvalidVotes: number // New prop
  votersPresent: number // New prop
  votersAbsent: number // New prop
  totalDPT: number // New prop
}

export function EnhancedResults({
  candidates,
  totalVotes,
  completedTPS,
  totalTPS,
  totalInvalidVotes, // Destructure new prop
  votersPresent, // Destructure new prop
  votersAbsent, // Destructure new prop
  totalDPT, // Destructure new prop
}: EnhancedResultsProps) {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)

  // Prepare data for charts
  const chartData = sortedCandidates.map((candidate, index) => ({
    ...candidate,
    percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0,
    rank: index + 1,
    fill: candidate.color,
  }))

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show label for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  const progressPercentage = (completedTPS / totalTPS) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progress Perhitungan Suara Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{completedTPS}</div>
              <div className="text-sm text-gray-500">TPS Selesai</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalVotes.toLocaleString("id-ID")}</div>
              <div className="text-sm text-gray-500">Total Suara Masuk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{progressPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Progress Keseluruhan</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>
                {completedTPS} dari {totalTPS} TPS
              </span>
              <span>{totalTPS - completedTPS} TPS tersisa</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Statistik Tambahan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <div className="text-xl font-bold">{totalVotes.toLocaleString("id-ID")}</div>
                <div className="text-sm text-gray-600">Total Suara Sah</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <div className="text-xl font-bold">{totalInvalidVotes.toLocaleString("id-ID")}</div>
                <div className="text-sm text-gray-600">Total Suara Tidak Sah</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">{votersPresent.toLocaleString("id-ID")}</div>
                <div className="text-sm text-gray-600">Pemilih Hadir</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <UserX className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="text-xl font-bold">{votersAbsent.toLocaleString("id-ID")}</div>
                <div className="text-sm text-gray-600">Pemilih Tidak Hadir</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <div className="text-xl font-bold">{totalDPT.toLocaleString("id-ID")}</div>
                <div className="text-sm text-gray-600">Total DPT</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
