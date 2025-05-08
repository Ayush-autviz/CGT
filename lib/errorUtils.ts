/**
 * Extracts error message from various error response formats
 * Prioritizes error.response.data.error format
 */
export function extractErrorMessage(error: any): string {
  // Check for the specific error format { "error": "message" }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Fallback to other common error formats
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  // Default error message if no specific message is found
  return "An unexpected error occurred. Please try again.";
}

/**
 * Creates a standardized toast error configuration
 */
export function createErrorToast(title: string, error: any) {
  return {
    description: extractErrorMessage(error),
    duration: 5000,
    style: {
      background: '#FEE2E2', // Light red background
      border: '1px solid #F87171', // Red border
      color: '#B91C1C', // Dark red text
    },
  };
}
