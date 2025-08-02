import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"

interface Candidate {
  id: number
  name: string
  party: string
  color: string
  votes: number
}

interface CandidateCardsProps {
  candidates: Candidate[]
  totalVotes: number
}

export function CandidateCards({ candidates, totalVotes }: CandidateCardsProps) {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {" "}
      {/* Adjusted grid columns */}
      {sortedCandidates.map((candidate, index) => {
        const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
        const isLeading = index === 0

        return (
          <Card key={candidate.id} className={`relative ${isLeading ? "ring-2 ring-yellow-400" : ""}`}>
            {isLeading && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-yellow-900">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Terdepan
                </Badge>
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: candidate.color }}></div>
                <span className="text-lg font-bold">#{index + 1}</span>
              </div>
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold" style={{ color: candidate.color }}>
                  {candidate.votes.toLocaleString("id-ID")}
                </div>
                <div className="text-sm text-muted-foreground">{percentage.toFixed(2)}% dari total suara</div>
                <Progress
                  value={percentage}
                  className="h-2"
                  style={{
                    backgroundColor: `${candidate.color}20`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
