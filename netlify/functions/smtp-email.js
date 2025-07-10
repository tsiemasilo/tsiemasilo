/**
 * Netlify serverless function for sending emails via SMTP
 * Handles contact form submissions from the portfolio website
 * Uses Gmail SMTP for reliable email delivery
 */
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('SMTP Email Function called');
  console.log('Request method:', event.httpMethod);
  console.log('Request body:', event.body);

  // CORS headers for cross-origin requests from the frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight requests (browser sends OPTIONS before POST)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  // Only allow POST requests for form submissions
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the JSON request body from the frontend
    const { name, email, message } = JSON.parse(event.body);
    
    console.log('Parsed data:', { name, email, message });

    // Validate that all required fields are present
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, and message are required' 
        })
      };
    }

    // Validate email format using regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid email format' 
        })
      };
    }

    // Gmail SMTP configuration for email delivery
    console.log('Creating nodemailer transporter...');
    console.log('Nodemailer object:', typeof nodemailer, Object.keys(nodemailer));
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',     // Gmail's SMTP server
      port: 587,                  // TLS port for Gmail
      secure: false,              // Use TLS (not SSL)
      auth: {
        user: 'tsiemasilo@gmail.com',        // Gmail account
        pass: 'dsphdodzkajngcbn'            // App-specific password
      },
      tls: {
        rejectUnauthorized: false  // Allow self-signed certificates
      }
    });

    console.log('Transporter created, verifying connection...');

    // Test SMTP connection (optional but helps with debugging)
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      // Continue anyway, sometimes verify fails but sending still works
    }

    // Configure email content with professional HTML formatting
    const mailOptions = {
      from: '"Portfolio Contact Form" <tsiemasilo@gmail.com>',  // Display name and sender
      to: 'tsiemasilo@gmail.com',                              // Recipient (portfolio owner)
      replyTo: email,                                          // Reply to the form submitter
      subject: `New Contact Form Message from ${name}`,        // Dynamic subject line
      html: `
        <p><strong>New Contact Form Message</strong></p>
        
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><small>Sent from your portfolio contact form on ${new Date().toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Africa/Johannesburg'        // South African time zone
        })} (SAST)</small></p>
      `
    };

    // Send the email using Gmail SMTP
    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    console.log('Email response:', result.response);

    // Return success response to frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        messageId: result.messageId 
      })
    };

  } catch (error) {
    // Log detailed error information for debugging
    console.error('Email sending error:', error);
    console.error('Error stack:', error.stack);
    
    // Return error response to frontend
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email. Please try again later.',
        details: error.message 
      })
    };
  }
};