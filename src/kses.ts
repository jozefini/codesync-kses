import { allowedPostTags, AllowedPostTags } from './allowedPostTags'
import { traverseNode, validateArguments } from './utils'

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

  Array.from(htmlDoc.body.children).forEach((child) =>
    traverseNode(child as Element, allowedTags, allowedProtocols)
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

  const { DOMParser } = await import('@xmldom/xmldom')
  const parser = new DOMParser()
  let htmlDoc = parser.parseFromString(
    `<!DOCTYPE html><body>${htmlString}</body>`,
    'text/xml'
  )

  Array.from(htmlDoc.body.children).forEach((child) =>
    traverseNode(child as Element, allowedTags, allowedProtocols)
  )

  return htmlDoc.body.innerHTML
}
