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
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 650px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff;">
            
            <!-- Header with Matrix-style background -->
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #00ff88; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: repeating-linear-gradient(90deg, transparent, transparent 2px, #00ff88 2px, #00ff88 4px); opacity: 0.1;"></div>
              <div style="position: relative; z-index: 2;">
                <h1 style="color: #00ff88; margin: 0; font-size: 36px; font-weight: bold; text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88; letter-spacing: 2px;">Hello World</h1>
                <div style="width: 60px; height: 3px; background: linear-gradient(90deg, transparent, #00ff88, transparent); margin: 15px auto;"></div>
                <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 16px; letter-spacing: 1px;">New Contact Form Message</p>
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px;">
              
              <!-- Contact Details Section -->
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 25px; border-radius: 15px; border: 1px solid #333; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.1);">
                <h2 style="color: #00ff88; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center;">
                  <span style="width: 8px; height: 8px; background: #00ff88; border-radius: 50%; margin-right: 12px; box-shadow: 0 0 10px #00ff88;"></span>
                  Contact Details
                </h2>
                
                <div style="display: table; width: 100%;">
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding: 8px 0; width: 80px; color: #00ff88; font-weight: bold;">Name:</div>
                    <div style="display: table-cell; padding: 8px 0; color: #ffffff; font-size: 16px;">${name}</div>
                  </div>
                  <div style="display: table-row;">
                    <div style="display: table-cell; padding: 8px 0; width: 80px; color: #00ff88; font-weight: bold;">Email:</div>
                    <div style="display: table-cell; padding: 8px 0; color: #ffffff; font-size: 16px;">
                      <a href="mailto:${email}" style="color: #00ff88; text-decoration: none;">${email}</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Message Section -->
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 25px; border-radius: 15px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.1);">
                <h3 style="color: #00ff88; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center;">
                  <span style="width: 8px; height: 8px; background: #00ff88; border-radius: 50%; margin-right: 12px; box-shadow: 0 0 10px #00ff88;"></span>
                  Message
                </h3>
                
                <div style="background-color: #0a0a0a; padding: 20px; border-radius: 10px; border-left: 4px solid #00ff88; box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);">
                  <div style="color: #ffffff; line-height: 1.8; font-size: 15px; white-space: pre-wrap; word-wrap: break-word;">${message}</div>
                </div>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 25px 30px; text-align: center; border-top: 1px solid #333;">
              <div style="color: #666666; font-size: 13px; line-height: 1.6;">
                <p style="margin: 0 0 8px 0;">📧 This email was sent from your portfolio contact form</p>
                <p style="margin: 0; color: #888888;">⏰ ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Africa/Johannesburg'
                })} (SAST)</p>
              </div>
              
              <!-- Matrix-style decorative line -->
              <div style="margin: 20px auto 0; width: 200px; height: 2px; background: linear-gradient(90deg, transparent, #00ff88, transparent); opacity: 0.5;"></div>
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