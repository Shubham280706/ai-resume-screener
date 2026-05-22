import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalJobs = await prisma.job.count();
    const totalCandidates = await prisma.candidate.count();

    const strongMatches = await prisma.candidate.count({
      where: {
        recommendation: {
          in: ['STRONG_YES', 'YES'],
        },
      },
    });

    const pendingReview = await prisma.candidate.count({
      where: {
        status: 'pending',
      },
    });

    // Calculate average score
    const candidates = await prisma.candidate.findMany({
      select: {
        scoring: true,
      },
    });

    let averageScore = 0;
    if (candidates.length > 0) {
      const totalScore = candidates.reduce((sum, c) => {
        const scoring = c.scoring as { total_score?: number };
        return sum + (scoring.total_score || 0);
      }, 0);
      averageScore = Math.round(totalScore / candidates.length);
    }

    return NextResponse.json({
      totalJobs,
      totalCandidates,
      strongMatches,
      averageScore,
      pendingReview,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
