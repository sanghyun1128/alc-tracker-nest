/**
 * @param {string} resourceName - The resource name (e.g., "nickname", "email").
 * @returns {string} The `${resourceName}` already exists
 */
export const ExistErrorMessage = (resourceName: string): string =>
  `The ${resourceName} already exists`;
