import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[v0] Supabase environment variables are not set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
})

// Export types for easier usage
export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          email: string
          address: string | null
          timezone: string
          slug: string
          onboarding_completed: boolean
          email_sms_settings?: any
          availability_settings?: any
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>
      }
      users: {
        Row: {
          id: string
          workspace_id: string
          email: string
          password_hash: string | null
          name: string
          role: 'admin' | 'staff' | 'viewer'
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          workspace_id: string
          name: string
          email: string | null
          phone: string | null
          source: string
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          workspace_id: string
          contact_id: string
          subject: string | null
          is_archived: boolean
          unread_count: number
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          content: string
          type: 'email' | 'sms' | 'system'
          direction: 'inbound' | 'outbound'
          is_read: boolean
          sender_name: string | null
          sender_email: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      booking_types: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          duration_minutes: number
          price: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['booking_types']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['booking_types']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          workspace_id: string
          contact_id: string
          booking_type_id: string | null
          booking_date: string
          booking_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      form_submissions: {
        Row: {
          id: string
          workspace_id: string
          contact_id: string | null
          booking_id: string | null
          form_name: string
          status: 'pending' | 'reviewed' | 'completed' | 'needs-revision'
          fields: Record<string, any> | null
          submitted_at: string
          reviewed_by: string | null
          reviewed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['form_submissions']['Row'], 'id' | 'created_at' | 'updated_at' | 'submitted_at'>
        Update: Partial<Database['public']['Tables']['form_submissions']['Insert']>
      }
      inventory_items: {
        Row: {
          id: string
          workspace_id: string
          name: string
          sku: string | null
          category: string | null
          quantity: number
          reorder_level: number
          unit_price: number | null
          supplier: string | null
          location: string | null
          expiry_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>
      }
      staff_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string | null
          email: string
          name: string
          permissions: Record<string, any>
          status: 'active' | 'inactive' | 'pending_invitation'
          invitation_token: string | null
          invitation_expires_at: string | null
          invited_at: string
          accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['staff_members']['Row'], 'id' | 'created_at' | 'updated_at' | 'invited_at'>
        Update: Partial<Database['public']['Tables']['staff_members']['Insert']>
      }
      contact_forms: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          fields: Array<Record<string, any>>
          submission_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contact_forms']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contact_forms']['Insert']>
      }
    }
  }
}
