### Equivalent of `wp_kses` / `wp_kses_post` in JavaScript/Node.js

Safely render HTML in React or any other JavaScript environment.
Works in both Node.js and the browser.

#### Example JavaScript

```typescript
import { kses } from '@codesync/kses'

const unsafeHtml = '<strong>Test parser</strong><script>alert("hello")</script>'
const safeHtml = kses(unsafeHtml)
// Output: <strong>Test parser</strong>
```

#### Example React

```typescript
'use client'
import { kses } from '@codesync/kses'

export default function ClientPage() {
  const unsafeHtml =
    '<strong>Test parser</strong><script>alert("hello")</script>'
  const safeHtml = kses(unsafeHtml)

  // Output: <div><strong>Test parser</strong></div>
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
```

#### Example RSC

```typescript
import { kses } from '@codesync/kses/server'

export default function ServerPage() {
  const unsafeHtml =
    '<strong>Test parser</strong><script>alert("hello")</script>'
  const safeHtml = kses(unsafeHtml)

  // Output: <div><strong>Test parser</strong></div>
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
```
