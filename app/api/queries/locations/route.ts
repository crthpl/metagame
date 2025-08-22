import { LocationsResponseSchema } from './schema'
import { NextResponse } from 'next/server'

import { getOrderedScheduleLocations } from '@/app/actions/db/locations'

export async function GET() {
  try {
    const locations = await getOrderedScheduleLocations()

    // Validate the response data
    const validatedLocations = LocationsResponseSchema.parse(locations)

    return NextResponse.json(validatedLocations)
  } catch (error) {
    console.error('Error fetching locations:', error)

    // Return more detailed error information
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        error: 'Failed to fetch locations',
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
