import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, ArrowRightIcon, CheckCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SignupSuccess({ searchParams }: { searchParams: Promise<{ confirmed?: string, email?: string }> }) {
  const { confirmed, email } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // For confirmed signups, we should have a user
  // For initial signups, we might not have a user yet (they need to confirm email)
  const isConfirmed = confirmed === 'true' || user?.email_confirmed_at

  // If this is a confirmed signup but no user, redirect to login
  if (isConfirmed && !user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="bg-card rounded-lg border border-border-primary p-6 text-center">
        <div className="mb-4">
          {isConfirmed ? (
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          ) : (
            <Mail className="w-12 h-12 text-blue-500 mx-auto" />
          )}
        </div>
        
        {isConfirmed ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome to Metagame!</h1>
            
            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                Your account has been successfully confirmed and you&apos;re all set to join us at Metagame 2025!
              </p>
              
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium text-center">{user?.email || email}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                You can now manage your profile, RSVP to sessions, and probably some other stuff.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Link 
                href="/profile" 
                className="btn btn-primary w-full"
              >
                Manage Profile <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link 
                href="/schedule" 
                className="btn btn-primary w-full"
              >
                Browse Schedule <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
            
            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                Thanks for signing up! We&apos;ve sent a confirmation email to:
              </p>
              
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium text-center">{user?.email || email}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Click the confirmation link in your email to activate your account.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Didn&apos;t receive the email?</strong> Check your spam folder or <a className="underline" href="mailto:ricki.heicklen+metagame@gmail.com, briantsmiley42+metagame@gmail.com">contact us</a> if you need help.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/" 
                className="btn btn-primary w-full"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
