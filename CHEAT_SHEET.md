# 🚀 HACKATHON OMNIA - CHEAT SHEET (LAMINÉ & À IMPRIMER)

**Imprimez cette page, laminéz-la, gardez-la à côté de vous pendant 42h!**

---

## ⚡ QUICK REFERENCE - API ENDPOINTS

```
Login:
POST /auth/login
  Body: { username, password }
  Return: { access_token }

Families:
GET    /families?page=1&limit=20&search=Fatima  → List
GET    /families/:id                             → Detail
POST   /families                                  → Create
PUT    /families/:id                              → Update
DELETE /families/:id                              → Archive (soft)

Visits:
GET    /families/:id/visits                      → History
POST   /families/:id/visits                      → Create visit
  Body: { visit_date, aids: [{aid_type, quantity}] }

Analytics:
GET    /analytics/dashboard?start_date=2026-02-06&end_date=2026-02-08

Geo:
GET    /geo/families?bounds=...                  → Map markers
POST   /geo/optimize-route                       → TSP solver
  Body: { family_ids: [1,2,3] }
```

---

## 🛠️ USEFUL COMMANDS

```bash
# Frontend
npm create vite@latest . -- --template react-ts
npm install axios zustand react-query tailwindcss leaflet
npm run dev                    # http://localhost:5173
npm run build                  # Production build
npm run test                   # Jest tests
npm run lint                   # ESLint

# Backend
nest new omnia-backend
npm install @nestjs/typeorm typeorm mysql2
npm run start:dev             # http://localhost:3000
npm run typeorm migration:generate -- src/migrations/Name
npm run typeorm migration:run
npm run test                  # Jest tests
npm run lint                  # ESLint

# Database
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=omnia_dev mysql:8.0

# Git (every 2h)
git add .
git commit -m "feat: description here"
git push origin main

# Accessibility Check
npm install -D jest-axe @testing-library/react
npm run lighthouse

# Performance Check
lighthouse http://localhost:5173 --view
```

---

## 🎨 ACCESSIBILITY QUICK WINS

```
✓ Label + Input linking
<label htmlFor="name">Name</label>
<input id="name" required aria-required="true" />

✓ Error with ARIA
<input aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email</span>

✓ Button (not <div onclick>!)
<button onClick={handleClick}>Click me</button>

✓ Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to content
</a>

✓ Contrast check: 4.5:1 minimum
  Dark gray on white: ✓ Yes (12:1)
  Light gray on white: ✗ No (2.5:1)

✓ Dark mode toggle
const [dark, setDark] = useState(false);
function toggle() {
  setDark(!dark);
  localStorage.setItem('dark', !dark);
  document.documentElement.classList.toggle('dark');
}

✓ Keyboard shortcuts
useEffect(() => {
  const handle = (e) => {
    if (e.altKey && e.key === 'n') navigate('/families/new');
  };
  window.addEventListener('keydown', handle);
}, []);
```

---

## 📊 DATABASE QUICK SCHEMA

```sql
users (id, username, email, password_hash, role, created_at, updated_at)
families (id, name, address, phone, latitude, longitude, status*, created_by_id, created_at, updated_at, deleted_at)
visits (id, family_id*, visit_date, volunteer_id*, created_at, updated_at)
aids (id, visit_id*, aid_type*, quantity, description, created_at)
audit_logs (id, user_id*, action, table_name, record_id, old_values JSON, new_values JSON, created_at)

Indexes:
CREATE INDEX idx_families_status ON families(status);
CREATE INDEX idx_visits_family_date ON visits(family_id, visit_date);
CREATE INDEX idx_aids_type ON aids(aid_type);

* = Foreign Key
```

---

## 🌳 FOLDER STRUCTURE ESSENTIALS

```
Frontend:
src/
├── features/
│   ├── families/          (Families CRUD)
│   ├── visits/            (Visits + History)
│   ├── map/               (Maps + Geo)
│   ├── dashboard/         (Analytics)
│   ├── auth/              (Login)
│   └── reports/           (PDF export)
├── shared/
│   ├── components/        (UI: Button, Modal, Form)
│   ├── hooks/             (Custom hooks)
│   ├── utils/             (Helpers)
│   └── contexts/          (State)
└── styles/                (CSS globals)

Backend:
src/
├── modules/
│   ├── auth/              (Login + JWT)
│   ├── families/          (Families CRUD)
│   ├── visits/            (Visits CRUD)
│   ├── analytics/         (Dashboard stats)
│   ├── geo/               (Maps + TSP)
│   └── reports/           (PDF generation)
├── common/                (Guards, Filters, Pipes)
├── config/                (Database, JWT, etc)
└── database/              (Migrations, Seeds)
```

