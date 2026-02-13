import { createClient } from '@supabase/supabase-js'

// Server-side only Supabase admin client
// Uses the service_role key which bypasses RLS
// NEVER expose this client to the browser

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceRoleKey) {
    console.warn(
        '[v0] SUPABASE_SERVICE_ROLE_KEY is not set. Server-side admin operations will fail. ' +
        'Add it to .env.local from Supabase Dashboard → Settings → API → service_role key.'
    )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})
