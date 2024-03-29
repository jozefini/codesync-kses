import * as cheerio from 'cheerio'
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
  if (typeof window !== 'undefined') {
    throw new Error('Use client version of kses() from `@codesync/kses`')
  }
  if (!validateArguments(htmlString, allowedTags, allowedProtocols)) {
    return ''
  }

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
    for (const [attrNameRaw, attrValue] of Object.entries(
      $node.get(0).attribs
    ) as any) {
      const attrName = attrNameRaw.toLowerCase()
      let validAttr = validAttrs[attrName]

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
        continue
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
