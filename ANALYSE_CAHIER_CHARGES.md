# 🎯 ANALYSE MINUTIEUSE - CAHIER DE CHARGES OMNIA

## 📋 RÉSUMÉ EXÉCUTIF

**Projet:** Application Web de gestion et suivi des actions caritatives
**Durée:** 42h (6-8 Février 2026)
**Stack:** React + NestJS + MySQL
**Objectif Client:** 2500+ bénéficiaires, visites structurées, données centralisées

---

## 1️⃣ BESOINS MÉTIER DÉCRYPTÉS

### 🔴 Problème Principal (Critique)
L'association Omnia **n'a pas de système numérique centralisé**:
- Données dispersées (papier, fichiers, mails, etc.)
- Pas de suivi des familles bénéficiaires
- Pas de visibilité sur les interventions et leur impact
- Difficile de planifier les tournées
- Impossible de générer des rapports/statistiques

### ✅ Solution Attendue
Une plateforme web responsive qui centralise **TOUT** :

#### A. GESTION DES FAMILLES (Cœur)
```
Famille = Entité centrale
├── Infos administratives (nom, adresse, tél)
├── Infos sociales (nombre de personnes, situation)
├── Localisation GPS (latitude/longitude)
├── Historique des visites (dates, types d'aide)
└── Statut actuel (actif, inactif, archivé?)
```

**Données à capturer par famille:**
- Nom, prénom représentant
- Adresse complète
- Nombre de personnes
- Situation socio-économique (optionnel)
- Contact téléphonique
- Photo/document d'identification (optionnel)
- Localisation GPS

#### B. GESTION DES VISITES (Cœur)
```
Visite = Transaction
├── Famille concernée
├── Date de visite
├── Type d'aide (1 ou plusieurs)
│   ├── Colis alimentaire
│   ├── Médicaments
│   ├── Aide spécifique (vêtements, couverture, etc.)
│   ├── Visite médicale
│   └── Autre
├── Quantité/détails
├── Notes additionnelles
└── Photos/preuves (optionnel)
```

#### C. TABLEAU DE BORD (Avancé mais STRATÉGIQUE)
```
Indicateurs à afficher:
├── Total familles enregistrées
├── Total visites ce mois
├── Types d'aide les plus distribués
├── Familles les plus visitées
├── Distribution par région/quartier
├── Tendances (graphiques)
└── Rapports exportables (PDF/Excel)
```

#### D. CARTOGRAPHIE INTERACTIVE (Avancé - Diferenciateur!)
```
Carte = Aide à la planification
├── Visualisation des familles (pins/markers)
├── Clustering (groupe les familles proches)
├── Filtres (par type d'aide, par statut)
├── Calcul d'itinéraire optimal (TSP - Travelling Salesman)
├── Affichage des dernières visites
└── Planification des tournées (drag & drop?)
```

---

## 2️⃣ FONCTIONNALITÉS CLASSIFIÉES

### 📌 MVP - INCONTOURNABLE (Semaine 1 du hackathon = Routes/API)

| Fonctionnalité | Priorité | Description | Points pour jury |
|---|---|---|---|
| Créer famille | ⭐⭐⭐⭐⭐ | Form + validation | +10 |
| Lister familles | ⭐⭐⭐⭐⭐ | Table/liste + recherche | +10 |
| Consulter famille | ⭐⭐⭐⭐⭐ | Fiche détail avec historique | +10 |
| Modifier famille | ⭐⭐⭐⭐⭐ | Form édition | +5 |
| Supprimer famille | ⭐⭐⭐⭐ | Soft delete (archive) | +5 |
| Enregistrer visite | ⭐⭐⭐⭐⭐ | Form simple + type aide | +15 |
| Historique visites | ⭐⭐⭐⭐⭐ | Timeline/liste visites | +10 |
| Authentification | ⭐⭐⭐⭐ | Login (bas de droits pour hackathon) | +5 |

**Temps estimé:** 20-24h

### 🚀 AVANCÉ - DIFFÉRENCIATEUR (Semaine 2 = UI Polish + Features)

