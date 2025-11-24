import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateDescription } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { originalUrl, slug } = await request.json()

    if (!originalUrl || !slug) {
      return NextResponse.json(
        { error: 'URL and slug are required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(originalUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Validate slug format (only lowercase letters, numbers, hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('urls')
      .select('id')
      .eq('short_slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This slug is already taken. Please choose another.' },
        { status: 409 }
      )
    }

    // Generate AI description
    const description = await generateDescription(originalUrl)

    // Insert into database
    const { data, error } = await supabase
      .from('urls')
      .insert({
        original_url: originalUrl,
        short_slug: slug,
        ai_description: description,
        clicks: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create short URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      slug: data.short_slug,
      description: data.ai_description 
    })
  } catch (error) {
    console.error('Error in create-url:', error)
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    )
  }
}