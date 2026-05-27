import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      )
    }

    // Get current user and org
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    const orgId = profile?.org_id
    if (!orgId) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      )
    }

    // RETRIEVE — fetch relevant data from Supabase
    const [
      { data: candidates },
      { data: jobs }
    ] = await Promise.all([
      supabase
        .from('candidates')
        .select(`
          id,
          full_name,
          score,
          status,
          seniority,
          location,
          years_experience,
          skills_matched,
          skills_missing,
          summary,
          job_id,
          created_at,
          jobs(title)
        `)
        .eq('org_id', orgId)
        .order('score', { ascending: false })
        .limit(50),
      supabase
        .from('jobs')
        .select('id, title, department, status, created_at')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(20)
    ])

    const safeCandidates = candidates ?? []
    const safeJobs = jobs ?? []

    // Build context string from real data
    const candidateContext = safeCandidates.map(c => `
Candidate: ${c.full_name || 'Unknown'}
  Job Applied: ${(c.jobs as any)?.title || 'Unknown'}
  Score: ${c.score || 0}%
  Status: ${c.status || 'Unknown'}
  Seniority: ${c.seniority || 'Unknown'}
  Location: ${c.location || 'Unknown'}
  Experience: ${c.years_experience || 0} years
  Skills Matched: ${Array.isArray(c.skills_matched) ? c.skills_matched.join(', ') : 'None listed'}
  Skills Missing: ${Array.isArray(c.skills_missing) ? c.skills_missing.join(', ') : 'None listed'}
  AI Summary: ${c.summary || 'No summary available'}
`).join('\n---\n')

    const jobContext = safeJobs.map(j => `
Job: ${j.title}
  Department: ${j.department || 'Not specified'}
  Status: ${j.status}
  Candidates: ${safeCandidates.filter(
    c => c.job_id === j.id
  ).length}
`).join('\n---\n')

    // Build conversation history for context
    const conversationHistory = (history || [])
      .slice(-6) // last 6 messages for context
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))

    // GENERATE — call Groq with context
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a smart hiring assistant for NexHire.
You help HR teams make better hiring decisions by analyzing
candidate data and answering questions about their pipeline.

You have access to the following real data:

JOBS (${safeJobs.length} total):
${jobContext || 'No jobs created yet.'}

CANDIDATES (${safeCandidates.length} total):
${candidateContext || 'No candidates uploaded yet.'}

INSTRUCTIONS:
- Answer questions about candidates, scores, skills, and hiring decisions
- Be concise and direct — HR people are busy
- When comparing candidates, give a clear recommendation
- Format lists with bullet points for readability
- If asked about a specific candidate, use their actual data
- Score >= 80 = Strong match, 60-79 = Good fit, <60 = Below bar
- Never make up candidates or data not in the context above
- If you don't have enough data to answer, say so clearly
- Keep responses under 200 words unless comparison is needed`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    const reply = completion.choices[0]?.message?.content ||
      'Sorry, I could not generate a response.'

    return NextResponse.json({ reply })

  } catch (err: any) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
