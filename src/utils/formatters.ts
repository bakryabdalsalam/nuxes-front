/**
 * Format company name from either string or object
 */
export function formatCompanyName(company: string | { name?: string, companyName?: string } | undefined): string {
  if (!company) return 'Unknown Company';
  
  if (typeof company === 'string') {
    return company;
  }
  
  return company.name || company.companyName || 'Unknown Company';
}

/**
 * Safely format date with fallback
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Invalid Date';
  }
}

/**
 * Get application status color
 */
export const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'REVIEWING': 'bg-blue-100 text-blue-800',
  'SHORTLISTED': 'bg-purple-100 text-purple-800',
  'ACCEPTED': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800'
};
