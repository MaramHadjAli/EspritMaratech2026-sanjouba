# ⏰PLAN D'EXÉCUTION 42 HEURES - GAGNANT

## 📊 OVERVIEW STRATÉGIQUE

```
JOUR 1 (Vendredi 6/2) = 14h
├─ 0-2h:   Setup dev environment
├─ 2-7h:   Backend: DB + API Core
├─ 7-12h:  Frontend: Structure + Pages
└─ 12-14h: Intégration + Testing

JOUR 2 (Samedi 7/2) = 14h
├─ 0-5h:   Fonctionnalités avancées
├─ 5-10h:  Géolocalisation + Maps
├─ 10-14h: UI Polish + Accessibilité
└─ 14h:    Nuit repos/debug

JOUR 3 (Dimanche 8/2) = 14h
├─ 0-4h:   Optimisations + Performance
├─ 4-7h:   Innovations (TSP, Export, Audio)
├─ 7-12h:  Tests complets + Documentation
└─ 12-14h: Démo rehearsal + Final publish
```

---

## 🔧 JOUR 1 - FONDATIONS (14 HEURES)

### CRÉNEAU 0-2h: SETUP DÉVELOPPEMENT
**Responsable:** 1 personne (Dev Lead)  
**Objectif:** Environnement prêt et "hello world" function

#### Checklist Setup Frontend:
```
[ ] Créer repo GitHub (frontend)
[ ] Node.js 18+ installed (npm --version)
[ ] npm create vite@latest . -- --template react-ts
[ ] Dependencies: 
    [ ] npm install react-query axios zustand
    [ ] npm install -D tailwindcss postcss autoprefixer
    [ ] npm install -D @types/react @types/node
    [ ] npm install leaflet react-leaflet (or use Google Maps)
    [ ] npm install react-router-dom
    [ ] npm install zod (validation)
    [ ] npm install wouter (smaller router option)
    [ ] npm install date-fns (date formatting)
[ ] Tailwind init: npx tailwindcss init -p
[ ] Test run: npm run dev (port 5173)
[ ] .env.local setup
[ ] Git: git init, first commit
```

#### Checklist Setup Backend:
```
[ ] Créer repo GitHub (backend)
[ ] nest new omnia-backend
[ ] npm install @nestjs/typeorm typeorm mysql2
[ ] npm install @nestjs/jwt @nestjs/passport passport passport-jwt
[ ] npm install @nestjs/config dotenv zod
[ ] npm install class-validator class-transformer
[ ] npm install uuid
[ ] npm install -D @types/node jest
[ ] Setup database:
    [ ] Docker: docker run -d -p 3306:3306 \
        -e MYSQL_ROOT_PASSWORD=root \
        -e MYSQL_DATABASE=omnia_dev mysql:8.0
[ ] Create TypeORM config (database.config.ts)
[ ] Test run: npm run start:dev
[ ] First migration created (users table)
```

#### Checklist Infrastructure:
```
[ ] Git repos linked (frontend + backend)
[ ] README.md created in both (instructions setup)
[ ] .env.example files created
[ ] .gitignore setup (node_modules, .env)
[ ] Slack/Discord channel for team
[ ] Shared Google Doc (live notes + tasks)
```

**⏱️ End Time Check:** Should finish ~ 14:15 (allow 15min buffer)

---

### CRÉNEAU 2-7h: BACKEND CORE API (5 HEURES)

**Responsables:** 2 personnes (Senior Dev + Mid Dev)  
**Objectif:** Toutes les APIs CRUD fonctionnelles

#### 2-2:45h: Database Schema & Migrations

```sql
-- Database entities à créer en TypeORM

1️⃣ User Entity
   ├─ id, username, email, password_hash
   ├─ full_name, phone
   ├─ role: ENUM(volunteer, coordinator, admin)
   └─ timestamps

2️⃣ Family Entity
   ├─ id, name, representative
   ├─ address, city, phone
   ├─ latitude, longitude (DECIMAL 10,8)
   ├─ family_size INT
   ├─ socioeconomic_status
   ├─ status: ENUM(active, inactive, archived)
   ├─ notes TEXT
   ├─ photo_url VARCHAR
   ├─ created_by FK → User
   └─ timestamps + soft delete

3️⃣ Visit Entity
   ├─ id, family_id FK
   ├─ visit_date DATE, visit_time TIME
   ├─ volunteer_id FK → User
   ├─ notes TEXT
   ├─ photo_url VARCHAR
   ├─ OneToMany: aids[]
   └─ timestamps

4️⃣ Aid Entity
   ├─ id, visit_id FK
   ├─ aid_type: ENUM(food, medicine, clothing, medical, fuel, other)
   ├─ description, quantity, unit
   ├─ cost_value DECIMAL(10,2)
   └─ timestamps

5️⃣ AuditLog Entity (optional but impressive)
   ├─ id, user_id, action
   ├─ table_name, record_id
   ├─ old_values JSON, new_values JSON
   └─ timestamp
```

