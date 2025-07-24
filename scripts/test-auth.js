#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

// Load environment variables
require('dotenv').config({ path: '../apps/web/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// Test user creation
async function createTestUser() {
  console.log('\n🔧 Creating Test User')
  console.log('==================')
  
  const email = await question('Email: ')
  const password = await question('Password: ')
  const name = await question('Name: ')
  
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name
      }
    })

    if (authError) {
      console.error('❌ Auth user creation failed:', authError.message)
      return
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        preferred_language: 'pt-BR',
        payment_preferences: {},
        privacy_settings: {
          allowGroupMemory: true,
          dataRetentionDays: 90
        },
        consent_timestamp: new Date().toISOString()
      })

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message)
      
      // Clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return
    }

    // Create audit log
    await supabase
      .from('lgpd_audit_log')
      .insert({
        user_id: authData.user.id,
        action: 'consent_given',
        details: {
          created_via: 'cli_tool',
          creation_timestamp: new Date().toISOString()
        }
      })

    console.log('✅ Test user created successfully!')
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Email: ${email}`)
    console.log(`   Name: ${name}`)
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message)
  }
}

// Test authentication
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication')
  console.log('=========================')
  
  const email = await question('Email: ')
  const password = await question('Password: ')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ Authentication failed:', error.message)
      return
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('❌ Profile fetch failed:', profileError.message)
      return
    }

    console.log('✅ Authentication successful!')
    console.log(`   User ID: ${data.user.id}`)
    console.log(`   Email: ${data.user.email}`)
    console.log(`   Name: ${profile.name}`)
    console.log(`   Language: ${profile.preferred_language}`)
    console.log(`   Last Active: ${profile.last_active_at}`)
    console.log(`   LGPD Consent: ${profile.consent_timestamp ? 'Yes' : 'No'}`)
    
  } catch (error) {
    console.error('❌ Error during authentication test:', error.message)
  }
}

// Test profile management
async function testProfileUpdate() {
  console.log('\n👤 Testing Profile Update')
  console.log('=========================')
  
  const userId = await question('User ID: ')
  const newName = await question('New Name (optional): ')
  const newLanguage = await question('New Language (pt-BR, en-US, es-ES, optional): ')
  
  try {
    const updateData = {}
    if (newName) updateData.name = newName
    if (newLanguage) updateData.preferred_language = newLanguage
    
    if (Object.keys(updateData).length === 0) {
      console.log('ℹ️ No updates provided')
      return
    }

    updateData.last_active_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single()

    if (error) {
      console.error('❌ Profile update failed:', error.message)
      return
    }

    // Create audit log
    await supabase
      .from('lgpd_audit_log')
      .insert({
        user_id: userId,
        action: 'profile_updated',
        details: {
          updated_fields: Object.keys(updateData),
          updated_via: 'cli_tool',
          update_timestamp: new Date().toISOString()
        }
      })

    console.log('✅ Profile updated successfully!')
    console.log(`   Name: ${data.name}`)
    console.log(`   Language: ${data.preferred_language}`)
    console.log(`   Last Active: ${data.last_active_at}`)
    
  } catch (error) {
    console.error('❌ Error during profile update:', error.message)
  }
}

// LGPD compliance verification
async function verifyLGPDCompliance() {
  console.log('\n🛡️ LGPD Compliance Verification')
  console.log('===============================')
  
  const userId = await question('User ID (optional, leave empty for all): ')
  
  try {
    let query = supabase
      .from('lgpd_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: auditLogs, error } = await query

    if (error) {
      console.error('❌ Audit log fetch failed:', error.message)
      return
    }

    console.log('\n📋 Recent LGPD Audit Entries:')
    console.log('-----------------------------')
    
    if (auditLogs.length === 0) {
      console.log('No audit logs found')
      return
    }

    auditLogs.forEach((log, index) => {
      console.log(`${index + 1}. Action: ${log.action}`)
      console.log(`   User ID: ${log.user_id || 'anonymized'}`)
      console.log(`   Date: ${new Date(log.created_at).toLocaleString('pt-BR')}`)
      if (log.details) {
        console.log(`   Details: ${JSON.stringify(log.details, null, 2)}`)
      }
      console.log('   ---')
    })

    // Check compliance status
    if (userId) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('consent_timestamp, privacy_settings, data_retention_date')
        .eq('id', userId)
        .single()

      if (!userError && user) {
        console.log('\n🔍 Compliance Status:')
        console.log(`   LGPD Consent: ${user.consent_timestamp ? '✅ Given' : '❌ Missing'}`)
        console.log(`   Data Retention: ${user.data_retention_date || 'Not set'}`)
        console.log(`   Privacy Settings: ${JSON.stringify(user.privacy_settings, null, 2)}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error during LGPD verification:', error.message)
  }
}

// List users
async function listUsers() {
  console.log('\n📋 User List')
  console.log('============')
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, preferred_language, created_at, last_active_at, consent_timestamp')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ User list fetch failed:', error.message)
      return
    }

    if (users.length === 0) {
      console.log('No users found')
      return
    }

    console.log(`Found ${users.length} users:\n`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Language: ${user.preferred_language}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleString('pt-BR')}`)
      console.log(`   Last Active: ${user.last_active_at ? new Date(user.last_active_at).toLocaleString('pt-BR') : 'Never'}`)
      console.log(`   LGPD Consent: ${user.consent_timestamp ? '✅' : '❌'}`)
      console.log('   ---')
    })
    
  } catch (error) {
    console.error('❌ Error listing users:', error.message)
  }
}

// Main menu
async function showMenu() {
  console.log('\n🔧 RachaAI Authentication Testing CLI')
  console.log('=====================================')
  console.log('1. Create Test User')
  console.log('2. Test Authentication')
  console.log('3. Test Profile Update')
  console.log('4. Verify LGPD Compliance')
  console.log('5. List Users')
  console.log('6. Exit')
  
  const choice = await question('\nSelect an option (1-6): ')
  
  switch (choice) {
    case '1':
      await createTestUser()
      break
    case '2':
      await testAuthentication()
      break
    case '3':
      await testProfileUpdate()
      break
    case '4':
      await verifyLGPDCompliance()
      break
    case '5':
      await listUsers()
      break
    case '6':
      console.log('👋 Goodbye!')
      rl.close()
      return
    default:
      console.log('❌ Invalid option')
  }
  
  await showMenu()
}

// Start the CLI
console.log('🚀 Starting RachaAI Auth Testing CLI...')
console.log('📍 Connected to:', supabaseUrl)

showMenu().catch(error => {
  console.error('❌ CLI Error:', error)
  rl.close()
}) 