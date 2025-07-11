/**
 * Netlify test function to diagnose deployment issues
 * This function logs deployment environment and helps identify problems
 */

exports.handler = async (event, context) => {
  console.log('=== NETLIFY DEPLOYMENT TEST LOG ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));
  
  // Test environment variables
  console.log('Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NETLIFY_DEV:', process.env.NETLIFY_DEV);
  console.log('CONTEXT:', process.env.CONTEXT);
  
  // Test file system access
  const fs = require('fs');
  const path = require('path');
  
  try {
    const functionPath = __dirname;
    console.log('Function directory:', functionPath);
    
    const files = fs.readdirSync(functionPath);
    console.log('Files in functions directory:', files);
    
    // Try to access the dist directory
    const distPath = path.join(functionPath, '..', 'dist');
    if (fs.existsSync(distPath)) {
      console.log('Dist directory exists');
      const distFiles = fs.readdirSync(distPath);
      console.log('Files in dist:', distFiles);
    } else {
      console.log('Dist directory does not exist');
    }
    
    // Try to access public directory
    const publicPath = path.join(functionPath, '..', 'dist', 'public');
    if (fs.existsSync(publicPath)) {
      console.log('Public directory exists');
      const publicFiles = fs.readdirSync(publicPath);
      console.log('Files in public:', publicFiles.slice(0, 10)); // First 10 files
    } else {
      console.log('Public directory does not exist');
    }
    
  } catch (error) {
    console.error('File system error:', error);
  }
  
  // Test response
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Netlify deployment test successful',
      timestamp: new Date().toISOString(),
      deploymentStatus: 'working',
      environment: process.env.NODE_ENV || 'unknown',
      context: process.env.CONTEXT || 'unknown'
    })
  };
  
  console.log('Response:', JSON.stringify(response, null, 2));
  console.log('=== END TEST LOG ===');
  
  return response;
};