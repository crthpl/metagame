"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { LockIcon, MailIcon, TicketIcon } from "lucide-react";
import { passwordSchema} from "@/lib/schemas/password";
import { signupByTicketCode } from "@/app/actions/db/tickets";

const signupSchema = z.object({
  email: z.email("Please enter a valid email address"),
  ticketCode: z.string().min(1, "Ticket code from purchase confirmation is required for signup").toUpperCase(),
  ...passwordSchema.shape,
});

type SignupFormData = z.infer<typeof signupSchema>;
type SignupErrors = Partial<
  Record<keyof SignupFormData, string | string[]>
> & {
  submit?: string;
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    ticketCode: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill form with URL parameters
  useEffect(() => {
    const email = searchParams.get("email");
    const ticketCode = searchParams.get("ticketCode");
    
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    if (ticketCode) {
      setFormData(prev => ({ ...prev, ticketCode: ticketCode.toUpperCase() }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === "ticketCode" ? value.toUpperCase() : value;
    
    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Clear errors when user starts typing
    if (errors[name as keyof SignupErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = signupSchema.parse(formData);
      
      await signupByTicketCode({
        email: validatedData.email,
        password: validatedData.password,
        ticketCode: validatedData.ticketCode,
      });

      // Redirect to home page on success
      router.push("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string | string[]> = {};

        // Group password errors to show all requirements
        const passwordErrors: string[] = [];

        error.issues.forEach((issue) => {
          if (issue.path[0] === "password") {
            passwordErrors.push(issue.message);
          } else if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });

        if (passwordErrors.length > 0) {
          fieldErrors.password = passwordErrors;
        }

        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 font-medium flex gap-1 items-center"
            >
              <MailIcon className="size-4" /> Email:{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="ticketCode"
              className="mb-1 font-medium flex gap-1 items-center"
            >
              <TicketIcon className="size-4" /> Ticket Code:{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="ticketCode"
              name="ticketCode"
              type="text"
              value={formData.ticketCode}
              onChange={handleInputChange}
              required
              placeholder="Enter your ticket code"
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 uppercase ${
                errors.ticketCode ? "border-red-500" : ""
              }`}
            />
            {errors.ticketCode && (
              <span className="text-red-500 text-xs mt-1">
                {errors.ticketCode}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium flex gap-1 items-center"
            >
              <LockIcon className="size-4" /> Password:{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <div className="text-xs text-gray-500 mt-1">
              Must be at least 10 characters with uppercase, lowercase, number,
              and symbol
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">
                {Array.isArray(errors.password) ? (
                  <ul className="list-disc list-inside">
                    {(errors.password as string[]).map(
                      (error: string, index: number) => (
                        <li key={index}>{error}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <span>{errors.password}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 font-medium flex gap-1 items-center"
            >
              <LockIcon className="size-4" /> Confirm Password:{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`rounded border p-2 dark:bg-gray-700 dark:border-gray-600 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
          </div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
