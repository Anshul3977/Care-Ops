import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, name } = body

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            )
        }

        // 1. Create auth user via Admin API (bypasses email confirmation)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm so user can login immediately
            user_metadata: { name },
        })

        if (authError) {
            console.error('[Signup API] Auth error:', authError.message)
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            )
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Failed to create auth user' },
                { status: 500 }
            )
        }

        const userId = authData.user.id

        // 2. Create workspace (admin client bypasses RLS)
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)

        const { data: workspace, error: wsError } = await supabaseAdmin
            .from('workspaces')
            .insert([{
                name: `${name}'s Workspace`,
                email,
                slug,
                timezone: body.timezone || 'UTC',
                onboarding_completed: false,
                address: null,
            }])
            .select()
            .single()

        if (wsError) {
            console.error('[Signup API] Workspace creation error:', wsError)
            // Cleanup: delete the auth user since workspace failed
            await supabaseAdmin.auth.admin.deleteUser(userId)
            return NextResponse.json(
                { error: 'Failed to create workspace: ' + wsError.message },
                { status: 500 }
            )
        }

        // 3. Create user record linked to auth user (admin client bypasses RLS)
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .insert([{
                id: userId, // Link to auth user
                workspace_id: workspace.id,
                email,
                name,
                role: 'admin',
                status: 'active',
                password_hash: null,
            }])
            .select()
            .single()

        if (userError) {
            console.error('[Signup API] User record creation error:', userError)
            // Cleanup: delete workspace and auth user
            await supabaseAdmin.from('workspaces').delete().eq('id', workspace.id)
            await supabaseAdmin.auth.admin.deleteUser(userId)
            return NextResponse.json(
                { error: 'Failed to create user record: ' + userError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                workspace_id: userData.workspace_id,
                created_at: userData.created_at,
            },
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[Signup API] Unexpected error:', message)
        return NextResponse.json(
            { error: 'Signup failed: ' + message },
            { status: 500 }
        )
    }
}
