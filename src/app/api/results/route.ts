import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AnalysisResult from '@/models/AnalysisResult';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      // Get results for a specific job
      const results = await AnalysisResult.find({ jobId })
        .sort({ createdAt: -1 });
      return NextResponse.json(results);
    } else {
      // Get all results
      const results = await AnalysisResult.find()
        .sort({ createdAt: -1 })
        .limit(100);
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
