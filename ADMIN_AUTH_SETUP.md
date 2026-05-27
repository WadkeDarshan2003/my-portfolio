## Admin Panel Authentication Setup

The admin panel now requires Firebase authentication. Only authorized administrators can access the CMS.

### Quick Setup

#### 1. Set Your Admin Email
Create a `.env` file in your project root (if not already created) and add:

```env
VITE_ADMIN_EMAIL=your-admin-email@gmail.com
```

Replace `your-admin-email@gmail.com` with your actual admin email address.

#### 2. Create Admin User in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **darshanwadke-portfolio**
3. Navigate to **Authentication** → **Users**
4. Click **Create user** (or **Add user**)
5. Enter:
   - **Email**: The email you set in `VITE_ADMIN_EMAIL`
   - **Password**: A strong password
6. Click **Create**

#### 3. Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Make sure **Email/Password** is enabled
3. Click **Enable** if not already enabled

### How It Works

- **Public Users**: Can view projects without authentication
- **Admin Users**: Must enter their email and password at the login screen to access the admin panel
- **Authentication State**: Persists across browser sessions (stored in localStorage)
- **Admin Check**: Only users with email matching `VITE_ADMIN_EMAIL` can access the admin panel

### Accessing Admin Panel

1. Click the "Admin" link in the footer
2. You'll be redirected to the login screen
3. Enter your admin email and password
4. Once authenticated, you'll have full CMS access

### Security Notes

⚠️ **Important**:
- Never commit `.env` files with credentials to version control
- Use a strong password for your admin account
- Optionally add Firestore security rules to restrict admin panel access further

### Environment Variables

Make sure these are set in your `.env` file:

```env
# Firebase Config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

# Admin Settings
VITE_ADMIN_EMAIL=your-admin-email@gmail.com
```

### Troubleshooting

**"Access denied. Only admin users can access this panel."**
- Make sure the email you're using matches exactly with `VITE_ADMIN_EMAIL`
- Email comparison is case-insensitive, but make sure it's the exact address

**"User not found"**
- The user doesn't exist in Firebase Authentication
- Create the user in Firebase Console → Authentication → Users

**"Incorrect password"**
- Double-check your password
- Use Firebase Console to reset the password if needed

---

For more Firebase Authentication docs, visit: https://firebase.google.com/docs/auth
