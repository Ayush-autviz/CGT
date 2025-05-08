import Image from "next/image"
import { ArrowRight } from "lucide-react"
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
      className="bg-[#1e2738] border-none overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#F6BE00]/10 h-full pt-0 cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 mb-0 relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardHeader>
      <CardContent className="px-5  relative">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#F6BE00] transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-[#A4A4A4]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F6BE00]"></span>
            <span className="text-[#F6BE00] font-medium">{count} videos</span>
          </div>

          {/* Arrow button that appears on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-8 group-hover:translate-x-0">
            <div className="bg-[#F6BE00] rounded-full p-2.5 hover:bg-yellow-400 transition-colors shadow-md">
              <ArrowRight className="h-5 w-5 text-[#1a2235]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
