import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { candidates: true },
        },
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      location,
      seniority_level,
      min_experience,
      max_experience,
      required_skills,
      preferred_skills,
    } = body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        seniority_level,
        min_experience,
        max_experience,
        required_skills,
        preferred_skills,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
