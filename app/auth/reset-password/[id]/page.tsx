"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { resetPassword } from "@/lib/ApiService"
import { toast } from "sonner"

export default function ResetPasswordPage({ params }: { params: any }) {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
    })
    const router = useRouter()
  
    const mutation = useMutation({
      mutationFn: resetPassword,
      onSuccess: () => {
        // Show success toast
        toast.success("Password Reset Successful", {
          description: "Your password has been updated. Redirecting to login...",
          duration: 3000,
        })
        router.push("/auth/login")
      },
      onError: (error: any) => {
        console.error("Password reset failed:", error)
        // Show error toast
        toast.error("Password Reset Failed", {
          description: error.message || "Unable to reset password. Please try again.",
          duration: 5000,
        })
      },
    })
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
  
      if (formData.password.length < 8) {
        toast.error("Invalid Password", {
          description: "Password must be at least 8 characters long.",
          duration: 5000,
        })
        return
      }
  
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords Do Not Match", {
          description: "Please ensure both passwords are identical.",
          duration: 5000,
        })
        return
      }
  
      mutation.mutate({ password: formData.password, token: params.id })
    }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D]">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-12">
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center mb-5">
              <h1 className="text-3xl font-bold text-white">Reset Password</h1>
              <p className="mt-2 text-white font-semibold">Create a new password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block font-semibold text-white">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="bg-[#1E2634] rounded-[10px] px-8 py-5 border-[#323D50] text-white placeholder:text-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block font-semibold text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="bg-[#1E2634] rounded-[10px] px-8 py-5 border-[#323D50] text-white placeholder:text-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

              <Button
                type="submit"
                className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-bold py-6 rounded-md flex items-center justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Reset Password"}
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
                <Link href="/auth/login" className="text-[#F6BE00] hover:underline">
                  Back to Login
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
