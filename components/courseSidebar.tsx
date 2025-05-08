"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { FileVideo, ChevronRight, BookOpen } from "lucide-react"

import { useCourse } from "@/context/coursecontext"
import { fetchCourseLectures } from "@/lib/ApiService"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoModal } from "./VideoModal"

export function CourseSidebar() {
  const { selectedCourseId } = useCourse()
  const [activeVideoId, setActiveVideoId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const {
    data: lectures = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseLectures", selectedCourseId],
    queryFn: () => (selectedCourseId ? fetchCourseLectures(selectedCourseId) : []),
    enabled: !!selectedCourseId,
  })

  const handleLectureClick = (lecture) => {
    setActiveVideoId(lecture.id)
    setSelectedVideo({ streamUrl: lecture.stream_url, title: lecture.title })
    setIsModalOpen(true)
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
          <div className="h-1 w-full bg-[#2a3447] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F6BE00] to-yellow-500 w-[5%]" />
          </div>
          <div className="flex justify-between text-xs text-[#A4A4A4] mt-2">
            <span>5% complete</span>
            <span>
              {Math.ceil(lectures.length * 0.05)}/{lectures.length} videos
            </span>
          </div>
        </div>

        <h3 className="text-md font-semibold text-white mb-4 flex items-center">
          <span className="w-1 h-4 bg-[#F6BE00] rounded mr-2"></span>
          Course Content
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {lectures.map((lecture, index) => (
            <div
              key={lecture.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                activeVideoId === lecture.id
                  ? "bg-[#2a3447] border-l-2 border-[#F6BE00]"
                  : "hover:bg-[#2a3447]/50 border-l-2 border-transparent"
              }`}
              onClick={() => handleLectureClick(lecture)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#2a3447] mr-3 group-hover:bg-[#F6BE00]/20">
                    <span className="text-xs font-medium text-[#F6BE00]">{index + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-[#F6BE00] transition-colors">
                      {lecture.title}
                    </p>
                    <p className="text-xs text-[#A4A4A4] mt-0.5">{Math.floor(Math.random() * 10) + 5} min</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#A4A4A4] group-hover:text-[#F6BE00] transition-colors" />
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
        />
      )}
    </>
  )
}
