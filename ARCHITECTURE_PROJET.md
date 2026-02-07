# 🏗️ ARCHITECTURE ET STRUCTURE DES DOSSIERS

## 1. STRUCTURE FRONTEND (React) - SCALABLE & PERFORMANTE

```
frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── icons/
│       ├── images/
│       └── fonts/
│
├── src/
│   ├── index.tsx                    # Entry point
│   ├── App.tsx                      # Root component
│   │
│   ├── core/                        # 🔧 CONFIGURATION & SETUP
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance + interceptors
│   │   │   ├── endpoints.ts         # API URLs CONSTANTS
│   │   │   └── handlers/
│   │   │       ├── errorHandler.ts
│   │   │       └── responseHandler.ts
│   │   │
│   │   ├── config/
│   │   │   ├── environment.ts       # ENV vars
│   │   │   ├── constants.ts         # App constantes
│   │   │   └── theme.ts             # Tailwind/emotion config
│   │   │
│   │   └── services/
│   │       ├── localization.ts      # i18n setup
│   │       ├── analytics.ts         # Event tracking
│   │       └── notifications.ts     # Toast/Alerts
│   │
│   ├── features/                    # 📦 FEATURE MODULES
│   │   │
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── LogoutPage.tsx
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── families/       # ⭐ CORE MODULE
│   │   │   ├── api/
│   │   │   │   ├── familiesApi.ts   # React Query hooks
│   │   │   │   └── types.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useFamilies.ts   # List + Filters
│   │   │   │   ├── useFamilyDetail.ts
│   │   │   │   ├── useCreateFamily.ts
│   │   │   │   ├── useUpdateFamily.ts
│   │   │   │   └── useDeleteFamily.ts
│   │   │   ├── pages/
│   │   │   │   ├── FamiliesPage.tsx
│   │   │   │   ├── FamilyDetailPage.tsx
│   │   │   │   ├── CreateFamilyPage.tsx
│   │   │   │   └── EditFamilyPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── FamilyForm.tsx      # Réutilisable
│   │   │   │   ├── FamilyCard.tsx
│   │   │   │   ├── FamilyTable.tsx     # Avec tri/filtre
│   │   │   │   ├── FamilySearch.tsx
│   │   │   │   └── FamilyFilters.tsx
│   │   │   ├── store/
│   │   │   │   └── familiesSlice.ts    # Redux (optionnel)
│   │   │   └── types/
│   │   │       └── family.types.ts
│   │   │
│   │   ├── visits/         # ⭐ CORE MODULE
│   │   │   ├── api/
│   │   │   │   └── visitsApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useVisits.ts
│   │   │   │   ├── useCreateVisit.ts
│   │   │   │   └── useVisitHistory.ts
│   │   │   ├── pages/
│   │   │   │   ├── VisitHistoryPage.tsx
│   │   │   │   └── CreateVisitPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── VisitForm.tsx
│   │   │   │   ├── VisitTimeline.tsx
│   │   │   │   ├── AidSelector.tsx
│   │   │   │   └── VisitDetails.tsx
│   │   │   └── types/
│   │   │       └── visit.types.ts
│   │   │
│   │   ├── map/            # 🗺️ GEO MODULE
│   │   │   ├── api/
│   │   │   │   └── geoApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useMapLocation.ts
│   │   │   │   ├── useGeolocation.ts
│   │   │   │   └── useGeoOptimize.ts  # TSP algorithm
│   │   │   ├── pages/
│   │   │   │   └── MapPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── MapViewer.tsx      # Leaflet/GMaps
│   │   │   │   ├── MapMarkers.tsx
│   │   │   │   ├── MapClusters.tsx    # Supercluster
│   │   │   │   ├── RouteOptimizer.tsx # TSP visualizer
│   │   │   │   └── GeoInputForm.tsx   # GPS input
│   │   │   └── utils/
│   │   │       ├── tsp.ts             # Travelling salesman algo
│   │   │       ├── geospatial.ts      # Distance calcs
│   │   │       └── mapHelpers.ts
│   │   │
│   │   ├── dashboard/      # 📊 ANALYTICS
│   │   │   ├── api/
│   │   │   │   └── dashboardApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardStats.ts
│   │   │   │   └── useDashboardCharts.ts
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── AidDistributionChart.tsx
│   │   │   │   ├── VisitsTrendChart.tsx
│   │   │   │   ├── TopFamiliesCard.tsx
│   │   │   │   └── RegionalStatsMap.tsx
│   │   │   └── utils/
│   │   │       └── chartHelpers.ts
│   │   │
│   │   ├── reports/        # 📄 REPORTS & EXPORT
│   │   │   ├── api/
│   │   │   │   └── reportsApi.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useExportPDF.ts
│   │   │   │   └── useExportExcel.ts
│   │   │   ├── pages/
│   │   │   │   └── ReportsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ReportBuilder.tsx
│   │   │   │   ├── ReportPreview.tsx
│   │   │   │   └── ExportButtons.tsx
│   │   │   └── utils/
│   │   │       ├── pdfGenerator.ts    # jsPDF
│   │   │       └── excelGenerator.ts  # ExcelJS
│   │   │
│   │   └── settings/       # ⚙️ PREFERENCES
│   │       ├── pages/
│   │       │   ├── SettingsPage.tsx
│   │       │   └── AccessibilitySettings.tsx
│   │       ├── components/
│   │       │   ├── ThemePicker.tsx    # Mode sombre
│   │       │   ├── LanguagePicker.tsx
│   │       │   ├── FontSizeSettings.tsx
│   │       │   └── A11yOptions.tsx
│   │       └── hooks/
│   │           └── useSettings.ts
│   │
│   ├── shared/                      # 🔄 SHARED MODULES
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx        # Nav + Logo
│   │   │   │   ├── Sidebar.tsx       # Menu principal
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx        # Wrapper
│   │   │   │
│   │   │   ├── Forms/
│   │   │   │   ├── FormField.tsx     # Réutilisable validated
│   │   │   │   ├── FormError.tsx
│   │   │   │   ├── FormButton.tsx
│   │   │   │   └── SelectField.tsx
│   │   │   │
│   │   │   ├── Tables/
│   │   │   │   ├── DataTable.tsx     # Generic + sorting/pagination
│   │   │   │   └── TableCell.tsx
│   │   │   │
│   │   │   ├── Cards/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── CardTitle.tsx
│   │   │   │
│   │   │   └── UI/
│   │   │       ├── Button.tsx        # Accessible buttons
│   │   │       ├── Modal.tsx         # Accessible modal
│   │   │       ├── Drawer.tsx
│   │   │       ├── Toast.tsx         # Notifications
│   │   │       ├── Badge.tsx
│   │   │       ├── Spinner.tsx
│   │   │       ├── Empty.tsx         # No data state
│   │   │       └── Error.tsx         # Error state
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAsync.ts           # Generic async hook
│   │   │   ├── useFetch.ts           # Fetch wrapper
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts    # Persist state
│   │   │   ├── useTheme.ts           # Theme context
│   │   │   ├── useMediaQuery.ts      # Responsive logic
│   │   │   └── useAccessibility.ts   # A11y features toggle
│   │   │
│   │   ├── utils/
│   │   │   ├── formatting.ts         # Date, number format
│   │   │   ├── validation.ts         # Form validation rules
│   │   │   ├── errors.ts             # Error handling utilities
│   │   │   ├── storage.ts            # LocalStorage helpers
│   │   │   ├── accessibility.ts      # A11y utilities
│   │   │   └── logger.ts             # Logging
│   │   │
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx      # Mode sombre/clair
│   │   │   ├── NotificationContext.tsx
│   │   │   ├── LoadingContext.tsx
│   │   │   └── A11yContext.tsx       # Accessibilité settings
│   │   │
│   │   └── types/
│   │       ├── common.types.ts       # Global types
│   │       ├── api.types.ts          # API response types
│   │       └── ui.types.ts           # UI component props
│   │
│   ├── pages/                        # 🔗 TOP LEVEL ROUTES
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── styles/                       # 🎨 GLOBAL STYLES
│   │   ├── globals.css               # Tailwind + Reset
│   │   ├── variables.css             # CSS variables
│   │   ├── accessibility.css         # A11y specific
│   │   └── animations.css
│   │
│   └── tests/                        # 🧪 TEST STRUCTURE
│       ├── unit/
│       │   ├── hooks/
│       │   ├── utils/
│       │   └── components/
│       ├── integration/
│       │   └── features/
│       └── e2e/
│           └── scenarios/
│
├── .env.example
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 2. STRUCTURE BACKEND (NestJS) - CLEAN ARCHITECTURE

```
backend/
│
├── src/
│   ├── main.ts                      # Entry point
│   │
│   ├── common/                      # 🔧 SHARED INFRASTRUCTURE
│   │   ├── decorators/
│   │   │   ├── Auth.decorator.ts
│   │   │   ├── Roles.decorator.ts
│   │   │   └── Public.decorator.ts
│   │   │
│   │   ├── filters/
│   │   │   ├── HttpExceptionFilter.ts
│   │   │   └── AllExceptionsFilter.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── JwtAuthGuard.ts
│   │   │   ├── RolesGuard.ts
│   │   │   └── ThrottlerGuard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── LoggingInterceptor.ts
│   │   │   ├── TransformInterceptor.ts
│   │   │   └── TimeoutInterceptor.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── LoggerMiddleware.ts
│   │   │   └── CorsMiddleware.ts
│   │   │
│   │   ├── pipes/
│   │   │   ├── ValidationPipe.ts
│   │   │   └── ParseIntPipe.ts
│   │   │
│   │   ├── constants/
│   │   │   └── constants.ts
│   │   │
│   │   └── types/
│   │       ├── ApiResponse.ts
│   │       └── Pagination.ts
│   │
│   ├── config/                      # 📋 CONFIGURATION
│   │   ├── database.config.ts        # TypeORM config
│   │   ├── jwt.config.ts
│   │   ├── validation.config.ts
│   │   └── env.validation.ts
│   │
│   ├── database/                    # 💾 DATABASE
│   │   ├── migrations/
│   │   │   ├── 001_initial.ts
│   │   │   ├── 002_add_indexes.ts
│   │   │   └── ...
│   │   │
│   │   ├── seeds/
│   │   │   ├── user.seeder.ts
│   │   │   └── family.seeder.ts
│   │   │
│   │   └── factories/
│   │       └── family.factory.ts
│   │
│   ├── modules/                     # 📦 FEATURE MODULES (DDD)
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts       # Business logic
│   │   │   ├── auth.controller.ts    # HTTP layer
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── families/                 # ⭐ CORE MODULE
│   │   │   ├── families.module.ts
│   │   │   ├── families.controller.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── services/
│   │   │   │   │   ├── families.service.ts (use cases)
│   │   │   │   │   └── family-validator.service.ts
│   │   │   │   │
│   │   │   │   └── dto/
│   │   │   │       ├── create-family.dto.ts
│   │   │   │       ├── update-family.dto.ts
│   │   │   │       ├── family-response.dto.ts
│   │   │   │       └── family-query.dto.ts (filters)
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── family.entity.ts
│   │   │   │   ├── value-objects/
│   │   │   │   │   └── family-status.ts
│   │   │   │   ├── repositories/
│   │   │   │   │   └── family.repository.interface.ts
│   │   │   │   └── events/
│   │   │   │       └── family-created.event.ts
│   │   │   │
│   │   │   └── infrastructure/
│   │   │       ├── repositories/
│   │   │       │   └── family.repository.ts (TypeORM)
│   │   │       └── mappers/
│   │   │           └── family.mapper.ts
│   │   │
│   │   ├── visits/                  # ⭐ CORE MODULE
│   │   │   ├── visits.module.ts
│   │   │   ├── visits.controller.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── services/
│   │   │   │   │   └── visits.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-visit.dto.ts
│   │   │   │       └── visit-response.dto.ts
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   └── entities/
│   │   │   │       └── visit.entity.ts
│   │   │   │
│   │   │   └── infrastructure/
│   │   │       └── repositories/
│   │   │           └── visit.repository.ts
│   │   │
│   │   ├── aids/
│   │   │   ├── aids.module.ts
│   │   │   ├── aids.service.ts
│   │   │   ├── aids.controller.ts
│   │   │   ├── entities/
│   │   │   │   └── aid.entity.ts
│   │   │   └── dto/
│   │   │       └── aid.dto.ts
│   │   │
│   │   ├── analytics/               # 📊 REPORTING
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── queries/
│   │   │   │   ├── get-dashboard-stats.query.ts
│   │   │   │   └── get-visit-trends.query.ts
│   │   │   └── dto/
│   │   │       └── dashboard-response.dto.ts
│   │   │
│   │   ├── geo/                     # 🗺️ GEOSPATIAL
│   │   │   ├── geo.module.ts
│   │   │   ├── geo.service.ts
│   │   │   ├── geo.controller.ts
│   │   │   ├── utils/
│   │   │   │   ├── tsp-solver.ts     # Travelling Salesman
│   │   │   │   ├── distance-calc.ts
│   │   │   │   └── route-optimizer.ts
│   │   │   └── dto/
│   │   │       └── optimize-route.dto.ts
│   │   │
│   │   ├── reports/                 # 📄 EXPORTS
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── generators/
│   │   │   │   ├── pdf.generator.ts  # PDFKit
│   │   │   │   └── excel.generator.ts # ExcelJS
│   │   │   └── dto/
│   │   │       └── export-options.dto.ts
│   │   │
│   │   └── health/
│   │       ├── health.controller.ts
│   │       └── health.service.ts
│   │
│   ├── shared/                      # 🔄 UTILITIES
│   │   ├── interfaces/
│   │   │   ├── repository.interface.ts
│   │   │   └── service.interface.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── pagination.ts
│   │   │   ├── error-handling.ts
│   │   │   ├── validation.ts
│   │   │   └── formatting.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── error-messages.ts
│   │   │   └── success-messages.ts
│   │   │
│   │   └── types/
│   │       ├── request.types.ts
│   │       └── response.types.ts
│   │
│   └── app.module.ts                # Root module
│
├── test/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── integration/
│   │   ├── auth/
│   │   ├── families/
│   │   └── visits/
│   │
│   └── fixtures/
│       └── test-data.ts
│
├── .env.example
├── .env.test
├── .eslintrc.js
├── .prettierrc
├── typeorm.config.ts
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml               # 🐳 Local MySQL
├── package.json
└── README.md
```

---

## 3. DESIGN PATTERNS APPLIQUÉS

### 3.1 Frontend (React)

```typescript
// ❌ AVANT: No structure
function Family() {
  const [families, setFamilies] = useState(null);
  // 500 lines of mixed logic...
}

