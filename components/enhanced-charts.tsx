"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { TrendingUp, Crown, Award } from "lucide-react"

interface Candidate {
  id: number
  name: string
  party: string
  color: string
  votes: number
}

interface EnhancedChartsProps {
  candidates: Candidate[]
  totalVotes: number
}

export function EnhancedCharts({ candidates, totalVotes }: EnhancedChartsProps) {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)

  // Prepare data for different chart types
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Enhanced Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Perolehan Suara per Calon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any, name: any, props: any) => [
                  `${value.toLocaleString("id-ID")} suara (${props.payload.percentage.toFixed(2)}%)`,
                  props.payload.party,
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]} fill={(entry: any) => entry.color}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Top 3 Rankings */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {chartData.slice(0, 3).map((candidate, index) => (
              <div key={candidate.id} className="text-center p-2 bg-gray-50 rounded">
                <div className="flex items-center justify-center mb-1">
                  {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                  {index === 1 && <Award className="h-4 w-4 text-gray-400" />}
                  {index === 2 && <Award className="h-4 w-4 text-orange-500" />}
                  <span className="ml-1 text-sm font-bold">#{index + 1}</span>
                </div>
                <div className="text-xs font-medium">{candidate.name}</div>
                <div className="text-xs text-gray-500">{candidate.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Pie Chart with Donut Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Distribusi Suara
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="votes"
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, props: any) => [
                  `${value.toLocaleString("id-ID")} suara`,
                  props.payload.party,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with detailed info */}
          <div className="mt-4 space-y-2">
            {chartData.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: candidate.color }}></div>
                  <div>
                    <div className="text-sm font-medium">{candidate.name}</div>
                    <div className="text-xs text-gray-500">{candidate.party}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{candidate.votes.toLocaleString("id-ID")}</div>
                  <div className="text-xs text-gray-500">{candidate.percentage.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radial Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Perolehan Suara
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={chartData}>
              <RadialBar dataKey="percentage" cornerRadius={10} fill={(entry: any) => entry.color}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RadialBar>
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, "Persentase"]} />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="text-center mt-4">
            <div className="text-2xl font-bold">{totalVotes.toLocaleString("id-ID")}</div>
            <div className="text-sm text-gray-500">Total Suara Masuk</div>
          </div>
        </CardContent>
      </Card>

      {/* Area Chart for Vote Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Tren Perolehan Suara
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any, name: any, props: any) => [
                  `${value.toLocaleString("id-ID")} suara`,
                  props.payload.party,
                ]}
              />
              <Area type="monotone" dataKey="votes" stroke="#3b82f6" fill="url(#colorGradient)" strokeWidth={2} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
