/**
 * @param decoratorName
 * @param interceptorName
 * @returns `${decoratorName}` must use with `${interceptorName}`
 */
export const DecoratorErrorMessage = (decoratorName: string, interceptorName: string) => {
  return `${decoratorName} must use with ${interceptorName}`;
};
