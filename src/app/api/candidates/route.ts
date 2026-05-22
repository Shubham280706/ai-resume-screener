import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}
