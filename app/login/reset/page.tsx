'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { z } from 'zod'
import { MailIcon } from 'lucide-react'

const resetSchema = z.object({
  email: z.email('Please enter a valid email'),
})

type ResetErrors = Partial<Record<keyof z.infer<typeof resetSchema>, string>> & {
  submit?: string
}

export default function ResetPasswordRequestPage() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const [errors, setErrors] = useState<ResetErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (errors[name as keyof ResetErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = resetSchema.safeParse(formData)
      if (!validatedData.success) {
        setErrors({ submit: 'Please enter a valid email' })
        return
      }
      
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(
        validatedData.data.email,
        {
          redirectTo: `${window.location.origin}/auth/confirm?type=recovery`,
        }
      )

      if (error) {
        setErrors({ submit: error.message })
      } else {
        setIsSuccess(true)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach(issue => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="text-gray-300 mb-6">
            We've sent a password reset link to {formData.email}. 
            Please check your email and click the link to reset your password.
          </p>
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <p className="text-gray-300 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium flex gap-1 items-center">
              <MailIcon className="size-4" />Email: <span className="text-red-500">*</span>
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email}</span>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link
              href="/login"
              className="flex-1 text-center bg-gray-600 text-white rounded py-2 px-4 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}