// ✅ APRÈS: Clean separation
export const useFamilies = (filters?: FamilyFilters) => {
  return useQuery(
    ['families', filters],
    () => familiesApi.list(filters),
    { staleTime: 5 * 60 * 1000 } // Caching strategy
  );
};

// Re-utilizable Smart Hook
const FamiliesPage = () => {
  const { data, isLoading, error } = useFamilies();
  return <FamilyList data={data} />;
};
```

**Patterns:**
- 🎣 **Custom Hooks:** Logic réutilisable, testable
- 📦 **Feature-based structure:** Scalable, modular
- 🔄 **React Query:** Caching, synchronisation auto
- 🧩 **Compound components:** Flexible, composable
- 🎬 **Context for global state:** Theme, auth, notifications

### 3.2 Backend (NestJS)

```typescript
// SOLID Principles:

// ✅ Dependency Injection
@Injectable()
export class FamiliesService {
  constructor(
    private readonly familyRepository: FamilyRepository, // Interface
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateFamilyDto): Promise<FamilyResponse> {
    // Business logic
    const family = new Family(dto);
    return this.familyRepository.save(family);
  }
}

// ✅ Repository Pattern (Data abstraction)
@Injectable()
export class FamilyRepository {
  async findById(id: number): Promise<Family | null> {
    return this.db.family.findOne({ id });
  }
}

