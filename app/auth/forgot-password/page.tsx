"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { resetPasswordLink } from "@/lib/ApiService"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: resetPasswordLink,
    onSuccess: () => {
      toast.success("Reset Link Sent", {
        description: "A password reset link has been sent to your email.",
        duration: 3000,
      })
      router.push(`/auth/resendLink?email=${encodeURIComponent(email)}`)
    },
    onError: (error: any) => {
      console.error("Password reset request failed:", error)

      // Extract error message from response
      const errorMessage = error?.response?.data?.error || error.message || "Unable to send reset link. Please try again.";

      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(email)
  }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D] overflow-auto">
      <div className="flex flex-col justify-center md:flex-row w-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg space-y-4 md:space-y-6">
            <div className="text-center mb-3 md:mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Forgot Password</h1>
              <p className="mt-1 md:mt-2 text-white font-semibold text-sm md:text-base">
                Enter your email to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1 md:space-y-2">
                <label htmlFor="email" className="block font-semibold text-white text-sm md:text-base">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-[#1E2634] rounded-[10px] px-4 md:px-8 py-3 md:py-4 border-[#323D50] text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-bold py-3 md:py-4 lg:py-5 rounded-md flex items-center justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Reset Link
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 md:mt-5 text-center">
              <p className="text-[#A6A6A6] text-xs md:text-sm">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-[#F6BE00] hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>

            <div className="mt-4 md:mt-6 text-center text-xs text-[#A6A6A6]">
              Capital Growth Traders Ltd. Registered in Australia. Authorized and regulated by the Financial Conduct
              Authority.
            </div>
          </div>
        </div>

        {/* Right Side - Promo */}
        <div className="hidden md:flex md:w-1/2 justify-start items-center p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="bg-[#F3A82A] rounded-3xl p-3 md:p-4 lg:p-5">
              <div className="bg-black rounded-2xl overflow-hidden mb-3 md:mb-4">
                <Image src="/login.png" alt="AI Trading Robot" width={500} height={400} className="w-full" />
              </div>

              <div className="text-white">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
                  AI-Powered Trading with 5,000+ Smart Traders
                </h2>

                <div className="grid grid-cols-3 gap-2 md:gap-3 mt-3 md:mt-4">
                  <div className="bg-white rounded-xl py-2 md:py-3 text-center">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">98%</div>
                    <div className="text-xs text-yellow-500">Success Rate</div>
                  </div>
                  <div className="bg-white rounded-xl py-2 md:py-3 text-center">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">24/7</div>
                    <div className="text-xs text-yellow-500">Active Trading</div>
                  </div>
                  <div className="bg-white rounded-xl py-2 md:py-3 text-center">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500">5K+</div>
                    <div className="text-xs text-yellow-500">Active Users</div>
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
