# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HUMAN 3.0 is a web-based assessment application that helps users explore their development across four dimensions (Mind, Body, Spirit, Vocation) through an AI-powered conversational interface. The app generates personalized reports with transformation strategies.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 7
- **Styling**: Tailwind CSS v3.4.19 with shadcn/ui components
- **Animations**: GSAP, custom WebGL shaders
- **AI Backend**: DeepSeek Chat API (proxied through Vercel serverless function)
- **Deployment**: Vercel (configured via `vercel.json`)

## Common Commands

```bash
# Development
cd app && npm run dev          # Start dev server on port 3000

# Build & Test
cd app && npm run build        # Type check + build
cd app && npm run lint         # ESLint
cd app && npm run preview      # Preview production build
```

## Architecture

### Application Flow

The app follows a linear 4-phase user journey managed by `App.tsx`:

1. **Hero** (`HeroSection.tsx`) - Landing page with initial input
2. **Assessment** (`AssessmentInterface.tsx`) - AI conversation (12-20 rounds)
3. **Metatype** (`MetatypeCanvas.tsx`) - WebGL visualization of results
4. **Report** (`ReportPage.tsx`) - Detailed assessment report

### Key Directories

```
app/
├── src/
│   ├── sections/      # Page sections (HeroSection, AssessmentInterface, MetatypeCanvas, ReportPage)
│   ├── hooks/         # Custom hooks (useDeepSeekChat, useTextScramble)
│   ├── types/         # TypeScript definitions
│   ├── components/ui/ # shadcn/ui components (40+)
│   ├── lib/           # Utilities (cn, class-variance-authority helpers)
│   ├── App.tsx        # Root component with phase management
│   └── main.tsx       # Entry point
├── api/               # Vercel serverless functions (chat.ts for DeepSeek proxy)
├── public/images/     # Dimension images for report page
└── vite.config.ts     # Path alias: @/ → ./src
```

### Color Scheme

Constants used throughout the app:
- Background: `#FDF6E3`
- Text: `#3D3229`
- Text Muted: `#8C7E6A`
- Border: `#E8DCC8`
- Accent: `#8C7E6A`

### Key Types (`src/types/index.ts`)

- `AppPhase`: `'loading' | 'hero' | 'assessment' | 'metatype' | 'report'`
- `AssessmentResult`: Complete assessment output with metatype name, dimension scores, quadrant analysis
- `DimensionScores`: `{ mind, body, spirit, vocation }` (0-1 range)
- `Message`: Chat message with id, role, content, timestamp

### AI Integration

**Chat Hook** (`src/hooks/useDeepSeekChat.ts`):
- Manages streaming chat with DeepSeek API
- Falls back to simulated responses if API fails
- Parses assessment results from AI responses (looks for `[ASSESSMENT_COMPLETE]` tag and JSON)
- System prompt is embedded in the hook with Chinese language instruction

**API Proxy** (`api/chat.ts`):
- Vercel serverless function that proxies to DeepSeek API
- Enables streaming responses via SSE (Server-Sent Events)
- Requires `DEEPSEEK_API_KEY` environment variable

### WebGL Canvas

`MetatypeCanvas.tsx` uses custom WebGL shaders to visualize assessment results:
- Dimension scores (mind/body/spirit/vocation) animate from 0.5 to target values
- Spiral fractal shader responds dynamically to score changes
- Uses requestAnimationFrame for smooth score interpolation

### State Management

The app uses React's `useState` with callback patterns for phase transitions:
- State is lifted to `App.tsx` and passed down through props
- Each phase component receives `onComplete` callbacks to trigger transitions
- No external state management library

## Important Notes

- The app uses the shadcn/ui component library—import from `@/components/ui/*`
- All text in the assessment flow is in Chinese (Simplified)
- Path alias `@/` maps to `./src` in both TypeScript and Vite configs
- The assessment flow requires approximately 12-20 chat exchanges before completion
- Dimension scores are normalized to 0-1 range for display and visualization
