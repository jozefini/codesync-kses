## Sanitize HTML

```typescript
import { kses } from '@codesync/kses'

const html = '<strong>Test parser</strong><script>alert("hello")</script>'
const sanitized = kses(html) // <strong>Test parser</strong>
```
