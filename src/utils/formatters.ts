/**
 * Gets color styling for match score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-emerald-100 text-emerald-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

/**
 * Gets color styling for recommendation badge
 */
export function getRecommendationColor(recommendation: string): string {
  const colors: Record<string, string> = {
    STRONG_YES: 'bg-green-100 text-green-800 border-green-300',
    YES: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MAYBE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    NO: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[recommendation] || colors.MAYBE;
}

/**
 * Formats recommendation text for display
 */
export function formatRecommendation(recommendation: string): string {
  return recommendation.replace(/_/g, ' ');
}

/**
 * Formats skill as a badge
 */
export function formatSkill(skill: string): string {
  return skill.trim();
}

/**
 * Gets status icon based on recommendation
 */
export function getRecommendationIcon(recommendation: string): string {
  const icons: Record<string, string> = {
    STRONG_YES: '✓✓',
    YES: '✓',
    MAYBE: '?',
    NO: '✗',
  };
  return icons[recommendation] || '?';
}

/**
 * Formats years of experience text
 */
export function formatExperience(years: number): string {
  if (years === 0) return 'No experience';
  if (years === 1) return '1 year';
  return `${years} years`;
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Formats date string (e.g., 2019 -> "Class of 2019")
 */
export function formatGraduationYear(year: number): string {
  return `Class of ${year}`;
}
