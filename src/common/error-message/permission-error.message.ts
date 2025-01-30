/**
 * @param {string} type - The resource type (e.g., "alcohol", "review").
 * @param {string} method - The attempted action (e.g., "update", "delete").
 * @returns {string} You don't have permission to `${method}` this `${type}`
 */
export const PermissionErrorMessage = (type: string, method: string): string =>
  `You don't have permission to ${method} this ${type}`;
