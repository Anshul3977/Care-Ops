-- CareOps Supabase Database Schema
-- This SQL creates the complete backend structure for the CareOps service business operations platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSON operators
CREATE EXTENSION IF NOT EXISTS "jsonb_dist";

-- ==================== WORKSPACES TABLE ====================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  timezone TEXT DEFAULT 'UTC',
  slug TEXT UNIQUE NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ==================== USERS TABLE ====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'viewer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, email)
);

CREATE INDEX idx_users_workspace_id ON users(workspace_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_workspace_email ON users(workspace_id, email);

-- ==================== CONTACTS TABLE ====================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'direct' CHECK (source IN ('contact_form', 'direct_booking', 'referral', 'social', 'direct')),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_workspace_id ON contacts(workspace_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- ==================== CONVERSATIONS TABLE ====================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  subject TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  unread_count INT DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_workspace_id ON conversations(workspace_id);
CREATE INDEX idx_conversations_contact_id ON conversations(contact_id);
CREATE INDEX idx_conversations_is_archived ON conversations(is_archived);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);

-- ==================== MESSAGES TABLE ====================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'system')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  is_read BOOLEAN DEFAULT FALSE,
  sender_name TEXT,
  sender_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Trigger to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at, updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- ==================== BOOKING TYPES TABLE ====================
CREATE TABLE booking_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_types_workspace_id ON booking_types(workspace_id);
CREATE INDEX idx_booking_types_is_active ON booking_types(is_active);

-- ==================== BOOKINGS TABLE ====================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  booking_type_id UUID REFERENCES booking_types(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_workspace_id ON bookings(workspace_id);
CREATE INDEX idx_bookings_contact_id ON bookings(contact_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- ==================== FORM SUBMISSIONS TABLE ====================
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  form_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'completed', 'needs-revision')),
  fields JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_form_submissions_workspace_id ON form_submissions(workspace_id);
CREATE INDEX idx_form_submissions_contact_id ON form_submissions(contact_id);
CREATE INDEX idx_form_submissions_booking_id ON form_submissions(booking_id);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);

-- ==================== INVENTORY ITEMS TABLE ====================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INT NOT NULL DEFAULT 0,
  reorder_level INT DEFAULT 10,
  unit_price DECIMAL(10, 2),
  supplier TEXT,
  location TEXT,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_items_workspace_id ON inventory_items(workspace_id);
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX idx_inventory_items_category ON inventory_items(category);

-- ==================== STAFF MEMBERS TABLE ====================
CREATE TABLE staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '{"view_bookings": true, "view_contacts": true}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending_invitation')),
  invitation_token TEXT UNIQUE,
  invitation_expires_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, email)
);

CREATE INDEX idx_staff_members_workspace_id ON staff_members(workspace_id);
CREATE INDEX idx_staff_members_user_id ON staff_members(user_id);
CREATE INDEX idx_staff_members_email ON staff_members(email);
CREATE INDEX idx_staff_members_status ON staff_members(status);

-- ==================== CONTACT FORMS TABLE ====================
CREATE TABLE contact_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  submission_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_forms_workspace_id ON contact_forms(workspace_id);

-- ==================== ROW LEVEL SECURITY (RLS) POLICIES ====================

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Workspaces: Users can only see their own workspace
CREATE POLICY "workspace_users_can_view_own" ON workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.workspace_id = workspaces.id
      AND users.id = auth.uid()
    )
  );

