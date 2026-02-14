import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET /api/contact/workspace?slug=xxx — public endpoint to look up workspace by slug
export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get('slug')

    if (!slug) {
        return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
        .from('workspaces')
        .select('id, name, email, address')
        .eq('slug', slug)
        .single()

    if (error || !data) {
        return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    return NextResponse.json({ workspace: data })
}
