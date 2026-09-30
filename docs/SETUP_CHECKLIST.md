# Firebase & Firestore Setup Checklist

If migration is failing, follow these steps:

## ✅ Step 1: Firebase Project Created
- [ ] Go to https://console.firebase.google.com/
- [ ] Project "darshanwadke-portfolio" exists
- [ ] Project is active

## ✅ Step 2: Firestore Database Created
- [ ] In Firebase Console, go to **Firestore Database**
- [ ] Database should be created
- [ ] If not created:
  - Click **"Create Database"**
  - Select **"Start in test mode"** (for development)
  - Choose **us-central1** region
  - Click **"Create"**

## ✅ Step 3: Firestore Security Rules Set
- [ ] In Firestore, go to **"Rules"** tab
- [ ] Replace with these development rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

- [ ] Click **"Publish"**

## ✅ Step 4: Firebase Credentials in .env
- [ ] `.env` file exists in project root
- [ ] Contains all Firebase credentials:
  ```
  VITE_FIREBASE_API_KEY=AIzaSyABYIbYdLE7IIZU7qIj2toWARQvaXKD9C4
  VITE_FIREBASE_AUTH_DOMAIN=darshanwadke-portfolio.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=darshanwadke-portfolio
  VITE_FIREBASE_STORAGE_BUCKET=darshanwadke-portfolio.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=266834823634
  VITE_FIREBASE_APP_ID=1:266834823634:web:38f0972a9938ea09d3200b
  VITE_FIREBASE_MEASUREMENT_ID=G-RPFBN2F3K0
  ```

## ✅ Step 5: Network & Connection
- [ ] Computer has internet connection
- [ ] No VPN or firewall blocking Firebase
- [ ] Can access https://www.google.com

## ✅ Step 6: Run App
```bash
npm run dev
```

## 🔍 If Still Not Working

### Check 1: Browser Console Errors
1. Open your browser (localhost:3000)
2. Press **F12** to open DevTools
3. Look at **Console** tab
4. Check for errors about:
   - Firebase not loading
   - Missing credentials
   - Network errors

### Check 2: Firestore Rules
1. Go to Firebase Console
2. Firestore Database → Rules
3. Make sure rules were published (not just edited)

### Check 3: Test Connection
```javascript
// In browser console, test Firebase:
import { getProjects } from './src/services/projectService';
getProjects().then(p => console.log('Projects:', p));
```

### Check 4: Firestore Collections
1. Firebase Console → Firestore Database
2. Look for **"projects"** collection
3. Should see 0 documents (empty) initially
4. After migration, should have 8 documents

## 📝 Manual Workaround

If Firebase won't connect:

1. **Skip Migration** - Click away from modal
2. **Keep Using Local Data** - Portfolio still works with initial 8 projects
3. **Manual Setup Later** - Can add projects to Firebase anytime

## ✨ Success Signs

When properly connected:
- [ ] Migration modal appears on first load
- [ ] Can click "Start Migration"
- [ ] Projects upload successfully
- [ ] No timeout errors
- [ ] Can see projects in Firebase Console

---

**Need More Help?**
- Firebase Status: https://status.firebase.google.com/
- Firebase Docs: https://firebase.google.com/docs
- Check .env file has correct values (no extra spaces)
