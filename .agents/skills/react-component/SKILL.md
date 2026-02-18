---
name: react-component
description: React component patterns with TypeScript
license: MIT
compatibility: opencode
---

## React Component Patterns

General guidance for React components with TypeScript.

### Component Template

```tsx
import { useState } from 'react'
import './ComponentName.css'

interface ComponentNameProps {
  title: string
  data: DataType
  onUpdate: (value: DataType) => void
}

export function ComponentName({ title, data, onUpdate }: ComponentNameProps) {
  const [localState, setLocalState] = useState(data)

  return (
    <div className="component-name">
      <h3>{title}</h3>
      {/* Component content */}
    </div>
  )
}
```

### Best Practices

#### Props
- Define explicit TypeScript interfaces
- Use optional props with `?` sparingly
- Consider children prop for composition

#### State
- Keep state as local as possible
- Lift state up when needed by siblings
- Use reducers for complex state logic

#### Effects
- Include all dependencies in the array
- Return cleanup functions when needed
- Consider if state can be derived instead

#### Styling
- Match project's existing approach
- Keep styles scoped to component
- Use consistent class naming

### Common Patterns

| Pattern | Use Case |
|---------|----------|
| Controlled inputs | Form fields with validation |
| Render props | Flexible component composition |
| Custom hooks | Reusable stateful logic |
| Context | Deep prop drilling avoidance |

### Testing

```tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

test('renders title', () => {
  render(<ComponentName title="Test" data={mockData} onUpdate={jest.fn()} />)
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

### Accessibility

- Use semantic HTML elements
- Add ARIA attributes when needed
- Ensure keyboard navigation
- Test with screen reader if possible
