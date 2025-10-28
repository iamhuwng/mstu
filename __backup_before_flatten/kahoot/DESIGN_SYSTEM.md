# Modern Pastel Design System

## Overview

This application now features a **modern, soft pastel design system** with a futuristic, dynamic aesthetic. The design emphasizes:

- 🎨 **Soft Pastel Colors** - Gentle, eye-pleasing color palette
- ✨ **Glassmorphism** - Frosted glass effects with backdrop blur
- 🌊 **Smooth Animations** - Fluid transitions and micro-interactions
- 🎯 **Consistent Language** - Unified design tokens across all components
- 📱 **Responsive** - Mobile-first, adaptive layouts

---

## Color Palette

### Primary Pastels

#### Lavender
- **Primary Use**: Main brand color, primary buttons, accents
- **Shades**: `#f5f3ff` → `#4c1d95`
- **Gradient**: `linear-gradient(135deg, #8b5cf6 0%, #a78bfa 25%, #c4b5fd 50%, #ddd6fe 100%)`

#### Rose
- **Primary Use**: Danger states, delete actions, errors
- **Shades**: `#fff1f2` → `#881337`
- **Gradient**: `linear-gradient(135deg, #f43f5e 0%, #fb7185 25%, #fda4af 50%, #fecdd3 100%)`

#### Sky
- **Primary Use**: Secondary actions, info states
- **Shades**: `#f0f9ff` → `#0c4a6e`
- **Gradient**: `linear-gradient(135deg, #0ea5e9 0%, #38bdf8 25%, #7dd3fc 50%, #bae6fd 100%)`

#### Mint
- **Primary Use**: Success states, positive feedback
- **Shades**: `#f0fdfa` → `#134e4a`
- **Gradient**: `linear-gradient(135deg, #14b8a6 0%, #2dd4bf 25%, #5eead4 50%, #99f6e4 100%)`

#### Peach
- **Primary Use**: Warning states, highlights
- **Shades**: `#fff7ed` → `#7c2d12`
- **Gradient**: `linear-gradient(135deg, #fb923c 0%, #fdba74 25%, #fda4af 50%, #fecdd3 100%)`

### Background Gradients

**Light Mode**:
```css
background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 25%, #f0fdfa 50%, #fff7ed 75%, #faf5ff 100%);
```

**Dark Mode**:
```css
background: linear-gradient(135deg, #1e1b4b 0%, #1e293b 25%, #0f172a 50%, #1e1b4b 100%);
```

---

## Components

### Card Component

Modern glassmorphic cards with multiple variants:

```jsx
import { Card, CardHeader, CardBody, CardFooter } from '../components/modern';

<Card variant="lavender" hover>
  <CardBody>
    <h3>Card Title</h3>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Variants**: `default`, `lavender`, `rose`, `sky`, `mint`, `peach`, `glass`

**Features**:
- Glassmorphism with backdrop blur
- Hover elevation effects
- Colored shadows matching variant
- Responsive padding

### Button Component

Gradient buttons with smooth animations:

```jsx
import { Button, ButtonGroup } from '../components/modern';

<Button variant="primary" size="lg" icon={<Icon />}>
  Click Me
</Button>

<ButtonGroup>
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Confirm</Button>
</ButtonGroup>
```

**Variants**: `primary`, `secondary`, `success`, `danger`, `warning`, `glass`, `outline`

**Sizes**: `sm`, `md`, `lg`, `xl`

**Features**:
- Gradient backgrounds
- Ripple effect on click
- Loading state with spinner
- Icon support (left/right)
- Colored shadows

### Input Component

Glassmorphic inputs with focus animations:

```jsx
import { Input, Textarea } from '../components/modern';

<Input
  label="Name"
  placeholder="Enter your name"
  variant="lavender"
  size="lg"
  icon={<SearchIcon />}
  error="This field is required"
/>

<Textarea
  label="Description"
  rows={4}
  variant="sky"
