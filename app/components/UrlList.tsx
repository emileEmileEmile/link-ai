import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function UrlList() {
  const { data: urls, error } = await supabase
    .from('urls')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Error loading URLs
      </div>
    )
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-gray-500 text-center p-8">
        No shortened URLs yet. Create one above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Your Shortened URLs
      </h2>
      
      <div className="space-y-3">
        {urls.map((url) => (
          <div 
            key={url.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/${url.short_slug}`}
                target="_blank"
                className="text-blue-600 hover:text-blue-800 font-mono font-medium flex items-center gap-2"
              >
                /{url.short_slug}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              
              <span className="flex items-center gap-2 text-gray-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {url.clicks} clicks
              </span>
            </div>

            {url.ai_description && (
              <p className="text-gray-600 text-sm mb-2">
                {url.ai_description}
              </p>
            )}

            <div className="flex items-start gap-2 text-xs">
              <span className="text-gray-500 font-medium">→</span>
              <a
                href={url.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 truncate flex-1"
              >
                {url.original_url}
              </a>
            </div>

            <div className="text-xs text-gray-400 mt-2">
              Created {new Date(url.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}