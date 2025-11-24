import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateSmartSlugs(url: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const prompt = `Given this URL: ${url}
    
Generate 3 short, memorable, SEO-friendly URL slugs (2-4 words each, separated by hyphens).
Return ONLY the 3 slugs, one per line, with no additional text or explanation.

Example format:
ai-breakthrough-2024
latest-tech-news
machine-learning-guide`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Split by newlines and clean up
    const slugs = response
      .split('\n')
      .map(slug => slug.trim().toLowerCase())
      .filter(slug => slug.length > 0)
      .slice(0, 3) // Take only first 3
    
    return slugs.length === 3 ? slugs : ['ai-link', 'smart-url', 'quick-link']
  } catch (error) {
    console.error('Error generating slugs:', error)
    // Fallback slugs if API fails
    return ['smart-link', 'ai-url', 'quick-link']
  }
}

export async function generateDescription(url: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const prompt = `Generate a brief 1-sentence description (max 100 characters) for this URL: ${url}
    
Return ONLY the description with no additional text.`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Error generating description:', error)
    return 'A shortened link'
  }
}