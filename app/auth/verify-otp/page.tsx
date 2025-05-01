"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const mutation = useMutation({
    mutationFn: async (otpCode: string) => {
      // Replace with your actual API call
      return { success: true }
    },
    onSuccess: () => {
      router.push("/auth/reset-password")
    },
    onError: (error) => {
      console.error("OTP verification failed:", error)
    },
  })

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input if current input is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")
    if (otpCode.length === 6) {
      mutation.mutate(otpCode)
    }
  }

  const handleResendOTP = () => {
    // Implement resend OTP functionality
    console.log("Resend OTP")
  }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D]">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-12">
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center mb-5">
              <h1 className="text-3xl font-bold text-white">Verify OTP</h1>
              <p className="mt-2 text-white font-semibold">Enter the 6-digit code sent to your email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl bg-[#1E2634] rounded-[10px] border-[#323D50] text-white"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-[#F6BE00] hover:underline text-sm font-semibold"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-bold py-6 rounded-md flex items-center justify-center"
                disabled={otp.join("").length !== 6 || mutation.isPending}
              >
                {mutation.isPending ? "Verifying..." : "Verify OTP"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#A6A6A6]">
                <Link href="/auth/forgot-password" className="text-[#F6BE00] hover:underline">
                  Back to Forgot Password
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center text-xs text-[#A6A6A6]">
              Capital Growth Traders Ltd. Registered in London, UK. Authorized and regulated by the Financial Conduct
              Authority.
            </div>
          </div>
        </div>

        {/* Right Side - Promo */}
        <div className="hidden md:flex md:w-1/2 justify-start items-center p-12">
          <div className="w-full max-w-xl">
            <div className="bg-[#F3A82A] rounded-3xl p-6">
              <div className="bg-black rounded-2xl overflow-hidden mb-6">
                <Image src="/login.png" alt="AI Trading Robot" width={500} height={400} className="w-full" />
              </div>

              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">AI-Powered Trading with 5,000+ Smart Traders</h2>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-xl py-4 text-center">
                    <div className="text-4xl font-bold text-yellow-500 whitespace-nowrap">98%</div>
                    <div className="text-sm text-yellow-500 whitespace-nowrap">Success Rate</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-4xl font-bold text-yellow-500 whitespace-nowrap">24/7</div>
                    <div className="text-sm text-yellow-500 whitespace-nowrap">Active Trading</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-4xl font-bold text-yellow-500 whitespace-nowrap">5K+</div>
                    <div className="text-sm text-yellow-500 whitespace-nowrap">Active Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