// ✅ DTO Validation (Input isolation)
export class CreateFamilyDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsPhoneNumber()
  phone: string;
}

// ✅ Service segregation
// FamiliesService → Business logic
// FamilyValidator   → Validation rules
// FamilyMapper      → Data transformation
```

---

## 4. PERFORMANCE OPTIMIZATIONS

### Frontend
```typescript
// ✅ Code splitting: Lazy loading routes
const FamiliesPage = lazy(() => import('./pages/FamiliesPage'));

// ✅ Image optimization: Use Next Image or similar
<img loading="lazy" srcSet="..." alt="Family photo" />

// ✅ Memoization: Prevent unnecessary renders
const FamilyCard = memo(({ family }) => (...), (prev, next) => 
  prev.family.id === next.family.id
);

// ✅ Debouncing: Search/filter
const debouncedSearch = useDebounce(searchTerm, 300);

// ✅ Virtual scrolling: Large lists
<FixedSizeList height={600} itemCount={2500} />

// ✅ Caching strategy with React Query
useQuery(['families'], fetchFamilies, {
  staleTime: 5 * 60 * 1000,      // 5 min fresh
  cacheTime: 30 * 60 * 1000,     // 30 min in memory
  refetchOnWindowFocus: false,   // No spam
});
```

### Backend
```typescript
// ✅ Database indexes (MySQL)
CREATE INDEX idx_family_status ON families(status);
CREATE INDEX idx_visit_date ON visits(visit_date);

