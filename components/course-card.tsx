import Image from "next/image"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export interface CourseCardProps {
  title: string
  image: string
  instructor: {
    name: string
    avatar: string
  }
  count: number
  progress: number
  action: string
  id: string
}

export function CourseCard({ id, title, image, instructor, count, progress, action }: CourseCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/main/courses/${id}`)
  }

  return (
    <Card
      className="bg-[#1e2738] border-none overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#F6BE00]/10 h-full pt-0 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 mb-0 relative group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-[#F6BE00] rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-yellow-400">
              <Play className="h-6 w-6 text-[#1a2235]" fill="currentColor" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#F6BE00] transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[#A4A4A4]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F6BE00]"></span>
            <span className="text-[#F6BE00] font-medium">{count} videos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
