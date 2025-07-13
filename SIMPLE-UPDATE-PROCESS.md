# Simple GitHub Update Process

## Your Repository: https://github.com/tsiemasilo/tsiemasilo.git

## What You Need to Do:

### Option 1: Direct File Updates (Easiest)
1. Go to your repository: https://github.com/tsiemasilo/tsiemasilo
2. Navigate to `client/src/pages/home.tsx`
3. Click the pencil icon (Edit)
4. Find line 244 (after the "No Shedding" project)
5. Add this code:

```javascript
    {
      title: "ERP System Demo",
      description: "Enterprise Resource Planning system with comprehensive dashboard for business operations, inventory management, sales tracking, and customer relationship management with real-time analytics.",
      image: "/erp-system-screenshot.png",
      technologies: ["React", "ERP Integration", "Business Operations", "Dashboard Analytics"],
      category: "WEB APPLICATION",
      liveUrl: "https://erpsystemdemo.netlify.app/",
      codeUrl: "#"
    },
```

6. Commit the changes
7. Upload the ERP screenshot to `client/public/` folder

### Option 2: Clone and Push Locally
```bash
git clone https://github.com/tsiemasilo/tsiemasilo.git
cd tsiemasilo
# Make the changes above
git add .
git commit -m "Add ERP System Demo to portfolio"
git push origin main
```

## ERP System Demo Details:
- **URL**: https://erpsystemdemo.netlify.app/
- **Position**: After "No Shedding" project
- **Category**: WEB APPLICATION
- **Technologies**: React, ERP Integration, Business Operations, Dashboard Analytics

The ERP System Demo will appear as the 3rd project in your web applications section once updated.