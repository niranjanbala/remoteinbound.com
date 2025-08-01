# Clear Netlify Cache and Force Rebuild

## Method 1: Force Clear Cache via Netlify Dashboard
1. Go to your Netlify dashboard
2. Navigate to your site
3. Go to **Site settings** → **Build & deploy** → **Environment variables**
4. Add a temporary environment variable:
   - Key: `CACHE_BUST`
   - Value: `$(date +%s)` or any random string
5. Trigger a new deploy

## Method 2: Clear Cache via Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Clear cache and trigger rebuild
netlify build --clear-cache
netlify deploy --prod
```

## Method 3: Git Commit to Force Rebuild
```bash
# Make a small change to force rebuild
echo "# Cache bust $(date)" >> .cache-bust
git add .cache-bust
git commit -m "Force cache clear and rebuild"
git push origin main
```

## Method 4: Update netlify.toml (Already Done)
The netlify.toml has been updated to use `npm ci` which:
- Deletes node_modules completely
- Installs dependencies from package-lock.json exactly
- Forces a clean build every time

## Verification Steps After Deploy
1. Check build logs for successful Tailwind CSS compilation
2. Verify all 14 pages are generated in the build output
3. Test the deployed site functionality
4. Check browser console for any remaining errors

## Common Cache Issues and Solutions
- **CSS not updating**: Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- **Dependencies not updating**: Use `npm ci` instead of `npm install`
- **Build cache persisting**: Add `NPM_FLAGS = "--production=false"` to netlify.toml
- **PostCSS issues**: Ensure postcss.config.mjs is properly configured

The updated netlify.toml should resolve the cache issues by forcing a clean install on every build.