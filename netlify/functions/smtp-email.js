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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px; text-shadow: 0 0 10px #00ff88;">Hello World</h1>
            <p style="color: #888; margin: 10px 0 0 0;">New Contact Form Message</p>
          </div>
          
          <div style="background-color: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid #333;">
            <h2 style="color: #00ff88; margin-top: 0; font-size: 20px;">Contact Details</h2>
            <p style="margin: 10px 0; line-height: 1.6;"><strong style="color: #00ff88;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0; line-height: 1.6;"><strong style="color: #00ff88;">Email:</strong> ${email}</p>
            
            <h3 style="color: #00ff88; margin: 20px 0 10px 0; font-size: 18px;">Message</h3>
            <div style="background-color: #0a0a0a; padding: 15px; border-radius: 5px; border-left: 4px solid #00ff88;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>This email was sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
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