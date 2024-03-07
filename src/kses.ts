import { allowedPostTags, AllowedPostTags } from './allowedPostTags'
import { traverseNode, validateArguments } from './utils'

export async function kses(
  htmlString: string,
  allowedTags: AllowedPostTags = allowedPostTags,
  allowedProtocols: string[] = ['http', 'https']
): Promise<string> {
  if (!validateArguments(htmlString, allowedTags, allowedProtocols)) {
    return ''
  }

  let htmlDoc: Document
  if (typeof window === 'undefined') {
    const { JSDOM } = await import('jsdom')
    const parser = new JSDOM(htmlString)
    htmlDoc = parser.window.document
  } else {
    const parser = new DOMParser()
    htmlDoc = parser.parseFromString(htmlString, 'text/html')
  }

  Array.from(htmlDoc.body.children).forEach((child) =>
    traverseNode(child as Element, allowedTags, allowedProtocols)
  )

  return htmlDoc.body.innerHTML
}
