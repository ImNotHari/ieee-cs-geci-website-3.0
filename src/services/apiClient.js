/**
 * Central API Client
 * Standardizes all service responses into { data, error } format
 * and provides unified error handling.
 */

/**
 * Wraps an async operation in a standard { data, error } envelope.
 * @param {Function} asyncFn - An async function that returns data.
 * @returns {Promise<{data: any, error: any}>}
 */
export async function apiCall(asyncFn) {
  try {
    const result = await asyncFn();
    return { data: result, error: null };
  } catch (err) {
    console.error('[apiClient]', err);
    return {
      data: null,
      error: {
        message: err?.message || 'An unexpected error occurred.',
        code: err?.code || 'UNKNOWN',
        original: err,
      },
    };
  }
}

/**
 * Wraps a Supabase query into the standard { data, error } envelope.
 * Supabase already returns { data, error }, so this just normalizes the error shape.
 * @param {Promise} supabaseQuery - The Supabase promise (e.g., supabase.from(...).select(...))
 * @returns {Promise<{data: any, error: any}>}
 */
export async function supabaseCall(supabaseQuery) {
  try {
    const { data, error } = await supabaseQuery;
    if (error) {
      return {
        data: null,
        error: {
          message: error.message || 'Supabase error',
          code: error.code || 'SUPABASE_ERROR',
          original: error,
        },
      };
    }
    return { data, error: null };
  } catch (err) {
    console.error('[apiClient:supabase]', err);
    return {
      data: null,
      error: {
        message: err?.message || 'Network error communicating with database.',
        code: 'NETWORK_ERROR',
        original: err,
      },
    };
  }
}
