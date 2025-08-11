import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Default to 'email' type if not specified
  const otpType = type || "email";

  if (!token_hash) {
    redirect("/auth/error?error=missing_token_hash");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type: otpType,
    token_hash,
  });

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  // Route based on the type parameter
  console.log(type);
  switch (type) {
    case "invite": 
    case "recovery":
      // These require password setup
      redirect("/profile/reset-password");
    case "signup":
    case "magiclink":
    case "email_change":
    case "email":
    default:
      // These go straight to home
      redirect("/");
  }
}
