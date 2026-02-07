# OMNIA - Charity Tracking Platform

A comprehensive web application for tracking and managing charitable aid distribution.

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── core/                  # Core functionality
│   ├── api/              # API client and endpoints
│   ├── config/           # Configuration files
│   └── services/         # Core services (i18n, TTS, storage)
│
├── features/             # Feature modules
│   ├── auth/            # Authentication pages
│   ├── landing/         # Landing page
│   ├── home/            # Home page
│   ├── campaigns/       # Campaign management
│   ├── aid/             # Aid management
│   ├── dashboard/       # Analytics dashboard
│   ├── communication/   # Chat & FAQs
│   └── settings/        # User settings
│
├── shared/              # Shared components & utilities
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # Global state contexts
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
│
├── styles/              # Global styles & Tailwind
└── locales/             # i18n translation files

```

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Zustand + Context API
- **Forms:** React Hook Form
- **i18n:** i18next
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Maps:** Leaflet

## Features

✅ Multi-language support (FR, AR, EN)
✅ Dark mode support
✅ WCAG AA accessibility compliance
✅ Offline capability with sync
✅ Role-based access control
✅ Responsive design (XS to XL)
✅ TypeScript strict mode

## Authentication

Demo credentials for testing:
- Email: `demo@example.com`
- Password: `Demo12345!`

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_DEFAULT_LANGUAGE=fr
VITE_ENABLE_TTS=true
VITE_ENABLE_OFFLINE=true
```

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Format with Prettier
- Write semantic HTML with ARIA attributes

### Accessibility

- All interactive elements must be keyboard accessible
- Color should not be the only means of conveying information
- Text should have minimum 4.5:1 contrast ratio
- Touch targets should be at least 44x44px

### Naming Conventions

- Components: PascalCase
- Hooks: camelCase with `use` prefix
- Context files: `NameContext.tsx`
- Pages: `NamePage.tsx`
- Utilities: camelCase with `.tsx` or `.ts` extensions

## Testing

```bash
npm run test
npm run test:ui
```

Test files use Vitest + React Testing Library

## API Integration

The frontend communicates with the backend via REST API. See [API_CONTRACTS.md](./API_CONTRACTS.md) for full endpoint specifications.

Base URL: `http://localhost:3001/api`

## Deployment

### Production Build

```bash
npm run build
npm run preview
```

### Performance Targets

- Lighthouse Score: ≥ 90
- Bundle Size: < 200KB gzipped
- LCP: < 2.5s
- CLS: < 0.1

## Contributing

1. Create a feature branch: `git checkout -b feature/component-name`
2. Make your changes
3. Run tests: `npm run test`
4. Submit a pull request

## License

Proprietary - OMNIA Charity Tracking Platform

## Support

For issues or questions, contact the development team.
