import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Use req to get any metadata from request body
    const body = await req.json()

    const token = `${Date.now()}_${Math.random().toString(36).substring(7)}`
    const upload_url = `/upload?token=${token}`
    
    return NextResponse.json({
      success: true,
      upload_url,
      token,
      message: "Upload URL generated successfully",
      metadata: body  // Include any metadata from the request
    })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate upload URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
