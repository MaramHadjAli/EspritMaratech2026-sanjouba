# 🌟 OMNIA - Plateforme de Gestion Caritative

<div align="center">

![OMNIA Logo](public/assets/images/logo.png)

**Application Web Progressive pour la gestion et le suivi des actions caritatives**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![WCAG AA](https://img.shields.io/badge/WCAG-AA%20Compliant-4CAF50)](https://www.w3.org/WAI/WCAG21/quickref/)
[![i18n](https://img.shields.io/badge/i18n-FR%20|%20EN%20|%20AR-orange)](https://react.i18next.com/)

</div>

---

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Scripts Disponibles](#-scripts-disponibles)
- [Structure du Projet](#-structure-du-projet)
- [Accessibilité (WCAG AA)](#-accessibilité-wcag-aa)
- [Internationalisation](#-internationalisation)
- [Mode Hors-ligne](#-mode-hors-ligne)
- [Workflow de Développement](#-workflow-de-développement)
- [Cahier des Charges - Implémentations](#-cahier-des-charges---implémentations)
- [Technologies](#-technologies)
- [Équipe](#-équipe)

---

## 🎯 Vue d'ensemble

**OMNIA** est une application web progressive conçue pour l'association caritative OMNIA, permettant de gérer efficacement plus de **2500 familles bénéficiaires** à travers la Tunisie.

### Problématique Résolue

L'association OMNIA n'avait pas de système numérique centralisé :
- ❌ Données dispersées (papier, fichiers, mails)
- ❌ Pas de suivi des familles bénéficiaires
- ❌ Pas de visibilité sur les interventions et leur impact
- ❌ Difficile de planifier les tournées
- ❌ Impossible de générer des rapports/statistiques

### Solution Apportée

✅ **Plateforme web centralisée** avec :
- Gestion complète des familles et de leur historique
- Planification et suivi des visites terrain
- Distribution d'aides avec traçabilité
- Tableau de bord analytique avec visualisations
- Cartographie interactive avec heatmaps
- Mode hors-ligne pour le travail terrain
- Accessibilité totale (WCAG AA)

---

## ✨ Fonctionnalités

### 🏠 Gestion des Familles
- **CRUD complet** : Création, consultation, modification, archivage
- **Recherche avancée** : Par nom, téléphone, localisation
- **Score de vulnérabilité** : Calcul automatique basé sur les besoins
- **Historique des aides** : Traçabilité complète des interventions
- **Catégorisation** : Personnes âgées, handicapées, étudiants

### 📍 Gestion des Visites
- **Planification** : Création de visites avec équipes assignées
- **Géolocalisation** : Coordonnées GPS des lieux de visite
- **Statut en temps réel** : Active, Complétée, Planifiée
- **Distribution d'aides** : Wizard 3 phases pour enregistrer les dons
- **Rejoindre une visite** : Système de participation des bénévoles

### 🎁 Gestion des Aides
- **Catalogue d'aides** : Types configurables (alimentaire, médicale, éducative, etc.)
- **Recommandations IA** : Suggestions basées sur l'historique familial
- **Gestion des dépôts** : Suivi des stocks et capacités
- **Traçabilité** : Qui a distribué quoi, quand, à qui

### 📊 Tableau de Bord Analytics
- **Dashboard configurable** : Drag & Drop pour personnaliser l'affichage
- **KPIs en temps réel** :
  - Nombre de familles enregistrées
  - Visites effectuées ce mois
  - Taux de complétion des visites
  - Types d'aides les plus distribués
- **Visualisations interactives** :
  - Graphiques temporels (familles/visites dans le temps)
  - Camembert de répartition des aides
  - Heatmaps par ville/région
  - Histogrammes de taille des familles
- **Persistance** : Disposition sauvegardée en localStorage

### 🗺️ Cartographie
- **Carte interactive** : Leaflet avec markers pour chaque famille/visite
- **Heatmaps** : Densité des familles et visites par région
- **Clustering** : Regroupement intelligent des points

### 👤 Authentification & Rôles
- **JWT Authentication** : Tokens sécurisés avec refresh
- **Rôles utilisateur** :
  - `GUEST` : Accès limité
  - `USER` : Bénévole standard
  - `EMPLOYEE` : Employé avec droits étendus
  - `ADMIN` : Accès complet + gestion utilisateurs
- **Session persistante** : Restoration automatique au rechargement

### ⚙️ Paramètres
- **Thème** : Mode clair/sombre avec détection automatique
- **Langue** : Français, English, العربية (RTL supporté)
- **Accessibilité** : Contrôles dédiés (contraste, taille texte)
- **Profil utilisateur** : Modification des informations personnelles

---

## 🏗 Architecture

### Architecture Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│                        OMNIA Frontend                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    Features     │  │     Shared      │  │      Core       │  │
│  │                 │  │                 │  │                 │  │
│  │ • Auth          │  │ • Components    │  │ • API Client    │  │
│  │ • Dashboard     │  │ • Contexts      │  │ • Services      │  │
│  │ • Families      │  │ • Hooks         │  │ • Config        │  │
│  │ • Visits        │  │ • Utils         │  │ • Layout        │  │
│  │ • Aid           │  │ • Types         │  │                 │  │
│  │ • Settings      │  │ • Stores        │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                    State Management                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │     Zustand     │  │  React Context  │  │   IndexedDB     │  │
│  │  (Local state)  │  │ (Global state)  │  │ (Offline data)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     External Services                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   NestJS API    │  │     Leaflet     │  │    Chart.js     │  │
│  │   (Backend)     │  │     (Maps)      │  │   (Analytics)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de Données

```
User Action
    │
    ▼
┌─────────────────┐
│   Component     │ ◄── React Component avec hooks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Custom Hook    │ ◄── useAuth, useDashboardStats, useOffline...
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │ ◄── aidService, familyService, visitService...
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Axios Client   │ ◄── Interceptors (auth, error handling)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────────┐
│  API  │ │ IndexedDB │ (si hors-ligne)
└───────┘ └───────────┘
```

---

## 🚀 Installation

### Prérequis

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Git**

### Installation locale

```bash
# 1. Cloner le repository
git clone https://github.com/omnia-charity/frontend.git
cd frontend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Lancer le serveur de développement
npm run dev
```

### Variables d'Environnement

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000
VITE_DEFAULT_LANGUAGE=fr
VITE_ENABLE_ANALYTICS=false
```

---

## 📜 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement (port 3001) |
| `npm run build` | Compile le projet pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run type-check` | Vérifie les types TypeScript |
| `npm run test` | Lance les tests avec Vitest |
| `npm run test:ui` | Lance les tests avec interface graphique |

---

## 📁 Structure du Projet

```
frontend/
├── public/
│   ├── assets/
│   │   ├── icons/           # Icônes de l'application
│   │   └── images/          # Images statiques
│   └── interceptors/        # Mock handlers pour développement
│
├── src/
│   ├── core/                # ⚙️ Configuration & Infrastructure
│   │   ├── api/             # Client Axios + interceptors
│   │   ├── config/          # Constantes, environnement, thème
│   │   ├── layout/          # Layout principal de l'app
│   │   └── services/        # Services métier (API calls)
│   │       ├── aid.service.ts
│   │       ├── auth.service.ts
│   │       ├── dashboard.service.ts
│   │       ├── family.service.ts
│   │       ├── visit.service.ts
│   │       ├── offlineStorage.ts    # IndexedDB wrapper
│   │       └── syncQueue.ts         # Sync hors-ligne
│   │
│   ├── features/            # 📦 Modules fonctionnels
│   │   ├── auth/            # Login, Register, AddEmployee
│   │   ├── dashboard/       # Dashboard configurable + Charts
│   │   ├── families/        # CRUD Familles
│   │   ├── visits/          # CRUD Visites + Distribution
│   │   ├── aid/             # CRUD Aides
│   │   ├── settings/        # Paramètres utilisateur
│   │   ├── profile/         # Édition profil + mot de passe
│   │   ├── history/         # Historique des actions
│   │   ├── home/            # Page d'accueil
│   │   └── landing/         # Landing page publique
│   │
│   ├── shared/              # 🔄 Code partagé
│   │   ├── components/      # Composants UI réutilisables
│   │   │   ├── AccessibleButton.tsx
│   │   │   ├── AccessibleFormField.tsx
│   │   │   ├── AccessibleModal.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── ...
│   │   ├── contexts/        # React Contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   ├── LanguageContext.tsx
│   │   │   ├── AccessibilityContext.tsx
│   │   │   ├── OfflineContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── hooks/           # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useAccessibility.ts
│   │   │   ├── useOffline.ts
│   │   │   ├── useDashboardStats.ts
│   │   │   └── ...
│   │   ├── types/           # Définitions TypeScript
│   │   ├── utils/           # Utilitaires
│   │   │   └── accessibility.ts
│   │   └── stores/          # Zustand stores
│   │
│   ├── locales/             # 🌍 Traductions i18n
│   │   ├── fr.json          # Français
│   │   ├── en.json          # English
│   │   └── ar.json          # العربية
│   │
│   ├── pages/               # Pages génériques
│   │   ├── NotFound.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── styles/              # 🎨 Styles globaux
│   │   └── globals.css
│   │
│   ├── App.tsx              # Composant racine + Routes
│   ├── main.tsx             # Point d'entrée
│   └── i18n.ts              # Configuration i18next
│
├── index.html
├── package.json
├── tailwind.config.ts       # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
└── vite.config.ts           # Configuration Vite
```

---

## ♿ Accessibilité (WCAG AA)

### Conformité WCAG 2.1 Niveau AA

OMNIA est entièrement conforme aux directives **WCAG 2.1 Niveau AA**, garantissant l'accès à tous les utilisateurs.

### ✅ Points Critiques Implémentés

#### 1. Perceptible

| Critère | Implémentation | Status |
|---------|----------------|--------|
| **Contraste minimum 4.5:1** | Palette de couleurs testée avec outils de contraste | ✅ |
| **Texte redimensionnable** | Unités relatives (rem, em), zoom 200% fonctionnel | ✅ |
| **Alternatives textuelles** | `alt` sur toutes les images, `aria-label` sur icônes | ✅ |
| **Mode sombre** | Thème dark automatique + toggle manuel | ✅ |
| **Pas de couleur seule** | Erreurs = icône + texte + couleur | ✅ |

#### 2. Opérable

| Critère | Implémentation | Status |
|---------|----------------|--------|
| **Navigation clavier** | Tous les éléments accessibles via Tab | ✅ |
| **Focus visible** | Outline 2px sur focus, `useFocusVisible` hook | ✅ |
| **Ordre de focus logique** | Structure HTML sémantique | ✅ |
| **Pas de piège de focus** | `trapFocus()` dans modales avec échappement | ✅ |
| **Boutons min 44x44px** | `spacing.touch: 44px` dans Tailwind config | ✅ |

#### 3. Compréhensible

| Critère | Implémentation | Status |
|---------|----------------|--------|
| **Labels associés** | `<label>` + `htmlFor` sur tous les inputs | ✅ |
| **Messages d'erreur clairs** | `AccessibleFormField` avec `aria-describedby` | ✅ |
| **Navigation cohérente** | Layout unique, Header persistant | ✅ |
| **Langue de la page** | `document.documentElement.lang` dynamique | ✅ |

#### 4. Robuste

| Critère | Implémentation | Status |
|---------|----------------|--------|
| **Rôles ARIA corrects** | `role`, `aria-live`, `aria-expanded`, etc. | ✅ |
| **HTML sémantique** | `<main>`, `<nav>`, `<section>`, `<article>` | ✅ |
| **Compatible lecteurs d'écran** | Testé avec NVDA | ✅ |

### Composants Accessibles

```tsx
// AccessibleButton - Bouton avec support clavier et ARIA
<AccessibleButton
  ariaLabel="Supprimer cet élément"
  ariaDescription="Cette action est irréversible"
  variant="danger"
>
  Supprimer
</AccessibleButton>

// AccessibleFormField - Champ avec label, erreur et hint
<AccessibleFormField
  label="Email"
  error={errors.email?.message}
  hint="Entrez une adresse email valide"
  required
>
  <input type="email" />
</AccessibleFormField>

// AccessibleModal - Modale avec gestion du focus
<AccessibleModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmer l'action"
>
  Contenu de la modale...
</AccessibleModal>
```

### Utilitaires d'Accessibilité

```typescript
// Annonces pour lecteurs d'écran
announceToScreenReader('Formulaire soumis avec succès', 'polite')
announceToScreenReader('Erreur: Champ requis', 'assertive')

// Gestion du focus
focusElement(document.getElementById('first-input'))
focusFirstFocusable()

// Détection des préférences utilisateur
const reducedMotion = prefersReducedMotion()
const darkMode = prefersDarkMode()
```

---

## 🌍 Internationalisation

### Langues Supportées

| Langue | Code | Direction | Fichier |
|--------|------|-----------|---------|
| Français | `fr` | LTR | `src/locales/fr.json` |
| English | `en` | LTR | `src/locales/en.json` |
| العربية | `ar` | RTL | `src/locales/ar.json` |

### Support RTL

L'arabe est entièrement supporté avec direction RTL automatique :

```typescript
// src/i18n.ts
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
})
```

### Utilisation

```tsx
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => i18n.changeLanguage('ar')}>
        العربية
      </button>
    </div>
  )
}
```

---

## 📴 Mode Hors-ligne

### Fonctionnement

OMNIA supporte le travail **hors connexion** pour les bénévoles sur le terrain :

```
┌─────────────────────────────────────────────────────────┐
│                    Mode Hors-ligne                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   1. Action utilisateur (créer famille, enregistrer     │
│      visite, distribuer aide)                           │
│                        │                                │
│                        ▼                                │
│   2. Détection statut réseau                            │
│      ┌────────────────┬────────────────┐                │
│      │    En ligne    │   Hors ligne   │                │
│      │       │        │       │        │                │
│      │       ▼        │       ▼        │                │
│      │   API Call     │   IndexedDB    │                │
│      │   Direct       │   Queue        │                │
│      └────────────────┴────────────────┘                │
│                                                          │
│   3. Retour en ligne → Sync automatique                 │
│      • Toutes les actions en queue sont envoyées        │
│      • Notification de succès/échec                     │
│      • Compteur d'actions en attente visible            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Composants

- **`OfflineContext`** : État global du réseau et sync
- **`OfflineBanner`** : Bandeau visuel quand hors-ligne
- **`offlineStorage.ts`** : Wrapper IndexedDB pour les actions en attente
- **`syncQueue.ts`** : Gestionnaire de synchronisation

### Utilisation

```tsx
import { useOffline } from '@hooks/useOffline'

const MyComponent = () => {
  const { isOffline, pendingCount, queueAction } = useOffline()
  
  const handleSubmit = async (data) => {
    if (isOffline) {
      await queueAction({
        type: 'CREATE_FAMILY',
        endpoint: '/family',
        method: 'POST',
        payload: data,
        label: `Famille: ${data.name}`,
      })
      // Notifier l'utilisateur que ça sera synchronisé plus tard
    } else {
      await familyService.createFamily(data)
    }
  }
}
```

---

## 🔄 Workflow de Développement

### Git Workflow

```
main (production)
 │
 └── develop (intégration)
      │
      ├── feature/dashboard-charts
      ├── feature/offline-mode
      ├── fix/accessibility-contrast
      └── ...
```

### Conventions de Commit

```
feat: Add dashboard configurable with drag-and-drop
fix: Correct color contrast for WCAG AA compliance
docs: Update README with accessibility section
refactor: Extract chart components from dashboard
chore: Update dependencies
```

### Review Checklist

- [ ] Les types TypeScript sont valides (`npm run type-check`)
- [ ] Pas d'erreurs ESLint (`npm run lint`)
- [ ] Fonctionnalité testée manuellement
- [ ] Accessibilité vérifiée (navigation clavier, contraste)
- [ ] Responsive testé (mobile, tablet, desktop)
- [ ] Traductions ajoutées pour FR/EN/AR si nécessaire

---

## 📋 Cahier des Charges - Implémentations

### MVP - Fonctionnalités Incontournables

| Fonctionnalité | Priorité | Implémenté | Fichiers |
|----------------|----------|------------|----------|
| Créer famille | ⭐⭐⭐⭐⭐ | ✅ | `CreateEditFamilyPage.tsx` |
| Lister familles | ⭐⭐⭐⭐⭐ | ✅ | `FamiliesPage.tsx` |
| Consulter famille | ⭐⭐⭐⭐⭐ | ✅ | `FamilyDetailPage.tsx` |
| Modifier famille | ⭐⭐⭐⭐⭐ | ✅ | `CreateEditFamilyPage.tsx` |
| Supprimer famille | ⭐⭐⭐⭐ | ✅ | Via `familyService.deleteFamily()` |
| Enregistrer visite | ⭐⭐⭐⭐⭐ | ✅ | `CreateEditVisitPage.tsx` |
| Historique visites | ⭐⭐⭐⭐⭐ | ✅ | `HistoryPage.tsx` |
| Authentification | ⭐⭐⭐⭐ | ✅ | `LoginPage.tsx`, `AuthContext.tsx` |

### Avancé - Différenciateurs

| Fonctionnalité | Priorité | Implémenté | Fichiers |
|----------------|----------|------------|----------|
| Géolocalisation | ⭐⭐⭐⭐⭐ | ✅ | `location.service.ts` |
| Tableau de bord | ⭐⭐⭐⭐⭐ | ✅ | `ConfigurableDashboard.tsx` |
| Cartographie + Heatmaps | ⭐⭐⭐⭐⭐ | ✅ | `ChartComponents.tsx` (Leaflet) |
| Recherche/Filtre | ⭐⭐⭐⭐ | ✅ | `SearchInput.tsx` |
| Mode hors-ligne | ⭐⭐ | ✅ | `OfflineContext.tsx`, `offlineStorage.ts` |

### Innovations

| Innovation | Implémenté | Description |
|------------|------------|-------------|
| Dashboard Drag & Drop | ✅ | Réorganisation des charts par l'utilisateur |
| Mode sombre accessible | ✅ | Thème automatique + toggle |
| Synthèse vocale (base) | ✅ | `announceToScreenReader()` |
| Multi-langue + RTL | ✅ | FR/EN/AR avec direction automatique |
| Recommandations d'aides | ✅ | Suggestions basées sur l'historique familial |

### Points d'Accessibilité du Cahier des Charges

| Exigence | Implémenté | Détails |
|----------|------------|---------|
| WCAG AA minimum | ✅ | Conformité complète |
| Contraste 4.5:1 | ✅ | Palette testée, mode sombre inclus |
| Tailles relatives | ✅ | rem/em partout, zoom 200% OK |
| Mode sombre auto | ✅ | `ThemeContext.tsx` avec détection système |
| Pas de couleur seule | ✅ | Icônes + texte pour tous les états |
| Lecteur d'écran | ✅ | ARIA complet, testé NVDA |
| Navigation clavier | ✅ | Tab order logique, focus visible |
| Boutons 44x44px minimum | ✅ | `touch: 44px` dans Tailwind |
| Labels associés | ✅ | `AccessibleFormField` |
| Messages d'erreur liés | ✅ | `aria-describedby`, `aria-invalid` |
| Régions live | ✅ | `aria-live` pour notifications |

---

## 🛠 Technologies

### Core

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| React | 18.2 | Framework UI |
| TypeScript | 5.3 | Typage statique |
| Vite | 5.0 | Build tool & dev server |
| React Router | 6.20 | Routing |

### State Management

| Technologie | Utilisation |
|-------------|-------------|
| React Context | État global (auth, theme, language) |
| Zustand | État local complexe (dashboard layout) |
| IndexedDB | Stockage hors-ligne |

### UI & Styling

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Tailwind CSS | 3.4 | Styling utility-first |
| Lucide React | 0.563 | Icônes |

### Data Visualization

| Technologie | Utilisation |
|-------------|-------------|
| Chart.js + react-chartjs-2 | Graphiques (pie, bar, line) |
| Recharts | Graphiques alternatifs |
| Leaflet + react-leaflet | Cartes interactives |
| leaflet.heat | Heatmaps géographiques |

### Forms & Validation

| Technologie | Utilisation |
|-------------|-------------|
| React Hook Form | Gestion des formulaires |
| Date-fns | Formatage des dates |

### i18n

| Technologie | Utilisation |
|-------------|-------------|
| i18next | Framework de traduction |
| react-i18next | Binding React |

### Testing

| Technologie | Utilisation |
|-------------|-------------|
| Vitest | Test runner |
| Testing Library | Tests de composants |

---

## 👥 Équipe

**OMNIA Charity Frontend Team** - Hackathon Maratech 2026

| Rôle | Responsabilités |
|------|-----------------|
| **Frontend Lead** | Architecture, routing, pages principales |
| **UI/UX Developer** | Composants, accessibilité, responsive |
| **QA/Polish** | Tests, documentation, démo |

---

## 📄 Licence

Ce projet est développé pour l'association OMNIA dans le cadre du Hackathon Maratech 2026.

---

<div align="center">

**Développé avec ❤️ pour les 2500+ familles bénéficiaires de OMNIA**

*Hackathon Maratech - Février 2026*

</div>
