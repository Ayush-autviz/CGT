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
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validationSchemas"

export default function ResetPasswordPage({ params }: { params: any }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  })
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  })
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password Reset Successful", {
        description: "Your password has been updated. Redirecting to login...",
        duration: 3000,
      })
      router.push("/auth/login")
    },
    onError: (error: any) => {
      console.error("Password reset failed:", error)
      toast.error("Password Reset Failed", {
        description: error.message || "Unable to reset password. Please try again.",
        duration: 5000,
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update password strength if password field is changed
    if (name === 'password') {
      const hasMinLength = value.length >= 8
      const hasUppercase = /[A-Z]/.test(value)
      const hasLowercase = /[a-z]/.test(value)
      const hasNumber = /[0-9]/.test(value)

      // Calculate score (0-4)
      const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length

      setPasswordStrength({
        score,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form using the schema
      const result = resetPasswordSchema.safeParse(formData);

      if (!result.success) {
        // Extract and display validation errors
        const errorMessages = result.error.errors.map(err => err.message).join(", ");
        toast.error("Validation Error", {
          description: errorMessages,
          duration: 5000,
        });
        return;
      }

      // If validation passes, submit the form
      mutation.mutate({ password: formData.password, token: params.id })
    } catch (error) {
      console.error("Unexpected error during validation:", error)
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
        duration: 5000,
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D] overflow-auto">
      <div className="flex flex-col justify-center md:flex-row w-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg space-y-4 md:space-y-6">
            <div className="text-center mb-3 md:mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Reset Password</h1>
              <p className="mt-1 md:mt-2 text-white font-semibold text-sm md:text-base">
                Create a new password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1 md:space-y-2">
                <label htmlFor="password" className="block font-semibold text-white text-sm md:text-base">
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
                    className="bg-[#1E2634] rounded-[10px] px-4 md:px-8 py-3 md:py-4 border-[#323D50] text-white placeholder:text-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                {/* Password strength indicator */}
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength:</span>
                    <span className="text-xs font-semibold">
                      {passwordStrength.score === 0 && "Very weak"}
                      {passwordStrength.score === 1 && "Weak"}
                      {passwordStrength.score === 2 && "Fair"}
                      {passwordStrength.score === 3 && "Good"}
                      {passwordStrength.score === 4 && "Strong"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score === 0 ? "w-0" :
                        passwordStrength.score === 1 ? "w-1/4 bg-red-500" :
                        passwordStrength.score === 2 ? "w-2/4 bg-orange-500" :
                        passwordStrength.score === 3 ? "w-3/4 bg-yellow-500" :
                        "w-full bg-green-500"
                      }`}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className={`flex items-center ${passwordStrength.hasMinLength ? "text-green-500" : "text-gray-500"}`}>
                      <span className="mr-1">{passwordStrength.hasMinLength ? "✓" : "○"}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasUppercase ? "text-green-500" : "text-gray-500"}`}>
                      <span className="mr-1">{passwordStrength.hasUppercase ? "✓" : "○"}</span>
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasLowercase ? "text-green-500" : "text-gray-500"}`}>
                      <span className="mr-1">{passwordStrength.hasLowercase ? "✓" : "○"}</span>
                      <span>Lowercase letter</span>
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasNumber ? "text-green-500" : "text-gray-500"}`}>
                      <span className="mr-1">{passwordStrength.hasNumber ? "✓" : "○"}</span>
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label htmlFor="confirmPassword" className="block font-semibold text-white text-sm md:text-base">
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
                    className="bg-[#1E2634] rounded-[10px] px-4 md:px-8 py-3 md:py-4 border-[#323D50] text-white placeholder:text-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2">
                    <div className={`flex items-center text-xs ${
                      formData.password === formData.confirmPassword ? "text-green-500" : "text-red-500"
                    }`}>
                      <span className="mr-1">
                        {formData.password === formData.confirmPassword ? "✓" : "✗"}
                      </span>
                      <span>
                        {formData.password === formData.confirmPassword
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-bold py-3 md:py-4 lg:py-5 rounded-md flex items-center justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Reset Password"}
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
              </Button>
            </form>

            <div className="mt-4 md:mt-5 text-center">
              <p className="text-[#A6A6A6] text-xs md:text-sm">
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
