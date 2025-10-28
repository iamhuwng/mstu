# Quick Start Guide - Modern Design System

## 🚀 Getting Started in 5 Minutes

### 1. Import Components

```jsx
import { Card, CardBody, CardFooter } from '../components/modern';
import { Button } from '../components/modern';
import { Input } from '../components/modern';
```

### 2. Create a Basic Page

```jsx
function MyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 50%, #f0fdfa 100%)',
      padding: '2rem'
    }}>
      <Card variant="lavender" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <CardBody>
          <h1 style={{
            background: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome!
          </h1>
          
          <Input 
            label="Your Name"
            placeholder="Enter your name"
            variant="lavender"
            fullWidth
          />
          
          <Button variant="primary" size="lg" fullWidth>
            Get Started
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
```

---

## 🎨 Common Patterns

### Pattern 1: Login/Signup Form

```jsx
<Card variant="lavender" style={{ maxWidth: '420px' }}>
  <CardBody>
    <h1 className="text-gradient">Sign In</h1>
    
    <Input 
      label="Email"
      type="email"
      variant="lavender"
      fullWidth
    />
    
    <Input 
      label="Password"
      type="password"
      variant="lavender"
      fullWidth
    />
    
    <Button variant="primary" fullWidth>
      Sign In
    </Button>
  </CardBody>
  
  <CardFooter style={{ justifyContent: 'center' }}>
    <Button variant="glass">
      Create Account
    </Button>
  </CardFooter>
</Card>
```

### Pattern 2: Dashboard Card Grid

```jsx
const cards = [
  { title: 'Total Users', value: '1,234', variant: 'lavender' },
  { title: 'Active Sessions', value: '56', variant: 'sky' },
  { title: 'Completed', value: '789', variant: 'mint' },
];

<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
}}>
  {cards.map((card, index) => (
    <Card 
      key={index}
      variant={card.variant}
      hover
      style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
    >
      <CardBody>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {card.title}
        </p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>
          {card.value}
        </h2>
      </CardBody>
    </Card>
  ))}
</div>
```

### Pattern 3: Action Buttons

```jsx
<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
  <Button variant="primary">
    ✅ Confirm
  </Button>
  <Button variant="danger">
    ❌ Delete
  </Button>
  <Button variant="glass">
    ↩️ Cancel
  </Button>
</div>
```

### Pattern 4: Form with Validation

```jsx
const [errors, setErrors] = useState({});

<Card variant="sky">
  <CardBody>
    <Input
      label="Username"
      placeholder="Enter username"
      variant="sky"
      error={errors.username}
      fullWidth
    />
    
    <Input
      label="Email"
      type="email"
      placeholder="your@email.com"
      variant="sky"
      error={errors.email}
      helperText="We'll never share your email"
      fullWidth
    />
    
    <Button variant="primary" fullWidth>
      Submit
    </Button>
  </CardBody>
</Card>
```

---

## 🎬 Animation Examples

### Entrance Animation

```jsx
<Card style={{ animation: 'slideUp 0.5s ease-out' }}>
  Content
</Card>
```

### Staggered List

```jsx
{items.map((item, i) => (
  <Card 
    key={item.id}
    style={{ animation: `slideUp 0.5s ease-out ${i * 0.1}s backwards` }}
  >
    {item.content}
  </Card>
))}
```

### Floating Elements

```jsx
<div style={{
  position: 'absolute',
  top: '10%',
  left: '10%',
  width: '300px',
  height: '300px',
  background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15), transparent)',
  borderRadius: '50%',
  filter: 'blur(60px)',
  animation: 'float 8s ease-in-out infinite'
}} />
```

---

## 🎨 Color Quick Reference

```jsx
// Variants
<Card variant="lavender" />  // Purple tones
<Card variant="rose" />      // Pink/red tones
<Card variant="sky" />       // Blue tones
<Card variant="mint" />      // Teal/green tones
<Card variant="peach" />     // Orange tones
<Card variant="glass" />     // Transparent glass

// Buttons
<Button variant="primary" />   // Lavender gradient
<Button variant="secondary" /> // Sky gradient
<Button variant="success" />   // Mint gradient
<Button variant="danger" />    // Rose gradient
<Button variant="warning" />   // Peach gradient
```

---

## 📐 Spacing Quick Reference

```jsx
// Padding/Margin
style={{ padding: '1rem' }}      // 16px
style={{ padding: '1.5rem' }}    // 24px
style={{ padding: '2rem' }}      // 32px

// Gap
style={{ gap: '0.5rem' }}        // 8px
style={{ gap: '1rem' }}          // 16px
style={{ gap: '1.5rem' }}        // 24px
```

---

## 🎯 Common Layouts

### Centered Container

```jsx
<div style={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem'
}}>
  <Card style={{ maxWidth: '600px', width: '100%' }}>
    {/* Content */}
  </Card>
</div>
```

### Full-Width Section

```jsx
<div style={{
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '2rem 1rem'
}}>
  {/* Content */}
</div>
```

### Grid Layout

```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
}}>
  {/* Cards */}
</div>
```

---

## ✨ Pro Tips

### 1. Gradient Text

```jsx
<h1 style={{
  background: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}>
  Gradient Title
</h1>
```

### 2. Glass Background

```jsx
<div style={{
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '1.5rem',
  padding: '2rem'
}}>
  Glass content
</div>
```

### 3. Colored Shadow

```jsx
<Card style={{
  boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.4)'
}}>
  Card with lavender shadow
</Card>
```

### 4. Loading Button

```jsx
<Button variant="primary" loading>
  Processing...
</Button>
```

### 5. Button with Icon

```jsx
<Button 
  variant="primary" 
  icon={<SearchIcon />}
  iconPosition="left"
>
  Search
</Button>
```

---

## 🐛 Common Issues

### Issue: Animations not working
**Solution**: Make sure modern.css is imported in index.css

### Issue: Glass effect not visible
**Solution**: Ensure parent has a background or image

### Issue: Components not found
**Solution**: Check import path: `'../components/modern'`

### Issue: Styles not applying
**Solution**: Clear browser cache, restart dev server

---

## 📚 Next Steps

1. ✅ Read [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for full documentation
2. ✅ Check [DESIGN_OVERHAUL_SUMMARY.md](./DESIGN_OVERHAUL_SUMMARY.md) for details
3. ✅ Explore existing pages (LoginPage, TeacherLobbyPage) for examples
4. ✅ Start building with modern components!

---

**Happy Building! 🚀**
