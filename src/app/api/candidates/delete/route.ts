import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
  try {
    const { candidateId } = await request.json()

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile?.org_id) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 403 }
      )
    }

    // Verify candidate belongs to user's organization
    const { data: candidate } = await supabase
      .from('candidates')
      .select('org_id')
      .eq('id', candidateId)
      .single()

    if (!candidate || candidate.org_id !== profile.org_id) {
      return NextResponse.json(
        { error: 'Candidate not found or unauthorized' },
        { status: 403 }
      )
    }

    // Delete the candidate
    const { error: deleteError } = await supabase
      .from('candidates')
      .delete()
      .eq('id', candidateId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete candidate' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete candidate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
