# Firebase Project Structure

**Date:** October 22, 2025  
**Firebase Project:** temp-a1437

---

## Project Overview

```
mstu/                                    ← Root folder
├── (root)                               → Firebase: temp-a1437 (default)
├── student-portal-vite/                 → Firebase: app3384
├── kahoot/                              → Firebase: kahut1
└── portal69/                            → Firebase: feedback.html
```

---

## Hosting Targets

| Directory | Firebase Target | Firebase Site | Description |
|-----------|----------------|---------------|-------------|
| `mstu/` (root) | default | temp-a1437 | Main site |
| `mstu/student-portal-vite/` | app3384 | app3384 | Student portal (Vite) |
| `mstu/kahoot/` | **kahut1** | kahut1 | Kahoot quiz app |
| `mstu/portal69/` | feedback.html | feedback.html | Feedback portal |

---

## Current Configuration

### mstu/kahoot/.firebaserc
```json
{
  "projects": {
    "default": "temp-a1437"
  },
  "targets": {
    "temp-a1437": {
      "hosting": {
        "kahoot1": [
          "kahoot1"
        ]
      }
    }
  }
}
```

### mstu/kahoot/firebase.json
```json
{
  "hosting": [
    {
      "target": "kahoot1",
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

---

## Deployment Commands

### Deploy Kahoot App
```bash
cd mstu/kahoot
npm run build
firebase deploy --only hosting:kahoot1
```

### Deploy Student Portal
```bash
cd mstu/student-portal-vite
npm run build
firebase deploy --only hosting:app3384
```

### Deploy Main Site
```bash
cd mstu
firebase deploy --only hosting
```

### Deploy Feedback Portal
```bash
cd mstu/portal69
firebase deploy --only hosting:feedback.html
```

---

## Firebase URLs

Assuming your Firebase project is `temp-a1437`:

| Site | URL |
|------|-----|
| Main | `https://temp-a1437.web.app` |
| Kahoot | `https://kahoot1--temp-a1437.web.app` |
| Student Portal | `https://app3384--temp-a1437.web.app` |
| Feedback | `https://feedback-html--temp-a1437.web.app` |

---

## Setup Checklist

### For Kahoot App (Current Directory)

- [x] `.firebaserc` configured with target `kahoot1`
- [x] `firebase.json` uses array format
- [x] `public` directory set to `dist`
- [x] Build command: `npm run build`
- [x] Deploy command: `firebase deploy --only hosting:kahoot1`

### For Other Apps (If Needed)

#### Student Portal (student-portal-vite)
```json
// .firebaserc
{
  "projects": {
    "default": "temp-a1437"
  },
  "targets": {
    "temp-a1437": {
      "hosting": {
        "app3384": ["app3384"]
      }
    }
  }
}
```

#### Feedback Portal (portal69)
```json
// .firebaserc
{
  "projects": {
    "default": "temp-a1437"
  },
  "targets": {
    "temp-a1437": {
      "hosting": {
        "feedback.html": ["feedback.html"]
      }
    }
  }
}
```

---

## Common Commands

### Check Current Configuration
```bash
# From any directory with .firebaserc
firebase target

# Expected output for kahoot:
# Resource targets for temp-a1437:
# [ hosting ]
#   kahoot1 (kahoot1)
```

### List All Projects
```bash
firebase projects:list
```

### Switch Project (if needed)
```bash
firebase use temp-a1437
```

### Deploy All Hosting Sites
```bash
firebase deploy --only hosting
```

### Deploy Specific Target
```bash
firebase deploy --only hosting:kahoot1
```

---

## Important Notes

1. **Target Name vs Site Name**
   - Target name in `.firebaserc`: `kahoot1`
   - Firebase site name: `kahoot1`
   - These should match

2. **Build Output**
   - Vite apps (kahoot, student-portal-vite): Use `dist/`
   - Static sites: Use `public/` or appropriate folder

3. **Rewrites**
   - SPAs (Single Page Apps) need rewrites to `/index.html`
   - Static sites may not need rewrites

4. **Multiple Sites**
   - All sites share the same Firebase project (`temp-a1437`)
   - Each site has its own URL subdomain
   - Each site can have independent configuration

---

## Troubleshooting

### Error: "Target not found"
```bash
# Re-apply target
firebase target:apply hosting kahoot1 kahoot1
```

### Error: "Public directory not found"
```bash
# Build first
npm run build

# Verify dist folder exists
ls dist/
```

### Error: "Permission denied"
```bash
# Re-authenticate
firebase login
```

---

## Project Structure Best Practices

```
mstu/
├── .firebaserc                    ← Root project config
├── firebase.json                  ← Root hosting config
├── kahoot/
│   ├── .firebaserc               ← Kahoot target config
│   ├── firebase.json             ← Kahoot hosting config
│   ├── src/                      ← Source files
│   ├── dist/                     ← Build output (gitignored)
│   └── package.json
├── student-portal-vite/
│   ├── .firebaserc
│   ├── firebase.json
│   ├── src/
│   ├── dist/
│   └── package.json
└── portal69/
    ├── .firebaserc
    ├── firebase.json
    └── public/
```

---

## Deployment Workflow

### 1. Development
```bash
cd mstu/kahoot
npm run dev
```

### 2. Build
```bash
npm run build
```

### 3. Test Locally
```bash
firebase serve --only hosting:kahoot1
```

### 4. Deploy
```bash
firebase deploy --only hosting:kahoot1
```

### 5. Verify
Visit: `https://kahoot1--temp-a1437.web.app`

---

## Conclusion

Your Firebase project structure is now documented. The kahoot app is configured to deploy to the `kahoot1` target on the `temp-a1437` Firebase project.
