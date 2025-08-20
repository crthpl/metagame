import { getAllSessions } from "@/app/actions/db/sessions"
import { NextResponse } from "next/server"
import { SessionsResponseSchema } from "./schema"

export async function GET() {
  try {
    const sessions = await getAllSessions()
    
    // Validate the response data
    const validatedSessions = SessionsResponseSchema.parse(sessions)
    
    return NextResponse.json(validatedSessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch sessions',
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
