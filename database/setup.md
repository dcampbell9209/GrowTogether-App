# GrowTogether Database Setup Guide

This guide will help you set up the Supabase database for the GrowTogether mobile app.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI for easier management
3. **PostgreSQL Client** (optional): For direct database access

## Setup Steps

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `growtogether`
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually 2-3 minutes)

### 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

### 3. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following settings:

#### Site URL
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: Add your app's redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `exp://localhost:8081` (for Expo development)
  - Your production app's redirect URL

#### OAuth Providers (Optional)
If you want to use Google OAuth:
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials

### 4. Set Up the Database Schema

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

#### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. Link to your remote project:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. Apply the schema:
   ```bash
   supabase db push
   ```

#### Option C: Using psql

1. Get your database connection string from **Settings** → **Database**
2. Run the schema file:
   ```bash
   psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres" -f database/schema.sql
   ```

### 5. Verify the Setup

After running the schema, verify that the following tables were created:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `users`
   - `volunteer_profiles`
   - `chats`
   - `messages`
   - `admin_action_logs`
   - `schools`
   - `subjects`

3. Check that the views were created:
   - `volunteer_matches`

4. Verify that the functions were created:
   - `get_volunteer_matches(UUID)`
   - `update_user_last_active()`
   - `update_chat_updated_at()`
   - `update_updated_at_column()`

### 6. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For server-side operations (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth (if using)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 7. Test the Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. Try to sign up a new user in your app
3. Check the **Authentication** → **Users** tab in Supabase to see if the user was created
4. Check the **Table Editor** → **users** table to see the user data

## Database Features

### Row Level Security (RLS)

The database is configured with Row Level Security policies that ensure:
- Users can only access their own data
- Users can only read/write to chats they participate in
- Admins have access to all data
- Proper data isolation between users

### Real-time Features

Supabase automatically provides real-time subscriptions for:
- New messages in chats
- User status changes
- Chat status updates
- Admin actions

### Performance Optimizations

The schema includes:
- Proper indexes for common queries
- Efficient JSONB storage for availability data
- Optimized views for volunteer matching
- Database functions for complex operations

## Troubleshooting

### Common Issues

1. **"permission denied" errors**
   - Check that RLS policies are correctly configured
   - Verify that the user is properly authenticated

2. **"relation does not exist" errors**
   - Ensure the schema was applied completely
   - Check that all tables, views, and functions were created

3. **Real-time not working**
   - Verify that the Supabase client is properly configured
   - Check that the user has the correct permissions

4. **OAuth not working**
   - Verify redirect URLs are correctly configured
   - Check that OAuth provider settings are correct

### Getting Help

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Visit the [Supabase Discord](https://discord.supabase.com)
3. Check the [GitHub Issues](https://github.com/supabase/supabase/issues)

## Production Considerations

### Security

1. **Never expose service role key** in client-side code
2. **Use environment variables** for all sensitive configuration
3. **Regularly rotate** your database password
4. **Monitor** your database for unusual activity

### Performance

1. **Monitor query performance** using Supabase dashboard
2. **Add indexes** for frequently queried columns
3. **Consider connection pooling** for high-traffic applications
4. **Set up alerts** for database performance issues

### Backup

1. **Enable automatic backups** in Supabase dashboard
2. **Test restore procedures** regularly
3. **Keep multiple backup copies** in different locations
4. **Document recovery procedures**

## Next Steps

After setting up the database:

1. **Configure your app** with the environment variables
2. **Test all features** to ensure everything works
3. **Set up monitoring** and alerting
4. **Plan for scaling** as your user base grows
5. **Document your setup** for team members

## Support

If you encounter any issues during setup:

1. Check this guide first
2. Review the Supabase documentation
3. Search existing GitHub issues
4. Ask for help in the Supabase Discord community





