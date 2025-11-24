'use client'

import { useState } from 'react'

export default function UrlShortenerForm() {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGenerateSlugs = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL (include https://)')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate-slugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await response.json()
      
      if (data.slugs) {
        setAiSuggestions(data.slugs)
        setSelectedSlug(data.slugs[0]) // Auto-select first suggestion
      }
    } catch (err) {
      setError('Failed to generate slugs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShortUrl = async () => {
    const slugToUse = customSlug || selectedSlug

    if (!slugToUse) {
      setError('Please select or enter a slug')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/create-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          originalUrl: url, 
          slug: slugToUse 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Short URL created: ${window.location.origin}/${data.slug}`)
        // Reset form
        setUrl('')
        setCustomSlug('')
        setAiSuggestions([])
        setSelectedSlug('')
      } else {
        setError(data.error || 'Failed to create short URL')
      }
    } catch (err) {
      setError('Failed to create short URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Long URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url/that/needs/shortening"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Generate AI Slugs Button */}
      <button
        onClick={handleGenerateSlugs}
        disabled={loading || !url}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? '🤖 Generating AI Suggestions...' : '✨ Generate Smart Slugs with AI'}
      </button>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            AI-Generated Suggestions (pick one):
          </label>
          <div className="grid grid-cols-1 gap-2">
            {aiSuggestions.map((slug) => (
              <button
                key={slug}
                onClick={() => setSelectedSlug(slug)}
                className={`px-4 py-3 border-2 rounded-lg text-left transition-all ${
                  selectedSlug === slug
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-mono">{window.location.origin}/{slug}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Slug Input */}
      {aiSuggestions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Enter Custom Slug (optional):
          </label>
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
              {window.location.origin}/
            </span>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="my-custom-slug"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Create Short URL Button */}
      {aiSuggestions.length > 0 && (
        <button
          onClick={handleCreateShortUrl}
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Creating...' : '🚀 Create Short URL'}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}
    </div>
  )
}