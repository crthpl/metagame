import { ArrowLeft, ArrowRightIcon, CheckCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function SignupSuccess({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; email?: string }>
}) {
  const { confirmed, email } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // For confirmed signups, we should have a user
  // For initial signups, we might not have a user yet (they need to confirm email)
  const isConfirmed = confirmed === 'true' || user?.email_confirmed_at

  // If this is a confirmed signup but no user, redirect to login
  if (isConfirmed && !user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="bg-card border-border-primary rounded-lg border p-6 text-center">
        <div className="mb-4">
          {isConfirmed ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          ) : (
            <Mail className="mx-auto h-12 w-12 text-blue-500" />
          )}
        </div>

        {isConfirmed ? (
          <>
            <h1 className="mb-4 text-2xl font-bold">Welcome to Metagame!</h1>

            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                Your account has been successfully confirmed and you&apos;re all
                set to join us at Metagame 2025!
              </p>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-center font-medium">
                  {user?.email || email}
                </p>
              </div>

              <p className="text-muted-foreground text-sm">
                You can now manage your profile, RSVP to sessions, and probably
                some other stuff.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Link href="/profile" className="btn btn-primary w-full">
                Manage Profile <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/schedule" className="btn btn-primary w-full">
                Browse Schedule <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-2xl font-bold">Check Your Email</h1>

            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                Thanks for signing up! We&apos;ve sent a confirmation email to:
              </p>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-center font-medium">
                  {user?.email || email}
                </p>
              </div>

              <p className="text-muted-foreground text-sm">
                Click the confirmation link in your email to activate your
                account.
              </p>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Didn&apos;t receive the email?</strong> Check your
                  spam folder or{' '}
                  <a
                    className="underline"
                    href="mailto:ricki.heicklen+metagame@gmail.com, briantsmiley42+metagame@gmail.com"
                  >
                    contact us
                  </a>{' '}
                  if you need help.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/" className="btn btn-primary w-full">
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
