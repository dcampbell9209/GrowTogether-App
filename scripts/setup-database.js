#!/usr/bin/env node

/**
 * Database Setup Script for GrowTogether
 * 
 * This script helps set up the Supabase database with the proper schema,
 * sample data, and configuration.
 * 
 * Usage:
 *   node scripts/setup-database.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bright}[Step ${step}]${colors.reset} ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function confirm(question) {
  const answer = await askQuestion(`${question} (y/N): `);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

function readSchemaFile() {
  try {
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    return fs.readFileSync(schemaPath, 'utf8');
  } catch (error) {
    throw new Error(`Could not read schema file: ${error.message}`);
  }
}

function createEnvTemplate(supabaseUrl, anonKey, serviceRoleKey) {
  return `# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${anonKey}

# For server-side operations (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}

# Google OAuth Configuration (optional)
# EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
# EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Development Settings
EXPO_PUBLIC_APP_ENV=development
`;
}

function createSupabaseConfig(supabaseUrl, anonKey) {
  return `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '${supabaseUrl}';
const supabaseAnonKey = '${anonKey}';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
`;
}

async function main() {
  log('\n' + '='.repeat(60), 'bright');
  log('🚀 GrowTogether Database Setup', 'bright');
  log('='.repeat(60), 'bright');

  try {
    logStep(1, 'Gathering Supabase Project Information');
    
    const supabaseUrl = await askQuestion('Enter your Supabase Project URL (e.g., https://your-project.supabase.co): ');
    const anonKey = await askQuestion('Enter your Supabase Anon Key: ');
    const serviceRoleKey = await askQuestion('Enter your Supabase Service Role Key (optional, for admin features): ');

    if (!supabaseUrl || !anonKey) {
      logError('Supabase URL and Anon Key are required!');
      process.exit(1);
    }

    logStep(2, 'Reading Database Schema');
    const schema = readSchemaFile();
    logSuccess('Schema file loaded successfully');

    logStep(3, 'Creating Environment Configuration');
    
    // Create .env.local file
    const envContent = createEnvTemplate(supabaseUrl, anonKey, serviceRoleKey);
    const envPath = path.join(__dirname, '..', '.env.local');
    
    if (fs.existsSync(envPath)) {
      const overwrite = await confirm('⚠️  .env.local already exists. Overwrite it?');
      if (!overwrite) {
        logWarning('Skipping .env.local creation');
      } else {
        fs.writeFileSync(envPath, envContent);
        logSuccess('Created .env.local file');
      }
    } else {
      fs.writeFileSync(envPath, envContent);
      logSuccess('Created .env.local file');
    }

    // Create Supabase config file
    const configContent = createSupabaseConfig(supabaseUrl, anonKey);
    const configPath = path.join(__dirname, '..', 'src', 'services', 'supabase.ts');
    
    if (fs.existsSync(configPath)) {
      const overwrite = await confirm('⚠️  Supabase config already exists. Overwrite it?');
      if (!overwrite) {
        logWarning('Skipping Supabase config creation');
      } else {
        fs.writeFileSync(configPath, configContent);
        logSuccess('Updated Supabase configuration');
      }
    } else {
      fs.writeFileSync(configPath, configContent);
      logSuccess('Created Supabase configuration');
    }

    logStep(4, 'Database Setup Instructions');
    
    logInfo('Next steps to complete your database setup:');
    log('\n1. Go to your Supabase dashboard');
    log('2. Navigate to SQL Editor');
    log('3. Create a new query');
    log('4. Copy and paste the schema from database/schema.sql');
    log('5. Click "Run" to execute the schema');
    
    if (await confirm('\nWould you like to display the schema for easy copying?')) {
      log('\n' + '='.repeat(60), 'bright');
      log('DATABASE SCHEMA (Copy this to Supabase SQL Editor)', 'bright');
      log('='.repeat(60), 'bright');
      log(schema);
      log('='.repeat(60), 'bright');
    }

    logStep(5, 'Verification Steps');
    
    logInfo('After running the schema, verify that these tables were created:');
    log('- users');
    log('- volunteer_profiles');
    log('- chats');
    log('- messages');
    log('- admin_action_logs');
    log('- schools');
    log('- subjects');
    
    logInfo('Also verify these views and functions:');
    log('- volunteer_matches (view)');
    log('- get_volunteer_matches() (function)');

    logStep(6, 'Authentication Setup');
    
    logInfo('Configure authentication in your Supabase dashboard:');
    log('1. Go to Authentication → Settings');
    log('2. Set Site URL to: http://localhost:3000');
    log('3. Add Redirect URLs:');
    log('   - http://localhost:3000/auth/callback');
    log('   - exp://localhost:8081');
    log('   - Your production app URL');

    if (await confirm('\nWould you like to set up Google OAuth?')) {
      logInfo('Google OAuth setup:');
      log('1. Go to Authentication → Providers');
      log('2. Enable Google provider');
      log('3. Add your Google OAuth credentials');
      log('4. Update .env.local with your Google client ID');
    }

    logStep(7, 'Testing');
    
    logInfo('Test your setup:');
    log('1. Start your development server: npm start');
    log('2. Try signing up a new user');
    log('3. Check the Users table in Supabase dashboard');
    log('4. Verify real-time features work');

    log('\n' + '='.repeat(60), 'bright');
    logSuccess('Database setup configuration complete!');
    log('='.repeat(60), 'bright');
    
    logInfo('Remember to:');
    log('• Keep your service role key secret');
    log('• Test all features before going to production');
    log('• Set up proper backup procedures');
    log('• Monitor your database performance');

  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle script termination
process.on('SIGINT', () => {
  log('\n\nSetup cancelled by user.', 'yellow');
  rl.close();
  process.exit(0);
});

// Run the setup
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});