| Fonctionnalité | Priorité | Description | Points pour jury |
|---|---|---|---|
| Géolocalisation | ⭐⭐⭐⭐⭐ | Saisie auto GPS + map | +20 |
| Tableau de bord | ⭐⭐⭐⭐⭐ | Stats + graphiques | +25 |
| Cartographie | ⭐⭐⭐⭐⭐ | Map interactive + clusters | +30 |
| Recherche/Filtre | ⭐⭐⭐⭐ | Recherche avancée + filtres | +15 |
| Export données | ⭐⭐⭐ | PDF/Excel des rapports | +10 |
| Mode hors-ligne | ⭐⭐ | Service Worker + IndexedDB | +10 |

**Temps estimé:** 15-18h

### 🎨 INNOVATIONS - BONUS JURY (Semaine 3 = WOW!)

| Innovation | Difficulté | Impact Jury |
|---|---|---|
| Calcul d'itinéraire optimal (TSP) | 🟠 Moyenne | **+40 points** |
| Prédiction des besoins (ML simple) | 🔴 Haute | **+30 points** |
| Rapport d'impact automatique | 🟢 Facile | **+20 points** |
| Synthèse vocale pour actions | 🟢 Facile | **+15 points** |
| Mode sombre accessible | 🟢 Facile | **+15 points** |
| Notifications en temps réel | 🟠 Moyenne | **+15 points** |
| Intégration SMS/WhatsApp | 🔴 Haute | **+25 points** |

---

## 3️⃣ EXIGENCES D'ACCESSIBILITÉ (CRITICAL!)

### ♿ Pour les Malvoyants/Avec défaut visuel:
```
✅ WCAG AA minimum (AAA vraiment top)
✅ Contraste 4.5:1 texte/fond (AA), 7:1 (AAA)
✅ Tailles relatives (rem, em, %) pas pixels fixes
✅ Mode sombre auto + manuel
✅ Zoom navigateur 200% fonctionnel
✅ Pas de couleur comme seule info (✘ rouge = erreur, mais aussi 🔴 icon + texte)
✅ Descriptions alt pour images
✅ Lecteur d'écran compatible (NVDA, JAWS)
```

### 🤝 Pour les Malentendants:
```
✅ Pas de son seul (tous les bips = équivalent visuel)
✅ Notifications visuelles (toast, badge, alert)
✅ Si vidéos → sous-titres obligatoires
✅ Icônes = toujours accompagnées de texte
✅ Forms = labels clairs et associés (aria-labelledby)
```

### ⌨️ Pour Moteur (Navigation clavier):
```
✅ Tous les boutons/liens accessibles TAB
✅ Focus visible visible (outline 2px minimum)
✅ Ordre TAB logique (top→bottom, left→right)
✅ ARIA roles (button, form, region, status, etc.)
✅ Raccourcis clavier (Alt+N = Nouvelle Famille, Alt+S = Sauvegarder)
✅ Pas de "pièges de focus" (modales sans piège)
✅ Skip links en haut (navigation principale)
```

### 📱 Pour Mobile/Tablette:
```
✅ Design responsive (Flexbox + CSS Grid)
✅ Boutons min 44x44px (doigt humain)
✅ Espaces min 8px entre éléments cliquables
✅ Pas d'interactions hover-only (pas hover sur mobile!)
✅ Tester avec react-device-detect
✅ Mise en page fluide (pas fixed widths)
✅ Touch targets assez larges
```

### 🎯 Pour Lecteurs d'écran:
```
✅ Attributs ARIA corrects (aria-label, aria-labelledby, aria-describedby)
✅ Headings structure (h1 → h2 → h3, pas sauter)
✅ Listes sémantiques (<ul><li>, <ol><li>)
✅ Formulaires: <label> + <input> + aria-required
✅ Messages d'erreur associés (aria-invalid, aria-describedby)
✅ Régions live (aria-live="polite") pour notifications
✅ Texte alternatif clair et descriptif (pas "image 1")
```

### 🔊 BONUS: Synthèse Vocale
```
✅ Bouton "Lire la page" avec Web Speech API
✅ Vitesse ajustable, pause/reprise
✅ Surbrillance du texte en cours de lecture
✅ Compatible navigateurs modernes
```

---

## 4️⃣ CAS D'USAGE DÉTAILLÉS

### 📖 Scénario 1: Tournée terrain classique

