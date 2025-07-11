import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'tsiemasilo@gmail.com',
      pass: process.env.EMAIL_PASS || 'dsphdodzkajngcbn'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${data.name}" <${data.email}>`,
      to: 'tsiemasilo@gmail.com',
      subject: `Portfolio Contact: ${data.name}`,
      html: `
        <h2 style="color: #00ff88;">New Contact Form Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
      text: `New contact from ${data.name} (${data.email}): ${data.message}`
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Email sent successfully!' })
    };

  } catch (error) {
    console.error('Email error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send email', details: error.message })
    };
  }
};