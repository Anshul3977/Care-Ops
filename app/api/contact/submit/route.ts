import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
    try {
        const { workspace_id, name, email, phone, message } = await request.json()

        // Validate required fields
        if (!workspace_id || !name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: workspace_id, name, email, message' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Verify workspace exists
        const { data: workspace, error: wsError } = await supabaseAdmin
            .from('workspaces')
            .select('id, name')
            .eq('id', workspace_id)
            .single()

        if (wsError || !workspace) {
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }

        // 1. Create contact
        const { data: contactData, error: contactError } = await supabaseAdmin
            .from('contacts')
            .insert({
                workspace_id,
                name,
                email,
                phone: phone || null,
                source: 'contact_form',
            })
            .select('id')
            .single()

        if (contactError) {
            console.error('[Contact API] Contact creation error:', contactError)
            return NextResponse.json(
                { error: 'Failed to create contact: ' + contactError.message },
                { status: 500 }
            )
        }

        const contactId = contactData.id

        // 2. Create conversation
        const { data: conversationData, error: conversationError } = await supabaseAdmin
            .from('conversations')
            .insert({
                workspace_id,
                contact_id: contactId,
                subject: `Contact from ${name}`,
            })
            .select('id')
            .single()

        if (conversationError) {
            console.error('[Contact API] Conversation creation error:', conversationError)
            return NextResponse.json(
                { error: 'Failed to create conversation: ' + conversationError.message },
                { status: 500 }
            )
        }

        const conversationId = conversationData.id

        // 3. Create initial message
        const { error: messageError } = await supabaseAdmin
            .from('messages')
            .insert({
                conversation_id: conversationId,
                content: message,
                type: 'email',
                direction: 'inbound',
                sender_name: name,
                sender_email: email,
            })

        if (messageError) {
            console.error('[Contact API] Message creation error:', messageError)
            return NextResponse.json(
                { error: 'Failed to create message: ' + messageError.message },
                { status: 500 }
            )
        }

        // 4. Trigger welcome email (fire and forget)
        try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            await fetch(`${appUrl}/api/automation/send-welcome`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact_id: contactId }),
            })
        } catch (emailErr) {
            console.error('[Contact API] Email trigger error (non-fatal):', emailErr)
        }

        return NextResponse.json({
            success: true,
            contactId,
            conversationId,
        })
    } catch (err) {
        console.error('[Contact API] Unexpected error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
