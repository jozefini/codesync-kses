import { validateArguments } from './utils'
import {
  AllowedTags,
  AllowedProtocols,
  allowedPostTags,
  allowedPostProtocols,
} from './postTags'

export {
  AllowedTags,
  AllowedProtocols,
  allowedPostTags as allowedTags,
  allowedPostProtocols as allowedProtocols,
}

export function kses(
  htmlString: string,
  allowedTags: AllowedTags = allowedPostTags,
  allowedProtocols: AllowedProtocols = allowedPostProtocols
): string {
  if (typeof window === 'undefined') {
    throw new Error('Use server version of kses() from `@codesync/kses/server`')
  }
  if (!validateArguments(htmlString, allowedTags, allowedProtocols)) {
    return ''
  }

  const parser = new DOMParser()
  let htmlDoc = parser.parseFromString(htmlString, 'text/html')

  const traverseNode = (node: Element): void => {
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

    Array.from(node.children).forEach((child) => traverseNode(child as Element))
  }

  Array.from(htmlDoc.body.children).forEach((child) =>
    traverseNode(child as Element)
  )

  return htmlDoc.body.innerHTML
}
