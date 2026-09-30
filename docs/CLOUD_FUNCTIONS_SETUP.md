# Firebase Cloud Functions Setup Guide

This portfolio now uses **Firebase Cloud Functions** to handle AI chat requests. This eliminates the need for a separate Express server and scales automatically.

## Prerequisites

1. **Firebase Project created** - You already have this
2. **Firebase CLI installed** - If not, run:
   ```bash
   npm install -g firebase-tools
   ```
3. **OpenRouter API Key** - You have this in your `.env`

## Local Development

### 1. Install Dependencies
```bash
npm install
cd functions
npm install
cd ..
```

### 2. Start Local Emulators (Optional)
To test Cloud Functions locally:
```bash
firebase emulators:start
```

Then uncomment in `src/config/firebase.ts`:
```typescript
connectFunctionsEmulator(functions, 'localhost', 5001);
```

### 3. Run Development Servers
```bash
npm run dev
```

The chat will call the local emulator (no server.mjs needed).

## Production Deployment

### Step 1: Set OpenRouter API Key
```bash
firebase functions:config:set openrouter.api_key="YOUR_API_KEY_HERE"
```

Or use Firebase Secrets (recommended):
```bash
firebase functions:secrets:set OPENROUTER_API_KEY
# Paste your API key when prompted
```

### Step 2: Deploy Everything
```bash
npm run build
firebase deploy
```

This deploys:
- ✅ React frontend to Firebase Hosting
- ✅ Cloud Function to handle chat requests
- ✅ Firestore rules
- ✅ Storage rules

### Step 3: Verify Deployment
After deployment, visit your Firebase Hosting URL (e.g., `https://your-project-id.web.app`) and test the chat.

## File Structure

```
functions/
├── package.json          # Function dependencies
└── index.js             # Chat Cloud Function logic

src/
├── config/firebase.ts   # Firebase SDK config
└── services/
    └── openclawService.ts  # Updated to use Cloud Function

firebase.json           # Added functions configuration
```

## How It Works

```
React Client
    ↓
Firebase SDK (httpsCallable)
    ↓
Firebase Cloud Function
    ↓
OpenRouter API
    ↓
Response back to React Client
```

**Benefits:**
- ✅ No separate server to manage
- ✅ Automatic scaling
- ✅ CORS handled automatically
- ✅ Works in production immediately
- ✅ Integrates with your existing Firebase setup

## Troubleshooting

### "Function not found" error
- Make sure you deployed with `firebase deploy`
- Check that the function name is `chat` (not `Chat`)

### "API key not configured"
- Set the API key using Firebase Secrets (recommended)
- Or set environment config: `firebase functions:config:set openrouter.api_key="..."`

### CORS errors in browser
- Cloud Functions handle CORS automatically - no extra setup needed

### Want to keep local Express server?
- The old `server.mjs` still works locally
- Update `.env` and restart `npm run server`
- Service will try Cloud Function first, falls back to proxy server

## Next Steps

1. Install dependencies: `npm install && npm install --prefix functions`
2. Test locally with emulators
3. Deploy: `npm run build && firebase deploy`
4. Update your domain in `functions/index.js` HTTP-Referer header
