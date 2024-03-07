### Equivalent of `wp_kses` / `wp_kses_post` in JavaScript/Node.js

Safely render HTML in React or any other JavaScript environment.
Works in both Node.js and the browser.

#### Example JavaScript

```typescript
import { kses } from '@codesync/kses'

const unsafeHtml = '<strong>Test parser</strong><script>alert("hello")</script>'
const safeHtml = kses(unsafeHtml) // <strong>Test parser</strong>
```

#### Example React

```typescript
import { kses } from '@codesync/kses'

export default function Page() {
  const unsafeHtml =
    '<strong>Test parser</strong><script>alert("hello")</script>'
  const safeHtml = kses(unsafeHtml)

  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
```

#### Example RSC

```typescript
import { ksesServer } from '@codesync/kses'

export default async function Page() {
  const unsafeHtml =
    '<strong>Test parser</strong><script>alert("hello")</script>'
  const safeHtml = await ksesServer(unsafeHtml)

  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
```
