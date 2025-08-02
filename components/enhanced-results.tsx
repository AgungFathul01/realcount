"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, Crown, Award, Target } from "lucide-react"

interface Candidate {
  id: number
  name: string
  party: string
  color: string
  votes: number
}

interface EnhancedResultsProps {
  candidates: Candidate[]
  totalVotes: number
  completedTPS: number
  totalTPS: number
}

export function EnhancedResults({ candidates, totalVotes, completedTPS, totalTPS }: EnhancedResultsProps) {
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
    </div>
  )
}