**Code:**
```typescript
// user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  full_name: string;

  @Column({ enum: ['volunteer', 'coordinator', 'admin'], default: 'volunteer' })
  role: string;

  @OneToMany(() => Family, family => family.created_by)
  families: Family[];

  @OneToMany(() => Visit, visit => visit.volunteer)
  visits: Visit[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// family.entity.ts
@Entity('families')
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ enum: ['active', 'inactive', 'archived'], default: 'active' })
  status: string;

  @ManyToOne(() => User)
  created_by: User;

  @OneToMany(() => Visit, visit => visit.family, { eager: false })
  visits: Visit[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date; // Soft delete
}

// visit.entity.ts
@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family, family => family.visits, { cascade: true })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @Column()
  visit_date: Date;

  @Column({ nullable: true })
  visit_time: string;

  @ManyToOne(() => User)
  volunteer: User;

  @OneToMany(() => Aid, aid => aid.visit, { cascade: true })
  aids: Aid[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// aid.entity.ts
@Entity('aids')
export class Aid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visit, visit => visit.aids, { onDelete: 'CASCADE' })
  visit: Visit;

  @Column({
    enum: ['food_package', 'medicine', 'clothing', 'medical_visit', 'fuel', 'other'],
  })
  aid_type: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @CreateDateColumn()
  created_at: Date;
}
```

**Exécution:**
```bash
# 1. Générer les entities dans CLI
nest g resource users      # Generate CRUD scaffold
nest g resource families
nest g resource visits
nest g resource aids

# 2. Créer une migration
npm run typeorm migration:generate -- src/database/migrations/InitialSchema

# 3. Exécuter migration
npm run typeorm migration:run

# 4. Commit
git add . && git commit -m "feat: Database schema entities"
```

**⏱️ Should Complete:** 14:45

---

#### 2:45-4:30h: Services & Repositories (1:45h)

```typescript
// families.service.ts - Business Logic
@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
    private logger: Logger,
  ) {}

  async create(createFamilyDto: CreateFamilyDto, userId: number): Promise<FamilyResponse> {
    const family = this.familyRepository.create({
      ...createFamilyDto,
      created_by: { id: userId },
    });
    
    const saved = await this.familyRepository.save(family);
    this.logger.log(`Family created: ${saved.id}`);
    
    return this.toResponse(saved);
  }

  async findAll(
    page = 1,
    limit = 20,
    filters?: FamilyQueryDto,
  ): Promise<PaginatedResponse<FamilyResponse>> {
    // Optimized query avec indexes
    const query = this.familyRepository.createQueryBuilder('f');

    if (filters?.status) {
      query.where('f.status = :status', { status: filters.status });
    }
    if (filters?.search) {
      query.andWhere('(f.name LIKE :search OR f.address LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    const [data, total] = await query
      .leftJoinAndSelect('f.visits', 'visits')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('f.updated_at', 'DESC')
      .getManyAndCount();

    return {
      data: data.map(f => this.toResponse(f)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: number): Promise<FamilyResponse> {
    const family = await this.familyRepository.findOne({
      where: { id },
      relations: ['visits', 'visits.aids'],
    });

    if (!family) throw new NotFoundException(`Family ${id} not found`);
    return this.toResponse(family);
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto): Promise<FamilyResponse> {
    await this.familyRepository.update(id, updateFamilyDto);
    return this.findById(id);
  }

  async archive(id: number): Promise<void> {
    await this.familyRepository.softDelete(id);
  }

  private toResponse(family: Family): FamilyResponse {
    return {
      id: family.id,
      name: family.name,
      address: family.address,
      phone: family.phone,
      latitude: family.latitude,
      longitude: family.longitude,
      status: family.status,
      visit_count: family.visits?.length ?? 0,
      last_visit: family.visits?.[0]?.visit_date ?? null,
      created_at: family.created_at,
      updated_at: family.updated_at,
    };
  }
}

// visits.service.ts
@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
    @InjectRepository(Aid)
    private aidRepository: Repository<Aid>,
    private familiesService: FamiliesService,
  ) {}

  async createVisit(familyId: number, createVisitDto: CreateVisitDto, userId: number) {
    // Verify family exists
    await this.familiesService.findById(familyId);

    const visit = this.visitRepository.create({
      family: { id: familyId },
      volunteer: { id: userId },
      ...createVisitDto,
    });

    const savedVisit = await this.visitRepository.save(visit);

    // Create aids
    if (createVisitDto.aids?.length) {
      const aids = createVisitDto.aids.map(aid =>
        this.aidRepository.create({
          ...aid,
          visit: { id: savedVisit.id },
        }),
      );
      await this.aidRepository.save(aids);
    }

    return this.visitRepository.findOne({
      where: { id: savedVisit.id },
      relations: ['aids'],
    });
  }

  async getFamilyHistory(familyId: number) {
    return this.visitRepository.find({
      where: { family: { id: familyId } },
      relations: ['aids', 'volunteer'],
      order: { visit_date: 'DESC' },
    });
  }
}

// aids.service.ts
@Injectable()
export class AidsService {
  async getAidStatistics(startDate: Date, endDate: Date) {
    // Will be used for analytics
    return this.aidRepository
      .createQueryBuilder('a')
      .select('a.aid_type', 'type')
      .addSelect('COUNT(a.id)', 'count')
      .addSelect('SUM(a.quantity)', 'quantity')
      .where('v.visit_date BETWEEN :start AND :end', { start: startDate, end: endDate })
      .leftJoin('a.visit', 'v')
      .groupBy('a.aid_type')
      .getRawMany();
  }
}
```

**Exécution:**
```bash
nest g service families/services/families
nest g service visits/services/visits
nest g service aids/services/aids

# Copier le code ci-dessus dans chaque service
# Créer les DTOs
```

**⏱️ Should Complete:** 16:30

---

#### 4:30-5:30h: Controllers & Routes (1h)

