"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addMonths, subMonths } from "date-fns"

export default function BookCoachPage() {
  // Selected coach state
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null)

  // Calendar state
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Time slot state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const timeSlots = ["9:00", "11:00", "14:00", "16:00"]

  // Form state
  const [timezone, setTimezone] = useState("utc")
  const [topic, setTopic] = useState("")
  const [reviewJournal, setReviewJournal] = useState(false)
  const [duration, setDuration] = useState<string | null>("30 mins")

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  // Format the selected date and time for display
  const formattedDateTime =
    date && selectedTimeSlot
      ? `${format(date, "MMMM d, yyyy")} - ${selectedTimeSlot} ${timezone.toUpperCase()}`
      : "Not selected"

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white p-6">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl text-white font-bold">Book a Coach</h1>
          <p className="text-sm text-[#A4A4A4]">Find your perfect trading mentor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Coach Card - Sarah Miller */}
          <div
            className={`bg-[#162033] rounded-lg p-6 cursor-pointer transition-all duration-200 ${selectedCoach === "sarah" ? "ring-2 ring-yellow-500" : "hover:bg-[#2a3347]"}`}
            onClick={() => setSelectedCoach("sarah")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src="/profile2.png"
                  alt="Sarah Miller"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Sarah Miller</h3>
                <p className="text-[#A4A4A4] text-sm">Price Action Specialist</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
                <span className="ml-2 text-gray-400 text-sm">(342 sessions)</span>
              </div>
            </div>
          </div>

          {/* Coach Card - Mark Thompson */}
          <div
            className={`bg-[#162033] rounded-lg p-6 cursor-pointer transition-all duration-200 ${selectedCoach === "mark" ? "ring-2 ring-yellow-500" : "hover:bg-[#2a3347]"}`}
            onClick={() => setSelectedCoach("mark")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src="/profile.png"
                  alt="Mark Thompson"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Mark Thompson</h3>
                <p className="text-gray-400 text-sm">Risk Management Expert</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
                <span className="ml-2 text-gray-400 text-sm">(256 sessions)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Calendar */}
        <div className="bg-[#162033] rounded-lg p-6 mb-6">
          <h2 className="text-2xl text-white font-bold mb-6">Booking Calendar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2">Date</label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full bg-[#334155] border-0 hover:bg-[#334155] text-white hover:text-white justify-between">
                    {date ? format(date, "MMMM d, yyyy") : "Select date"}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                {/* <PopoverContent className="w-auto p-0 bg-[#1a2235] border-[#3a4357]">
                  <div className="flex items-center justify-between p-2 border-b border-[#3a4357]">
                    <Button
                      variant="outline"
                      className="h-7 w-7 p-0 bg-transparent border-0"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                    <Button variant="outline" className="h-7 w-7 p-0 bg-transparent border-0" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate)
                      setCalendarOpen(false)
                    }}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="bg-[#1a2235] text-white"
                    classNames={{
                      day_selected: "bg-yellow-500 text-black hover:bg-yellow-400",
                      day_today: "bg-[#2a3347] text-white",
                      day: "text-white hover:bg-[#2a3347]",
                      head_cell: "text-gray-400",
                      cell: "text-white",
                      nav_button: "text-gray-400 hover:bg-[#2a3347]",
                      table: "border-[#3a4357]",
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent> */}
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                        setDate(newDate)
                        setCalendarOpen(false)
                      }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>

              </Popover>
            </div>

            {/* <div>
              <label className="block text-white mb-2">Time Zone</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="bg-[#1a2235] border-0">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2235] border-[#3a4357]">
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  <SelectItem value="est">EST (GMT-5)</SelectItem>
                  <SelectItem value="pst">PST (GMT-8)</SelectItem>
                  <SelectItem value="cet">CET (GMT+1)</SelectItem>
                  <SelectItem value="jst">JST (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="outline"
                className={`bg-[#1a2235] hover:bg-[#2a3347] hover:text-white border-0 ${
                  selectedTimeSlot === time ? "bg-[#F6BE00] text-black hover:bg-yellow-400" : ""
                }`}
                onClick={() => setSelectedTimeSlot(time)}
              >
                {time}
              </Button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">Preferred Topic (optional)</label>
            <Input
              placeholder="What would you like to discuss?"
              className="bg-[#334155] placeholder:text-white border-0 focus-visible:ring-1 focus-visible:ring-gray-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* <div className="flex items-start gap-2 mb-6">
            <Checkbox
              id="review-journal"
              className="mt-1"
              checked={reviewJournal}
              onCheckedChange={(checked) => setReviewJournal(checked === true)}
            />
            <label htmlFor="review-journal" className="text-sm">
              Allow coach to review my trade journal before the call
            </label>
          </div> */}

          {/* <div className="grid grid-cols-3 gap-4 mb-6">
            {["30 mins", "60 mins", "90 mins"].map((time) => (
              <Button
                key={time}
                variant="outline"
                className={`bg-[#1a2235] hover:bg-[#2a3347] border-0 ${
                  duration === time ? "bg-yellow-500 text-black hover:bg-yellow-400" : ""
                }`}
                onClick={() => setDuration(time)}
              >
                {time}
              </Button>
            ))}
          </div> */}
 
          <Button
            className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-medium py-6"
          //  disabled={!selectedCoach || !date || !selectedTimeSlot || !duration}
            onClick={() => {
              // Here you would typically submit the booking
              alert(`Booking confirmed with ${selectedCoach} on ${formattedDateTime} for ${duration}`)
            }}
          >
            Book a Coach
          </Button>
        </div>

        {/* Session Summary */}
        {/* <div className="bg-[#2a3347] rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Session Summary</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-gray-400">Date & Time</h3>
              <p>{formattedDateTime}</p>
            </div>

            <div>
              <h3 className="text-gray-400">Duration</h3>
              <p>{duration || "Not selected"}</p>
            </div>

            <div>
              <h3 className="text-gray-400">Topic</h3>
              <p>{topic || "Price Action Analysis & Entry Strategies"}</p>
            </div>

            {selectedCoach && (
              <div>
                <h3 className="text-gray-400">Selected Coach</h3>
                <p>
                  {selectedCoach === "sarah"
                    ? "Sarah Miller"
                    : selectedCoach === "mark"
                      ? "Mark Thompson"
                      : selectedCoach === "lisa"
                        ? "Lisa Chen"
                        : "Not selected"}
                </p>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  )
}
