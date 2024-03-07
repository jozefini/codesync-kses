import { AllowedPostTags } from './allowedPostTags'

export function validateArguments(
  htmlString: string,
  allowedTags: AllowedPostTags,
  allowedProtocols: string[]
): boolean {
  const hasHTMLString = typeof htmlString === 'string' && htmlString.length > 0
  const hasAllowedTags =
    typeof allowedTags === 'object' &&
    allowedTags !== null &&
    Object.keys(allowedTags).length > 0
  const hasAllowedProtocols =
    Array.isArray(allowedProtocols) && allowedProtocols.length > 0

  return hasHTMLString && hasAllowedTags && hasAllowedProtocols
}
