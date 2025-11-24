import UrlShortenerForm from './components/UrlShortenerForm'
import UrlList from './components/UrlList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Link-AI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          AI-Powered URL Shortener with Smart Slug Generation
        </p>
        
        {/* URL Shortener Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <UrlShortenerForm />
        </div>

        {/* List of URLs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <UrlList />
        </div>
      </div>
    </main>
  )
}