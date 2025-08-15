import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EmailChangeSuccess({ searchParams }: { searchParams: Promise<{ old_email?: string, new_email?: string }> }) {
  const { old_email, new_email } = await searchParams

  if (!old_email || !new_email) {
    redirect('/profile')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isEmailChangeComplete = user.email === new_email

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

      <div className="bg-card rounded-lg border border-border-primary p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        </div>
        
        {isEmailChangeComplete ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Email Changed Successfully!</h1>
            
            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                Your email address has been successfully updated to:
              </p>
              
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium text-center">{new_email}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                You can now use your new email address to sign in to your account.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Email Change Initiated</h1>
            
            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                You&apos;ve partially completed your email change. Once you&apos;ve clicked the link in both your old and new email, the change will be finalized.
              </p>
              
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div>
                  <span className="font-medium">Current email:</span>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <span className="font-medium">New email:</span>
                  <p className="text-sm text-muted-foreground">{new_email}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Check both email addresses for confirmation links. Click the links in each email 
                to complete your email change. The change will be finalized once both emails are verified.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
