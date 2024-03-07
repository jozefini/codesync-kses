import { allowedPostTags, AllowedPostTags } from './allowedPostTags'
import { validateArguments } from './utils'

export function kses(
  htmlString: string,
  allowedTags: AllowedPostTags = allowedPostTags,
  allowedProtocols: string[] = ['http', 'https']
): string {
  if (typeof window === 'undefined') {
    throw new Error('Use ksesServer() on the server')
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

export async function ksesServer(
  htmlString: string,
  allowedTags: AllowedPostTags = allowedPostTags,
  allowedProtocols: string[] = ['http', 'https']
): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('Use kses() on the client')
  }
  if (!validateArguments(htmlString, allowedTags, allowedProtocols)) {
    return ''
  }

  const cheerio = await import('cheerio')
  const $ = cheerio.load(htmlString)

  const traverseNode = ($node: any) => {
    if ($node.get(0)?.type === 'text') {
      return // Skip text node
    }

    const tagName = $node.get(0)?.tagName.toLowerCase()
    const validAttrs = allowedTags[tagName]

    if (!validAttrs) {
      $node.remove()
      return // Not allowed tag
    }

    const newAttrs: { [key: string]: string } = {}
    for (const [attrName, attrValue] of Object.entries(
      $node.get(0).attribs
    ) as any) {
      let validAttr = validAttrs[attrName.toLowerCase()]

      if (!validAttr) {
        continue
      }

      for (const attrPattern in validAttrs) {
        if (
          attrPattern.endsWith('*') &&
          attrName.toLowerCase().startsWith(attrPattern.slice(0, -1))
        ) {
          validAttr = 1
          break
        }
      }

      if (validAttr && allowedProtocols && ['href', 'src'].includes(attrName)) {
        const url = new URL(attrValue, 'https://example.com')
        if (allowedProtocols.includes(url.protocol)) {
          newAttrs[attrName] = attrValue
        }
      } else {
        newAttrs[attrName] = attrValue
      }
    }

    $node.get(0).attribs = newAttrs

    $node.children().each((_: any, child: any) => traverseNode($(child)))
  }

  $('body')
    .children()
    .each((_: any, child: any) => traverseNode($(child)))

  return $('body').html() || ''
}
