
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load Environment Variables from .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log('Loading .env.local...');
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach((line) => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
                process.env[key] = value;
            }
        });
    } else {
        console.warn('.env.local not found, assuming variables are set in environment');
    }
} catch (e) {
    console.error('Error loading .env.local:', e);
}

// 2. Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'MISSING');
console.log('Supabase Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
    console.log('Starting verification...');
    let hasError = false;

    // 3. Test Connection (Public Table?)
    console.log('Testing connection...');
    const { data: countData, error: matchError } = await supabase.from('booking_types').select('count', { count: 'exact', head: true });

    // check if error is network related
    if (matchError && !matchError.code) {
        console.error('Connection Failed (Network/Client):', matchError);
        hasError = true;
    } else if (matchError) {
        console.log('Connection Test result (API Error):', matchError.message, matchError.code);
        // API error means we reached Supabase (e.g. 404 table not found), so connection is actually OK.
    } else {
        console.log('Connection OK');
    }

    // 4. Test Auth Flow (Sign Up Temp User)
    const testEmail = `verify-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    console.log(`Testing Auth: Signing up ${testEmail}...`);

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
    });

    if (authError) {
        console.error('Auth Signup Failed:', authError);
        hasError = true;
    } else if (!authData.user) {
        console.error('Auth Signup suceeded but no user returned. Session:', authData.session);
        hasError = true;
    } else {
        console.log('Auth Signup Successful. User ID:', authData.user.id);

        // 5. Test Database Access (Authenticated)
        console.log('Testing Database Access with new user...');

        // Check Workspaces Table and Columns
        const { error: wsError } = await supabase
            .from('workspaces')
            .select('id, email_sms_settings, availability_settings')
            .limit(1);

        if (wsError) {
            if (wsError.message && (wsError.message.includes('column') || wsError.message.includes('Could not find'))) {
                console.error('Schema Verification Failed:', wsError.message);
                hasError = true;
            } else {
                console.log('Workspace query result:', wsError.message);
            }
        } else {
            console.log('Workspaces schema check: OK (Columns exist)');
        }

        // Check presence of other tables
        const tables = ['bookings', 'contacts', 'inventory_items', 'form_submissions', 'staff_members', 'conversations', 'messages'];
        for (const t of tables) {
            const { error } = await supabase.from(t).select('count', { count: 'exact', head: true });
            if (error && error.code === '42P01') { // undefined_table
                console.error(`Missing table: ${t}`);
                hasError = true;
            } else {
                console.log(`Table '${t}' exists.`);
            }
        }
    }

    if (hasError) {
        console.error('Verification FAILED with errors.');
        process.exit(1);
    } else {
        console.log('Verification PASSED.');
        process.exit(0);
    }
}

verify();