---

## 🧪 TESTING TEMPLATES

```typescript
// Unit test
import { Test } from '@nestjs/testing';

describe('FamiliesService', () => {
  let service: FamiliesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FamiliesService,
        { provide: getRepositoryToken(Family), useValue: mockRepository },
      ],
    }).compile();
    service = module.get(FamiliesService);
  });

  it('should create family', async () => {
    const result = await service.create({ name: 'Test' }, 1);
    expect(result).toHaveProperty('id');
  });
});

// React component test
import { render, screen } from '@testing-library/react';

test('FamilyList renders families', () => {
  const families = [{ id: 1, name: 'Test Family' }];
  render(<FamilyList families={families} />);
  expect(screen.getByText('Test Family')).toBeInTheDocument();
});

// E2E test
test('Create family flow', async () => {
  const res = await request(app.getHttpServer())
    .post('/families')
    .send({ name: 'Test', address: 'Rue Test' })
    .expect(201);
  expect(res.body).toHaveProperty('id');
});
```

---

## 🎯 PERFORMANCE CHECKLIST (5 min)

Run every 4 hours:

```bash
# Frontend
npm run build
du -sh dist/                          # < 500KB?
lighthouse http://localhost:5173      # >= 90?

# Backend  
curl -w "@curl-format.txt" -o /dev/null http://localhost:3000/families
# Response time < 200ms?

# Database
mysql> EXPLAIN SELECT * FROM families WHERE status='active';
# Using index? Index ok!
```

---

## 😱 EMERGENCY FIXES (30 sec each)

```
✗ "Cannot find module"
→ npm install && npm run dev

✗ "Port 3000 already in use"
→ lsof -i :3000 && kill -9 <PID>
  (Windows: netstat -ano | findstr :3000 && taskkill /PID <PID> /F)

✗ "Database connection error"
→ docker ps (is MySQL running?)
→ docker restart <container_name>

✗ "Module not found: react-query"
→ npm install @tanstack/react-query (v5 new name)

✗ "TypeScript error: Type 'any'"
→ import { PropsWithChildren } from 'react';
→ type ComponentProps = PropsWithChildren<{ prop: string }>;

✗ "Tailwind classes not applying"
→ Check tailwind.config.js content: ['src/**/*.{js,jsx,ts,tsx}']
→ Restart dev server

✗ "Token undefined in frontend"
→ localStorage.getItem('token') from login response
→ Set Authorization header: headers: { Authorization: `Bearer ${token}` }

✗ "Can't connect to backend from frontend"
→ VITE_API_BASE_URL=http://localhost:3000/api in .env
→ Update axios baseURL accordingly
```

---

## 🎤 JURY Q&A QUICK ANSWERS

```
Q: "Why React?"
A: "Perfect for responsive, accessible field interfaces. Component reusability speeds up dev."

Q: "Database design?"
A: "Normalized schema with proper indexes. Soft deletes for audit trail. Handles 2500+ records efficiently."

Q: "How secure?"
A: "JWT auth on all APIs. Role-based access. No PII in logs. HTTPS-ready."

Q: "Accessibility testing?"
A: "Lighthouse 90+, keyboard-only nav works, NVDA screen reader tested, WCAG AA compliant."

Q: "Performance metrics?"
A: "FCP <2s, LCP <2.5s, API response <200ms, bundle <500KB."

Q: "TSP route optimization?"
A: "Nearest-Neighbor algorithm. Calculates driving distance between points. Reduces volunteer travel ~30%."

Q: "Scalability?"
A: "Stateless services. Horizontal scaling ready. Database indexes on all frequent queries. Can handle 10K+ records."

Q: "What's the MVP?"
A: "Families CRUD + Visit tracking + History. Advanced: Map visualization, dashboard analytics, route optimization."

Q: "Offline mode?"
A: "Service Worker caches pages. IndexedDB stores data locally. Auto-syncs when connection returns."

Q: "Biggest challenge?"
A: "Making it truly accessible while maintaining performance. Solved with careful component design + testing."
```

---

## 💡 INNOVATION STARTER PACK

