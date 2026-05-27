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
      candidatesResult,
      jobsResult
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
          ai_summary,
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

    console.log('Candidates query result:', {
      count: candidatesResult.data?.length,
      error: candidatesResult.error,
      orgId,
    })
    console.log('Jobs query result:', {
      count: jobsResult.data?.length,
      error: jobsResult.error,
    })

    const safeCandidates = candidatesResult.data ?? []
    const safeJobs = jobsResult.data ?? []

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
  AI Summary: ${c.ai_summary || 'No summary available'}
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
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a sharp hiring assistant for NexHire.
Answer questions about candidates and jobs directly.

FORMATTING RULES — follow exactly:
- Numbered lists only: 1. 2. 3.
- NEVER use asterisks (*) for bullets or emphasis
- Each candidate: Name — Score% on first line
  then indented: Skills, Job, recommendation
- Under 150 words per response
- No preamble like "Based on the data..."
- No footnotes like "Note:..."
- End every list with: "RECOMMENDATION: Interview [Name] first."
- If no relevant data: say so in one sentence

SCORE GUIDE:
80%+ = Strong hire
60-79% = Good fit
<60 = Below bar

CANDIDATE DATA (${safeCandidates.length} candidates):
${candidateContext || 'No candidates uploaded yet.'}

JOB DATA (${safeJobs.length} jobs):
${jobContext || 'No jobs created yet.'}

RULES:
- Only answer hiring questions
- Use actual candidate data only, never make up
- If asked non-hiring question: "I only help with hiring decisions. Try asking about your candidates or jobs!"
- Be direct and concise — HR people are busy`
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
