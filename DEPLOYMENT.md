# CareOps Supabase Deployment Guide

## ✅ Environment Setup Complete

Your Supabase credentials are already configured in the project:
- `NEXT_PUBLIC_SUPABASE_URL`: https://gyzcvsgubcfmbtwqmou.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Configured (visible in your project settings)

## 📋 Deploy Database Schema

Follow these steps to deploy the database schema to your Supabase instance:

### Step 1: Access Supabase SQL Editor
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project: `gyzcvsgubcfmbtwqmou`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Execute Schema
1. Open `scripts/supabase-schema.sql` from the project root
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run** to execute the schema

### Step 3: Verify Tables Created
After execution, you should see these tables in your database:
- ✅ `workspaces` - Business workspace data
- ✅ `users` - Team members and staff
- ✅ `contacts` - Customer contact information
- ✅ `conversations` - Message threads
- ✅ `messages` - Individual messages
- ✅ `booking_types` - Service definitions
- ✅ `bookings` - Customer bookings
- ✅ `inventory_items` - Stock management
- ✅ `form_submissions` - Form response tracking
- ✅ `contact_forms` - Custom form definitions
- ✅ `staff_members` - Team member details

## 🔒 Row Level Security (RLS)

The schema includes RLS policies that automatically enforce workspace isolation:
- Users can only access data from their assigned workspace
- Each table is protected with appropriate RLS policies
- Policies use `auth.uid()` for user identification

**Important**: RLS is pre-configured in the SQL but may need to be enabled in Supabase:
1. Go to **Authentication** → **Policies**
2. Verify RLS is enabled on each table

## 🚀 Running the App

Once the schema is deployed:

```bash
npm run dev
```

The app is now fully integrated with Supabase:
- Authentication uses Supabase Auth (with mock fallback)
- All data is persisted to Supabase
- Real-time updates are available via Supabase subscriptions
- Offline mode falls back to localStorage

## 📊 Sample Data

The schema includes sample data for testing:
- Demo workspace: "CareOps Demo"
- Sample users, contacts, bookings, and inventory items
- Use demo email: `admin@careops.com` to explore the workspace

## 🔧 Troubleshooting

### Connection Issues
- Verify credentials in `.env.local`
- Check that your Supabase project is active
- Ensure the anon key has proper permissions

### RLS Policy Errors
- Confirm RLS is enabled in Supabase
- Check that the user is authenticated before making queries
- Review the specific table policy in Supabase UI

### Data Not Persisting
- Check browser console for error messages
- Verify the user has workspace_id set correctly
- Confirm RLS policies allow the operation

## 📚 API Functions

All Supabase operations are handled by functions in `lib/api.ts`:
- `createWorkspace()` - Create new workspace
- `createUser()` - Add team member
- `createBooking()` - Create booking
- `updateInventory()` - Update stock levels
- And many more...

Each function includes error handling and automatic logging.

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Use RLS policies** - All data is automatically workspace-isolated
3. **Validate on server** - Backend validation in place via RLS
4. **Keep anon key secure** - It's public but limited by RLS policies

## ✨ Next Steps

1. Deploy the schema (see Step 2 above)
2. Run `npm run dev` to start the development server
3. Visit http://localhost:3000
4. Test with demo credentials or create a new account
5. Access the admin dashboard to manage your workspace

## 📖 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time subscriptions](https://supabase.com/docs/guides/realtime)
- [Project API reference](./SUPABASE_SETUP.md)

---

**Status**: ✅ Ready to deploy
**Last Updated**: 2026-02-12
