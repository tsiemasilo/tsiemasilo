# Simple Update Process for Windows

## The Problem:
- You're in the Linux workspace, not your Windows local repository
- The workspace doesn't have GitHub connection set up
- You need to update your local Windows repository

## Solution: Update Your Local Repository

### Step 1: Open Command Prompt on Windows
Press `Win + R`, type `cmd`, press Enter

### Step 2: Navigate to Your Repository
```cmd
cd "C:\Users\Tsie Masilo\Desktop\PORTFOLIO\tsiemasilo"
```

### Step 3: Check Current Status
```cmd
git status
git log --oneline -5
```

### Step 4: Add ERP System Demo to home.tsx
Open `client\src\pages\home.tsx` in any text editor and add this after the No Shedding project:

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

### Step 5: Add and Commit
```cmd
git add .
git commit -m "Add ERP System Demo to portfolio"
```

### Step 6: Push to GitHub
```cmd
git push origin main
```

If it asks for credentials, use:
- Username: tsiemasilo
- Password: Your GitHub personal access token

## Alternative: Download Complete Package
1. Download `FORCE-GITHUB-UPDATE.tar.gz` from this workspace
2. Extract it to replace your current repository
3. Push to GitHub

The ERP System Demo will then appear as the 3rd project in your web applications section.