#!/bin/bash

# Simple Netlify deployment - skip build detection
echo "🚀 Simple Netlify Deployment"
echo "============================"

# Deploy directly without build process
cd netlify-final-updated

# Deploy with specific flags to avoid build detection
netlify deploy --prod --dir=dist/public --functions=functions --site=tsiemasiloportfolio --skip-functions-cache

echo "✅ Deployment complete!"
echo "🌐 Visit: https://tsiemasiloportfolio.netlify.app"