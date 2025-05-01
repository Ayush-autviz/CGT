"use client"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 text-muted-foreground">
          <Image src="/emoji.svg" width={20} height={20} alt="Emoji" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none" align="start">
        <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" />
      </PopoverContent>
    </Popover>
  )
}
