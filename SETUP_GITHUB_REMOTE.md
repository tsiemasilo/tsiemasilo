# Setup GitHub Remote and Push Changes

## Issue: No remote repository configured
The error `fatal: 'origin' does not appear to be a git repository` means the local repository isn't connected to GitHub.

## Solution: Configure GitHub Remote

### Step 1: Add GitHub remote
Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your actual GitHub details:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### Step 2: Verify remote is added
```bash
git remote -v
```

### Step 3: Push to GitHub
```bash
git push -u origin main
```

## If you need to create a new GitHub repository:

1. Go to https://github.com/new
2. Create a new repository (e.g., `tsie-portfolio`)
3. Copy the repository URL
4. Run the commands above with your repository URL

## Alternative: If you have an existing repository URL
If you know your GitHub repository URL, run:

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Example with a typical repository:
```bash
git remote add origin https://github.com/tsiemasilo/portfolio.git
git push -u origin main
```

After setting up the remote, all your enhanced IP geolocation changes will be pushed to GitHub.