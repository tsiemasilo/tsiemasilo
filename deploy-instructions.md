# Deploy to Netlify - Instructions

## Option 1: Direct Netlify Deploy (Recommended)

### Step 1: Prepare Your Project
1. Your project is already configured with `netlify.toml` and serverless functions
2. Required environment variables are set in `.env`

### Step 2: Deploy to Netlify
1. **Go to** [netlify.com](https://netlify.com) and sign in
2. **Click** "Add new site" → "Deploy manually"
3. **Drag and drop** your entire project folder to Netlify
4. **Wait** for the build to complete

### Step 3: Set Environment Variables
1. **Go to** Site settings → Environment variables
2. **Add** these variables:
   - `EMAIL_USER`: `tsiemasilo@gmail.com`
   - `EMAIL_PASS`: `dsphdodzkajngcbn`

### Step 4: Configure Build Settings
1. **Go to** Site settings → Build & deploy
2. **Set** Build command: `npm run build`
3. **Set** Publish directory: `dist/public`

## Option 2: GitHub + Netlify (Better for Updates)

### Step 1: Create GitHub Repository
1. **Go to** [github.com](https://github.com) and create a new repository
2. **Name it** something like `tsie-portfolio`
3. **Make it** public or private (your choice)

### Step 2: Upload Your Code
1. **Download** all your project files
2. **Upload** them to your new GitHub repository
3. **Commit** the changes

### Step 3: Connect to Netlify
1. **Go to** [netlify.com](https://netlify.com) and sign in
2. **Click** "Add new site" → "Import an existing project"
3. **Connect** your GitHub account
4. **Select** your portfolio repository
5. **Configure** build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
6. **Deploy**

### Step 4: Set Environment Variables
1. **Go to** Site settings → Environment variables
2. **Add** these variables:
   - `EMAIL_USER`: `tsiemasilo@gmail.com`
   - `EMAIL_PASS`: `dsphdodzkajngcbn`

## Important Notes

### Email Functionality
- The contact form will work with Gmail SMTP
- Environment variables are securely stored in Netlify
- Test the form after deployment

### Project Structure
```
your-project/
├── client/          # React frontend
├── server/          # Express backend (converted to functions)
├── dist/            # Build output
├── netlify.toml     # Netlify configuration
├── _redirects       # URL redirects
└── package.json     # Dependencies
```

### Features Available After Deployment
✅ Portfolio website with dark theme
✅ Interactive animations and Matrix effects
✅ Contact form with real email delivery
✅ Mobile-responsive design
✅ Professional project showcase
✅ Social media links (GitHub, LinkedIn, Indeed)

### Domain Setup (Optional)
- Use your existing domain: `tsiemasilo.netlify.app`
- Or connect a custom domain in Netlify settings

### Troubleshooting
1. **Build fails**: Check the build logs in Netlify dashboard
2. **Email not working**: Verify environment variables are set
3. **404 errors**: Ensure `_redirects` file is in place
4. **Slow loading**: Netlify CDN will optimize static assets

Your portfolio is ready for deployment! 🚀