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
  let userId: string | null = null
  let shouldRedirect = false

  try {
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.full_name } },
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Signup failed' }
    userId = authData.user.id

    // Step 2: Sign in to get active session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })
    if (signInError) return { error: signInError.message }

    // Step 3: Create org
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: formData.company_name?.trim() || 'My Company',
        plan: 'basic',
      })
      .select('id')
      .single()

    if (orgError) return { error: orgError.message }

    // Step 4: Update profile
    await supabase
      .from('profiles')
      .upsert({
        id: userId,
        org_id: org.id,
        full_name: formData.full_name,
        role: 'admin',
      })

    // Step 5: Mark for redirect — do NOT redirect here
    shouldRedirect = true
  } catch (err: any) {
    return { error: err?.message || 'Something went wrong' }
  }

  // redirect() is OUTSIDE try/catch — always
  if (shouldRedirect) redirect('/dashboard')
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  const supabase = await createClient()
  let shouldRedirect = false

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) return { error: 'Invalid email or password' }

    shouldRedirect = true
  } catch (err: any) {
    return { error: err?.message || 'Something went wrong' }
  }

  if (shouldRedirect) redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()

  try {
    await supabase.auth.signOut()
  } catch (err) {
    // ignore signout errors
  }

  redirect('/login')
}