```typescript
// families.controller.ts
@Controller('families')
@UseGuards(JwtAuthGuard) // Auth protected
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createFamilyDto: CreateFamilyDto,
    @CurrentUser() user: any,
  ) {
    return this.familiesService.create(createFamilyDto, user.id);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() filters: FamilyQueryDto,
  ) {
    return this.familiesService.findAll(page, limit, filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familiesService.update(id, updateFamilyDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async archive(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.archive(id);
  }
}

// visits.controller.ts
@Controller('families/:familyId/visits')
@UseGuards(JwtAuthGuard)
export class VisitsController {
  constructor(private visitsService: VisitsService) {}

  @Post()
  async createVisit(
    @Param('familyId', ParseIntPipe) familyId: number,
    @Body() createVisitDto: CreateVisitDto,
    @CurrentUser() user: any,
  ) {
    return this.visitsService.createVisit(familyId, createVisitDto, user.id);
  }

  @Get()
  async getHistory(@Param('familyId', ParseIntPipe) familyId: number) {
    return this.visitsService.getFamilyHistory(familyId);
  }
}

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,       // Login
    FamiliesModule,   // Families CRUD
    VisitsModule,     // Visits CRUD
    AidsModule,       // Aids
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**⏱️ End of Backend Core:** 17:30 (30 min buffer = OK)

---

### CRÉNEAU 7-12h: FRONTEND STRUCTURE (5 HEURES)

**Responsables:** 2 personnes (Frontend Lead + V-UX Lead)  
**Objectif:** Toutes les pages structurées, pas belle mais fonctionnelle

#### 7:00-7:30h: Project Setup & Routing (30min)

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

// Pages (lazy)
import LoginPage from './features/auth/pages/LoginPage';
import FamiliesPage from './features/families/pages/FamiliesPage';
import FamilyDetailPage from './features/families/pages/FamilyDetailPage';
import CreateFamilyPage from './features/families/pages/CreateFamilyPage';
import VisitHistoryPage from './features/visits/pages/VisitHistoryPage';
import CreateVisitPage from './features/visits/pages/CreateVisitPage';
import MapPage from './features/map/pages/MapPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/families" element={<FamiliesPage />} />
          <Route path="/families/:id" element={<FamilyDetailPage />} />
          <Route path="/families/new" element={<CreateFamilyPage />} />
          <Route path="/families/:id/edit" element={<CreateFamilyPage />} />
          <Route path="/families/:id/visits" element={<VisitHistoryPage />} />
          <Route path="/families/:id/visits/new" element={<CreateVisitPage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### 7:30-9:15h: Core Pages Scaffolding (1:45h)

**Créer 8 pages basiques:**

```typescript
// 1. FamiliesPage.tsx
export default function FamiliesPage() {
  const { data: families, isLoading } = useFamilies();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Familles</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => navigate('/families/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          aria-label="Créer une nouvelle famille"
        >
          + Nouvelle Famille
        </button>
      </div>

      {isLoading ? <Spinner /> : <FamilyTable families={families} />}
    </div>
  );
}

// 2. FamilyDetailPage.tsx
export default function FamilyDetailPage() {
  const { id } = useParams();
  const { data: family } = useFamilyDetail(id);

  return (
    <div className="container mx-auto p-4">
      <h1>{family?.name}</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <h3>Adresse</h3>
          <p>{family?.address}</p>
        </Card>
        <Card>
          <h3>Téléphone</h3>
          <p>{family?.phone}</p>
        </Card>
      </div>

      <h2>Historique des visites</h2>
      <VisitTimeline visits={family?.visits} />

      <button onClick={() => navigate(`/families/${id}/visits/new`)}>
        Nouvelle visite
      </button>
    </div>
  );
}

// 3-8. CreateFamilyPage, CreateVisitPage, MapPage, etc.
// (Scaffolding simple, sera polishé plus tard)
```

**⏱️ Should Complete:** 20:45

---

#### 9:15-12:00h: Component Library (2:45h)

Créer les composants réutilisables essentiels:

```typescript
// shared/components/UI/Button.tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

// shared/components/Layout/Layout.tsx
export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <Outlet /> {/* Pages rendered here */}
        </div>
        <Footer />
      </main>
    </div>
  );
}

// shared/components/Forms/FormField.tsx
interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export const FormField = ({ label, id, error, required, children }: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="text-red-600 text-sm mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

// shared/components/Tables/DataTable.tsx
export const DataTable = ({ columns, data, onRowClick }: DataTableProps) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b">
          {columns.map(col => (
            <th key={col.key} className="px-4 py-2 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick?.(row)}
            className="border-b hover:bg-gray-50 cursor-pointer"
            role="button"
            tabIndex={0}
          >
            {columns.map(col => (
              <td key={col.key} className="px-4 py-2">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// shared/hooks/useFamilies.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export const useFamilies = (page = 1, limit = 20, filters = {}) => {
  return useQuery(
    ['families', page, limit, filters],
    () =>
      apiClient.get('/families', {
        params: { page, limit, ...filters },
      }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    },
  );
};

export const useFamilyDetail = (id: string) => {
  return useQuery(
    ['family', id],
    () => apiClient.get(`/families/${id}`),
    { enabled: !!id },
  );
};

export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateFamilyDto) => apiClient.post('/families', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['families']);
      },
    },
  );
};
```

**⏱️ End Frontend:** 23:45 (Good!)

---

### CRÉNEAU 12-14h: INTÉGRATION & TESTS (2 HEURES)

**Responsable:** 1 personne (QA/Test Lead)

```bash
# Test Backend API
curl -X POST http://localhost:3000/families \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Famille Test",
    "address": "Rue Test, Tunis",
    "phone": "21699999999"
  }'

