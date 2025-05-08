"use client"
import { CourseCard } from "./course-card"
import { useCourse } from "@/context/coursecontext"

interface Course {
  id: string
  title: string
  thumbnail_url: string
  video_count: number
}

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  const { selectedCourseId, setSelectedCourseId } = useCourse()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
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
  )
}