// ✅ Query optimization with eager loading
const family = await this.familyRepository.find({
  relations: ['visits', 'visits.aids'], // Prevent N+1
});

// ✅ Pagination for large datasets
const [data, total] = await this.repo.findAndCount({
  skip: (page - 1) * limit,
  take: limit,
});

// ✅ Caching with Redis (optional but recommended)
@Cacheable('families', 5 * 60) // 5 min cache
async getFamilies() { ... }

// ✅ Response compression
GzipMiddleware enabled in main.ts

// ✅ Query optimization (avoid SELECT *)
const family = await this.repo.find({
  select: ['id', 'name', 'phone', 'status'],
});
```

---

## 5. ACCESSIBILITY IMPLEMENTATION MAP

### React Components Pattern
```typescript
// ❌ NOT Accessible
<div onClick={handleClick}>Delete</div>

// ✅ Accessible
<button 
  onClick={handleClick}
  aria-label="Delete family record"
  className="focus:ring-2 focus:ring-blue-500"
>
  <TrashIcon aria-hidden="true" />
  <span>Delete</span>
</button>

// ✅ Form with ARIA
<label htmlFor="name">
  Family name <span aria-label="required">*</span>
</label>
<input
  id="name"
  aria-required="true"
  aria-invalid={errors.name ? true : false}
  aria-describedby={errors.name ? "name-error" : undefined}
