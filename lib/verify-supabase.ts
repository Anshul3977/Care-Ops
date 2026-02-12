import { supabase } from './supabase'

/**
 * Verify Supabase connection and schema deployment
 * Run this after deploying the schema to confirm everything is set up correctly
 */
export async function verifySUpabaseSetup(): Promise<{
  success: boolean
  message: string
  details: Record<string, unknown>
}> {
  const details: Record<string, unknown> = {}

  try {
    console.log('[v0] Starting Supabase verification...')

    // 1. Test connection
    console.log('[v0] Testing connection to Supabase...')
    const { data: connectionTest, error: connError } = await supabase
      .from('workspaces')
      .select('count')
      .limit(1)

    if (connError) {
      return {
        success: false,
        message: 'Failed to connect to Supabase',
        details: { error: connError.message },
      }
    }

    details.connection = 'OK'
    console.log('[v0] Connection successful')

    // 2. Check tables exist
    console.log('[v0] Checking database tables...')
    const requiredTables = [
      'workspaces',
      'users',
      'contacts',
      'conversations',
      'messages',
      'booking_types',
      'bookings',
      'inventory_items',
      'form_submissions',
      'contact_forms',
      'staff_members',
    ]

    const tableStatus: Record<string, boolean> = {}

    for (const tableName of requiredTables) {
      const { error } = await supabase
        .from(tableName as any)
        .select('1')
        .limit(1)

      tableStatus[tableName] = !error || error.code === 'PGRST116' // PGRST116 means table exists but is empty
    }

    details.tables = tableStatus
    const allTablesExist = Object.values(tableStatus).every((exists) => exists)

    if (!allTablesExist) {
      return {
        success: false,
        message: 'Some tables are missing. Please deploy the schema.',
        details: tableStatus,
      }
    }

    console.log('[v0] All tables verified')

    // 3. Check sample data
    console.log('[v0] Checking sample data...')
    const { data: workspaces, error: wsError } = await supabase
      .from('workspaces')
      .select('count')

    if (!wsError) {
      details.sampleData = {
        workspaces: workspaces?.length || 0,
      }
    }

    console.log('[v0] Verification complete - all checks passed!')

    return {
      success: true,
      message: 'Supabase setup verified successfully',
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('[v0] Verification failed:', error)
    return {
      success: false,
      message: 'Verification error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      details: { error },
    }
  }
}

/**
 * Run this in your browser console to verify setup:
 * import { verifySUpabaseSetup } from '@/lib/verify-supabase'
 * verifySUpabaseSetup().then(result => console.log(result))
 */
