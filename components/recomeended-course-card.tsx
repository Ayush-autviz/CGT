import Image from "next/image"
import { Play, Clock } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export interface RecommendedCourseCardProps {
  title: string
  image: string
  duration: string
}

export function RecommendedCourseCard({ title, image, duration }: RecommendedCourseCardProps) {
  return (
    <Card className="bg-[#334155] p-0 border-none overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="relative h-32 w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-yellow-500 rounded-full p-2 cursor-pointer hover:bg-yellow-600 transition-colors">
              <Play className="h-4 w-4 text-[#1a2235]" fill="currentColor" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-md font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
      </CardContent>
    </Card>
  )
}
