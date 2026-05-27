# Database Migration Guide

This guide walks you through migrating your portfolio projects from local storage to Firebase Firestore.

## 🚀 Quick Start

### Step 1: Verify Firebase Configuration
Ensure your `.env` file has all Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyABYIbYdLE7IIZU7qIj2toWARQvaXKD9C4
VITE_FIREBASE_AUTH_DOMAIN=darshanwadke-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=darshanwadke-portfolio
VITE_FIREBASE_STORAGE_BUCKET=darshanwadke-portfolio.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=266834823634
VITE_FIREBASE_APP_ID=1:266834823634:web:38f0972a9938ea09d3200b
VITE_FIREBASE_MEASUREMENT_ID=G-RPFBN2F3K0
```

### Step 2: Set Up Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select "darshanwadke-portfolio" project
3. Navigate to **Firestore Database**
4. If not created:
   - Click **Create Database**
   - Select **Start in test mode** (for development)
   - Choose **us-central1** region
   - Click **Create**

### Step 3: Configure Security Rules
1. In Firestore Database, go to **Rules** tab
2. Choose appropriate rules from [FIRESTORE_RULES.md](./FIRESTORE_RULES.md):
   - **Development**: Use the permissive rules (allow all)
   - **Production**: Use the restricted rules with authentication
3. Click **Publish**

### Step 4: Run the Application
```bash
npm run dev
```

On first load, you'll see a **Database Migration** modal:
- Click **"Start Migration"**
- Wait for the process to complete
- Your 8 projects will be migrated to Firestore

## 📋 Migration Process

### What Gets Migrated
The migration process transfers these project fields to Firestore:
- **title** - Project name
- **category** - Project type/category
- **description** - Project description
- **stack** - Array of technologies used
- **duration** - Project duration
- **speciality** - Main specialty
- **image** - Featured image URL
- **theme** - Light/dark theme
- **bgColor** - Background color class
- **darkGradient** - Dark mode gradient
- **status** - published/draft status
- **gallery** - Array of gallery image URLs
- **details** - Array of project details
- **createdAt** - Migration timestamp
- **updatedAt** - Last update timestamp

### Automatic ID Generation
- Local IDs (numeric) are removed
- Firestore auto-generates unique string IDs
- Your Admin Panel automatically handles this

## 🔄 Migration States

### Modal States

1. **Checking** 
   - Verifying if database is empty
   - Takes 1-2 seconds

2. **Ready**
   - Database is empty and ready for migration
   - Click "Start Migration"

3. **Already Migrated**
   - Database has projects
   - Modal warns about potential duplicates
   - You can still migrate if needed

4. **Migrating**
   - Progress bar shows migration progress
   - Each project is being uploaded to Firestore
   - Typically takes 10-30 seconds for 8 projects

5. **Complete**
   - Shows success count
   - Lists any failed projects with errors
   - Modal auto-closes after success

## 🛠️ Manual Migration (Advanced)

If you prefer to migrate manually via Firebase Console:

1. **Create projects one by one:**
   ```
   Firestore > + Add Collection > "projects"
   → Add Document > Auto ID > Fill in project data
   ```

2. **Or import JSON (Advanced):**
   ```bash
   # Export current data
   npm run export-data
   
   # Then import via Firebase Console's import feature
   ```

## ✅ Verify Migration Success

After migration, check:

1. **Firestore Console**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select "darshanwadke-portfolio"
   - Open Firestore Database
   - You should see "projects" collection with 8 documents

2. **Application**
   - All projects display on portfolio
   - Admin panel shows all projects
   - Can edit/delete projects
   - Changes sync to Firestore in real-time

3. **Browser Console**
   - No Firebase errors
   - `getProjects()` returns 8+ items

## 🔄 Sync Behavior After Migration

### Reading Projects
- App loads projects from Firestore on startup
- Falls back to initial data if Firebase fails
- Client always syncs with Firestore

### Creating Projects
- Via Admin Panel → "Add Project"
- Automatically synced to Firestore
- Firestore-generated ID assigned

### Updating Projects
- Via Admin Panel → "Edit Project"
- Changes immediately sync to Firestore
- Other users see changes in real-time

### Deleting Projects
- Via Admin Panel → "Delete Project"
- Removed from Firestore and local state
- Deletion is permanent

## ⚠️ Common Issues

### "Migration Failed" Error
**Cause:** Firestore database not created or security rules too strict

**Solution:**
1. Verify Firestore exists in Firebase Console
2. Check rules allow write access (use test mode rules for dev)
3. Check browser console for specific error message
4. Click "Retry" in modal

### Projects Not Showing After Migration
**Cause:** App still loading from cache or different database

**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check Firestore Console to see if documents exist
3. Verify `.env` variables are correct
4. Check browser Console tab for errors

### Duplicate Projects After Re-migrating
**Cause:** Running migration twice

**Solution:**
1. Delete duplicates from Firestore Console
2. Or backup your projects and reset Firestore
3. Run migration once

### "customClaim_isAdmin is undefined" (Production)
**Cause:** Using custom claim rules without setting them up

**Solution:**
1. Use simple production rules from FIRESTORE_RULES.md
2. Or set up custom claims via Cloud Functions
3. For now, keep using test mode rules

## 📊 Data Size Limits

Firestore free tier includes:
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

For a portfolio with 8 projects:
- Storage: ~50 KB
- Daily operations: Well under limits

## 🗑️ Rollback Plan

If you need to go back to local storage:

1. **Comment out migration** in App.tsx
2. **Replace Firestore calls** with localStorage
3. Keep Firestore data as backup

## 🚀 Next Steps

After successful migration:

1. **Set up Authentication** (recommended)
   - Enable Google/GitHub sign-in
   - Add admin checks for protected routes

2. **Set up Cloud Functions** (advanced)
   - Handle admin operations securely
   - Validate data server-side

3. **Enable Backups**
   - In Firestore Console → Schedules
   - Daily automatic backups

4. **Deploy to Production**
   - Update Firestore rules to production version
   - Use custom claims for admin access
   - Monitor Firestore usage

## 📚 Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore CLI](https://firebase.google.com/docs/cli)

## 🆘 Need Help?

Check:
1. `FIREBASE_SETUP.md` - Initial setup guide
2. `FIRESTORE_RULES.md` - Security rules reference
3. Browser Console - Error messages
4. Firestore Console - Database state

---

**You're all set! Your portfolio is now powered by Firestore! 🎉**
