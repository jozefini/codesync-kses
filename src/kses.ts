import { allowedPostTags, AllowedPostTags } from './allowedPostTags'

export async function kses(
  htmlString: string,
  allowedTags: AllowedPostTags = allowedPostTags,
  allowedProtocols: string[] = ['http', 'https']
): Promise<string> {
  // Validate arguments
  const hasHTMLString = typeof htmlString === 'string' && htmlString.length > 0
  const hasAllowedTags =
    typeof allowedTags === 'object' &&
    allowedTags !== null &&
    Object.keys(allowedTags).length > 0
  const hasAllowedProtocols =
    Array.isArray(allowedProtocols) && allowedProtocols.length > 0

  if (!hasHTMLString) {
    return ''
  }

  let htmlDoc
  if (typeof window === 'undefined') {
    if (typeof DOMParser === 'undefined') {
      throw new Error('DOMParser is not available in this environment')
    }
    const parser = new DOMParser()
    htmlDoc = parser.parseFromString(
      `<!DOCTYPE html><body>${htmlString}</body>`,
      'text/xml'
    )
  } else {
    const parser = new DOMParser()
    htmlDoc = parser.parseFromString(htmlString, 'text/html')
  }

  const traverse = (node: Element): void => {
    if (node.nodeType === 3) {
      return // Skip text node
    }

    const tagName = node.tagName.toLowerCase()
    const validAttrs = hasAllowedTags ? allowedTags[tagName] : null

    if (!validAttrs) {
      node.remove()
      return // Not allowed tag
    }

    Array.from(node.attributes).forEach((attr) => {
      if (!hasAllowedTags) {
        return // Allow all attributes
      }
      const attrName = attr.name.toLowerCase()
      let validAttr = validAttrs ? validAttrs[attrName] : null

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
        (hasAllowedProtocols && attr.name === 'href') ||
        attr.name === 'src'
      ) {
        let url = document.createElement('a')
        url.href = attr.value

        if (!allowedProtocols.includes(url.protocol)) {
          node.removeAttribute(attr.name)
        }
      }
    })

    Array.from(node.children).forEach((child) => traverse(child as Element))
  }

  Array.from(htmlDoc.body.children).forEach((child) =>
    traverse(child as Element)
  )

  return htmlDoc.body.innerHTML
}
