"use client"

import { useState } from "react"
import { CheckCircle2, Clock, Lock, Play, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Mock data for the selected course
const selectedCourse = {
  id: "1",
  title: "Advanced Price Action Mastery",
  instructor: "John Smith",
  totalDuration: "4h 30m",
  progress: 75,
  completedLectures: 6,
  totalLectures: 12,
  lectures: [
    { id: "1", title: "Introduction to Price Action", duration: "15m", completed: true, locked: false },
    { id: "2", title: "Support and Resistance Levels", duration: "25m", completed: true, locked: false },
    { id: "3", title: "Candlestick Patterns", duration: "35m", completed: true, locked: false },
    { id: "4", title: "Price Action Strategies", duration: "45m", completed: true, locked: false },
    { id: "5", title: "Trading with Trends", duration: "30m", completed: true, locked: false },
    { id: "6", title: "Breakout Trading", duration: "40m", completed: true, locked: false },
    { id: "7", title: "Advanced Chart Patterns", duration: "35m", completed: false, locked: false },
    { id: "8", title: "Multiple Timeframe Analysis", duration: "25m", completed: false, locked: false },
    { id: "9", title: "Risk Management in Price Action", duration: "20m", completed: false, locked: true },
    { id: "10", title: "Psychology of Price Action", duration: "30m", completed: false, locked: true },
    { id: "11", title: "Case Studies", duration: "35m", completed: false, locked: true },
    { id: "12", title: "Final Assessment", duration: "15m", completed: false, locked: true },
  ],
}

export function CourseSidebar() {
  const [activeVideoId, setActiveVideoId] = useState("7")

  return (
    <div
      className="hidden lg:flex lg:flex-col w-80 bg-[#1E293B] p-6 border-l border-[#2a3447]"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Course Title and Progress */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">{selectedCourse.title}</h2>
        <p className="text-sm text-[#A4A4A4] mb-4">Instructor: {selectedCourse.instructor}</p>

        <div className="flex justify-between text-sm text-[#A4A4A4] mb-2">
          <span>
            {selectedCourse.completedLectures} of {selectedCourse.totalLectures} lectures completed
          </span>
          <span>{selectedCourse.progress}%</span>
        </div>
        <Progress value={selectedCourse.progress} className="h-2 bg-[#334155]" />
      </div>

      {/* Video Lectures List */}
      <div className="flex-1 overflow-auto mb-6">
        <h3 className="text-md font-semibold text-white mb-4">Course Content</h3>
        <div className="space-y-3">
          {selectedCourse.lectures.map((lecture) => (
            <div
              key={lecture.id}
              className={cn(
                "py-3 rounded-lg cursor-pointer transition-colors",

              )}
              onClick={() => !lecture.locked && setActiveVideoId(lecture.id)}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">

                    <PlayCircle className="h-4 w-4 text-white mr-2" />
      
                  <span className={cn("text-sm font-medium  text-white")}>
                    {lecture.title}
                  </span>
                </div>
                <div className="flex items-center text-xs text-[#A4A4A4]">
                  <Clock className="h-3 w-3 mr-1" />
                  {lecture.duration}
                </div>
              </div>
              {/* {activeVideoId === lecture.id && <div className="mt-2 text-xs text-[#A4A4A4]">Currently watching</div>} */}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Learning Button */}
      <div>
        <Button className="w-full bg-[#334155] hover:bg-[#3f4f68] rounded-[10px] font-semibold p-5 text-white">
          <Play className="mr-2 h-4 w-4" /> Continue Learning
        </Button>
      </div>
    </div>
  )
}
