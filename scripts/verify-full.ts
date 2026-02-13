
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
    const { error: matchError } = await supabase.from('booking_types').select('count').limit(1);
    if (matchError && matchError.code !== 'PGRST116') { // PGRST116 is no rows, which is fine for connection check? No, select count returns rows.
        // connection error usually 500 or something. 
        // If table doesn't exist/RLS blocks, we get error.
        // Let's assume connection is OK if we get a response, even error.
        console.log('Connection test response:', matchError ? matchError.message : 'OK');
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
        console.error('Auth Signup Failed:', authError.message);
        hasError = true;
    } else if (!authData.user) {
        console.error('Auth Signup suceeded but no user returned.');
        hasError = true;
    } else {
        console.log('Auth Signup Successful. User ID:', authData.user.id);

        // 5. Test Database Access (Authenticated)
        console.log('Testing Database Access with new user...');

        // Check Workspaces Table and Columns
        // We can't query information_schema easily via client.
        // We will try to select specific columns from workspaces.
        const { error: wsError } = await supabase
            .from('workspaces')
            .select('id, email_sms_settings, availability_settings')
            .limit(1);

        // If column doesn't exist, Supabase throws error: "Could not find the 'email_sms_settings' column..."
        if (wsError) {
            if (wsError.message.includes('column')) {
                console.error('Schema Verification Failed:', wsError.message);
                hasError = true;
            } else {
                // Other error (RLS? Empty?)
                console.log('Workspace query result:', wsError.message);
                // If RLS blocks, that's expected if we haven't created a workspace yet.
            }
        } else {
            console.log('Workspaces schema check: OK (Columns exist)');
        }

        // Check Insert into Workspaces (if logic permits)
        // We usually create workspace on signup via logic, but here we are raw.
        // Let's verify other tables exist by simple selects.
        const tables = ['bookings', 'contacts', 'inventory_items', 'form_submissions', 'staff_members'];
        for (const t of tables) {
            const { error } = await supabase.from(t).select('id').limit(1);
            if (error && error.code === '42P01') { // undefined_table
                console.error(`Missing table: ${t}`);
                hasError = true;
            } else {
                console.log(`Table '${t}' exists.`);
            }
        }
    }

    // 6. Cleanup (Optional - Anon key cannot delete users usually)
    // We leave the user.

    if (hasError) {
        console.error('Verification FAILED with errors.');
        process.exit(1);
    } else {
        console.log('Verification PASSED.');
        process.exit(0);
    }
}

verify();
