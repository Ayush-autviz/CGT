"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { FileVideo, ChevronRight, BookOpen, Play } from "lucide-react"
import Image from "next/image"

import { useCourse } from "@/context/coursecontext"
import { fetchCourseLectures } from "@/lib/ApiService"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoModal } from "./VideoModal"
import { toast } from "sonner"

// Define the Lecture type to fix TypeScript issues
interface Lecture {
  id: number;
  title: string;
  stream_url: string;
  thumbnail_url?: string;
  duration?: string;
  description?: string;
}

export function CourseSidebar() {
  const { selectedCourseId } = useCourse()
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{
    streamUrl: string;
    title: string;
    thumbnailUrl?: string;
  } | null>(null)

  const {
    data: lectures = [] as Lecture[],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseLectures", selectedCourseId],
    queryFn: () => (selectedCourseId ? fetchCourseLectures(selectedCourseId) : []),
    enabled: !!selectedCourseId,
  })

  const handleLectureClick = (lecture: Lecture) => {
    setActiveVideoId(lecture.id)
    setSelectedVideo({
      streamUrl: lecture.stream_url,
      title: lecture.title,
      thumbnailUrl: lecture.thumbnail_url
    })
    setIsModalOpen(true)
  }

  const handleVideoError = (lectureId: number) => {
    toast.error("Failed to load video thumbnail", {
      description: "Using placeholder image instead",
      duration: 3000,
    })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  if (!selectedCourseId) {
    return (
      <div
        className="fixed bottom-0 right-0 w-80 bg-[#1A2235] p-6 border-l border-[#2a3447] flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-[#F6BE00]/40 mx-auto mb-4" />
          <p className="text-[#A4A4A4] font-medium">Select a course to view details</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className="fixed bottom-0 right-0 w-80 bg-[#1A2235] p-6 border-l border-[#2a3447]"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="mb-6">
          <Skeleton className="h-7 w-3/4 bg-[#2a3447] mb-2" />
          <Skeleton className="h-4 w-1/2 bg-[#2a3447]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-[#2a3447] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="fixed bottom-0 right-0 w-80 bg-[#1A2235] p-6 border-l border-[#2a3447] flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="text-center">
          <p className="text-red-400 font-medium">Error loading lectures</p>
          <p className="text-[#A4A4A4] text-sm mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="fixed bottom-0 right-0 w-80 bg-[#1A2235] p-6 border-l border-[#2a3447] flex flex-col"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            {lectures.length > 0 ? lectures[0].title : "Course Details"}
          </h2>
          <div className="flex items-center text-sm text-[#A4A4A4] mb-4">
            <FileVideo className="h-4 w-4 text-[#F6BE00] mr-2" />
            <span>{lectures.length} videos available</span>
          </div>
        </div>

        <h3 className="text-md font-semibold text-white mb-4 flex items-center">
          <span className="w-1 h-4 bg-[#F6BE00] rounded mr-2"></span>
          Course Content
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {lectures.map((lecture: Lecture, index: number) => (
            <div
              key={lecture.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                activeVideoId === lecture.id
                  ? "bg-[#2a3447] border-l-2 border-[#F6BE00]"
                  : "hover:bg-[#2a3447]/50 border-l-2 border-transparent"
              }`}
              onClick={() => handleLectureClick(lecture)}
            >
              <div className="flex flex-col gap-2">
                {/* Thumbnail section */}
                {lecture.thumbnail_url && (
                  <div className="relative w-full h-24 rounded-md overflow-hidden mb-1">
                    <Image
                      src={lecture.thumbnail_url}
                      alt={lecture.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleVideoError(lecture.id)}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-[#F6BE00] rounded-full p-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Play className="h-4 w-4 text-[#1a2235]" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Video info section */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#2a3447] mr-3 group-hover:bg-[#F6BE00]/20">
                      <span className="text-xs font-medium text-[#F6BE00]">{index + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-[#F6BE00] transition-colors">
                        {lecture.title}
                      </p>
                      <p className="text-xs text-[#A4A4A4] mt-0.5">{lecture.duration || `${Math.floor(Math.random() * 10) + 5} min`}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#A4A4A4] group-hover:text-[#F6BE00] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          streamUrl={selectedVideo.streamUrl}
          title={selectedVideo.title}
          thumbnailUrl={selectedVideo.thumbnailUrl}
        />
      )}
    </>
  )
}
