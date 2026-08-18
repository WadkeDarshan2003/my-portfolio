const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get API key from environment - check multiple sources
const getApiKey = () => {
  // Try environment variable first (Firebase Secret or local env)
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }

  const runtimeConfigKey = functions.config()?.openrouter?.api_key;
  if (runtimeConfigKey) {
    return runtimeConfigKey;
  }
  
  // Try from .env.local for local emulator
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  
  return null;
};

// Chat Cloud Function
exports.chat = functions
  .runWith({ secrets: ['OPENROUTER_API_KEY'] })
  .https.onCall(async (data, context) => {
  try {
    const { message } = data;

    if (!message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Message is required'
      );
    }

    const apiKey = getApiKey();

    if (!apiKey) {
      console.error('❌ No API key configured');
      throw new functions.https.HttpsError(
        'internal',
        'API key not configured - contact administrator'
      );
    }

    console.log('📝 Received message:', message);
    console.log('🚀 Calling OpenRouter API...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://darshanwadke-portfolio.web.app',
        'X-Title': 'Portfolio Chat'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful portfolio assistant. Answer concisely and professionally in under 100 words.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    console.log('📊 OpenRouter Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(async () => {
        const text = await response.text().catch(() => '');
        return { error: { message: text || `HTTP ${response.status}` } };
      });
      console.error('❌ OpenRouter API error:', error);
      throw new functions.https.HttpsError(
        'internal',
        `OpenRouter API error: ${error.error?.message || 'Unknown error'}`
      );
    }

    const data_response = await response.json();
    const reply = data_response.choices?.[0]?.message?.content;

    if (!reply) {
      throw new functions.https.HttpsError(
        'internal',
        'No response content from API'
      );
    }

    console.log('✅ Response generated successfully');
    return { reply };
  } catch (error) {
    console.error('❌ Function error:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Internal server error'
    );
  }
});