```typescript
// 1. Route Optimization (TSP Nearest Neighbor)
function optimizeRoute(families) {
  let route = [families[0]];
  let visited = new Set([families[0].id]);
  while (visited.size < families.length) {
    const current = route[route.length - 1];
    const nearest = families
      .filter(f => !visited.has(f.id))
      .reduce((min, f) => 
        distance(current, f) < distance(current, min) ? f : min
      );
    route.push(nearest);
    visited.add(nearest.id);
  }
  return route;
}

// 2. Dark Mode
<button onClick={() => {
  setDark(!dark);
  document.documentElement.classList.toggle('dark');
}}>
  {dark ? '☀️ Light' : '🌙 Dark'}
</button>

// 3. Voice Read
const speak = () => {
  const text = document.querySelector('main').textContent;
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(text)
  );
};

// 4. PDF Export (jsPDF)
import jsPDF from 'jspdf';
new jsPDF().text('Family Report', 10, 10).save('report.pdf');

// 5. Offline Sync
navigator.serviceWorker.register('/sw.js');
window.addEventListener('online', syncDataToServer);
```

---

## 📈 SCORING CHEATSHEET

```
✅ When you do:                          Points gained:
Families CRUD working                    +30
Map + Route optimization                  +30
Dashboard with analytics                  +15
Accessibility WCAG AA                     +20
Clean code + documentation                +10
---
SUBTOTAL (MVP well done)                +105 ← WINNING ZONE!

BONUSES:
Route optimization visual (TSP map)       +5
Dark mode accessible                      +3
PDF report generation                     +5
Voice/synthèse vocale                     +3
Offline mode with sync                    +3
Predictive analytics                      +3
---
POSSIBLE TOTAL                          <= 127/100

⚠️ Deductions:
Console errors                           -5
Accessibility issues                     -30
No demo preparation                      -20
Code not documented                      -10
Performance < 2s load time               -5
No tests                                 -10
```

---

## ⏰ TIME ALLOCATION QUICK REFERENCE

```
0-2h    Setup (15%)        ■
2-7h    Backend APIs (38%) ■■■■
7-12h   Frontend (38%)     ■■■■
12-14h  Integration (9%)   ■

0-5h    Dashboard (33%)    ■■■
5-10h   Maps (33%)         ■■■
10-14h  A11y Polish (33%)  ■■■

0-4h    Perf+Test (29%)    ■■
4-7h    Innovations (21%)  ■
7-12h   Bug fix+Doc (36%)  ■■
12-14h  Demo prep (14%)    ■
```

---

## 🚨 COMMIT MESSAGE TEMPLATE

```
[Type] Short description (50 chars max)

Detailed explanation (optional)
- What changed
- Why it changed
- Any breaking changes

Types: feat, fix, docs, style, refactor, test, chore, ci

GOOD:
  feat: add family geolocation with leaflet map
  
BAD:
  fixed stuff
  wtf is this
  asdfjkl
```

---

## 👥 TEAM COMMUNICATION PROTOCOL

```
Slack Status Template (post every 2h):
"🟢 [14:30] Backend: Family CRUD ✅, DB migration ✅, Auth guard WIP"
"🟢 [14:30] Frontend: Pages structure ✅, API calls starting 🔄"
"🟢 [14:30] QA: Tests framework ready ✅, accessibility audit running 🔄"

Morning standup (5 min only!):
"Done yesterday: X"
"Today: Y"
"Blocker: Z (or none)"

Friday night (14h mark):
Team huddle - review Checklist, celebrate wins, prep Day 2

Saturday night (28h mark):
Performance audit, accessibility deep dive

Sunday (40h mark):
Final demo rehearsal, no more features, only bug fixes
```

---

## 🏆 FINAL MINDSET

```
✅ Functionality beats perfection
✅ Accessibility = differentiator
✅ Performance matters
✅ Simple > Complex
✅ User testing in your head
✅ Documentation helps jury understand
✅ Demo flawlessness = half the battle
✅ Team morale = sustained velocity
✅ Sleep > caffeine (go to bed!)
✅ You've prepared. Trust the plan.

MANTRA:
"Functional today, beautiful tomorrow.
Accessible always, optimized in the end.
Demo perfectly, jury impressed, trophy won. 🏆"
```

---

**Print this, laminate it, tape it to your monitor! 🎯**

**GO WIN THIS HACKATHON! 🚀**

---

*Créé: 6 Février 2026*  
*Pour: Hackathon Maratech OMNIA*  
*Par: Your Expert Coding Agent*  
