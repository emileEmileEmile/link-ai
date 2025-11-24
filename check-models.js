const { GoogleGenerativeAI } = require('@google/generative-ai')

const API_KEY = 'AIzaSyBaZ6rYgSZ3h1yzoXxh_2LSmh5NVbvVcgU' // Your full key

const genAI = new GoogleGenerativeAI(API_KEY)

async function testModels() {
  console.log('🔍 Testing Gemini 2.0 models...\n')
  
  const modelsToTry = [
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash-thinking-exp-1219',
    'gemini-2.0-flash',
    'gemini-exp-1206',
    'gemini-exp-1121'
  ]
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`)
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent('Say hi in 2 words')
      const text = result.response.text()
      console.log(`✅ ${modelName} WORKS! Response: ${text}\n`)
      return modelName
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message.substring(0, 60)}...\n`)
    }
  }
  
  console.log('❌ None worked')
}

testModels()