import Image from "next/image"
import { ChevronRight, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  description?: string
}

export function CourseCard({ id, title, image, instructor, count, progress, action, description }: CourseCardProps) {
  const router = useRouter()
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false)

  const handleCardClick = () => {
    router.push(`/main/courses/${id}`)
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click from triggering
    setShowDescriptionDialog(true)
  }

  return (
    <Card
      className="bg-[#1e2738] border-none overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#F6BE00]/10 h-full pt-0 flex flex-col"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 mb-0 relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500"
          />
        </div>
      </CardHeader>

      <CardContent className="px-5  group flex overflow-visible flex-col ">
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Title without tooltip */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#F6BE00] transition-colors">
            {title}
          </h3>

          {/* Description with "Read More" button */}
          {description && (
            <div className="mb-3">
              <p className="text-sm text-[#A4A4A4] line-clamp-2">
                {description}
              </p>
              {description.length > 100 && (
                <button
                  onClick={handleDescriptionClick}
                  className="text-xs text-[#F6BE00] mt-1 hover:underline flex items-center"
                >
                  <Info className="h-3 w-3 mr-1" /> Read more
                </button>
              )}
            </div>
          )}

          {/* Description Dialog */}
          <Dialog open={showDescriptionDialog} onOpenChange={setShowDescriptionDialog}>
            <DialogContent className="bg-[#1A2235] border border-[#2a3447] text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl text-white mb-2">{title}</DialogTitle>
              </DialogHeader>
              <div className="mt-2 text-[#A4A4A4]">
                {description}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bottom section with video count and arrow */}
        <div className="flex items-center justify-between mt-auto ">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F6BE00]"></span>
            <span className="text-[#F6BE00] font-medium">{count} videos</span>
          </div>

          <div className="bg-[#2a3447] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ChevronRight className="h-4 w-4 text-[#F6BE00]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}