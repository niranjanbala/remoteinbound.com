# Netlify Deployment Guide - Remote Inbound

## 🚀 **Environment Variables Setup**

The Remote Inbound application requires environment variables to be configured in Netlify for the database connection to work properly.

### **Required Environment Variables**

From your `.env.local` file, you need to add these as **Environment Variables** in Netlify:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tdcghhupwfoiwfwoqqrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY2doaHVwd2ZvaXdmd29xcXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjgxNTcsImV4cCI6MjA2OTYwNDE1N30.2AQbJoNI0JUJe_kIkuBdGgEmS_JQffkn3Pf47kD7XQ8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY2doaHVwd2ZvaXdmd29xcXJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDAyODE1NywiZXhwIjoyMDY5NjA0MTU3fQ.ibU5UkafwwelRJUeQnmbi7GRUK4X8RWn3M_y5s-sXwQ

# App Configuration (Optional - Not currently used)
# NEXTAUTH_SECRET=your_nextauth_secret_key
# NEXTAUTH_URL=https://your-netlify-site-url.netlify.app
```

---

## 📋 **Step-by-Step Setup Instructions**

### **Step 1: Access Netlify Dashboard**
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Login to your Netlify account
3. Find your Remote Inbound site in the dashboard

### **Step 2: Navigate to Environment Variables**
1. Click on your site name
2. Go to **"Site settings"**
3. In the left sidebar, click **"Environment variables"**
4. Click **"Add a variable"** or **"Add environment variables"**

### **Step 3: Add Each Environment Variable**

Add these variables one by one:

#### **Variable 1: Supabase URL**
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://tdcghhupwfoiwfwoqqrt.supabase.co`
- **Scopes**: All scopes (Production, Deploy previews, Branch deploys)

#### **Variable 2: Supabase Anon Key**
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY2doaHVwd2ZvaXdmd29xcXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjgxNTcsImV4cCI6MjA2OTYwNDE1N30.2AQbJoNI0JUJe_kIkuBdGgEmS_JQffkn3Pf47kD7XQ8`
- **Scopes**: All scopes

#### **Variable 3: Supabase Service Role Key**
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY2doaHVwd2ZvaXdmd29xcXJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDAyODE1NywiZXhwIjoyMDY5NjA0MTU3fQ.ibU5UkafwwelRJUeQnmbi7GRUK4X8RWn3M_y5s-sXwQ`
- **Scopes**: All scopes
- **⚠️ Important**: This is a sensitive key - keep it secure!

**Note**: The NextAuth variables are commented out because Remote Inbound uses Supabase authentication instead of NextAuth. You only need the 3 Supabase variables above for full functionality.

### **Step 4: Save and Redeploy**
1. Click **"Save"** after adding each variable
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait for the deployment to complete

---

## 🔧 **Build Configuration Verification**

Make sure your `netlify.toml` file contains:

