import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/parser';
import { createClient } from '@/lib/supabase/server';

// Import semantic services
import { parseRequirement } from '@/services/requirementParser';
import { parseResumeSemantics } from '@/services/semanticResumeParser';
import { semanticMatch } from '@/services/semanticMatcher';
import { calculateScore, getRecommendation, getScoreExplanation } from '@/services/scoringEngine';
import { analyzeCandidate } from '@/services/aiAnalyzer';

import type { SemanticAnalysisResult } from '@/types';

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobDescriptionInput = formData.get('jobDescription') as string;
    const jobId = formData.get('jobId') as string | null;
    const fileName = formData.get('fileName') as string || file.name;

    console.log('=== ANALYZE API CALLED ===');
    console.log('jobId received:', jobId);
    console.log('file name:', file?.name);
    console.log('jobDescription length:', jobDescriptionInput?.length);

    // Validation
    if (!file) {
      console.error('ERROR: No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!jobDescriptionInput?.trim()) {
      console.error('ERROR: Job description is required');
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // STEP 1: Parse recruiter input into structured requirement
    console.log('Parsing requirement...');
    const requirement = await parseRequirement(jobDescriptionInput);

    // STEP 2: Extract resume text
    console.log('Extracting resume text...');
    const resumeText = await extractTextFromFile(file);
    if (!resumeText || resumeText.length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from resume' },
        { status: 400 }
      );
    }

    // STEP 3: Parse resume semantically
    console.log('Parsing resume semantically...');
    const candidate = await parseResumeSemantics(resumeText);

    // STEP 4: Semantic matching
    console.log('Performing semantic matching...');
    const matching = semanticMatch(candidate, requirement);

    // STEP 5: Deterministic scoring
    console.log('Calculating score breakdown...');
    const scoreBreakdown = calculateScore(candidate, requirement);

    // STEP 6: AI-powered analysis
    console.log('Generating AI analysis...');
    const analysis = await analyzeCandidate(candidate, requirement, scoreBreakdown);

    // STEP 7: Get recommendation
    const recommendation = getRecommendation(scoreBreakdown.total_score);

    // STEP 8: Format response
    const response: SemanticAnalysisResult = {
      // Candidate info
      candidate_name: candidate.candidate_name,
      email: candidate.email,
      years_of_experience: candidate.years_of_experience,
      seniority_level: candidate.seniority_level,

      // Structured requirement
      job_requirement: requirement,

      // Semantic matching
      semantic_match: {
        overall_match: matching.overall_match,
        skill_match: matching.skill_match,
        experience_match: matching.experience_match,
        seniority_match: matching.seniority_match,
        matched_skills: matching.matched_skills,
        unmatched_required_skills: matching.unmatched_required_skills,
        bonus_skills: matching.bonus_skills,
        reasoning: matching.match_reasoning,
      },

      // Deterministic scoring
      scoring: {
        total_score: scoreBreakdown.total_score,
        skills_score: scoreBreakdown.skills_score,
        experience_score: scoreBreakdown.experience_score,
        seniority_score: scoreBreakdown.seniority_score,
        education_score: scoreBreakdown.education_score,
      },

      // AI analysis
      analysis: {
        key_strengths: analysis.key_strengths,
        gaps_and_concerns: analysis.gaps_and_concerns,
        recommendation_reasoning: analysis.recommendation_reasoning,
        interview_focus_areas: analysis.interview_focus_areas,
        overall_fit_summary: analysis.overall_fit_summary,
      },

      // Final recommendation
      recommendation: recommendation.recommendation,
      recommendation_message: recommendation.message,
    };

    console.log(`Analysis complete: ${candidate.candidate_name} - ${scoreBreakdown.total_score}/100`);

    // Save candidate to Supabase
    console.log('=== ATTEMPTING DB SAVE ===');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log('User:', user?.id);

    let orgId: string | null = null;
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();
      console.log('Profile query error:', profileError);
      console.log('Profile data:', profile);
      orgId = profile?.org_id || null;
    }

    console.log('orgId:', orgId);
    console.log('jobId:', jobId);

    if (!user) {
      console.error('No user logged in');
    } else if (!orgId) {
      console.error('User has no org_id in profile');
    } else {
      try {
        console.log('Inserting to candidates table...');

        // Try insert with full schema first
        let insertData = {
          org_id: orgId,
          job_id: jobId || null,
          full_name: response.candidate_name,
          email: response.email || '',
          years_experience: response.years_of_experience,
          seniority: response.seniority_level || 'Mid',
          score: response.scoring.total_score,
          status: 'New',
          ai_summary: response.analysis.overall_fit_summary,
        };
        console.log('Insert data:', JSON.stringify(insertData));

        let { data, error: supabaseError } = await supabase
          .from('candidates')
          .insert(insertData);

        // If full schema fails, try with minimal columns
        if (supabaseError) {
          console.log('Full schema failed, trying minimal columns...');
          insertData = {
            org_id: orgId,
            score: response.scoring.total_score,
          };
          console.log('Minimal insert data:', JSON.stringify(insertData));
          const result = await supabase
            .from('candidates')
            .insert(insertData);
          data = result.data;
          supabaseError = result.error;
        }

        console.log('Supabase response data:', data);
        console.log('Supabase response error:', supabaseError);

        if (supabaseError) {
          console.error('❌ Supabase insert failed:', JSON.stringify(supabaseError));
        } else {
          console.log('✅ SAVED TO SUPABASE:', response.candidate_name);
        }
      } catch (dbError) {
        console.error('❌ DB SAVE CAUGHT ERROR:', dbError);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
