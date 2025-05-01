import { ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const features = [
  {
    title: "Trading Q&A",
    description: "Get instant answers to your trading questions and market analysis",
    icon: ArrowRight,
  },
  {
    title: "Document Analysis",
    description: "Upload PDFs or documents for AI-powered summery and insights",
    icon: ArrowRight,
  },
  {
    title: "Chat Validation",
    description: "Upload chart images for pattern recognition and setup validation",
    icon: ArrowRight,
  },
  {
    title: "Trading Strategy",
    description: "Get customized trading advice based on your style and goals",
    icon: ArrowRight,
  },
]

export function Features() {
  return (
    <div className="space-y-4 h-full p-6 bg-[#1E293B]">
      <h2 className="text-xl text-white w-[70%] font-bold">What this AI Chatbot Can Help you With</h2>
      <div className="space-y-4">
        {features.map((feature) => (
          <Card key={feature.title} className="cursor-pointer bg-[#1e2738] transition-all hover:bg-[#2a3548]">
            <CardContent className="flex items-center justify-between ">
              <div className="space-y-1">
                <div className="flex flex-row justify-between items-center mb-5">
                <h3 className="font-semibold text-md text-white">{feature.title}</h3>
                <Image src="/Arrow.svg" className="w-5 h-5" height={100} width={100} alt={feature.title} />
                </div>
                <p className="text-sm text-[#A4A4A4]">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