/>
```

**Variants**: `default`, `lavender`, `rose`, `sky`, `mint`

**Sizes**: `sm`, `md`, `lg`

**Features**:
- Glassmorphism background
- Smooth focus transitions
- Colored focus rings
- Icon support
- Error states

---

## Typography

### Font Families

- **Sans-serif**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Display**: `'Poppins', 'Inter', sans-serif`
- **Monospace**: `'Fira Code', 'Consolas', 'Monaco', monospace`

### Font Sizes

| Size | Value | Use Case |
|------|-------|----------|
| xs | 0.75rem (12px) | Small labels, badges |
| sm | 0.875rem (14px) | Secondary text |
| base | 1rem (16px) | Body text |
| lg | 1.125rem (18px) | Subheadings |
| xl | 1.25rem (20px) | Card titles |
| 2xl | 1.5rem (24px) | Section headings |
| 3xl | 1.875rem (30px) | Page titles |
| 4xl | 2.25rem (36px) | Hero text |
| 5xl | 3rem (48px) | Large displays |

### Gradient Text

```css
.text-gradient {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 25%, #fb7185 50%, #fda4af 75%, #fecdd3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Spacing System

Based on 4px increments:

| Token | Value | Pixels |
|-------|-------|--------|
| 1 | 0.25rem | 4px |
| 2 | 0.5rem | 8px |
| 3 | 0.75rem | 12px |
| 4 | 1rem | 16px |
| 6 | 1.5rem | 24px |
| 8 | 2rem | 32px |
| 12 | 3rem | 48px |
| 16 | 4rem | 64px |

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| sm | 0.5rem | Small elements |
| md | 0.75rem | Inputs |
| lg | 1rem | Buttons |
| xl | 1.5rem | Cards |
| 2xl | 2rem | Large cards |
| full | 9999px | Pills, badges |

---

## Shadows

### Standard Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Colored Shadows

```css
--shadow-lavender: 0 10px 40px -10px rgba(139, 92, 246, 0.4);
--shadow-rose: 0 10px 40px -10px rgba(244, 63, 94, 0.4);
--shadow-sky: 0 10px 40px -10px rgba(14, 165, 233, 0.4);
--shadow-mint: 0 10px 40px -10px rgba(20, 184, 166, 0.4);
```

---

## Animations

### Keyframes

All animations use smooth easing functions:

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Usage

```jsx
<div style={{ animation: 'slideUp 0.5s ease-out' }}>
  Content
</div>

<div style={{ animation: 'float 6s ease-in-out infinite' }}>
  Floating element
</div>
```

### Staggered Animations

```jsx
{items.map((item, index) => (
  <Card 
    key={item.id}
    style={{ 
      animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` 
    }}
  >
    {item.content}
  </Card>
))}
```

---

## Glassmorphism

### Light Mode Glass

```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(16px) saturate(200%);
-webkit-backdrop-filter: blur(16px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.4);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Dark Mode Glass

```css
background: rgba(30, 27, 75, 0.6);
backdrop-filter: blur(16px) saturate(200%);
-webkit-backdrop-filter: blur(16px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
```

---

## Responsive Design

### Breakpoints

```javascript
{
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```

### Mobile Optimizations

- Reduced padding on cards (1.5rem → 1rem)
- Smaller border radius (2rem → 1.25rem)
- Adjusted font sizes
- Stacked button groups
- Reduced blur intensity for performance

---

## Best Practices

### 1. Consistent Spacing
Use the spacing system tokens instead of arbitrary values:
```jsx
// ✅ Good
<div style={{ padding: 'var(--spacing-6)' }}>

// ❌ Avoid
<div style={{ padding: '25px' }}>
```

### 2. Color Usage
- Use semantic colors for states (success, error, warning)
- Maintain color contrast for accessibility
- Use gradients sparingly for emphasis

### 3. Animations
- Keep animations under 500ms for UI interactions
- Use `ease-out` for entrances, `ease-in` for exits
- Respect `prefers-reduced-motion` for accessibility

### 4. Glassmorphism
- Ensure sufficient contrast between glass and background
- Use backdrop-filter for better visual hierarchy
- Test on various backgrounds

### 5. Component Composition
```jsx
// ✅ Good - Composable
<Card variant="lavender">
  <CardBody>
    <Input variant="lavender" />
    <Button variant="primary">Submit</Button>
  </CardBody>
</Card>

// ❌ Avoid - Monolithic
<CustomFormCard />
```

---

## Accessibility

- **Color Contrast**: All text meets WCAG AA standards
- **Focus States**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects `prefers-reduced-motion`

---

## File Structure

```
src/
├── styles/
│   ├── designSystem.js      # Design tokens
│   └── modern.css            # Global styles
├── components/
│   └── modern/
│       ├── Card.jsx          # Card component
│       ├── Card.css
│       ├── Button.jsx        # Button component
│       ├── Button.css
│       ├── Input.jsx         # Input component
│       ├── Input.css
│       └── index.js          # Exports
└── pages/
    ├── LoginPage.jsx         # Updated with modern design
    └── TeacherLobbyPage.jsx  # Updated with modern design
```

---

## Migration Guide

### From Old to New Components

**Old (Mantine)**:
```jsx
import { Paper, Button, TextInput } from '@mantine/core';

<Paper withBorder shadow="md" p={30}>
  <TextInput label="Name" />
  <Button>Submit</Button>
</Paper>
```

**New (Modern)**:
```jsx
import { Card, CardBody } from '../components/modern';
import { Button } from '../components/modern';
import { Input } from '../components/modern';

<Card variant="lavender">
  <CardBody>
    <Input label="Name" variant="lavender" />
    <Button variant="primary">Submit</Button>
  </CardBody>
</Card>
```

---

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Theme customization panel
- [ ] Additional component variants
- [ ] Motion presets library
- [ ] Accessibility audit tools
- [ ] Design token documentation site

---

## Credits

**Design System**: Modern Pastel UI  
**Color Palette**: Soft pastels with gradient overlays  
**Typography**: Inter & Poppins  
**Inspiration**: Glassmorphism, Neumorphism, Modern Web Design

---

**Last Updated**: October 2025  
**Version**: 2.0.0
