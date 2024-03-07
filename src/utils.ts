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

export function traverseNode(
  node: Element,
  allowedTags: AllowedPostTags,
  allowedProtocols: string[]
): void {
  if (node.nodeType === 3) {
    return // Skip text node
  }

  const tagName = node.tagName.toLowerCase()
  const validAttrs = allowedTags[tagName]

  if (!validAttrs) {
    node.remove()
    return // Not allowed tag
  }

  Array.from(node.attributes).forEach((attr) => {
    const attrName = attr.name.toLowerCase()
    let validAttr = validAttrs[attrName]

    // Check if the attribute matches the pattern before the asterisk
    for (const attrPattern in validAttrs) {
      if (
        attrPattern.endsWith('*') &&
        attrName.startsWith(attrPattern.slice(0, -1))
      ) {
        validAttr = 1
        break
      }
    }

    if (!validAttr) {
      // Remove not allowed attribute
      node.removeAttribute(attr.name)
    } else if (
      (allowedProtocols && attr.name === 'href') ||
      attr.name === 'src'
    ) {
      let url = document.createElement('a')
      url.href = attr.value

      if (!allowedProtocols.includes(url.protocol)) {
        node.removeAttribute(attr.name)
      }
    }
  })

  Array.from(node.children).forEach((child) =>
    traverseNode(child as Element, allowedTags, allowedProtocols)
  )
}
