import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const API_URL = process.env.NEXT_PUBLIC_VALIDATION_API_URL || ''
    const API_KEY = process.env.NEXT_PUBLIC_VALIDATION_API_KEY || ''

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-Key': API_KEY,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || data.error || 'Error validating file',
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in validate API route:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
