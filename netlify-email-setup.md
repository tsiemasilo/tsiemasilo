# 📧 Netlify Email Function Setup Instructions

## ✅ What's Been Done
- Created `netlify/functions/smtp-email.js` function
- Pushed to GitHub repository
- Function matches frontend POST request endpoint

## 🔧 Required Environment Variables
You need to set these in your Netlify dashboard:

### Option 1: Gmail SMTP (Currently Configured)
```
EMAIL_USER=tsiemasilo@gmail.com
EMAIL_PASS=dsphdodzkajngcbn
```

### Option 2: Alternative Email Service
If Gmail doesn't work, we can use SendGrid or another service.

## 🚀 How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (tsiemasiloportfolio.netlify.app)
3. Go to **Site settings** → **Environment variables**
4. Add these variables:
   - `EMAIL_USER`: tsiemasilo@gmail.com
   - `EMAIL_PASS`: dsphdodzkajngcbn

## 🔄 Netlify Deployment Status
- The function should auto-deploy when Netlify detects the GitHub changes
- Check your Netlify dashboard for deployment status
- The function will be available at: `/.netlify/functions/smtp-email`

## 🧪 Testing
After deployment, the contact form should:
1. Send POST request to `/.netlify/functions/smtp-email`
2. Return success/error response
3. Show success animation or error message

## 🆘 If Still Not Working
1. Check Netlify function logs in dashboard
2. Verify environment variables are set
3. Try manual redeploy in Netlify dashboard
4. We can switch to SendGrid if Gmail SMTP has issues

The function is now properly configured and should resolve the 404 error you were seeing.