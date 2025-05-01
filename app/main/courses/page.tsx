import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseCard } from "@/components/course-card"
import { CourseSidebar } from "@/components/courseSidebar"


export default function DigitalCoursesPage() {
  return (
    <div className="flex bg-[#0A0F1D]">
      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl text-white font-bold mb-2">Digital Courses</h1>
          <p className="text-sm text-[#A4A4A4]">Structured on-demand learning to sharpen your edge.</p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6 w-[60%] bg-[#334155] rounded-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
          <Input
            placeholder="Search for a courses..."
            className="pl-10 bg-transparent border-none rounded-full text-white h-12 placeholder:text-white placeholder:font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <Select>
            <SelectTrigger className="w-[180px] border-[#323D50] bg-[#1E2634] text-white [&_.select-placeholder]:text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="trading">Trading</SelectItem>
              <SelectItem value="investing">Investing</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] border-[#323D50] bg-[#1E2634] text-white">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] border-[#323D50] bg-[#1E2634] text-white">
              <SelectValue placeholder="All Durations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="short">Under 1 hour</SelectItem>
              <SelectItem value="medium">1-3 hours</SelectItem>
              <SelectItem value="long">3+ hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course 1 */}
          <CourseCard
            title="Advanced Price Action Mastery"
            image="/placeholder.svg?height=200&width=400"
            instructor={{
              name: "John Smith",
              avatar: "/placeholder.svg?height=40&width=40",
            }}
            duration="4h 30m"
            progress={75}
            action="Resume Course"
          />

          {/* Course 2 */}
          <CourseCard
            title="Risk Management Fundamentals"
            image="/placeholder.svg?height=200&width=400"
            instructor={{
              name: "Sarah Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
            }}
            duration="2h 15m"
            progress={40}
            action="Continue Learning"
          />

          {/* Course 3 */}
          <CourseCard
            title="Trading Psychology Master"
            image="/placeholder.svg?height=200&width=400"
            instructor={{
              name: "Mike Anderson",
              avatar: "/placeholder.svg?height=40&width=40",
            }}
            duration="3h 45m"
            progress={0}
            action="Start Course"
          />
        </div>
      </div>

      {/* Right sidebar with selected course */}
      <CourseSidebar />
    </div>
  )
}
