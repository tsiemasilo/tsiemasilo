# Force GitHub Update Commands

## Current Issue:
Your local repository has the ERP System Demo but GitHub doesn't show it. This will force update GitHub.

## Force Update Steps:

### 1. Download and Extract
Download `FORCE-GITHUB-UPDATE.tar.gz` from this workspace and extract it to your desktop.

### 2. Navigate to Extracted Folder
```cmd
cd "C:\Users\Tsie Masilo\Desktop\FORCE-GITHUB-UPDATE"
```

### 3. Force Push to GitHub
```cmd
git push origin main --force
```

### Alternative: Manual Force Push from Your Repository
```cmd
cd "C:\Users\Tsie Masilo\Desktop\PORTFOLIO\tsiemasilo"
git add .
git commit -m "Add ERP System Demo to portfolio"
git push origin main --force
```

## What --force Does:
- Overwrites GitHub repository with your local changes
- Ensures ERP System Demo appears on GitHub
- Updates all files to match your local version

## Expected Result:
- GitHub will show the ERP System Demo in web applications
- Portfolio will display ERP System Demo as 3rd project
- Netlify will automatically deploy the updates

## Verify Success:
1. Check https://github.com/tsiemasilo/tsiemasilo
2. Look for "Add ERP System Demo" in recent commits
3. Verify ERP System Demo appears in client/src/pages/home.tsx
4. Check if erp-system-screenshot.png is in client/public/

The force push will definitely update GitHub with your changes.