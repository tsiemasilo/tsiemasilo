#!/bin/bash

# Fixed Netlify Deployment Script
# This script deploys the corrected version without build errors

echo "🔧 FIXED NETLIFY DEPLOYMENT"
echo "========================="

# Extract the fixed package
echo "📦 Extracting fixed deployment package..."
tar -xzf netlify-fixed-deployment.tar.gz

# Deploy to your existing site
echo "🚀 Deploying to existing site..."
cd netlify-final-updated

# Deploy to your specific site (replace with your site ID if needed)
netlify deploy --prod --dir=dist/public --functions=functions --site=tsiemasiloportfolio

echo "✅ Deployment complete!"
echo "🌐 Your site: https://tsiemasiloportfolio.netlify.app"
echo ""
echo "🔍 Verify the changes:"
echo "  - Network Management System should be first"
echo "  - WhatsApp integration (082 806 9569) should be working"
echo "  - AI Call Analyzer should be visible"
echo "  - Mobile apps should show 'Coming Soon'"
echo ""
echo "📋 Test pages:"
echo "  - https://tsiemasiloportfolio.netlify.app/debug.html"
echo "  - https://tsiemasiloportfolio.netlify.app/test-changes.html"