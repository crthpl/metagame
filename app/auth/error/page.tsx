"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <p className="mb-6 text-gray-300">
      {error || "An error occurred during authentication. Please try again."}
    </p>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="bg-dark-400 w-full max-w-md rounded-lg p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="size-12 text-red-500" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">Authentication Error</h1>
        <Suspense
          fallback={
            <p className="mb-6 text-gray-300">
              An error occurred during authentication. Please try again.
            </p>
          }
        >
          <ErrorMessage />
        </Suspense>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="block w-full rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
