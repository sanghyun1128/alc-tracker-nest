/**
 * @param {string} act - The action that was being performed when the error occurred.
 * @returns {string} Server error occurred while `${act}`
 */
export const ServerErrorMessage = (act: string): string => {
  return `Server error occurred while ${act}`;
};
