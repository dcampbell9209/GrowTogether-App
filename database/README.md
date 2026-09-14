# GrowTogether Database

This directory contains the database schema and setup files for the GrowTogether mobile app.

## Files

- **`schema.sql`** - Complete database schema with tables, indexes, views, functions, and RLS policies
- **`setup.md`** - Detailed setup guide for Supabase
- **`../scripts/setup-database.js`** - Automated setup script

## Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script to configure your database:

```bash
node scripts/setup-database.js
```

This script will:
- Gather your Supabase project information
- Create environment configuration files
- Display setup instructions
- Help you configure authentication

### Option 2: Manual Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings → API
3. **Run the schema** in Supabase SQL Editor (copy from `schema.sql`)
4. **Configure authentication** in Supabase dashboard
5. **Set up environment variables** in `.env.local`

See `setup.md` for detailed instructions.

## Database Schema Overview

### Core Tables

- **`users`** - User accounts and profiles
- **`volunteer_profiles`** - Volunteer-specific information
- **`chats`** - Chat sessions between students and volunteers
- **`messages`** - Individual chat messages
- **`admin_action_logs`** - Admin action audit trail

### Lookup Tables

- **`schools`** - Available schools
- **`subjects`** - Available subjects for tutoring

### Views and Functions

- **`volunteer_matches`** - View for finding compatible volunteers
- **`get_volunteer_matches(UUID)`** - Function for volunteer matching algorithm

## Security Features

- **Row Level Security (RLS)** - Ensures users can only access their own data
- **Authentication policies** - Proper user isolation
- **Admin permissions** - Secure admin access to all data
- **Audit logging** - Complete admin action tracking

## Performance Features

- **Optimized indexes** - Fast queries for common operations
- **JSONB storage** - Flexible availability and preference data
- **Real-time subscriptions** - Live updates for chat and status changes
- **Efficient matching** - Optimized volunteer-student pairing

## Environment Variables

Create a `.env.local` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing

After setup, test your database:

1. **Sign up a user** in your app
2. **Check the users table** in Supabase dashboard
3. **Create a chat** between users
4. **Verify real-time updates** work
5. **Test admin features** (if applicable)

## Troubleshooting

### Common Issues

- **Permission denied**: Check RLS policies and authentication
- **Tables not found**: Ensure schema was applied completely
- **Real-time not working**: Verify client configuration and permissions

### Getting Help

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the setup guide in `setup.md`
3. Ask for help in the [Supabase Discord](https://discord.supabase.com)

## Production Considerations

- **Backup regularly** - Enable automatic backups in Supabase
- **Monitor performance** - Use Supabase dashboard metrics
- **Secure secrets** - Never expose service role key in client code
- **Scale appropriately** - Monitor usage and upgrade as needed

## Schema Version

Current schema version: **1.0.0**

For schema updates and migrations, see the project's version control history.





