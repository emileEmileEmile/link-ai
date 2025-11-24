import { NextRequest, NextResponse } from 'next/server'
import { generateSmartSlugs } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Generate AI slugs
    const slugs = await generateSmartSlugs(url)

    return NextResponse.json({ slugs })
  } catch (error) {
    console.error('Error in generate-slugs:', error)
    return NextResponse.json(
      { error: 'Failed to generate slugs' },
      { status: 500 }
    )
  }
}