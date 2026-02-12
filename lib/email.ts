import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Email configuration with fallback
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
  from: process.env.SMTP_FROM_EMAIL || 'noreply@careops.com',
  fromName: process.env.SMTP_FROM_NAME || 'CareOps',
}

// Create transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig)
  }
  return transporter
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('[v0] SMTP credentials not configured')
      return false
    }
    await getTransporter().verify()
    console.log('[v0] SMTP connection verified')
    return true
  } catch (err) {
    console.error('[v0] SMTP verification failed:', err)
    return false
  }
}

// Send email
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('[v0] SMTP not configured, email sending skipped')
      return { success: true, messageId: 'demo-mode' }
    }

    const mailOptions = {
      from: `${emailConfig.fromName} <${emailConfig.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    const info = await getTransporter().sendMail(mailOptions)
    console.log('[v0] Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] Email send error:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string, workspaceName: string) => ({
    subject: 'Thanks for contacting us!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #217 91.2% 59.8%; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .button { display: inline-block; background: #217 91.2% 59.8%; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${workspaceName}</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for getting in touch with us! We've received your message and appreciate your interest.</p>
              <p>Our team will review your inquiry and respond within 24 hours. If you have any urgent concerns, please don't hesitate to call us directly.</p>
              <p>In the meantime, you can explore our services by visiting our website.</p>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://careops.com'}/book" class="button">Book a Service</a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message. Please don't reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} ${workspaceName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${name},

Thank you for getting in touch with us! We've received your message and appreciate your interest.

Our team will review your inquiry and respond within 24 hours. If you have any urgent concerns, please don't hesitate to call us directly.

In the meantime, you can explore our services by visiting our website.

Best regards,
${workspaceName} Team

---
This is an automated message. Please don't reply to this email.
Copyright ${new Date().getFullYear()} ${workspaceName}. All rights reserved.
    `.trim(),
  }),

  notificationToWorkspace: (contactName: string, message: string) => ({
    subject: `New contact message from ${contactName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #217 91.2% 59.8%; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .message { background: white; padding: 15px; border-left: 4px solid #217 91.2% 59.8%; margin: 15px 0; }
            .button { display: inline-block; background: #217 91.2% 59.8%; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message Received</h1>
            </div>
            <div class="content">
              <p><strong>From:</strong> ${contactName}</p>
              <div class="message">
                ${message.split('\n').join('<br>')}
              </div>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://careops.com'}/dashboard/inbox" class="button">View in Dashboard</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
