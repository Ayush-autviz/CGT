"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage({ params }: { params: any }) {
  const router = useRouter()
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`https://lwj8k3bb-5000.inc1.devtunnels.ms/api/auth/verify/${params.token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: params.token })
        })
    
        if (response.ok) {
          setVerificationState("success")
        } else {
          const errorData = await response.json()
          setErrorMessage(errorData.message || "Verification failed. Please try again.")
          setVerificationState("error")
        }
      } catch (error) {
        setErrorMessage("An error occurred during verification. Please try again later.")
        setVerificationState("error")
      }
    }
    
    verifyEmail()
  }, [params.token])

  const handleRedirectToLogin = () => {
    router.push("/auth/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] p-4 overflow-auto">
      <Card className="w-full max-w-md border-0 bg-[#1E293B] text-white shadow-xl">
        <CardHeader className="text-center py-3 md:py-4">
          <CardTitle className="text-xl md:text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription className="text-[#A4A4A4] text-sm md:text-base">
            {verificationState === "loading" && "Verifying your email address..."}
            {verificationState === "success" && "Your email has been verified!"}
            {verificationState === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-4 md:py-5">
          {verificationState === "loading" && (
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <Loader2 className="h-12 w-12 md:h-14 md:w-14 animate-spin text-amber-500" />
              <p className="text-center text-sm md:text-base text-[#A4A4A4]">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {verificationState === "success" && (
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <CheckCircle className="h-12 w-12 md:h-14 md:w-14 text-green-500" />
              <div className="text-center">
                <p className="text-base md:text-lg font-medium">Verification Successful!</p>
                <p className="mt-1 md:mt-2 text-sm md:text-base text-[#A4A4A4]">
                  Your email has been verified successfully. You can now log in to your account.
                </p>
              </div>
            </div>
          )}

          {verificationState === "error" && (
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <XCircle className="h-12 w-12 md:h-14 md:w-14 text-red-500" />
              <div className="text-center">
                <p className="text-base md:text-lg font-medium">Verification Failed</p>
                <p className="mt-1 md:mt-2 text-sm md:text-base text-[#A4A4A4]">{errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="py-3 md:py-4">
          <Button
            onClick={handleRedirectToLogin}
            className="w-full bg-amber-500 text-black hover:bg-amber-600 py-2 md:py-3"
            disabled={verificationState === "loading"}
          >
            {verificationState === "success" ? "Proceed to Login" : "Back to Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
