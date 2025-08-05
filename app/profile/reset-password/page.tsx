"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { LockIcon } from "lucide-react";
import { passwordSchema, type PasswordErrors } from "@/lib/schemas/password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name as keyof PasswordErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = passwordSchema.parse(formData);
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: validatedData.password,
      });

      if (error) {
        setErrors({ submit: error.message });
      } else {
        router.push("/");
      }
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-dark-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Set Your Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium flex gap-1 items-center"
            >
              <LockIcon className="size-4" /> New Password:{" "}
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
            {isLoading ? "Setting password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
