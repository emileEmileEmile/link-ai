import { supabase } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = await params

  // Look up the URL in the database
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('short_slug', slug)
    .single()

  // If not found, show 404
  if (error || !urlData) {
    notFound()
  }

  // Increment click count
  await supabase
    .from('urls')
    .update({ clicks: urlData.clicks + 1 })
    .eq('id', urlData.id)

  // Track the click in analytics
  await supabase
    .from('clicks')
    .insert({
      url_id: urlData.id,
      user_agent: 'browser',
      referrer: 'direct'
    })

  // Redirect to the original URL
  redirect(urlData.original_url)
}