# Should return 201 with family object

# Test GET
curl http://localhost:3000/families

# Should return paginated list
```

```typescript
// Frontend API Integration Test
describe('Families API', () => {
  test('should fetch families', async () => {
    const response = await apiClient.get('/families');
    expect(response.data).toHaveProperty('data');
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  test('should create family', async () => {
    const response = await apiClient.post('/families', {
      name: 'Test Famille',
      address: 'Rue Test',
      phone: '21699999999',
    });
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });
});
```

**Checklist End of Day 1:**
- [x] Backend APIs: Families CRUD ✅
- [x] Backend APIs: Visits CRUD ✅
- [x] Frontend: Pages structure ✅
- [x] Frontend: Components library ✅
- [x] Integration: API calls working ✅
- [x] Git: Code committed ✅

**⏱️ Day 1 Complete: 23:59 ✅**

---

## 🚀 JOUR 2 - FONCTIONNALITÉS AVANCÉES (14 HEURES)

### CRÉNEAU 0-5h: DASHBOARD & STATISTIQUES (5 HEURES)

**Responsable:** Frontend Lead  
**Objectif:** Tableau de bord fonctionnel avec graphiques

```typescript
// features/dashboard/api/dashboardApi.ts
export async function getDashboardStats(startDate: Date, endDate: Date) {
  return apiClient.get('/analytics/dashboard', {
    params: {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    },
  });
}

// backend/modules/analytics/analytics.controller.ts
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.analyticsService.getDashboardMetrics(
      new Date(startDate),
      new Date(endDate),
    );
  }
}

// backend/modules/analytics/analytics.service.ts
@Injectable()
export class AnalyticsService {
  async getDashboardMetrics(startDate: Date, endDate: Date) {
    const familiesCount = await this.getActiveFamiliesCount();
    const visitsCount = await this.getVisitsCount(startDate, endDate);
    const aidDistribution = await this.getAidDistribution(startDate, endDate);
    const topFamilies = await this.getTopFamilies(startDate, endDate);
    const visitTrends = await this.getVisitTrends(startDate, endDate);

    return {
      summary: {
        total_families: familiesCount,
        total_visits: visitsCount,
        visit_average_per_family: (visitsCount / familiesCount).toFixed(2),
      },
      aid_distribution: aidDistribution, // [{ type: 'food', count: 120 }]
      top_families: topFamilies,         // [{ name, visit_count }]
      visit_trends: visitTrends,         // Time series for chart
    };
  }
}

// Frontend: DashboardPage.tsx
export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery(
    ['dashboard'],
    () => getDashboardStats(startOfMonth(new Date()), endOfMonth(new Date())),
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          title="Familles"
          value={stats.summary.total_families}
          icon="👨‍👩‍👧‍👦"
        />
        <KPICard
          title="Visites ce mois"
          value={stats.summary.total_visits}
          icon="📍"
        />
        <KPICard
          title="Moyenne par famille"
          value={stats.summary.visit_average_per_family}
          icon="📊"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <AidDistributionChart data={stats.aid_distribution} />
        <VisitsTrendChart data={stats.visit_trends} />
      </div>

      {/* Top Families */}
      <TopFamiliesCard families={stats.top_families} />
    </div>
  );
}
```

**Graphiques library:** `npm install recharts` (léger + accesible)

**⏱️ Should Complete:** 5:00

---

### CRÉNEAU 5-10h: GÉOLOCALISATION & CARTOGRAPHIE (5 HEURES)

**Responsables:** 2 personnes (1 Backend Geo, 1 Frontend Maps)

#### Backend: Geo Endpoint

```typescript
// modules/geo/geo.service.ts
@Injectable()
export class GeoService {
  // Calcul distance entre 2 points (Haversine)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Rayon Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // TSP Solver (Travelling Salesman) - Algorithme rapide
  optimizeRoute(families: Family[]): Family[] {
    // Approche: Nearest Neighbor (assez bon pour démo)
    if (families.length <= 2) return families;

    const visited = new Set<number>();
    const route = [families[0]];
    visited.add(families[0].id);

    while (visited.size < families.length) {
      const current = route[route.length - 1];
      let nearest: Family | null = null;
      let minDistance = Infinity;

      for (const family of families) {
        if (!visited.has(family.id)) {
          const distance = this.calculateDistance(
            current.latitude,
            current.longitude,
            family.latitude,
            family.longitude,
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearest = family;
          }
        }
      }

      if (nearest) {
        route.push(nearest);
        visited.add(nearest.id);
      }
    }

    return route;
  }

