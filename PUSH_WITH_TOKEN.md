# Push to GitHub with Personal Access Token

## Method 1: Include token in URL (one-time use)
```bash
git push --force https://YOUR_USERNAME:YOUR_TOKEN@github.com/tsiemasilo/tsiemasilo.git main
```

## Method 2: Set up token authentication
```bash
# Remove existing remote
git remote remove origin

# Add remote with token authentication
git remote add origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/tsiemasilo/tsiemasilo.git

# Push with force
git push --force origin main
```

## Method 3: Use git credential store (recommended)
```bash
# Configure git to store credentials
git config --global credential.helper store

# Push (will prompt for username and token)
git push --force origin main
# Username: tsiemasilo
# Password: YOUR_PERSONAL_ACCESS_TOKEN
```

## To create a Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the generated token

## Example command structure:
```bash
git push --force https://tsiemasilo:ghp_xxxxxxxxxxxxxxxxxxxx@github.com/tsiemasilo/tsiemasilo.git main
```

Replace `YOUR_USERNAME` with `tsiemasilo` and `YOUR_TOKEN` with your actual personal access token.