```
Bénévole Ahmed arrive sur le terrain avec tablette
│
├─ 1. Ouvre l'app → Page d'accueil carte
│     └─ Voit les familles à visiter (pins bleus)
│
├─ 2. Clique sur famille "Mme Fatima - Rue Bourguiba"
│     └─ Fiche s'ouvre: infos + dernière visite (3 mois)
│
├─ 3. Clique "Nouvelle visite"
│     └─ Form: Date (auto=aujourd'hui)
│         Type aide: [Colis alimentaire]
│         Détails: Sucre 2kg, Riz 5kg, Huile 1L
│         Photo: [📷]
│         Notes: "Famille OK, pas nouveau besoin"
│
├─ 4. Enregistre visite
│     └─ Toast: "✅ Visite recorded sur 12:35"
│
├─ 5. Visite update en temps réel
│     ├─ Fiche famille: historique update
│     ├─ Carte: pin passe au vert (dernière visite <24h)
│     └─ Stats: +1 visite au totalisateur
│
└─ 6. Continue vers prochaine famille (carrousel ou map)
```

### 📊 Scénario 2: Rapport d'impact (Admin/Coordinateur)

```
Coordinateur souhaite savoir l'impact du mois

LOGIN → Dashboard
│
├─ Voir KPIs: 
│  ├─ 245 familles enregistrées
│  ├─ 412 visites ce mois
│  ├─ 1,850kg colis distribués
│  ├─ 320 médicaments distribués
│  └─ Tendance: +12% vs mois dernier
│
├─ Graphique: Types d'aide distribués (pie chart)
│  ├─ 45% Colis alimentaires
│  ├─ 35% Médicaments
│  ├─ 15% Aide spécifique
│  └─ 5% Autres
│
├─ Graphique: Visites par région (bar chart)
│  └─ Affiche répartition géographique
│
├─ Clique "Exporter rapport"
│  └─ Génère PDF belle mise en page + graphiques
│
└─ Partage rapport avec direction
```

### 🗺️ Scénario 3: Planification tournée optimisée

```
Coordinateur Ahmed prépare tournée pour demain

MAP → Mode "Planification"
│
├─ Couche zoom sur quartier "Menzah 6" 
│     └─ 23 familles à visiter ce mois
│
├─ Filtre active: "Dernière visite > 60 jours"
│     └─ 12 familles en jaune (prioritaires)
│
├─ Clique "Optimiser itinéraire"
│     └─ Calcule route TSP (traveling salesman)
│     └─ Affiche la séquence: [1→2→3→...→12]
│     └─ Distance totale: 12.3km, ~2h30min
│
├─ Résultat visible sur map
│  └─ Route tracée en bleu
│  └─ Points numérotés (ordre visite)
│
├─ Export PDF: Liste + Carte détaillée + Horaires
│
└─ Bénévole télécharge avant tournée
      └─ Can work offline si set up
```

---

## 5️⃣ STRUCTURE DE DONNÉES (Database)

### 🗄️ Tables MySQL Essentielles

```sql
-- Familles (Core Entity)
CREATE TABLE families (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  representative VARCHAR(255),
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100),
  phone VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  family_size INT,
  socioeconomic_status ENUM('sehr_vulnerable', 'vulnerable', 'stable'),
  notes TEXT,
  photo_url VARCHAR(500),
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Visites (Transactions)
CREATE TABLE visits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  family_id INT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME,
  volunteer_id INT,
  notes TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES users(id),
  INDEX idx_family_date (family_id, visit_date)
);

-- Aides (Types d'aide distribués)
CREATE TABLE aids (
  id INT PRIMARY KEY AUTO_INCREMENT,
  visit_id INT NOT NULL,
  aid_type ENUM('food_package', 'medicine', 'clothing', 'medical_visit', 'fuel', 'other'),
  description VARCHAR(255),
  quantity INT,
  unit VARCHAR(50),
  cost_value DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

-- Utilisateurs/Bénévoles
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role ENUM('volunteer', 'coordinator', 'admin') DEFAULT 'volunteer',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Audit Log (important pour traçabilité)
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255),
  table_name VARCHAR(100),
  record_id INT,
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 📊 Indices optimisés pour performance:
```sql
-- Performance query pour dashboard
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_families_status ON families(status);
CREATE INDEX idx_aids_type ON aids(aid_type);
CREATE INDEX idx_visits_created ON visits(created_at);
```

---

## 6️⃣ FLUX DE DONNÉES & GESTION D'ÉTAT

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Pages   │  │Components│  │   Hooks  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│                     │                            │
│                 React Query / Redux               │
│              (State Management)                   │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      │
              ┌───────▼────────┐
              │  API Gateway   │
              │  (Axios/Fetch) │
              └───────┬────────┘
                      │
┌─────────────────────▼────────────────────────────────────┐
│           BACKEND (NestJS + TypeORM)                    │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐               │
│  │Routes   │  │Services  │  │ Entities │               │
│  └─────────┘  └──────────┘  └──────────┘               │
│                                                         │
│  Middleware: Auth, Logging, Error Handling              │
│  Guards: RoleGuard, JwtGuard                            │
│                                                         │
└─────────────────────┬────────────────────────────────────┘
                      │
              ┌───────▼────────┐
              │   MySQL DB     │
              │  (via TypeORM) │
              └────────────────┘
```

