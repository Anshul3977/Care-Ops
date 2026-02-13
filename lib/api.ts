import { supabase } from './supabase'
import type { Database } from './supabase'

// ==================== WORKSPACE OPERATIONS ====================

export async function createWorkspace(data: Database['public']['Tables']['workspaces']['Insert']) {
  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating workspace:', error)
    throw error
  }
  return workspace
}

export async function getWorkspace(id: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[v0] Error fetching workspace:', error)
    throw error
  }
  return data
}

export async function getWorkspaceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('[v0] Error fetching workspace by slug:', error)
    throw error
  }
  return data
}

export async function updateWorkspace(id: string, data: Database['public']['Tables']['workspaces']['Update']) {
  const { data: updated, error } = await supabase
    .from('workspaces')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating workspace:', error)
    throw error
  }
  return updated
}

// ==================== USER OPERATIONS ====================

export async function createUser(data: Database['public']['Tables']['users']['Insert']) {
  const { data: user, error } = await supabase
    .from('users')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating user:', error)
    throw error
  }
  return user
}

export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[v0] Error fetching user:', error)
    throw error
  }
  return data
}

export async function getUsersByWorkspace(workspaceId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching workspace users:', error)
    throw error
  }
  return data
}

export async function updateUser(id: string, data: Database['public']['Tables']['users']['Update']) {
  const { data: updated, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating user:', error)
    throw error
  }
  return updated
}

// ==================== CONTACT OPERATIONS ====================

export async function createContact(data: Database['public']['Tables']['contacts']['Insert']) {
  const { data: contact, error } = await supabase
    .from('contacts')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating contact:', error)
    throw error
  }
  return contact
}

export async function getContact(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[v0] Error fetching contact:', error)
    throw error
  }
  return data
}

export async function getContacts(workspaceId: string, options?: { limit?: number; offset?: number }) {
  let query = supabase
    .from('contacts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('[v0] Error fetching contacts:', error)
    throw error
  }
  return data
}

export async function updateContact(id: string, data: Database['public']['Tables']['contacts']['Update']) {
  const { data: updated, error } = await supabase
    .from('contacts')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating contact:', error)
    throw error
  }
  return updated
}

// ==================== BOOKING OPERATIONS ====================

export async function createBooking(data: Database['public']['Tables']['bookings']['Insert']) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating booking:', error)
    throw error
  }
  return booking
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      contact:contacts(name, email, phone),
      booking_type:booking_types(name, duration_minutes, price)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('[v0] Error fetching booking:', error)
    throw error
  }
  return data
}

export async function getBookings(workspaceId: string, options?: {
  status?: string
  startDate?: string
  endDate?: string
  limit?: number
}) {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      contact:contacts(name, email, phone),
      booking_type:booking_types(name, duration_minutes, price)
    `)
    .eq('workspace_id', workspaceId)

  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.startDate) {
    query = query.gte('booking_date', options.startDate)
  }
  if (options?.endDate) {
    query = query.lte('booking_date', options.endDate)
  }

  query = query.order('booking_date', { ascending: true })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[v0] Error fetching bookings:', error)
    throw error
  }
  return data
}

export async function updateBooking(id: string, data: Database['public']['Tables']['bookings']['Update']) {
  const { data: updated, error } = await supabase
    .from('bookings')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating booking:', error)
    throw error
  }
  return updated
}

// ==================== BOOKING TYPE OPERATIONS ====================

export async function createBookingType(data: Database['public']['Tables']['booking_types']['Insert']) {
  const { data: bookingType, error } = await supabase
    .from('booking_types')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating booking type:', error)
    throw error
  }
  return bookingType
}

export async function getBookingTypes(workspaceId: string) {
  const { data, error } = await supabase
    .from('booking_types')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('[v0] Error fetching booking types:', error)
    throw error
  }
  return data
}

// ==================== CONVERSATION OPERATIONS ====================

export async function createConversation(data: Database['public']['Tables']['conversations']['Insert']) {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating conversation:', error)
    throw error
  }
  return conversation
}

export async function getConversations(workspaceId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      contact:contacts(name, email)
    `)
    .eq('workspace_id', workspaceId)
    .eq('is_archived', false)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching conversations:', error)
    throw error
  }
  return data
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[v0] Error fetching messages:', error)
    throw error
  }
  return data
}

