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
  let shouldRedirect = false

  try {
    // Step 1 — Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.full_name } },
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Signup failed' }

    const userId = authData.user.id

    // Step 2 — Sign in immediately to get session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (signInError) return { error: signInError.message }

    // Step 3 — Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: formData.company_name?.trim() || 'My Company',
        plan: 'basic',
      })
      .select('id')
      .single()

    if (orgError) {
      console.error('Org error:', orgError)
      return { error: orgError.message }
    }

    // Step 4 — Update profile with org_id
    // Try update first (trigger creates profile row)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        org_id: org.id,
        full_name: formData.full_name,
        role: 'admin',
      })
      .eq('id', userId)

    // If update fails try upsert
    if (updateError) {
      console.error('Update error:', updateError)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          org_id: org.id,
          full_name: formData.full_name,
          role: 'admin',
        })

      if (upsertError) {
        console.error('Upsert error:', upsertError)
        return { error: upsertError.message }
      }
    }

    // Step 5 — Verify org_id was saved
    const { data: verify } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', userId)
      .single()

    console.log('Signup complete. org_id:', verify?.org_id)

    shouldRedirect = true
  } catch (err: any) {
    return { error: err?.message || 'Something went wrong' }
  }

  // redirect() OUTSIDE try/catch — always
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
