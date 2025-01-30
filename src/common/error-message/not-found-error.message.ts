/**
 * @param {string} type - The resource type (e.g., "alcohol", "review").
 * @returns {string} No `${type}` found
 */
export const NotFoundErrorMessage = (type: string): string => `No ${type} found`;