export async function createMessage(data: Database['public']['Tables']['messages']['Insert']) {
  const { data: message, error } = await supabase
    .from('messages')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating message:', error)
    throw error
  }
  return message
}

// ==================== FORM SUBMISSION OPERATIONS ====================

export async function createFormSubmission(data: Database['public']['Tables']['form_submissions']['Insert']) {
  const { data: submission, error } = await supabase
    .from('form_submissions')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating form submission:', error)
    throw error
  }
  return submission
}

export async function getFormSubmissions(workspaceId: string, options?: {
  formName?: string
  status?: string
  limit?: number
}) {
  let query = supabase
    .from('form_submissions')
    .select(`
      *,
      contact:contacts(name, email)
    `)
    .eq('workspace_id', workspaceId)

  if (options?.formName) {
    query = query.eq('form_name', options.formName)
  }
  if (options?.status) {
    query = query.eq('status', options.status)
  }

  query = query.order('submitted_at', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('[v0] Error fetching form submissions:', error)
    throw error
  }
  return data
}

export async function updateFormSubmission(id: string, data: Database['public']['Tables']['form_submissions']['Update']) {
  const { data: updated, error } = await supabase
    .from('form_submissions')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating form submission:', error)
    throw error
  }
  return updated
}

// ==================== INVENTORY OPERATIONS ====================

export async function createInventoryItem(data: Database['public']['Tables']['inventory_items']['Insert']) {
  const { data: item, error } = await supabase
    .from('inventory_items')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating inventory item:', error)
    throw error
  }
  return item
}

export async function getInventoryItems(workspaceId: string) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('[v0] Error fetching inventory items:', error)
    throw error
  }
  return data
}

export async function getLowStockItems(workspaceId: string) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('quantity', { ascending: true })

  if (error) {
    console.error('[v0] Error fetching low stock items:', error)
    throw error
  }
  // Supabase PostgREST doesn't support cross-column comparisons natively,
  // so we filter in JavaScript
  return (data || []).filter(item => item.quantity <= item.reorder_level)
}

export async function updateInventoryItem(id: string, data: Database['public']['Tables']['inventory_items']['Update']) {
  const { data: updated, error } = await supabase
    .from('inventory_items')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating inventory item:', error)
    throw error
  }
  return updated
}

// ==================== STAFF OPERATIONS ====================

export async function createStaffMember(data: Database['public']['Tables']['staff_members']['Insert']) {
  const { data: staff, error } = await supabase
    .from('staff_members')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating staff member:', error)
    throw error
  }
  return staff
}

export async function getStaffMembers(workspaceId: string) {
  const { data, error } = await supabase
    .from('staff_members')
    .select(`
      *,
      user:users(name, email, role)
    `)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[v0] Error fetching staff members:', error)
    throw error
  }
  return data
}

export async function updateStaffMember(id: string, data: Database['public']['Tables']['staff_members']['Update']) {
  const { data: updated, error } = await supabase
    .from('staff_members')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating staff member:', error)
    throw error
  }
  return updated
}

// ==================== CONTACT FORM OPERATIONS ====================

export async function createContactForm(data: Database['public']['Tables']['contact_forms']['Insert']) {
  const { data: form, error } = await supabase
    .from('contact_forms')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating contact form:', error)
    throw error
  }
  return form
}

export async function getContactForms(workspaceId: string) {
  const { data, error } = await supabase
    .from('contact_forms')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching contact forms:', error)
    throw error
  }
  return data
}

export async function updateContactForm(id: string, data: Database['public']['Tables']['contact_forms']['Update']) {
  const { data: updated, error } = await supabase
    .from('contact_forms')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating contact form:', error)
    throw error
  }
  return updated
}
