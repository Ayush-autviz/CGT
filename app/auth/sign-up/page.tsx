"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation } from "@tanstack/react-query"
import { signUpUser } from "@/lib/ApiService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signUpSchema, type SignUpFormData } from "@/lib/validationSchemas"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({})

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log("Sign up successful:", data)
      // Show success toast
      toast.success("Sign Up Successful", {
        description: "Please check your email to verify your account.",
        duration: 3000,
      })
      router.push(`/auth/resend?email=${encodeURIComponent(formData.email)}`)
    },
    onError: (error: any) => {
      console.error("Sign up failed:", error)

      // Extract error message from response
      const errorMessage = error?.response?.data?.error || error.message || "Something went wrong. Please try again.";

      // Show error toast
      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name as keyof SignUpFormData]: value }))

    // Clear error for this field when user types
    if (errors[name as keyof SignUpFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))

    // Clear error for this field when user changes it
    if (errors.agreeTerms) {
      setErrors(prev => ({ ...prev, agreeTerms: undefined }))
    }
  }

  const validateForm = (): boolean => {
    try {
      signUpSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const formattedErrors: Partial<Record<keyof SignUpFormData, string>> = {}

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof SignUpFormData
          formattedErrors[path] = err.message
        })
      }

      setErrors(formattedErrors)
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Form has validation errors
      toast.error("Validation Error", {
        description: "Please correct the errors in the form.",
        duration: 5000,
      })
      return
    }

    console.log("Sign up data:", formData)
    mutation.mutate(formData)
  }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D] overflow-auto">
      <div className="flex flex-col justify-center md:flex-row w-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg space-y-4 md:space-y-6">
            <div className="text-center mb-3 md:mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Sign Up</h1>
              <p className="text-white mt-1 md:mt-2 font-semibold text-sm md:text-base">
                Please enter your details below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1 md:space-y-2">
                <label htmlFor="name" className="block font-semibold text-white text-sm md:text-base">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`bg-[#1E2634] rounded-[10px] px-4 md:px-8 py-3 md:py-4 border-[#323D50] text-white placeholder:text-gray-500 ${
                    errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 md:space-y-2">
                <label htmlFor="email" className="block font-semibold text-white text-sm md:text-base">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`bg-[#1E2634] rounded-[10px] px-4 md:px-8 py-3 md:py-4 border-[#323D50] text-white placeholder:text-gray-500 ${
                    errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 md:space-y-2">
                <label htmlFor="password" className="block font-semibold text-white text-sm md:text-base">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••"
                    className={`bg-[#1E2634] rounded-[10px] px-4 md:px-8 py-3 md:py-4 border-[#323D50] text-white placeholder:text-gray-500 pr-10 ${
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <div className="mt-1">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={handleCheckboxChange}
                    className={`border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 ${
                      errors.agreeTerms ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="terms" className="text-xs md:text-sm font-semibold text-[#A6A6A6]">
                    I agree with{" "}
                    <Link href="/terms" className="text-[#F6BE00] hover:underline">
                      Terms and Conditions
                    </Link>
                  </label>
                  {errors.agreeTerms && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>{errors.agreeTerms}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="bg-[#F6BE00] hover:bg-yellow-600 w-full text-black font-bold py-3 md:py-4 lg:py-5 rounded-md flex items-center justify-center"
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
                    Loading...
                  </span>
                ) : (
                  <>
                    Sign Up
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
              <p className="text-xs md:text-sm text-[#A6A6A6] font-semibold">
                I have an account.{" "}
                <Link href="/auth/login" className="text-[#F6BE00] hover:underline">
                  Sign In
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
