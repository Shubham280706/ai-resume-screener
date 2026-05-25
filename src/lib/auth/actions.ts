'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: {
  full_name: string
  email: string
  password: string
  company_name: string
}) {
  const supabase = await createClient()

  try {
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
        },
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user' }
    }

    // Create organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([{ name: formData.company_name }])
      .select()
      .single()

    if (orgError) {
      return { error: orgError.message }
    }

    // Update profile with org_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ org_id: orgData.id })
      .eq('id', authData.user.id)

    if (updateError) {
      return { error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    console.log('Sign in attempt:', { email: formData.email, error })

    if (error) {
      console.error('Supabase auth error:', error.message)
      return { error: error.message || 'Invalid email or password' }
    }

    if (!data.session) {
      return { error: 'No session created' }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign in catch error:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function signOut() {
  const supabase = await createClient()

  try {
    await supabase.auth.signOut()
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: error instanceof Error ? error.message : 'Sign out failed' }
  }
}