/>
{errors.name && <span id="name-error" role="alert">{errors.name}</span>}

// ✅ Keyboard navigation
<nav role="navigation" aria-label="Main">
  <ul>
    <li><Link tabIndex={0}>Home</Link></li>
    <li><Link tabIndex={0}>Families</Link></li>
  </ul>
</nav>
```

### Accessibility Checklist
```
☑ WCAG AA Contrast (4.5:1 at min)
☑ Form labels + ARIA associations
☑ Keyboard-only navigation works
☑ Focus indicators visible
☑ Modal focus trap
☑ Screen reader tested
☑ Color not sole indicator
☑ No auto-playing audio
☑ Resize text 200% works
☑ Mobile touch targets 44px+
```

---

## 6. GIT WORKFLOW & BRANCHING

```
main (Production)
  ↑
  └─ develop (Integration)
      ├─ feature/auth-login
      ├─ feature/families-crud
      ├─ feature/map-integration
      ├─ fix/accessibility-contrast
      ├─ chore/dependency-update
      └─ test/e2e-scenarios
```

**Rules:**
- Feature branches from `develop`
- PR before merge + code review
- Squash commits on merge (clean history)
- CI/CD: Tests + Lint before merge

---

## 7. ENVIRONMENT STRUCTURE

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
```

### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=omnia_dev
DATABASE_USER=root
DATABASE_PASSWORD=password

JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=7d

NODE_ENV=development
PORT=3000

# Optional
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://...
```

---

## 8. TESTING STRATEGY

```
Frontend Coverage Target: 80%+
├── Unit Tests (Hooks, Utils): 60%
├── Integration (Components): 25%
└── E2E (Critical Flows): 15%

Backend Coverage Target: 85%+
├── Unit Tests (Services): 50%
├── Integration (API): 35%
└── E2E (API flows): 15%
```

**Tools:**
- Frontend: Vitest + React Testing Library
- Backend: Jest + Supertest
- E2E: Playwright

---

## 9. DEPLOYMENT STRUCTURE

```
Docker (Local + Production)
├── frontend.Dockerfile    → React app
├── backend.Dockerfile     → NestJS app
├── docker-compose.yml     → Orchestration (Dev)
└── kubernetes/            → Production (optional)

CI/CD Pipeline:
1. Push → GitHub
2. Tests run (Jest, Vitest)
3. Linting (ESLint)
4. Build check
5. Deploy to staging
6. Manual approval
7. Deploy to prod
```

---

**Cette architecture est:**
✅ **Scalable** - Facile d'ajouter features
✅ **Performante** - Caching, optimisations
✅ **Maintenable** - Code organisé, testable
✅ **Accessible** - WCAG AA+ intégré
✅ **Sécurisée** - Auth, validation, injection prevention
✅ **Professionnelle** - Patterns industry-standard

**Let's build it! 🚀**
