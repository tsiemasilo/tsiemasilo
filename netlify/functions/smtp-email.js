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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Portfolio Contact Form Message</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #F1F3F4;
              font-family: 'Roboto', Arial, sans-serif;
            }
            .gmail-container {
              max-width: 620px;
              margin: 20px auto;
              background-color: #FFFFFF;
              border-radius: 8px;
              box-shadow: 0px 4px 6px rgba(32, 33, 36, 0.28);
              overflow: hidden;
            }
            .gmail-header {
              background-color: #FFFFFF;
              padding: 16px 24px;
              border-bottom: 1px solid #DADCE0;
            }
            .gmail-title {
              color: #202124;
              font-size: 16px;
              font-weight: 500;
              margin: 0;
            }
            .gmail-content {
              padding: 24px;
            }
            .gmail-field {
              display: flex;
              padding: 12px 0;
              border-bottom: 1px solid #DADCE0;
            }
            .gmail-field:last-child {
              border-bottom: none;
            }
            .gmail-label {
              color: #5F6368;
              font-size: 13px;
              font-weight: 500;
              min-width: 80px;
              margin-right: 16px;
            }
            .gmail-value {
              color: #202124;
              font-size: 14px;
              flex: 1;
              line-height: 1.4;
            }
            .gmail-message {
              background-color: #F8F9FA;
              padding: 16px;
              border-radius: 4px;
              margin-top: 8px;
              border-left: 4px solid #1A73E8;
            }
            .gmail-footer {
              background-color: #F8F9FA;
              padding: 16px 24px;
              text-align: center;
              border-top: 1px solid #DADCE0;
            }
            .gmail-footer-text {
              color: #80868B;
              font-size: 12px;
              margin: 0;
            }
            .email-link {
              color: #1A73E8;
              text-decoration: none;
            }
            .email-link:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="gmail-container">
            
            <!-- Header -->
            <div class="gmail-header">
              <h1 class="gmail-title">New Contact Form Message</h1>
            </div>
            
            <!-- Content -->
            <div class="gmail-content">
              
              <!-- From Field -->
              <div class="gmail-field">
                <div class="gmail-label">From:</div>
                <div class="gmail-value">
                  ${name} &lt;<a href="mailto:${email}" class="email-link">${email}</a>&gt;
                </div>
              </div>
              
              <!-- Subject Field -->
              <div class="gmail-field">
                <div class="gmail-label">Subject:</div>
                <div class="gmail-value">Portfolio Contact Form Message</div>
              </div>
              
              <!-- Message Field -->
              <div class="gmail-field">
                <div class="gmail-label">Message:</div>
                <div class="gmail-value">
                  <div class="gmail-message">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div class="gmail-footer">
              <p class="gmail-footer-text">
                Sent from your portfolio contact form on ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Africa/Johannesburg'
                })} (SAST)
              </p>
            </div>
            
          </div>
        </body>
        </html>
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