```toml
[build]
  publish = "out"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Note**: The build command uses `npm ci` to force clean dependency installation and avoid cache issues.

---

## 🧹 **Cache Issues Resolution**

If you're experiencing deployment issues due to Netlify cache, use these methods:

### **Method 1: Force Cache Clear (Recommended)**
1. Go to **Site settings** → **Build & deploy** → **Environment variables**
2. Add a temporary variable:
   - **Key**: `CACHE_BUST`
   - **Value**: `$(date +%s)` or any random string like `20250801`
3. Click **"Save"**
4. Go to **"Deploys"** tab and trigger a new deploy
5. **Remove the variable** after successful deployment

### **Method 2: Updated Build Configuration**
The `netlify.toml` has been updated to force clean builds:
- Uses `npm ci` instead of `npm install` (deletes `node_modules` completely)
- Includes `NPM_FLAGS = "--production=false"`
- Forces fresh dependency installation on every build

### **Method 3: Manual Cache Clear via CLI**
```bash
# If you have Netlify CLI installed
npm install -g netlify-cli
netlify login
netlify build --clear-cache
netlify deploy --prod
```

### **Method 4: Git Commit to Force Rebuild**
A `.cache-bust` file has been added to force fresh deployments when needed.

---

## ✅ **Verification Steps**

After deployment with environment variables:

### **1. Check Build Logs**
- Go to **"Deploys"** tab
- Click on the latest deploy
- Check the build logs for any errors
- Look for successful compilation messages

### **2. Test Database Connection**
- Visit your deployed site
- Try to register a new user
- Check if the registration works
- Verify data appears in your Supabase dashboard

### **3. Test PWA Features**
- Check if the PWA install prompt appears
- Test offline functionality
- Verify service worker registration

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Cache-Related Build Failures**
- **Tailwind CSS v4 errors**: Use Method 1 above to add `CACHE_BUST` variable
- **PostCSS module not found**: Clear cache and force clean `npm ci` install
- **Old dependencies persisting**: Use `npm ci` instead of `npm install` in build command
- **CSS compilation errors**: Ensure Tailwind CSS v3.4.17 is being used (not v4)

#### **Build Still Failing**
- Double-check all environment variable names (case-sensitive)
- Ensure no extra spaces in variable values
- Verify Supabase keys are correct and not expired
- Try adding `CACHE_BUST` variable to force clean build

#### **Database Connection Issues**
- Check Supabase project is active
- Verify database tables are created (see [`SUPABASE_AUTH_GUIDE.md`](SUPABASE_AUTH_GUIDE.md))
- Test connection from Supabase dashboard

#### **Environment Variables Not Working**
- Make sure variables are set for all scopes (Production, Deploy previews, Branch deploys)
- Redeploy after adding variables
- Check variable names match exactly what's used in code

#### **CSS/Styling Issues**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Verify Tailwind CSS configuration is correct
- Check that `postcss.config.mjs` exists and is properly configured
- Ensure `globals.css` uses `@tailwind` directives (not v4 syntax)

---

## 📱 **Expected Features After Deployment**

Once successfully deployed with environment variables:

### **✅ Working Features**
- **User Registration**: Create accounts and store in Supabase
- **User Login**: Authenticate with stored credentials
- **Dashboard**: View registered events and user profile
- **Admin Panel**: Manage users and events (admin login required)
- **PWA Installation**: Install app on devices
- **Offline Functionality**: Works without internet connection
- **Database Integration**: All data stored in Supabase
- **Local Storage Fallback**: Works even if database is unavailable

### **🎯 User Flow**
1. **Visit Site**: Users can browse events
2. **Register**: Create account (stored in Supabase)
3. **Login**: Access personal dashboard
4. **Install PWA**: Add to home screen
5. **Use Offline**: Access cached content without internet

---

## 🔐 **Security Notes**

- **Never commit `.env.local`** to version control (it's in `.gitignore`)
- **Service Role Key** is sensitive - only add to Netlify environment variables
- **Anon Key** is safe to expose publicly (it's prefixed with `NEXT_PUBLIC_`)
- **Rotate keys** periodically in Supabase dashboard if needed

---

## 🌐 **Custom Domain (Optional)**

To set up a custom domain:

1. Go to **"Domain settings"** in Netlify
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `remoteinbound.com`)
4. Follow DNS configuration instructions
5. Your site will be accessible at your custom domain

---

## 📊 **Performance Optimization**

The deployed site includes:

- **Static Site Generation**: All pages pre-rendered
- **Service Worker**: Advanced caching strategies
- **Image Optimization**: Disabled for static export
- **Bundle Splitting**: Optimized JavaScript chunks
- **PWA Features**: Installable with offline support

---

## 🎉 **Success Indicators**

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Site loads at your Netlify URL
- ✅ User registration works
- ✅ Database connection established
- ✅ PWA install prompt appears
- ✅ Admin panel accessible
- ✅ Offline functionality works

---

## 📞 **Support**

If you encounter issues:

1. **Check Build Logs**: Look for specific error messages
2. **Verify Environment Variables**: Ensure all keys are correct
3. **Test Locally**: Make sure `npm run build` works locally
4. **Database Status**: Check Supabase project status
5. **Clear Cache**: Try a fresh deploy

The Remote Inbound platform should now be fully functional in production! 🚀