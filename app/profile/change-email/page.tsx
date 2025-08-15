'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { AuthError } from '@supabase/supabase-js'

export default function ChangeEmail() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.newEmail !== formData.confirmEmail) {
      toast.error('Email addresses do not match')
      return
    }

    if (!formData.newEmail || !formData.confirmEmail || !formData.currentPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.newEmail === formData.confirmEmail) {
      setIsLoading(true)
      
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({
          email: formData.newEmail,
        })
        if (error) throw error
        toast.success('Email change initiated! You will need to confirm the change by clicking a link in both your old and new email.', {duration: 10000})
        router.push('/profile')
      } catch (error) {
        console.error('Error changing email:', error)
        toast.error(error instanceof AuthError ? error.message : 'Failed to change email')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Link 
          href="/profile" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>

      <div className="bg-card rounded-lg border border-border-primary p-6">
        <h1 className="text-2xl font-bold mb-6">Change Email</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newEmail" className="block text-sm font-medium mb-2">
              New Email Address
            </label>
            <Input
              id="newEmail"
              type="email"
              placeholder="Enter new email address"
              value={formData.newEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, newEmail: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmEmail" className="block text-sm font-medium mb-2">
              Confirm New Email Address
            </label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="Confirm new email address"
              value={formData.confirmEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmEmail: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Changing Email...' : 'Change Email'}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            After submitting, you will receive a confirmation email at your current and new email addresses. 
            Click the links in each email to confirm the email change.
          </p>
        </div>
      </div>
    </div>
  )
}
