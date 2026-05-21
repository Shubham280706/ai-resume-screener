import { ScreeningResult } from '@/types';

export type SortBy = 'score' | 'name' | 'experience';
export type SortOrder = 'asc' | 'desc';

export interface RankingFilter {
  minScore?: number;
  maxScore?: number;
  recommendation?: string;
  minExperience?: number;
}

/**
 * Sorts candidates by various criteria
 */
export function sortCandidates(
  candidates: ScreeningResult[],
  sortBy: SortBy = 'score',
  order: SortOrder = 'desc'
): ScreeningResult[] {
  const sorted = [...candidates].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'score':
        comparison = a.match_score - b.match_score;
        break;
      case 'name':
        comparison = a.candidate_name.localeCompare(b.candidate_name);
        break;
      case 'experience':
        comparison = a.years_of_experience - b.years_of_experience;
        break;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

/**
 * Filters candidates based on criteria
 */
export function filterCandidates(
  candidates: ScreeningResult[],
  filter: RankingFilter
): ScreeningResult[] {
  return candidates.filter((candidate) => {
    if (
      filter.minScore !== undefined &&
      candidate.match_score < filter.minScore
    ) {
      return false;
    }

    if (
      filter.maxScore !== undefined &&
      candidate.match_score > filter.maxScore
    ) {
      return false;
    }

    if (
      filter.recommendation &&
      candidate.recommendation !== filter.recommendation
    ) {
      return false;
    }

    if (
      filter.minExperience !== undefined &&
      candidate.years_of_experience < filter.minExperience
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Gets ranking statistics for a list of candidates
 */
export function getRankingStats(candidates: ScreeningResult[]) {
  if (candidates.length === 0) {
    return {
      totalCandidates: 0,
      averageScore: 0,
      topScore: 0,
      bottomScore: 0,
      strongCandidates: 0,
      recommendations: { STRONG_YES: 0, YES: 0, MAYBE: 0, NO: 0 },
    };
  }

  const scores = candidates.map((c) => c.match_score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / candidates.length;

  const recommendations = {
    STRONG_YES: candidates.filter((c) => c.recommendation === 'STRONG_YES')
      .length,
    YES: candidates.filter((c) => c.recommendation === 'YES').length,
    MAYBE: candidates.filter((c) => c.recommendation === 'MAYBE').length,
    NO: candidates.filter((c) => c.recommendation === 'NO').length,
  };

  return {
    totalCandidates: candidates.length,
    averageScore: Math.round(averageScore),
    topScore: Math.max(...scores),
    bottomScore: Math.min(...scores),
    strongCandidates: candidates.filter((c) => c.match_score >= 75).length,
    recommendations,
  };
}
