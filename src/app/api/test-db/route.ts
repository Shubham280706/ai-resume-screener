import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...');
    const jobCount = await prisma.job.count()
    const candidateCount = await prisma.candidate.count()
    console.log('✓ Database connected');
    console.log('Jobs in DB:', jobCount);
    console.log('Candidates in DB:', candidateCount);

    return NextResponse.json({
      connected: true,
      jobs: jobCount,
      candidates: candidateCount,
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
