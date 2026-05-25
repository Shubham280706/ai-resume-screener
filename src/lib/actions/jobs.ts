'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createJob(formData: {
  title: string
  department: string
  description: string
}) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Please log in to create a job' }
    }

    console.log('Creating job for user:', user.id)

    // Get user's organization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return { error: 'Failed to fetch your profile. Please try again.' }
    }

    if (!profile?.org_id) {
      return { error: 'No organization found. Please contact support.' }
    }

    console.log('Creating job with org_id:', profile.org_id)

    // Insert job
    const { data: job, error: insertError } = await supabase
      .from('jobs')
      .insert({
        org_id: profile.org_id,
        title: formData.title,
        department: formData.department,
        description: formData.description,
        status: 'Open',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error full:', JSON.stringify(insertError))
      console.error('Insert error code:', insertError?.code)
      console.error('Insert error details:', insertError?.details)
      console.error('Insert error hint:', insertError?.hint)
      console.error('Insert error message:', insertError?.message)

      return {
        error: `Failed to create job: ${insertError?.message || insertError?.code || JSON.stringify(insertError)}`,
      }
    }

    console.log('Job created successfully:', job)
    redirect(`/jobs/${job.id}`)
  } catch (error) {
    // Next.js redirect() throws a special error - let it pass through
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error('Unexpected error creating job:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { error: errorMessage }
  }
}
