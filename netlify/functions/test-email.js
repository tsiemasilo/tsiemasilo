const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Test nodemailer configuration
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'tsiemasilo@gmail.com',
        pass: 'dsphdodzkajngcbn'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'SMTP connection test successful',
        nodemailer: 'working',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('SMTP Test Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'SMTP connection test failed',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};