const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`

export async function askGrok(message, context = '') {
  try {
    const systemPrompt = `You are Nexus AI, a family assistant for the Miller household. You have access to all family data including:
- Family members: Sarah (Parent), David (Parent), Leo (10, Child), Maya (7, Child), Grandma Elena (Elder), Rosa (Staff/Housekeeper), James (Staff/Driver)
- Health records, prescriptions, medications
- Budget, expenses, grocery lists, pocket money
- Tasks, chores, calendar events
- Memories and family timeline
- Child tracking locations

Current context: ${context}

Always respond in a warm, helpful tone. Use the family data to give personalized answers. If asked about health, reference actual prescriptions and conditions. If asked about budget, reference actual spending data. Keep responses concise but informative. Format with bullet points when helpful.`

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\nUser message: ' + message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${err}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('Gemini API error:', error)
    return `I'm having trouble connecting right now. Please try again in a moment. (Error: ${error.message})`
  }
}
