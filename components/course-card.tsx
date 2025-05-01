import Image from "next/image"
import { Play, Clock } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface CourseCardProps {
  title: string
  image: string
  instructor: {
    name: string
    avatar: string
  }
  duration: string
  progress: number
  action: string
}

export function CourseCard({ title, image, instructor, duration, progress, action }: CourseCardProps) {
  return (
    <Card className="bg-[#1e2738] border-none p-0 overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="relative h-48 w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-yellow-500 rounded-full p-3 cursor-pointer hover:bg-yellow-600 transition-colors">
              <Play className="h-6 w-6 text-[#1a2235]" fill="currentColor" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 mb-0">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} />
            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-[#A4A4A4]">{instructor.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#A4A4A4]">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        <Progress value={progress} className="h-1.5 mt-4 [&>[role=progressbar]]:bg-red-500" />

      </CardContent>
      <CardFooter className="p-4 mt-auto">
      <Button
          className={`w-full mt-auto ${
            action === "Start Course"
              ? "bg-[#F6BE00] hover:bg-[#F6BE00] text-[#1a2235]"
              : "bg-[#F6BE00] hover:bg-[#F6BE00] text-[#1a2235]"
          }`}
        >
          {action}
        </Button>
        </CardFooter>
    </Card>
  )
}