-- Users: Can only see other users in same workspace
-- Users: Can see own record + other users in same workspace
CREATE POLICY "users_can_view_workspace_users" ON users
  FOR SELECT USING (
    id = auth.uid()
    OR workspace_id = (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Contacts: Workspace isolation
CREATE POLICY "contacts_workspace_isolation" ON contacts
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Conversations: Workspace isolation
CREATE POLICY "conversations_workspace_isolation" ON conversations
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Messages: Through conversation workspace
CREATE POLICY "messages_workspace_isolation" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE workspace_id IN (
        SELECT workspace_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Booking Types: Workspace isolation
CREATE POLICY "booking_types_workspace_isolation" ON booking_types
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Bookings: Workspace isolation
CREATE POLICY "bookings_workspace_isolation" ON bookings
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Form Submissions: Workspace isolation
CREATE POLICY "form_submissions_workspace_isolation" ON form_submissions
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Inventory: Workspace isolation
CREATE POLICY "inventory_workspace_isolation" ON inventory_items
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Staff Members: Workspace isolation
CREATE POLICY "staff_members_workspace_isolation" ON staff_members
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- Contact Forms: Workspace isolation
CREATE POLICY "contact_forms_workspace_isolation" ON contact_forms
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- ==================== SAMPLE DATA FOR TESTING ====================

-- Insert sample workspace
INSERT INTO workspaces (name, email, address, timezone, slug, onboarding_completed)
VALUES ('Demo Company', 'admin@democompany.com', '123 Main St', 'America/New_York', 'demo-company', true);

-- Insert sample booking type
INSERT INTO booking_types (workspace_id, name, description, duration_minutes, price)
SELECT id, 'Standard Cleaning', '2-hour standard house cleaning service', 120, 150.00
FROM workspaces WHERE slug = 'demo-company'
LIMIT 1;

-- Insert sample contacts
INSERT INTO contacts (workspace_id, name, email, phone, source)
SELECT id, 'John Smith', 'john@example.com', '555-0101', 'direct_booking'
FROM workspaces WHERE slug = 'demo-company'
LIMIT 1;

INSERT INTO contacts (workspace_id, name, email, phone, source)
SELECT id, 'Jane Doe', 'jane@example.com', '555-0102', 'contact_form'
FROM workspaces WHERE slug = 'demo-company'
LIMIT 1;

-- Insert sample bookings
INSERT INTO bookings (workspace_id, contact_id, booking_type_id, booking_date, booking_time, status)
SELECT w.id, c.id, bt.id, CURRENT_DATE + INTERVAL '3 days', '10:00'::time, 'confirmed'
FROM workspaces w
JOIN contacts c ON c.workspace_id = w.id
JOIN booking_types bt ON bt.workspace_id = w.id
WHERE w.slug = 'demo-company' AND c.name = 'John Smith'
LIMIT 1;

-- Insert sample conversations
INSERT INTO conversations (workspace_id, contact_id, subject)
SELECT w.id, c.id, 'Booking Confirmation'
FROM workspaces w
JOIN contacts c ON c.workspace_id = w.id
WHERE w.slug = 'demo-company' AND c.name = 'John Smith'
LIMIT 1;

-- Insert sample messages
INSERT INTO messages (conversation_id, content, type, direction, is_read)
SELECT id, 'Your booking has been confirmed for March 15th at 10:00 AM', 'email', 'outbound', false
FROM conversations
LIMIT 1;

-- Insert sample inventory
INSERT INTO inventory_items (workspace_id, name, sku, category, quantity, reorder_level, unit_price)
SELECT id, 'Industrial Vacuum Cleaner', 'VAC-001', 'Equipment', 5, 2, 450.00
FROM workspaces WHERE slug = 'demo-company'
LIMIT 1;

INSERT INTO inventory_items (workspace_id, name, sku, category, quantity, reorder_level, unit_price)
SELECT id, 'Eco-Friendly Cleaner', 'CLEAN-ECO-001', 'Supplies', 25, 10, 15.00
FROM workspaces WHERE slug = 'demo-company'
LIMIT 1;

-- Insert sample contact form
INSERT INTO contact_forms (workspace_id, name, description, fields)
SELECT id, 'Service Inquiry', 'General service inquiry form', '[
  {"id": "name", "label": "Full Name", "type": "text", "required": true},
  {"id": "email", "label": "Email", "type": "email", "required": true},
  {"id": "phone", "label": "Phone", "type": "phone", "required": true},
  {"id": "service", "label": "Service Interested In", "type": "select", "required": true}
]'::jsonb
FROM workspaces WHERE slug = 'demo-company'
LIMIT 1;
