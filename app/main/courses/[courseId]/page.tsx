"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileVideo } from "lucide-react"
import Image from "next/image"

import { fetchCourseLectures } from "@/lib/ApiService"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoModal } from "@/components/VideoModal"
import { toast } from "sonner"

// Define the Lecture type
interface Lecture {
  id: number
  title: string
  stream_url: string
  thumbnail_url?: string
  duration?: string
  description?: string
}

export default function CourseVideosPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{
    streamUrl: string
    title: string
    thumbnailUrl?: string
  } | null>(null)

  // Fetch course lectures
  const {
    data: lectures = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseLectures", courseId],
    queryFn: () => (courseId ? fetchCourseLectures(courseId) : []),
    enabled: !!courseId,
  })

  const handleVideoClick = (lecture: Lecture) => {
    setSelectedVideo({
      streamUrl: lecture.stream_url,
      title: lecture.title,
      thumbnailUrl: lecture.thumbnail_url,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  const handleBackClick = () => {
    router.push("/main/courses")
  }

  const handleThumbnailError = () => {
    toast.error("Failed to load thumbnail", {
      description: "Using placeholder image instead",
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-[#0A0F1D] min-h-screen">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 bg-[#1E293B] mb-2" />
          <Skeleton className="h-4 w-64 bg-[#1E293B]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full bg-[#1E293B] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-[#0A0F1D] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium text-xl mb-2">Error loading course videos</p>
          <p className="text-[#A4A4A4] mb-6">{(error as Error).message}</p>
          <Button onClick={handleBackClick} variant="outline" className="bg-transparent border-[#F6BE00] text-[#F6BE00]">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const courseTitle = lectures.length > 0 ? lectures[0].title : "Course Videos"

  return (
    <div className="p-6 bg-[#0A0F1D] min-h-screen">
      <div className="mb-8">
        <Button 
          onClick={handleBackClick} 
          variant="ghost" 
          className="mb-4 text-[#A4A4A4] hover:text-white hover:bg-[#1E293B]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
        </Button>
        
        <h1 className="text-2xl text-white font-bold mb-2">{courseTitle}</h1>
        <div className="flex items-center text-sm text-[#A4A4A4]">
          <FileVideo className="h-4 w-4 text-[#F6BE00] mr-2" />
          <span>{lectures.length} videos available</span>
        </div>
      </div>

      {lectures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#A4A4A4] text-lg">No videos available for this course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture: Lecture) => (
            <div
              key={lecture.id}
              className="bg-[#1E293B] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#F6BE00]/10 group"
              onClick={() => handleVideoClick(lecture)}
            >
              <div className="relative h-48 w-full">
                {lecture.thumbnail_url ? (
                  <Image
                    src={lecture.thumbnail_url}
                    alt={lecture.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={handleThumbnailError}
                  />
                ) : (
                  <div className="w-full h-full bg-[#2a3447] flex items-center justify-center">
                    <FileVideo className="h-12 w-12 text-[#F6BE00]/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-[#F6BE00] rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-[#1a2235]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#F6BE00] transition-colors">
                  {lecture.title}
                </h3>
                {/* <p className="text-sm text-[#A4A4A4]">
                  {lecture.duration || `${Math.floor(Math.random() * 10) + 5} min`}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          streamUrl={selectedVideo.streamUrl}
          title={selectedVideo.title}
          thumbnailUrl={selectedVideo.thumbnailUrl}
        />
      )}
    </div>
  )
}