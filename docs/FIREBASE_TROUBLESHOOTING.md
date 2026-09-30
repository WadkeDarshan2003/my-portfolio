# 🔥 Firebase Connection Troubleshooting

## Error: "Firebase request timeout"

This means your app cannot connect to Firebase. Follow these steps:

### ✅ Step 1: Check if Firestore Database Exists

1. Go to https://console.firebase.google.com/
2. Select project: **darshanwadke-portfolio**
3. Click **Firestore Database** in left menu
4. **If you see "Get Started":**
   - Click "Create Database"
   - Choose "Start in test mode"
   - Select region (us-central or closest to you)
   - Click "Enable"
   - **Wait 30-60 seconds for database to provision**

### ✅ Step 2: Set Security Rules to Test Mode

1. In Firestore Database, click **Rules** tab
2. Replace with these rules:
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
3. Click **Publish**
4. **Wait 10-20 seconds for rules to propagate**

### ✅ Step 3: Verify Firebase Config

Open browser console (F12) and run:
```javascript
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
```

Should show:
- API Key: `AIzaSyABYIbYdLE7IIZU7qIj2toWARQvaXKD9C4`
- Project ID: `darshanwadke-portfolio`

If `undefined`, restart dev server: `npm run dev`

### ✅ Step 4: Test Connection

In browser console (F12), run:
```javascript
import { testFirebaseConnection } from './src/services/firebaseTest';
testFirebaseConnection().then(result => console.log(result));
```

**Expected output:**
```
✅ Firebase connected successfully!
Found 0 documents in projects collection
```

**If you see errors:**
- `permission-denied` → Check security rules (Step 2)
- `unavailable` → Check internet/VPN
- `not-found` → Database not created (Step 1)

### ✅ Step 5: Check Network

1. **Disable VPN** if using one
2. **Check firewall** isn't blocking:
   - `firestore.googleapis.com`
   - `firebase.googleapis.com`
3. **Test internet:** Can you access https://www.google.com ?

### ✅ Step 6: Wait for Firestore Initialization

If you JUST created the database:
1. Wait **1-2 minutes**
2. Refresh browser (F5)
3. Try migration again

### 🔄 Quick Test Commands

In browser console (F12):

**Test read:**
```javascript
import { getDocs, collection } from 'firebase/firestore';
import { db } from './src/config/firebase';
getDocs(collection(db, 'projects')).then(snap => 
  console.log('Projects:', snap.size)
);
```

**Test write:**
```javascript
import { addDoc, collection } from 'firebase/firestore';
import { db } from './src/config/firebase';
addDoc(collection(db, 'test'), { hello: 'world' }).then(doc => 
  console.log('Created:', doc.id)
);
```

### 🎯 Common Solutions

| Problem | Solution |
|---------|----------|
| "Permission denied" | Enable test mode rules |
| "Timeout" | Wait for DB creation, check internet |
| "Not found" | Create Firestore database |
| "Unavailable" | Disable VPN, check firewall |
| Rules not working | Wait 30 seconds, hard refresh (Ctrl+Shift+R) |

### 📊 Firebase Status

Check if Firebase is down:
- https://status.firebase.google.com/

### 🆘 Still Not Working?

1. **Skip Firebase for now** - Portfolio works with local data
2. Click away from migration modal
3. All features work except cloud sync
4. You can set up Firebase later

### ✨ Success Checklist

- [ ] Firestore database created in Firebase Console
- [ ] Security rules set to test mode
- [ ] Rules published and waited 30 seconds
- [ ] Can see "projects" collection (even if empty)
- [ ] `testFirebaseConnection()` returns success
- [ ] No VPN/firewall blocking Firebase

---

**Once all green, refresh browser and try migration again!**
