"use client"

import { useQuery } from "@tanstack/react-query"
import { CourseCard } from "@/components/course-card"
import { fetchCourses } from "@/lib/ApiService"
import { useCourse } from "@/context/coursecontext"
import { Skeleton } from "@/components/ui/skeleton"

export default function DigitalCoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  })

  const { setSelectedCourseId, selectedCourseId } = useCourse()

  return (
    <div className="bg-[#0A0F1D] min-h-screen">
      <div className="p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl text-white font-bold mb-2">Digital Courses</h1>
          <p className="text-sm text-[#A4A4A4]">Structured on-demand learning to sharpen your edge.</p>
        </div>

        {isLoading ? (
          // Skeleton loaders for courses
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="rounded-2xl overflow-hidden">
                  <div className="bg-[#1e2738] h-full">
                    {/* Image skeleton */}
                    <Skeleton className="h-48 w-full bg-[#2a3447]" />

                    {/* Content skeleton */}
                    <div className="p-5">
                      {/* Title skeleton */}
                      <Skeleton className="h-6 w-3/4 bg-[#2a3447] mb-3" />

                      {/* Video count skeleton */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full bg-[#2a3447]" />
                        <Skeleton className="h-4 w-24 bg-[#2a3447]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : courses.length === 0 ? (
          // No courses UI
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-[#1E293B] rounded-xl p-8 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-[#2a3447] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F6BE00]"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" />
                  <path d="M8 11h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Courses Available</h3>
              <p className="text-[#A4A4A4] mb-6">
                There are currently no digital courses available. Please check back later for new content.
              </p>
              {/* <div className="h-1 w-full bg-[#2a3447] rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-[#F6BE00] to-yellow-500 w-0" />
              </div> */}
              {/* <div className="flex justify-center">
                <button
                  className="bg-[#F6BE00] hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-full transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div> */}
            </div>
          </div>
        ) : (
          // Course grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course:any) => {
              const isSelected = selectedCourseId === course.id.toString()

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id.toString())}
                  className={`rounded-2xl cursor-pointer transition-all duration-300 transform ${
                    isSelected
                      ? "border-2 border-[#F6BE00] scale-[1.02] shadow-lg shadow-[#F6BE00]/20"
                      : "border border-transparent hover:scale-[1.01]"
                  }`}
                >
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    image={course.thumbnail_url || "/placeholder.svg?height=200&width=400"}
                    instructor={{ name: "Instructor", avatar: "/placeholder.svg?height=40&width=40" }}
                    count={course.video_count}
                    progress={0}
                    action="Start Course"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
