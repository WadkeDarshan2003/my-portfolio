/**
 * FIRESTORE SECURITY RULES FOR PORTFOLIO
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console > Firestore Database > Rules
 * 2. Replace the default rules with the rules below
 * 3. Publish the rules
 * 
 * IMPORTANT: Choose the appropriate ruleset based on your environment
 */

/**
 * ===================================================================
 * DEVELOPMENT RULES (Use during development/testing)
 * ===================================================================
 * WARNING: These rules allow anyone to read/write
 * Only use in development environment!
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all read/write for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

/**
 * ===================================================================
 * PRODUCTION RULES (Use when deployed)
 * ===================================================================
 * Rules provide:
 * - Public read access to published projects
 * - Admin-only write access
 * - Secure project validation
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection - public read, admin write
    match /projects/{projectId} {
      // Allow anyone to read published projects
      allow read: if resource.data.status == 'published';
      
      // Allow authenticated admins to read all projects (including drafts)
      allow read: if request.auth != null && 
                     request.auth.token.customClaim_isAdmin == true;
      
      // Only authenticated admins can create projects
      allow create: if request.auth != null &&
                       request.auth.token.customClaim_isAdmin == true &&
                       request.resource.data.status in ['published', 'draft'];
      
      // Only authenticated admins can update projects
      allow update: if request.auth != null &&
                       request.auth.token.customClaim_isAdmin == true;
      
      // Only authenticated admins can delete projects
      allow delete: if request.auth != null &&
                       request.auth.token.customClaim_isAdmin == true;
    }
  }
}

/**
 * ===================================================================
 * ALTERNATIVE: SIMPLE PRODUCTION RULES
 * ===================================================================
 * If you don't want to set up custom claims for admin checks
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection
    match /projects/{projectId} {
      // Allow anyone to read published projects
      allow read: if resource.data.status == 'published';
      
      // Deny write access from client-side
      // (Use Cloud Functions for admin operations instead)
      allow write: if false;
    }
  }
}

/**
 * ===================================================================
 * SETUP: ENABLING ADMIN ACCESS
 * ===================================================================
 * 
 * Option 1: Using Cloud Functions (Recommended)
 * - Create Cloud Functions to handle project CRUD
 * - Client calls functions instead of direct Firestore access
 * - More secure and gives you full control
 * 
 * Option 2: Using Custom Claims
 * 1. Create an admin user in Firebase Auth
 * 2. Use Firebase Admin SDK or Cloud Function to set custom claim:
 *    - Field: customClaim_isAdmin
 *    - Value: true
 * 3. User can now modify projects
 * 
 * Option 3: Using Email Domain (Simple)
 * If all admins share company email:
 * 
 * allow create, update, delete: if 
 *   request.auth != null && 
 *   request.auth.token.email.matches('.*@yourcompany\\.com');
 */

/**
 * ===================================================================
 * TESTING YOUR RULES
 * ===================================================================
 * 
 * Use Firestore Emulator:
 * 
 * 1. Install Firebase CLI:
 *    npm install -g firebase-tools
 * 
 * 2. Start emulator:
 *    firebase emulators:start
 * 
 * 3. Visit emulator UI:
 *    http://localhost:4000
 * 
 * 4. Test your rules in the console
 */

/**
 * ===================================================================
 * COLLECTIONS STRUCTURE
 * ===================================================================
 * 
 * projects/ (Collection)
 *   └── {projectId} (Document)
 *       ├── title: string
 *       ├── description: string
 *       ├── category: string
 *       ├── stack: array<string>
 *       ├── duration: string
 *       ├── speciality: string
 *       ├── image: string
 *       ├── theme: 'light' | 'dark'
 *       ├── bgColor: string
 *       ├── darkGradient: string
 *       ├── status: 'published' | 'draft'
 *       ├── gallery: array<string>
 *       ├── details: array<{title: string, content: string}>
 *       ├── createdAt: timestamp
 *       └── updatedAt: timestamp
 */

/**
 * ===================================================================
 * COMMON ISSUES
 * ===================================================================
 * 
 * 1. "Missing or insufficient permissions"
 *    - Check your rules allow the operation
 *    - Verify user is authenticated (if required)
 *    - Check custom claims if using option 2
 * 
 * 2. "Projects not saving"
 *    - Admin rules not set up correctly
 *    - Use Cloud Functions instead for safer writes
 * 
 * 3. "Can't read draft projects"
 *    - Draft projects are hidden from non-admins (correct behavior)
 *    - Only published projects are public
 */
