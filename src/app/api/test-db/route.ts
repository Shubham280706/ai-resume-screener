import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const jobCount = await prisma.job.count()
    const candidateCount = await prisma.candidate.count()
    console.log('✓ Database connected');
    console.log('Jobs in DB:', jobCount);
    console.log('Candidates in DB:', candidateCount);

    return NextResponse.json({
      connected: true,
      jobs: jobCount,
      candidates: candidateCount,
      message: 'Database connection successful',
      env: {
        databaseUrlSet: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Full error:', JSON.stringify(error, null, 2))

    return NextResponse.json({
      connected: false,
      error: errorMessage,
      databaseUrlSet: !!process.env.DATABASE_URL,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
