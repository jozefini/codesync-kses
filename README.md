## JS/TS Library

Lightweight `2.5 kB (gzipped: 1.1 kB)` lib of helper functions for JS/TS projects

### Event

Set of helper functions to manage event listeners

```typescript
import { on, off, delegate, undelegate, once } from '@jozefini/lib' // 598 B (gzipped: 324 B)

// Prepare
const parent = document.querySelector('.wrapper')
const el = document.querySelector('.cta-btn')
const handler = () => console.log('hello world')

// Add event listener
on(el, 'click', handler)

// Remove event listener
off(el, 'click', handler)

// Add event listener to parent
delegate(parent, 'click', '.cta-button', handler)

// Remove event listener from parent
undelegate(parent, 'click', '.cta-button', handler)

// Add event listener that will be removed after first call
once(el, 'click', handler)
```

### Object

Set of helper functions for safely getting and setting values in an object

```typescript
import { safeGet, safeSet } from '@jozefini/lib' // 532 B (gzipped: 312 B)

// Prepare
const obj = { a: { b: { c: 1 } } } as const

// Get value from object
const v1 = safeGet(obj, 'a.b.c', 0) // TypeSafe for path and v1 = 1 | 0

// Set value to object
const v2 = safeSet(obj, 'a.b.c', 2) // true | false
```

### String

Helper function to manage string replacements

```typescript
import { strReplacer } from '@jozefini/lib' // 437 B (gzipped: 298 B)

// Prepare
const str = 'Hello {{name}}!'

// Replace string
const v1 = strReplacer(str, { name: 'World' }) // TypeSafe for all {{keys}} and output = 'Hello World!'
```

### HTML

Helper function to sanitize HTML strings

```typescript
import { kses } from '@jozefini/lib' // 965 B (gzipped: 536 B)

// Prepare
const htmlStr =
  '<p class"flex">Hello <strong class"text-sm" style="color:red">World</strong>!</p>'
const allowedTags = {
  p: {
    class: true,
  },
  strong: {
    class: false,
    style: false,
  },
}

// Sanitize HTML
const v1 = kses(htmlStr, allowedTags) // '<p class"flex">Hello <strong>World</strong>!</p>'
```

### Tailwind CSS

Set of helper functions to manage CSS classes, particularly useful when working with Tailwind CSS

```typescript
import { cn, firstTruthy } from '@jozefini/lib' // 342 B (gzipped: 241 B)

// Prepare
const base = 'text-sm'
const v1 = 'text-blue-500'
const v2 = 'text-red-500'
const v3 = 'text-green-500'
const selectedColor = 'green'

const combinedClasses = cn(
  base, // Always included
  firstTruthy(
    selectedColor === 'blue' && v1,
    selectedColor === 'red' && v2,
    selectedColor === 'green' && v3
  )
) // 'text-sm text-green-500'
```

### Misc

Set of helper functions to check various properties of arrays and objects

```typescript
import {
  hasLength,
  hasValue,
  hasValues,
  hasAnyValue,
  hasKey,
  hasKeys,
  hasAnyKey,
} from '@jozefini/lib' // 795 B (gzipped: 379 B)

// Prepare
const arr = [1, 2, 3]
const obj = { a: 1, b: 2 }

// Check if array has length
const v1 = hasLength(arr) // true
const v2 = hasLength(arr, 2) // true (more than)
const v3 = hasLength(arr, 2, true) // false (exactly)
const v4 = hasLength(arr, 3, true) // true

// Check if array has exact value
const v5 = hasValue(arr, 1) // true
const v6 = hasValue(arr, 4) // false
const v7 = hasValue(arr, '1', (v) => String(v)) // true (transformed arr value)

// Check if array has all the values
const v8 = hasValues(arr, [1, 2]) // true
const v9 = hasValues(arr, [1, 2, 3]) // true
const v10 = hasValues(arr, [1, 2, 3, 4]) // false
const v11 = hasValues(arr, ['1', '2'], (v) => String(v)) // true (transformed arr value)

// Check if array has any of values
const v12 = hasAnyValue(arr, [1, 2]) // true
const v13 = hasAnyValue(arr, [1, 2, 3]) // true
const v14 = hasAnyValue(arr, [1, 2, 3, 4]) // true
const v15 = hasAnyValue(arr, ['1', '2'], (v) => String(v)) // true (transformed arr value)

// Check if object has key
const v16 = hasKey(obj, 'a') // true
const v17 = hasKey(obj, 'c') // false

// Check if object has all the keys
const v18 = hasKeys(obj, ['a', 'b']) // true
const v19 = hasKeys(obj, ['a', 'b', 'c']) // false

// Check if object has any of keys
const v20 = hasAnyKey(obj, ['a', 'b']) // true
const v21 = hasAnyKey(obj, ['a', 'b', 'c']) // true
const v22 = hasAnyKey(obj, ['c', 'd']) // false
```
