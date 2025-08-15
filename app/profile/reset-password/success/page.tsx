import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-600 rounded-full p-3 mb-2">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Password Changed!</h1>
          <p className="text-lg text-gray-300 mb-4">
            Your password has been updated successfully.
          </p>
          <div className="flex gap-4">
              <Link
                href="/profile"
                className={buttonVariants({ variant: 'outline' })}
              >
                Go to Profile
              </Link>
              <Link href="/" className={buttonVariants({ variant: 'outline' })}>
                Go to Home
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
