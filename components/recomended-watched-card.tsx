import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface RecentlyWatchedCardProps {
  title: string
  progress: number
}

export function RecentlyWatchedCard({ title, progress }: RecentlyWatchedCardProps) {
  return (
    <Card className="bg-[#334155] p-0 border-none">
      <CardContent className="p-4">
        <h3 className="text-md font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress: {progress}%</span>
          <Button variant="link" className="text-yellow-500 p-0 h-auto">
            Resume
          </Button>
        </div>
        <Progress value={progress} className="h-1.5" />
      </CardContent>
    </Card>
  )
}
