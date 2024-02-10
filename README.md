## Sanitize HTML

```typescript
import { sanitizeHTML } from '@jozefini/html'

const html = '<strong>Test parser</strong><script>alert("hello")</script>'
const allowedTags = ['strong']
const sanitized = sanitizeHTML(html, allowedTags) // <strong>Test parser</strong>
```