---

## 7️⃣ PLAN GAGNANT - 42 HEURES

### ⏰ RÉPARTITION TEMPS

#### **Jour 1 - 14 heures** (Vendredi 6/2)
- **0-2h:** Setup dev env (Node, React, MySQL, repos)
- **2-7h:** Backend API architecture + DB schema (NestJS)
  - Setup NestJS project
  - Entities Family, Visit, Aid, User
  - Controllers/Services basiques
  - DB migrations
  
- **7-12h:** Frontend structure + pages MVP
  - React setup (Vite/CRA)
  - Routing (React Router v6)
  - Folder structure
  - Famille CRUD pages
  
- **12-14h:** Intégration API + Tests basiques

#### **Jour 2 - 14 heures** (Samedi 7/2)
- **0-5h:** Visites + Historique + Tableau bord basique
- **5-10h:** Géolocalisation + Google Maps
- **10-14h:** Polish UI + Accessibilité (ARIA, labels, colors)

#### **Jour 3 - 14 heures** (Dimanche 8/2)
- **0-4h:** Optimisations + Performance (caching, indexing)
- **4-7h:** Innovations: Mode sombre, Export PDF, Synthèse vocale
- **7-12h:** Tests + Bug fixes + Documentation
- **12-14h:** Démo préparation + Désign pitch

---

## 8️⃣ CRITÈRES DE SUCCÈS POUR GAGNER

| Critère | Points | Vérification |
|---|---|---|
| ✅ Toutes fonctionnalités MVP | 30 | Démo chaque feature |
| ✅ Fonctionnalités Avancées | 30 | Géo + Tableau + Carte |
| ✅ Accessibilité WCAG AA | 20 | Audit avec Lighthouse |
| ✅ Performance optimisée | 10 | <2s load, <80ms interactions |
| ✅ Code clean/structuré | 10 | Review code, design patterns |
| **TOTAL** | **100** | |
| 🏆 BONUS Innovations | **+50** | TSP, Export, Synthèse vocale |

---

## 9️⃣ PIÈGES À ÉVITER (⚠️ CRITIQUES)

❌ **Ne pas faire:**
1. **Oublier accessibilité** → Jury vérifiera WCAG (30pts!)
2. **UI non-responsive** → Moitié des users sur mobile
3. **DB non-optimisée** → Lent avec 2500 familles
4. **Pas de gestion d'erreurs** → Vrai désastre en démo
5. **State management chaos** → Refonte à minuit, catastrophe
6. **Pas de tests** → Bugs en démo = points perdus
7. **Code non documenté** → Jury demande explications tech

✅ **À faire:**
1. Tests unitaires dès le start
2. CI/CD local (npm test avant git push)
3. Commit réguliers (sauvegarde!)
4. Documentation code inline
5. Démo testée 3x avant présentation
6. Accessibilité check hebdomadaire

---

## 🎯 RÉSUMÉ FINAL

**Pour GAGNER ce hackathon:**

1. **Fonctionnalités 100%** → Cochez démo scenario, nul part ne perd
2. **Accessibilité 100%** → Jury très attent, +30pts de différence
3. **Perfo + UX** → Fast, simple, beautiful = jury heureux
4. **Innovations** → TSP route planning = WOW factor
5. **Code propre** → Jury lit code, impressionner avec patterns
6. **Démo fluide** → Pas de crash, timeline parfaite

**Let's build something EPIC! 🚀**
