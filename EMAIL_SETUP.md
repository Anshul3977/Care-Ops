# Email Automation Setup Guide

This guide explains how to configure email automation for CareOps.

## Overview

The email automation system sends:
1. **Welcome emails** to contacts who submit the contact form
2. **System messages** logged in conversations
3. **Notifications** to workspace admins about new messages

## Email Configuration

### Using Gmail SMTP

1. **Enable Less Secure Apps** (for personal Gmail):
   - Go to https://myaccount.google.com/lesssecureapps
   - Turn on "Less secure app access"
   - Or use an [App Password](https://support.google.com/accounts/answer/185833)

2. **Add Environment Variables**:
   ```env
   # SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=noreply@careops.com
   SMTP_FROM_NAME=CareOps
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

### Using Other Email Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=CareOps
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@yourdomain.mailgun.org
SMTP_FROM_NAME=CareOps
```

#### AWS SES
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-username
SMTP_PASSWORD=your-ses-password
SMTP_FROM_EMAIL=verified-email@yourdomain.com
SMTP_FROM_NAME=CareOps
```

## API Endpoints

### Send Welcome Email

**POST** `/api/automation/send-welcome`

Sends a welcome email to a contact and creates a system message.

**Request Body:**
```json
{
  "contact_id": "uuid-of-contact"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "contactId": "uuid",
  "emailSent": true
}
```

**Health Check:**
```bash
GET /api/automation/send-welcome
```

Returns service status and configuration status.

## How It Works

### Contact Form Submission Flow

1. User submits contact form at `/contact/[slug]`
2. Contact created in Supabase `contacts` table
3. Conversation created in `conversations` table
4. Initial message stored in `messages` table
5. API calls `/api/automation/send-welcome` automatically
6. Welcome email sent to contact
7. Notification email sent to workspace admin
8. System message logged in conversation

## Email Templates

### Welcome Email Template (`lib/email.ts`)

The welcome email includes:
- Personalized greeting with contact name
- Acknowledgment of their message
- 24-hour response time commitment
- Link to book a service
- Professional branding with workspace name

### Workspace Notification Template

Workspace admins receive:
- Contact's name
- Full message content
- Link to view in dashboard
- Professional formatting

## Testing

### Test Email Configuration

```typescript
import { verifyEmailConnection, sendEmail, emailTemplates } from '@/lib/email'

// Verify connection
const isValid = await verifyEmailConnection()

// Send test email
const template = emailTemplates.welcome('John Doe', 'My Business')
const result = await sendEmail({
  to: 'test@example.com',
  subject: template.subject,
  html: template.html,
})
```

### Test via API

```bash
# Check service health
curl https://yourdomain.com/api/automation/send-welcome

# Send test email (requires valid contact_id)
curl -X POST https://yourdomain.com/api/automation/send-welcome \
  -H "Content-Type: application/json" \
  -d '{"contact_id": "your-contact-uuid"}'
```

## Troubleshooting

### Emails Not Sending

1. **Check SMTP Configuration**
   - Verify all env variables are set correctly
   - Check server supports SMTP on configured port
   - Verify credentials are accurate

2. **Check Logs**
   - Look for `[v0]` prefixed logs in terminal
   - Review error messages for specific issues

3. **Verify Email Credentials**
   ```typescript
   import { verifyEmailConnection } from '@/lib/email'
   await verifyEmailConnection() // Returns true/false
   ```

### Emails Going to Spam

1. **Add SPF Record** to your domain DNS:
   ```
   v=spf1 include:smtp.provider.com ~all
   ```

2. **Add DKIM** signing through your email provider

3. **Add DMARC** policy:
   ```
   v=DMARC1; p=none; rua=mailto:postmaster@yourdomain.com
   ```

4. **Use Email Provider's Domain** in `SMTP_FROM_EMAIL`

## Production Considerations

1. **Rate Limiting**: Consider adding rate limits to prevent abuse
2. **Email Validation**: All contact emails are validated before sending
3. **Error Handling**: Failed emails don't block contact creation
4. **Logging**: All email activity is logged for auditing
5. **Privacy**: Consider GDPR compliance for email storage

## Fallback Behavior

If SMTP is not configured:
- Contact form still works (no email sent)
- No errors displayed to user
- Admin receives in-app notification in inbox
- System logs indicate email was skipped

This allows the app to work in demo mode without email setup.
