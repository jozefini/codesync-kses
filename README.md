## Equivalent of WordPress's KSES in JavaScript/Node.js

Safely render HTML in React or any other JavaScript environment.
Works in both Node.js and the browser.

### Example JavaScript

```typescript
import { kses } from '@codesync/kses'

const unsafeHtml = '<strong>Test parser</strong><script>alert("hello")</script>'
const safeHtml = kses(html) // <strong>Test parser</strong>
```

### Example React

```typescript
import { kses } from '@codesync/kses'

export default function Page() {
  const unsafeHtml =
    '<strong>Test parser</strong><script>alert("hello")</script>'
  const safeHtml = kses(unsafeHtml)

  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
```
