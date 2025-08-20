import { getCurrentUserRsvps } from "@/app/actions/db/sessions"
import { NextResponse } from "next/server"
import { RsvpsResponseSchema } from "./schema"

export async function GET() {
  try {
    const rsvps = await getCurrentUserRsvps()
    
    // Validate the response data
    const validatedRsvps = RsvpsResponseSchema.parse(rsvps)
    
    return NextResponse.json(validatedRsvps)
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch RSVPs',
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
