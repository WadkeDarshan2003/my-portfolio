import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

const PORT = 3001;

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Proxy server running',
    endpoints: [
      'POST /api/chat - Send chat message',
      'GET /api/test - Test API configuration'
    ]
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Try different env variable names
    const apiKey = process.env.VITE_OPENAI_API_KEY || 
                   process.env.OPENAI_API_KEY ||
                   process.env.OPENROUTER_API_KEY ||
                   process.env.VITE_TOGETHER_API_KEY;

    console.log('📝 Received message:', message);
    console.log('🔑 API Key available:', !!apiKey);

    if (!apiKey) {
      console.error('❌ No API key found in environment');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('🚀 Calling OpenRouter API...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3001',
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

    console.log('📊 OpenAI Response status:', response.status);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error;
      
      if (contentType?.includes('application/json')) {
        error = await response.json();
      } else {
        const text = await response.text();
        error = { message: text || `HTTP ${response.status}` };
      }
      
      console.error('❌ OpenRouter API error:', error);
      return res.status(response.status).json(error);
    }

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('❌ Invalid response format. Expected JSON, got:', text.substring(0, 200));
      return res.status(500).json({ error: 'Invalid API response format' });
    }
    
    console.log('✅ Response generated successfully');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Proxy server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    const errorStack = error instanceof Error ? error.stack : 'Unknown';
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorStack
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`✅ Also accessible at http://127.0.0.1:${PORT}`);
});

// Test endpoint to verify API key
app.get('/api/test', async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY ||
                   process.env.OPENAI_API_KEY ||
                   process.env.VITE_OPENAI_API_KEY;
    console.log('🧪 Testing API configuration...');
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key starts with:', apiKey?.substring(0, 10) + '...');
    
    if (!apiKey) {
      return res.json({ error: 'No API key configured' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': `http://localhost:${PORT}`,
        'X-Title': 'Portfolio Chat'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 50
      })
    });

    console.log('📊 API Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('📊 Response body:', text.substring(0, 500));
    
    res.json({
      status: response.status,
      ok: response.ok,
      responseLength: text.length,
      preview: text.substring(0, 200)
    });
  } catch (error) {
    console.error('🧪 Test error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Test failed' });
  }
});
