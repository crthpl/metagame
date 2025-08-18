import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toExternalLink(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('/#')) {
    return url
  }
  return `https://${url}`
}

export async function uploadFileWithSignedUrl(signedUrl: string, file: File): Promise<void> {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
}

export function canonicalUserProfilePictureUrl({ userId }: { userId: string }): string {
  const bucket = 'public-assets'
  const path = `profile_pictures/${userId}`
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set')
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
