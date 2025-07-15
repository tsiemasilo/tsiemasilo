# Fix Git Lock Issue and Connect to GitHub

## Issue: Git config file is locked
The error `could not lock config file .git/config: File exists` indicates a git lock file issue.

## Solution: Remove lock file and reconfigure

### Step 1: Remove the lock file
```bash
rm -f .git/config.lock
```

### Step 2: Check if remote already exists
```bash
git remote -v
```

### Step 3: Remove existing remote if needed
```bash
git remote remove origin
```

### Step 4: Add the correct remote
```bash
git remote add origin https://github.com/tsiemasilo/tsiemasilo.git
```

### Step 5: Verify remote is added
```bash
git remote -v
```

### Step 6: Force add changes (in case git thinks nothing changed)
```bash
git add -A
git status
```

### Step 7: Commit and push
```bash
git commit -m "feat: Enhanced real IP geolocation system with multi-API support

- Implemented real IP geolocation using ipapi.co and ip-api.com
- Added business visitor detection from IP organization data
- Enhanced admin dashboard with location and company display
- Removed all mock data for privacy compliance
- Added support for multi-region IP tracking (US, India, SA)
- Integrated postal codes, coordinates, and business identification
- Added API testing endpoint for real-time geolocation verification

Tested with real IPs from Google, Facebook, and South African networks"

git push -u origin main
```

## Alternative if still having issues:
```bash
# Initialize fresh git if needed
git init
git add .
git commit -m "Initial commit with enhanced IP geolocation system"
git branch -M main
git remote add origin https://github.com/tsiemasilo/tsiemasilo.git
git push -u origin main
```

Run these commands to resolve the git lock issue and push your enhanced portfolio to GitHub.