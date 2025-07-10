const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('SMTP Email Function called');
  console.log('Request method:', event.httpMethod);
  console.log('Request body:', event.body);

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { name, email, message } = JSON.parse(event.body);
    
    console.log('Parsed data:', { name, email, message });

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, and message are required' 
        })
      };
    }

    // Validate email format
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

    // Gmail SMTP configuration with explicit settings
    console.log('Creating nodemailer transporter...');
    console.log('Nodemailer object:', typeof nodemailer, Object.keys(nodemailer));
    const transporter = nodemailer.createTransport({
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

    console.log('Transporter created, verifying connection...');

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      // Continue anyway, sometimes verify fails but sending works
    }

    // Email content
    const mailOptions = {
      from: '"Portfolio Contact Form" <tsiemasilo@gmail.com>',
      to: 'tsiemasilo@gmail.com',
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
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
          timeZone: 'Africa/Johannesburg'
        })} (SAST)</small></p>
      `
    };

    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    console.log('Email response:', result.response);

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
    console.error('Email sending error:', error);
    console.error('Error stack:', error.stack);
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