  @GetMapping('/families/optimize-route')
  async optimizeRoute(@Query('familyIds') ids: number[]) {
    const families = await this.familyRepository.findByIds(ids);
    const optimized = this.optimizeRoute(families);
    
    return {
      optimized_route: optimized.map(f => ({ id: f.id, name: f.name })),
      total_distance: this.calculateTotalDistance(optimized),
      estimated_time: this.estimateTime(optimized),
    };
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

// modules/geo/geo.controller.ts
@Controller('geo')
export class GeoController {
  constructor(private geoService: GeoService) {}

  @Get('families')
  async getFamiliesForMap(
    @Query('bounds') bounds?: string, // bbox filter
  ) {
    // Retourne familles avec lat/lon pour affichage map
    return this.familiesService.findByBounds(bounds);
  }

  @Post('optimize-route')
  async optimizeRoute(@Body() { family_ids }: OptimizeRouteDto) {
    return this.geoService.optimizeRoute(family_ids);
  }
}
```

#### Frontend: Map Component

```typescript
// features/map/components/MapViewer.tsx
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

export function MapViewer({ families, onFamilyClick }: MapViewerProps) {
  const [selectedFamily, setSelectedFamily] = useState(null);

  return (
    <MapContainer center={[36.8065, 10.1876]} zoom={12} style={{ height: '600px' }}>
      {/* Couche de base */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Clustering des markers */}
      <MarkerClusterGroup>
        {families.map(family => (
          <Marker
            key={family.id}
            position={[family.latitude, family.longitude]}
            eventHandlers={{
              click: () => {
                setSelectedFamily(family);
                onFamilyClick(family);
              },
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{family.name}</h3>
                <p>{family.address}</p>
                <p className="text-sm text-gray-600">
                  Dernière visite: {format(new Date(family.last_visit), 'dd/MM/yyyy')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

// features/map/components/RouteOptimizer.tsx
export function RouteOptimizer({ families }: RouteOptimizerProps) {
  const [route, setRoute] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    const response = await apiClient.post('/geo/optimize-route', {
      family_ids: families.map(f => f.id),
    });
    setRoute(response.data);
    setIsOptimizing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-4">Planification de tournée</h3>

      <button
        onClick={handleOptimize}
        disabled={isOptimizing}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {isOptimizing ? 'Optimisation...' : 'Optimiser l\'itinéraire'}
      </button>

      {route && (
        <div className="mt-4">
          <p className="font-semibold">
            Distance totale: {route.total_distance.toFixed(2)} km
          </p>
          <p className="text-gray-600">
            Temps estimé: {route.estimated_time} min
          </p>

          <ol className="mt-4 space-y-2">
            {route.optimized_route.map((family, idx) => (
              <li key={family.id} className="flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                  {idx + 1}
                </span>
                {family.name}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// features/map/pages/MapPage.tsx
export default function MapPage() {
  const { data: families } = useFamilies();
  const [filteredFamilies, setFilteredFamilies] = useState(families);

  const handleFamilyClick = (family: Family) => {
    navigate(`/families/${family.id}`);
  };

  return (
    <div className="h-screen flex">
      {/* Map on left 70% */}
      <div className="flex-1">
        <MapViewer families={filteredFamilies} onFamilyClick={handleFamilyClick} />
      </div>

      {/* Sidebar on right 30% */}
      <div className="w-1/3 bg-white shadow-lg overflow-auto">
        <div className="p-4">
          <h2 className="font-bold text-lg mb-4">Tournée</h2>

          <div className="mb-4">
            <select
              onChange={e =>
                setFilteredFamilies(
                  families.filter(f => f.status === e.target.value || !e.target.value),
                )
              }
              className="w-full px-3 py-2 border rounded"
              aria-label="Filtrer par statut"
            >
              <option value="">Toutes les familles</option>
              <option value="priority">⭐ Prioritaires</option>
              <option value="overdue">🔴 À visiter</option>
            </select>
          </div>

          <RouteOptimizer families={filteredFamilies} />

          <FamiliesList families={filteredFamilies} />
        </div>
      </div>
    </div>
  );
}
```

**⏱️ Should Complete:** 10:00

---

### CRÉNEAU 10-14h: ACCESSIBILITÉ & POLISH (4 HEURES)

**Responsable:** Accessibility Lead

#### Checklist Accessibility Implementaion:

```typescript
// 1. COLORS & CONTRAST
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // WCAG AA compliant (4.5:1 ratio)
      'text-dark': '#111827',    // text-gray-900 (98:1)
      'text-light': '#F9FAFB',   // text-gray-50
      'bg-primary': '#2563EB',   // blue-600 (11:1 vs white)
      'bg-secondary': '#6B7280', // gray-500 (7.5:1)
      'error': '#DC2626',        // red-600 (8.6:1)
      'success': '#059669',      // green-600 (8:1)
    },
  },
};

// styles/globals.css
@layer base {
  :root {
    /* Light mode (default) */
    --color-text: #111827;
    --color-bg: #FFFFFF;
    --color-bg-secondary: #F9FAFB;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      /* Dark mode */
      --color-text: #F9FAFB;
      --color-bg: #111827;
      --color-bg-secondary: #1F2937;
    }
  }
}

// 2. FOCUS VISIBLE
button:focus-visible {
  outline: 3px solid #2563EB;
  outline-offset: 2px;
}

// 3. SKIP LINK
<a href="#main-content" className="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>

// 4. FORM ACCESSIBILITY
<label htmlFor="family-name">
  Nom de la famille <span aria-label="required">*</span>
</label>
<input
  id="family-name"
  type="text"
  aria-required="true"
  aria-invalid={errors.name ? 'true' : 'false'}
  aria-describedby={errors.name ? 'family-name-error' : undefined}
  required
/>
{errors.name && (
  <span id="family-name-error" role="alert" className="text-red-600">
    {errors.name}
  </span>
)}

// 5. SCREEN READER ONLY TEXT
<span className="sr-only">Appuyez sur Entrée pour soumettre</span>

// 6. LANDMARKS & REGIONS
<header role="banner">Navigation</header>
<main id="main-content" role="main">Contenu principal</main>
<footer role="contentinfo">Pied de page</footer>

// 7. KEYBOARD SHORTCUTS
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.altKey && e.key === 'n') {
      navigate('/families/new');
    }
    if (e.altKey && e.key === 's') {
      handleSubmit();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);

// 8. DARK MODE TOGGLE
export function ThemePicker() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="p-2 rounded border"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

// 9. RESPONSIVE DESIGN
// Mobile first approach
.container {
  padding: 1rem; /* mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
  }
}

// 10. TOUCH TARGETS
button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1rem; /* At least 44px */
}

// relative units everywhere
font-size: 1rem; /* Instead of 16px */
padding: 1.5em; /* Instead of 24px */
max-width: 50rem; /* Instead of 800px */
```

#### Lighthouse Audit & Testing

```typescript
// Automated accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

test('FamilyForm should be accessible', async () => {
  const { container } = render(<FamilyForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**⏱️ Accessibility complete:** 12:30

---

#### Final Polish (1:30h)

```bash
# 1. Lighthouse audit
npm run lighthouse

# 2. Fix any WCAG issues
# (Should aim for Score >= 90)

# 3. Test responsiveness
# - Desktop (1920x1080)
# - Tablet (768x1024)
# - Mobile (375x667)

# 4. Test keyboard navigation
# Tab through every page, all interactive elements must be accessible

# 5. Test with screen reader (NVDA on Windows)
# Download NVDA free at nvaccess.org

# 6. Final commit
git commit -m "feat: accessibility WCAG AA compliance + dark mode"
```

**⏱️ Day 2 Complete: 23:45 ✅**

---

## 🏆 JOUR 3 - FINALE & INNOVATIONS (14 HEURES)

### CRÉNEAU 0-4h: OPTIMISATIONS PERFORMANCE (4 HEURES)

```typescript
// 1. Database Optimisations
// backend/src/database/migrations/OptionalAdvanced.ts
import { MigrationInterface } from 'typeorm';

// Add indexes
CREATE INDEX idx_families_status ON families(status);
CREATE INDEX idx_families_location ON families(latitude, longitude);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_visits_family ON visits(family_id);
CREATE INDEX idx_aids_type ON aids(aid_type);

// 2. Frontend: Code Splitting & Lazy Loading
const FamiliesPage = lazy(() => import('./pages/FamiliesPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// 3. React Query Optimization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 30 * 60 * 1000,     // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'stale',
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// 4. Image Optimization
// Use responsive images
<picture>
  <source srcSet="family-small.webp" media="(max-width: 640px)" type="image/webp" />
  <source srcSet="family-medium.webp" media="(max-width: 1024px)" type="image/webp" />
  <img src="family.jpg" alt="Family photo" loading="lazy" />
</picture>

// 5. Compression & Gzip
// vite.config.ts
import compression from 'vite-plugin-compression';

export default {
  plugins: [compression()],
};

// 6. Virtual Scrolling pour large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={2500}
  itemSize={50}
>
  {({ index, style }) => <FamilyRow style={style} family={families[index]} />}
</FixedSizeList>

//  7. Memoization
const FamilyCard = memo(
  ({ family }) => <div>{family.name}</div>,
  (prevProps, nextProps) => prevProps.family.id === nextProps.family.id
);

// 8. Backend: Query Optimization
// Use selects instead of SELECT *
const family = await this.familyRepository
  .createQueryBuilder('f')
  .select(['f.id', 'f.name', 'f.phone', 'f.status'])
  .where('f.id = :id', { id: familyId })
  .getOne();

// 9. Caching Layer (Redis optional)
@Cacheable('dashboard:metrics', 5 * 60) // 5 min cache
async getDashboardMetrics() { ... }
```

**Performance Targets:**
- ✅ First Contentful Paint < 2s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Cumulative Layout Shift < 0.1
- ✅ API response < 200ms
- ✅ Bundle size < 500KB (gzipped)

---

### CRÉNEAU 4-7h: INNOVATIONS (3 HEURES)

#### 🎯 Innovation 1: TSP Route Optimization (Already done in Day 2!)

#### 🎯 Innovation 2: Synthetic Voice + Screen Reader Integration

```typescript
// features/dashboard/components/VoiceReader.tsx
export function VoiceReader() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const readPageContent = () => {
    const mainContent = document.querySelector('main')?.textContent || '';
    const utterance = new SpeechSynthesisUtterance(mainContent);

    // Configuration
    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const stopReading = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="mb-4">
      <button
        onClick={isSpeaking ? stopReading : readPageContent}
        className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
        aria-label={isSpeaking ? 'Arrêter la lecture' : 'Lire la page'}
      >
        🔊 {isSpeaking ? 'Arrêter' : 'Lire'}
      </button>
    </div>
  );
}
```

#### 🎯 Innovation 3: PDF Export con Impact Report

```typescript
// features/reports/utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export async function generateImpactReport(stats: DashboardStats) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('RAPPORT D\'IMPACT - Association Omnia', 10, 20);
  
  // Date range
  doc.setFontSize(10);
  doc.text(
    `Période: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
    10,
    30
  );

  // KPIs Section
  doc.setFontSize(14);
  doc.text('Indicateurs clés', 10, 45);
  
  const kpiText = `
  • Familles aidées: ${stats.total_families}
  • Total visites: ${stats.total_visits}
  • Moyenne par famille: ${stats.visit_average_per_family}
  • Colis distribués: ${stats.total_packages}
  • Médicaments distribués: ${stats.total_medicines}
  `;
  doc.setFontSize(11);
  doc.text(kpiText, 10, 55);

  // Charts
  const chartImage = await generateChartImage(stats);
  doc.addImage(chartImage, 'PNG', 10, 100, 190, 80);

  // Save
  doc.save(`impact-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// features/reports/pages/ReportsPage.tsx
export default function ReportsPage() {
  const { data: stats } = useDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rapports</h1>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => generateImpactReport(stats)}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          📄 Exporter PDF
        </button>

        <button
          onClick={() => generateExcelReport(stats)}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          📊 Exporter Excel
        </button>
      </div>

      {/* Preview */}
      <ReportPreview stats={stats} />
    </div>
  );
}
```

#### 🎯 Innovation 4: Offline Mode (Service Worker)

```typescript
// public/service-worker.js
const CACHE_NAME = 'omnia-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/globals.css',
  '/app.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Register in React
if ('serviceWorker' in navigator && !isLocal) {
  navigator.serviceWorker.register('/service-worker.js');
}

// Store data in  IndexedDB for offline
import Dexie from 'dexie';

const db = new Dexie('OmniaDB');
db.version(1).stores({
  families: '++id',
  visits: '++id',
  aids: '++id',
});

// Sync when online
window.addEventListener('online', () => {
  // Sync offline changes back to server
  const pendingVisits = db.visits.where('synced').equals(false).toArray();
  pendingVisits.forEach(async (visit) => {
    await apiClient.post('/visits', visit);
    await db.visits.update(visit.id, { synced: true });
  });
});
```

#### 🎯 Innovation 5: AI-powered Predictive Insights (Bonus)

```typescript
// backend/modules/analytics/analytics.service.ts
@Injectable()
export class AnalyticsService {
  // Simple prediction: Families due for visit
  async getPredictedVisits(): Promise<FamilyPrediction[]> {
    // Get families + their visit history
    const families = await this.familiesService.findAll();

    return families
      .map(family => {
        // Average days between visits
        const avgDaysBetweenVisits = this.calculateAvgDaysBetweenVisits(family.visits);
        // Days since last visit
        const daysSinceLastVisit = this.daysSinceLastVisit(family);
        // Predict if overdue
        const isOverdue = daysSinceLastVisit > avgDaysBetweenVisits * 1.2;
        
        return {
          family,
          predicted_next_visit: new Date(Date.now() + avgDaysBetweenVisits * 24 * 60 * 60 * 1000),
          is_overdue: isOverdue,
          priority: isOverdue ? 'high' : 'normal',
        };
      })
      .filter(p => p.is_overdue)
      .sort((a, b) => b.priority - a.priority);
  }
}

// Frontend: Show predictions
export function PredictionCard({ predictions }: PredictionProps) {
  const overdue = predictions.filter(p => p.is_overdue);

  return (
    <div className="bg-red-50 border-2 border-red-600 p-4 rounded">
      <h3 className="font-bold text-red-900">🔴 Familles à visiter en priorité</h3>
      <p className="text-red-700">{overdue.length} famille(s) en attente</p>
      <ul className="mt-4 space-y-2">
        {overdue.map(p => (
          <li key={p.family.id} className="text-sm text-red-900">
            • {p.family.name} ({Math.round(p.days_since_last_visit)} jours)
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**⏱️ Innovations complete:** 07:00

---

### CRÉNEAU 7-12h: TESTS & DOCUMENTATION (5 HEURES)

#### Testing Pyramid

```typescript
// 1. Unit Tests (60% of coverage)
describe('FamiliesService', () => {
  let service: FamiliesService;
  let repository: Repository<Family>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamiliesService, { provide: getRepositoryToken(Family), useValue: mockRepository }],
    }).compile();

    service = module.get<FamiliesService>(FamiliesService);
  });

  test('should create a family', async () => {
    const dto = { name: 'Test', address: 'Rue Test' };
    const result = await service.create(dto, 1);
    expect(result).toHaveProperty('id');
  });
});

// 2. Integration Tests (25% of coverage)
describe('Families API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('POST /families should create family', () => {
    return request(app.getHttpServer())
      .post('/families')
      .send({ name: 'Test', address: 'Rue Test' })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id');
      });
  });

  test('GET /families should return list', () => {
    return request(app.getHttpServer())
      .get('/families')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });
});

// 3. E2E Tests (15% of coverage)
describe('Family Management Flow', () => {
  test('should create family, add visit, view history', async () => {
    // Create
    const family = await api.post('/families', {
      name: 'Famille Test',
      address: 'Rue Test',
      phone: '21699999999',
    });

    expect(family.status).toBe(201);

    // Add visit
    const visit = await api.post(`/families/${family.data.id}/visits`, {
      visit_date: new Date(),
      aids: [{ aid_type: 'food_package', quantity: 1 }],
    });

    expect(visit.status).toBe(201);

    // View history
    const history = await api.get(`/families/${family.data.id}/visits`);
    expect(history.data).toHaveLength(1);
  });
});

// Run tests
npm run test                    // Unit tests
npm run test:integration       // Integration
npm run test:e2e              // E2E
npm run test:coverage         // Coverage report
```

#### Documentation

```markdown
# README.md

## Installation

npm install
npm run dev

## API Documentation

### Families Endpoints

- POST /families - Create family
  - Body: { name, address, phone, latitude, longitude }
  - Returns: Family object

-  GET /families - List families
  - Query: page, limit, search, status
  - Returns: { data: Family[], pagination }

- GET /families/:id - Get family details
  - Returns: Family object with visits

- PUT /families/:id - Update family
  - Body: Partial family object
  - Returns: Updated family

- DELETE /families/:id - Archive family
  - Returns: 204 No Content

### Visits Endpoints

- POST /families/:familyId/visits - Create visit
  - Body: { visit_date, aids: [{ aid_type, quantity }] }
  - Returns: Visit object

- GET /families/:familyId/visits - Get family visit history
  - Returns: Visit[] ordered by date DESC

### Analytics Endpoints

- GET /analytics/dashboard - Get dashboard metrics
  - Query: start_date, end_date
  - Returns: Dashboard stats, charts data

- GET /geo/families - Get families for map
  - Query: bounds (optional)
  - Returns: Families with location data

- POST /geo/optimize-route - Optimize visit route
  - Body: { family_ids: [1, 2, 3] }
  - Returns: Optimized route with distance/time

## Architecture

See ARCHITECTURE_PROJET.md for detailed structure.

## Testing

npm run test              # Run all tests
npm run test:coverage    # Generate coverage report

## Deployment

npm run build
```

**⏱️ Tests & Documentation complete:** 12:00

---

### CRÉNEAU 12-14h: DÉMO REHEARSAL & FINALIZATION (2 HEURES)

```typescript
// Demo Checklist

Storytelling Flow:
1. Login page (show auth is working)
2. Dashboard (statistics & KPIs)
3. Families list (search, filter)
4. Create new family (form + validation)
5. Map view (show geolocation + clustering)
6. Route optimization (TSP algorithm wow moment!)
7. Add visit (capture data on "terrain")
8. View history (timestamp + aids)
9. Export report (PDF generation)
10. Dark mode + Accessibility features

// Practice script:
"Bonjour, je vous présente OMNIA- une solution de gestion et suivi d'intervention charitable.

L'association Omnia aide 2500+ familles en Tunisie, mais leurs données étaient dispersées.

Avec cette application web:
- Les bénévoles saisissent les données directement sur le terrain
- Toutes les informations sont centralisées
- On peut visualiser l'impact avec des tableaux de bord
- On optimise les tournées pour économiser du temps

Regardez, je crée une famille... [DEMO]

L'application est complètement accessible:
- Mode sombre pour les malvoyants
- Navigation au clavier uniquement
- Synthèse vocale pour lecteur d'écran
- Responsive mobile-first

Notre architecture est scalable, performante, et suivre les design patterns SOLID.

Avec les scores d'impact générés, l'association peut montrer l'effet de ses actions aux donateurs.

Merci!"

// Timing: 3-5 minutes max
```

**Final Checklist before submission:**

```
[ ] All APIs working (Postman test)
[ ] Frontend pages responsive (mobile + desktop)
[ ] Database populated with test data
[ ] Accessibility audit passed (Lighthouse >= 90)
[ ] Performance audit passed (< 2s load, LCP < 2.5s)
[ ] Tests passing (npm run test)
[ ] No console errors
[ ] Git history clean
[ ] README updated
[ ] Code commented (critical sections)
[ ] .env files configured
[ ] Docker compose working (optional)
[ ] Demo script practiced 3x
[ ] Backup of repo (2 copies)
```

**⏱️ Day 3 & HACKATHON COMPLETE:** 14:00 ✅

---

## 🏆 JURY PRESENTATION STRATEGY

### Points à scorer (Total = 100 + 50 bonus)

| Aspect | Points | How to Score |
|---|---|---|
| Fonctionnalités MVP | 30 | ✅ All CRUD working |
| Fonctionnalités Avancées | 30 | ✅ Map + Dashboard + Export |
| Accessibilité | 20 | ✅ WCAG AA score, Demo keyboard nav + screen reader |
| Code Quality | 10 | ✅ Clean architecture, Design patterns, Documented |
| Performance | 10 | ✅ Lighthouse report, <>benchmark numbers |
| **BONUS:** | | |
| Route Optimization (TSP) | +10 | ✅ Show optimized route on map |
| PDF Reports | +10 | ✅ Generate + download |
| Offline Mode | +10 | ✅ Works without internet |
| Predictive Analytics | +10 |  ✅ Families overdue list |
| Voice/Audio Features | +10 | ✅ Screen reader integration + speak button |

### Presentation Order (avoid order effect):

1. **Welcome** (30sec) - Smile, greet jury
2. **Problem statement** (1min) - Why Omnia needed this
3. **Demo Features in order:**
   - Dashboard (stats)
   - Families CRUD (core)
   - Map + Optimization (WOW moment!)
   - Accessibility walkthrough
4. **Technical** (1min) - Architecture, stack, design patterns
5. **Accessibility deep dive** (1min) - Show keyboard nav, dark mode, voice
6. **Q&A** - Be ready for questions

---

## 📊 SUCCESS METRICS

By end of Hackathon:

✅ **Functional Requirements:** 100%
- All MVP features working
- All advanced features working
- Demo scenario = smooth

✅ **Non-functional Requirements:** 100%
- Performance: <2s load, LCP <2.5s
- Accessibility: WCAG AA (≥90 Lighthouse)
- Responsiveness: Works mobile+tablet+desktop
- Code quality: Clean, documented, SOLID

✅ **Innovation:** Differentiate
- TSP route optimization
- PDF report generation
- Voice synthesis
- Offline mode
- Predictive insights

✅ **Pitch:** Impressive
- Crystal clear value prop
- Demo flows perfectly
- Team confident
- Jury envisions impact

---

**BONNE CHANCE! 🚀 Vous allez GAGNER ce hackathon. Let's build something EPIC for Omnia!**

