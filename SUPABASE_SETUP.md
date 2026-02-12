# Supabase Integration Setup Guide

This document provides step-by-step instructions for setting up Supabase backend for the CareOps platform.

## Prerequisites

- Supabase account (create at https://supabase.com)
- Node.js 18+ installed
- CareOps frontend repository cloned

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Enter project details:
   - Name: `careops` (or your preference)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for project to initialize (5-10 minutes)

## Step 2: Get API Credentials

1. In Supabase dashboard, go to "Settings" → "API"
2. Copy the following values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Anon Key` (public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Create Environment Variables

Create or update `.env.local` in your CareOps project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace with your actual Supabase credentials from Step 2.

## Step 4: Create Database Schema

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `scripts/supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" (play button)
6. Wait for all tables and policies to be created

## Step 5: Verify Installation

Run the following command to test the connection:

```bash
npm run dev
```

1. Navigate to http://localhost:3000
2. Try to sign up with a new account
3. Check Supabase dashboard → "Authentication" to see new user
4. Check "workspaces" table to see created workspace

## Database Schema Overview

### Core Tables

- **workspaces**: Company/workspace information
- **users**: User accounts with role-based access
- **contacts**: Customer contact information
- **conversations**: Message threads between staff and contacts
- **messages**: Individual messages in conversations

### Booking Tables

- **booking_types**: Service types offered
- **bookings**: Scheduled service bookings

### Forms & Submissions

- **contact_forms**: Custom form templates
- **form_submissions**: Submitted form responses

### Operations

- **inventory_items**: Product/supply inventory tracking
- **staff_members**: Team member management with invitations

## Features Included

### Row Level Security (RLS)

All tables have RLS policies enabled to ensure workspace isolation. Users can only see data from their workspace.

### Automatic Triggers

- Conversations auto-update `last_message_at` when new messages arrive
- Maintains referential integrity across all tables

### Indexes

Strategic indexes on:
- workspace_id (all tables)
- contact_id, booking_date, created_at
- Optimizes common query patterns

## API Functions Available

The `lib/api.ts` file provides ready-to-use functions:

### Workspaces
- `createWorkspace(data)`
- `getWorkspace(id)`
- `updateWorkspace(id, data)`

### Users
- `createUser(data)`
- `getUser(id)`
- `getUsersByWorkspace(workspaceId)`

### Contacts
- `createContact(data)`
- `getContacts(workspaceId)`
- `updateContact(id, data)`

### Bookings
- `createBooking(data)`
- `getBookings(workspaceId, options)`
- `getBookingTypes(workspaceId)`

### Messages & Conversations
- `getConversations(workspaceId)`
- `getMessages(conversationId)`
- `createMessage(data)`

### Forms
- `createFormSubmission(data)`
- `getFormSubmissions(workspaceId)`

### Inventory
- `createInventoryItem(data)`
- `getInventoryItems(workspaceId)`
- `getLowStockItems(workspaceId)`

### Staff
- `createStaffMember(data)`
- `getStaffMembers(workspaceId)`

## Troubleshooting

### "Relation 'public.users' does not exist"
- Solution: Run the schema SQL from Step 4 again

### "RLS policy violation"
- Solution: Ensure you're authenticated and accessing own workspace data

### "NEXT_PUBLIC_SUPABASE_URL is empty"
- Solution: Add environment variables to `.env.local` file

### Supabase connection timeout
- Solution: Check internet connection and Supabase service status

## Next Steps

1. Update contexts (already done in `AuthContext.tsx`)
2. Replace mock data calls with API functions from `lib/api.ts`
3. Test all features with real database
4. Deploy to production when ready

## Security Notes

- Keep `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` only (not in git)
- Add `.env.local` to `.gitignore`
- Use RLS policies to enforce workspace isolation
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- Validate all user input on backend

## Support

For Supabase issues: https://supabase.com/docs
For CareOps questions: Check the main README.md
