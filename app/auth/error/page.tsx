"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  return (
    <p className="text-gray-300 mb-6">
      {error || "An error occurred during authentication. Please try again."}
    </p>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="size-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <Suspense fallback={
          <p className="text-gray-300 mb-6">
            An error occurred during authentication. Please try again.
          </p>
        }>
          <ErrorMessage />
        </Suspense>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-600 text-white rounded py-2 px-4 hover:bg-gray-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
