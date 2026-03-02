# Cognito Authentication Setup

## ✅ Authentication Integrated!

Your app now has AWS Cognito authentication with sign up, sign in, and sign out.

## 🔧 Setup Required

### 1. Create User Pool (if not done)

```bash
aws cognito-idp create-user-pool \
  --pool-name vehicle-marketplace-users \
  --auto-verified-attributes email \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true}"
```

### 2. Create App Client

```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-name vehicle-marketplace-web \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
```

### 3. Update .env

```bash
# Add to .env
REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_API_URL=https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev
```

## 📝 Files Created

1. **src/services/authService.js** - Cognito authentication service
2. **src/hooks/useAuth.js** - Authentication context and hook
3. **src/components/Login.js** - Login/signup component
4. **Updated App.js** - Protected routes
5. **Updated Navbar.js** - Sign out button
6. **Updated customerApi.js** - Auto-attach auth token

## 🎯 Features

- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign out
- ✅ Protected routes (login required)
- ✅ Auto-attach JWT token to API requests
- ✅ Session management
- ✅ Toast notifications

## 🚀 Usage

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();

  // Sign in
  await signIn('user@example.com', 'Password123!');

  // Sign out
  signOut();

  // Check if logged in
  if (user) {
    console.log('Logged in as:', user.username);
  }
}
```

## 🔐 API Gateway Integration

Update your API Gateway to use Cognito authorizer:

1. API Gateway → Authorizers → Create New Authorizer
2. Type: Cognito
3. Cognito User Pool: Select your pool
4. Token Source: Authorization
5. Attach to your methods

## 🧪 Test

```bash
cd /tmp/customer-app
npm start
```

1. App loads → Shows login screen
2. Click "Sign Up" → Create account
3. Sign in with credentials
4. App shows vehicle management
5. API requests include auth token
6. Click "Sign Out" → Back to login

## 📦 Dependencies Added

- amazon-cognito-identity-js

## ✅ Complete!

Your app now requires authentication to access vehicle management!
