import { NextResponse } from 'next/server'

export async function POST(_req: Request) {
  try {
    // Generate a unique token for the upload session
    const token = `${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Construct the upload URL with the token
    const upload_url = `/upload?token=${token}`

    return NextResponse.json({
      success: true,
      upload_url,
      token,
      message: "Upload URL generated successfully"
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