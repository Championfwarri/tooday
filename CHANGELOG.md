## 2026-06-29 - Phases 0 à 4 : Implementation complete

### Fonctionnalites Validees

#### Phase 0 — Fondations
- [Design System] : Palette Bleu Nuit (#0F172A) + Orange Dore (#F59E0B) dans `src/constants/theme.ts`. Spacing, BorderRadius, couleurs light/dark.
- [i18n bilingue] : Systeme i18next avec detection automatique de la langue du telephone. Fichiers `src/i18n/fr.json` et `src/i18n/en.json`. Bascule FR/EN.
- [Structure routes] : 3 onglets (TooDay / Entre Nous / Notre Histoire) via expo-router groupe `(tabs)`. Ecran onboarding gere par le layout racine (`_layout.tsx`). Ecran settings.
- [Onboarding] : Ecran multi-etapes (intro, prenoms, date, frequence, priorite, villes, retrouvailles, appairage, notifications, essai gratuit). Sauvegarde du profil dans AsyncStorage.
- [Store profil] : Module `src/store/profile.ts` avec AsyncStorage pour persister les donnees du couple localement.

#### Phase 1 — Onglet TooDay (100% local)
- [Countdown] : Compte a rebours vers les retrouvailles (`src/components/countdown.tsx`).
- [Double horloge] : Horloges cote a cote avec visuel jour/nuit (soleil/lune, fond degrade) (`src/components/dual-clock.tsx`).
- [Meteo] : Meteo des 2 villes via Open-Meteo API publique (`src/utils/weather.ts`, `src/components/weather-card.tsx`).
- [Geocoding] : Geocodage des villes + detection fuseau horaire (`src/utils/geocoding.ts`).
- [Suggestion contextuelle] : Affiche "Souhaite-lui bonne nuit/bon matin" quand pertinent.
- [Notre distance] : Calcul de distance en km entre les 2 villes (Haversine).
- [Pull-to-refresh] : Actualisation des donnees meteo et profil.

#### Phase 2 — Backend Convex + onglet Entre Nous
- [Schema Convex] : Tables couples, dailyQuestions, missYou, photos, ourList, ourMoment, capsules (`convex/schema.ts`).
- [Fonctions Convex] : CRUD pour couples, questions, missYou, ourList, ourMoment, capsules.
- [Onglet Entre Nous] : Grille de fonctionnalites (Question du jour, Tu me manques, Notre liste, Notre instant, Capsule, Photo du jour).
- [Question du jour] : Banque de 20 questions multi-themes (amour, desir, distance, quotidien, projets, souvenirs). Rotation quotidienne. Repondre = gratuit, voir la reponse du partenaire = TooDay+.
- [Tu me manques] : 4 gestes tendres (miss you, kiss, hug, love) avec feedback visuel.
- [Notre liste] : Bucket-list a deux (ajout, toggle, suppression).
- [Capsule] : Message verrouille jusqu'a une date future.
- [Gating] : Fonctions connectees verrouillees si non appaire (mode solo Phase 1).

#### Phase 3 — Notre Histoire + Reglages
- [Espace Evenements] : Dates-cles calculees automatiquement (retrouvailles, anniversaire de relation). Tri chronologique.
- [Stats douces] : Jours ensemble, jours avant retrouvailles.
- [Onglets internes] : Evenements / Stats / Frise (frise = placeholder Phase suivante).
- [Ecran Reglages] : Profil complet (prenoms, villes, dates, langue) accessible via icone engrenage. Bascule manuelle de langue (Auto/FR/EN).

#### Phase 4 — Monetisation TooDay+
- [Store subscription] : Module `src/store/subscription.ts` — gestion essai 7 jours, statut premium/trial/free, liste des fonctions premium.
- [PremiumGate] : Composant reutilisable pour bloquer l'acces aux fonctions premium avec message et bouton upgrade.
- [Hook useSubscription] : Acces reactif au statut d'abonnement.
- [Onboarding trial] : Bouton "Commencer l'essai gratuit" declenche le trial de 7 jours.
- [RevenueCat SDK] : Package `react-native-purchases` installe. Configuration API key a ajouter lors du build natif.
- [Gating] : Fonctions premium identifiees (seePartnerAnswer, questionArchive, capsule, ourList, ourMoment, multipleCountdowns, photoDiaporama, advancedThemes).

### Modifications Apportees
- Suppression des composants de demo Expo (animated-icon, app-tabs, external-link, hint-row, web-badge, collapsible, explore.tsx).
- Refonte de `themed-text.tsx` et `themed-view.tsx` (simplification, adaptation au nouveau theme).
- tsconfig.json : exclusion du dossier `convex/` (genere par `npx convex dev`).
- Dependances ajoutees : expo-localization, i18next, react-i18next, @react-native-async-storage/async-storage, convex, convex-helpers, react-native-purchases.

### Points d'Attention
- L'onboarding utilise des TextInput bruts pour les dates (YYYY-MM-DD). Un date-picker natif ameliorera l'UX.
- L'appairage (code de couple) est en mode "solo" tant que Convex n'est pas deploye. Lancer `npx convex dev` pour activer la synchro.
- Le `useTheme()` retourne toujours le theme dark (app a fond sombre par design). Le mode clair pourra etre active plus tard.
- RevenueCat : la cle API doit etre configuree dans l'app native (pas Expo Go). Tester l'achat in-app avec un build EAS.
- Le dossier `convex/_generated/` n'existe pas tant que `npx convex dev` n'a pas ete lance au moins une fois.
