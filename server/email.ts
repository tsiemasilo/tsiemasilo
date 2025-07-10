import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tsiemasilo@gmail.com',
      pass: process.env.EMAIL_PASS || 'dsph dodz kajn gcbn'
    }
  });
};

export interface EmailData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (data: EmailData) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${data.name}" <${data.email}>`,
    to: 'tsiemasilo@gmail.com',
    subject: `Portfolio Contact Form: Message from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #00ff88; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #555;">${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
          <p>This message was sent from your portfolio contact form.</p>
        </div>
      </div>
    `,
    text: `
      New Contact Form Submission
      
      Name: ${data.name}
      Email: ${data.email}
      
      Message:
      ${data.message}
      
      ---
      This message was sent from your portfolio contact form.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};