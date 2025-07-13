# Windows Commands to Add ERP System Demo

## Step 1: Check if ERP System Demo exists
```cmd
findstr /n "ERP System Demo" client\src\pages\home.tsx
```

## Step 2: If not found, add it manually
1. Open `client\src\pages\home.tsx` in your text editor
2. Find the "No Shedding" project (around line 244)
3. Add this code AFTER the No Shedding project:

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

## Step 3: Add the screenshot
1. Copy `erp-system-screenshot.png` to `client\public\` folder
2. (The screenshot should be in your downloaded package)

## Step 4: Push to GitHub
```cmd
git add .
git commit -m "Add ERP System Demo to portfolio"
git push origin main
```

## Step 5: Verify on GitHub
- Go to https://github.com/tsiemasilo/tsiemasilo
- Check if the latest commit shows "Add ERP System Demo"
- Verify the files are updated

## Your Current Status:
- Repository: ✅ Correct location
- Latest commit: ✅ Clean Release (0bd3edc)
- Need to add: ERP System Demo project entry