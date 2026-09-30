# Firebase Setup Guide

This portfolio is now connected to Firebase for real-time data management!

## 🚀 Quick Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name (e.g., "My Portfolio")
4. Accept Firebase terms and create the project

### 2. Register Your Web App
1. In your Firebase project, click the Web icon (`</>`)
2. Register your app with a nickname (e.g., "portfolio-web")
3. Copy the Firebase configuration

### 3. Add Credentials to .env
Edit `.env` file in your project root and paste your credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 4. Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in production mode** or **test mode** (use test for development)
4. Select your region and create

### 5. Set Firestore Security Rules (for test mode)
1. Go to **Firestore Database** → **Rules**
2. For development/testing, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ For development only!
    }
  }
}
```

3. For production, use proper authentication and security rules

### 6. Test Your Setup
Run your development server:
```bash
npm run dev
```

If Firebase loads correctly, you should see:
- Projects loading from Firebase
- Initial projects seeded if database is empty
- Admin panel saving changes to Firebase in real-time

## 📁 Project Structure

```
src/
├── config/
│   └── firebase.ts           # Firebase initialization
├── services/
│   └── projectService.ts     # Firebase CRUD operations
├── components/
│   ├── AdminPanel.tsx        # CMS with Firebase sync
│   └── ...
└── types.ts                  # TypeScript interfaces
```

## 🔧 Available Functions

### projectService.ts

```typescript
// Get all projects
getProjects(): Promise<Project[]>

// Add new project
addProject(project: Omit<Project, 'id'>): Promise<string>

// Update project
updateProject(projectId: string, updates: Partial<Project>): Promise<boolean>

// Delete project
deleteProject(projectId: string): Promise<boolean>
```

## 🔐 Security Rules for Production

When deploying, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      // Public read access
      allow read: if true;
      
      // Admin-only write access
      allow write: if request.auth != null && request.auth.uid == '[YOUR_ADMIN_UID]';
    }
  }
}
```

## 📊 Firestore Collection Structure

Your `projects` collection will contain documents like:

```json
{
  "title": "Project Name",
  "description": "Project description",
  "technologies": ["React", "TypeScript"],
  "status": "published",
  "createdAt": "2024-01-23T...",
  "updatedAt": "2024-01-23T...",
  ...
}
```

## 🔄 Using Firebase Emulator (Optional)

For local development without hitting Firebase servers:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Uncomment emulator code in `src/config/firebase.ts`:
```typescript
if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

3. Start emulator:
```bash
firebase emulators:start
```

## 🚨 Troubleshooting

### "Missing or insufficient permissions"
- Check your Firestore security rules
- For development, use the test mode rules above
- Ensure `.env` variables are correctly set

### "Cannot find module 'firebase'"
```bash
npm install firebase
```

### Projects not loading
1. Check browser console for errors
2. Verify `.env` file has correct credentials
3. Confirm Firestore Database is created and enabled
4. Check Firestore security rules allow read access

### Changes not syncing to Firebase
- Verify you have write permissions in Firestore rules
- Check Admin panel error messages
- Try refreshing the page

## 📝 Next Steps

1. **Setup Authentication**: Add Google/GitHub sign-in for admin access
2. **Storage**: Upload project images to Firebase Storage
3. **Hosting**: Deploy to Firebase Hosting
4. **Analytics**: Enable Firebase Analytics
5. **Database Backup**: Setup automatic backups in Firebase Console

## 🔗 Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Database Guide](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI Docs](https://firebase.google.com/docs/cli)

---

**Your portfolio is now powered by Firebase! 🎉**
