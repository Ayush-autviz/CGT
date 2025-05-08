"use client"

import { useQuery } from "@tanstack/react-query"
import { CourseCard } from "@/components/course-card"
import { fetchCourses } from "@/lib/ApiService"
import { useCourse } from "@/context/coursecontext"
import { CourseSidebar } from "@/components/courseSidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function DigitalCoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  })

  const { setSelectedCourseId, selectedCourseId } = useCourse()

  return (
    <div className="flex bg-[#0A0F1D] min-h-screen">
      <div className="flex-1 p-6 overflow-y-auto" style={{ marginRight: "320px" }}>
        <div className="mb-8">
          <h1 className="text-2xl text-white font-bold mb-2">Digital Courses</h1>
          <p className="text-sm text-[#A4A4A4]">Structured on-demand learning to sharpen your edge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? // Skeleton loaders for courses
              Array(6)
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
                ))
            : courses.map((course) => {
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
      </div>
      <CourseSidebar />
    </div>
  )
}
