import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact_id } = body

    if (!contact_id) {
      return NextResponse.json(
        { error: 'contact_id is required' },
        { status: 400 }
      )
    }

    console.log('[v0] Processing welcome email for contact:', contact_id)

    // Fetch contact details
    const { data: contactData, error: contactError } = await supabaseAdmin
      .from('contacts')
      .select('id, name, email, workspace_id')
      .eq('id', contact_id)
      .single()

    if (contactError || !contactData) {
      console.error('[v0] Contact not found:', contactError)
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Fetch workspace details
    const { data: workspaceData, error: workspaceError } = await supabaseAdmin
      .from('workspaces')
      .select('id, name, email')
      .eq('id', contactData.workspace_id)
      .single()

    if (workspaceError || !workspaceData) {
      console.error('[v0] Workspace not found:', workspaceError)
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    // Generate welcome email template
    const emailTemplate = emailTemplates.welcome(contactData.name, workspaceData.name)

    // Send welcome email to contact
    const sendResult = await sendEmail({
      to: contactData.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    if (!sendResult.success) {
      console.error('[v0] Failed to send welcome email:', sendResult.error)
      // Don't fail the API call if email fails - continue to create system message
    }

    // Create system message in the conversation
    const { data: conversationData, error: conversationError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('contact_id', contact_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!conversationError && conversationData) {
      const { error: messageError } = await supabaseAdmin
        .from('messages')
        .insert({
          conversation_id: conversationData.id,
          content: `Automated welcome email sent to ${contactData.email}`,
          type: 'system',
          direction: 'outbound',
          sender_name: 'System',
          sender_email: null,
        })

      if (messageError) {
        console.error('[v0] Failed to create system message:', messageError)
      }
    }

    // Send notification to workspace email (if configured)
    if (workspaceData.email && workspaceData.email !== contactData.email) {
      try {
        // Fetch first message from conversation for context
        const { data: firstMessage } = await supabaseAdmin
          .from('messages')
          .select('content')
          .eq('conversation_id', conversationData?.id || '')
          .order('created_at', { ascending: true })
          .limit(1)
          .single()

        const messageContent = firstMessage?.content || '[Message content not available]'
        const notificationTemplate = emailTemplates.notificationToWorkspace(contactData.name, messageContent)

        await sendEmail({
          to: workspaceData.email,
          subject: notificationTemplate.subject,
          html: notificationTemplate.html,
        }).catch((err) => {
          console.error('[v0] Failed to send workspace notification:', err)
        })
      } catch (err) {
        console.error('[v0] Error sending workspace notification:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      contactId: contact_id,
      emailSent: sendResult.success,
    })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] Email automation error:', error)

    return NextResponse.json(
      { error: 'Failed to process welcome email', details: error },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Email automation service is running',
    environment: {
      smtpConfigured: !!process.env.SMTP_USER && !!process.env.SMTP_PASSWORD,
    },
  })
}
