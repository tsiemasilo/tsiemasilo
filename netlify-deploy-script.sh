#!/bin/bash

# Netlify Deployment Script - Force Update
# This script cleans and re-deploys your portfolio with all changes

echo "🚀 Starting Netlify Force Deployment..."

# Step 1: Extract the deployment package
echo "📦 Extracting deployment package..."
tar -xzf netlify-debug-package.tar.gz

# Step 2: Install Netlify CLI (if not already installed)
echo "🔧 Installing Netlify CLI..."
npm install -g netlify-cli

# Step 3: Login to Netlify (you'll need to authenticate)
echo "🔐 Logging into Netlify..."
netlify login

# Step 4: Navigate to the deployment directory
cd netlify-final-updated

# Step 5: Delete existing deployment and force new one
echo "🗑️ Removing old deployment..."
netlify sites:delete --force 2>/dev/null || echo "No existing site to delete"

# Step 6: Create new site and deploy
echo "🚀 Creating new Netlify site..."
netlify deploy --prod --dir=dist/public --functions=functions

# Alternative: If you have an existing site, use this instead:
# netlify deploy --prod --dir=dist/public --functions=functions --site=YOUR_SITE_ID

echo "✅ Deployment complete!"
echo "🌐 Your site should now show all the updates:"
echo "  - Network Management System as first project"
echo "  - WhatsApp integration (082 806 9569)"
echo "  - AI Call Analyzer project"
echo "  - Coming Soon mobile apps"

echo "🔍 To verify deployment, visit your site and check /debug.html"