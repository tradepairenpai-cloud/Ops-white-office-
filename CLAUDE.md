# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## Overview

**Daily Life OS** (`daily-life-os`) is a Thai-language, mobile-first personal
life-management app. It presents five tabs — Home (หน้าแรก), Schedule (ตาราง),
Health (สุขภาพ), Finance (การเงิน), and an AI Assistant — inside a phone-sized
frame (max width 430px).

It is currently a **UI prototype running on mock data**: there is no backend,
no API, no authentication, and no persistence. All content comes from
`src/data/sampleData.ts`, and the AI Assistant's replies are hardcoded
lookups, not a real model. Keep this in mind before wiring up "real" behaviour.

The app ships in two forms:
- a **PWA** (installable web app, via `vite-plugin-pwa`), and
- an **Android app** packaged with **Capacitor**.

## Tech stack

- **React 18** + **TypeScript** (strict mode)
- **Vite 6** (build tool / dev server)
- **Tailwind CSS 3** (styling) with PostCSS + Autoprefixer
- **vite-plugin-pwa** (service worker, web manifest)
- **Capacitor 8** (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`)
- **lucide-react** (icons)
- Android build toolchain: **Node 22**, **Java 21**, Gradle, Android SDK
  (platform `android-36`, build-tools `35.0.0`)

## Commands

```bash
npm install              # install dependencies

npm run dev              # start Vite dev server (hot reload)
npm run build            # type-check + production build → tsc -b && vite build
npm run preview          # serve the production build locally

node scripts/gen-icons.mjs   # regenerate PWA / favicon icons into public/icons/

# Android (after npm run build):
npx cap sync android                       # copy web assets + plugins into android/
cd android && ./gradlew assembleDebug      # build debug APK
```

**There is no test runner and no linter configured.** Code quality is enforced
only by the TypeScript compiler in strict mode — `npm run build` will fail on
type errors, unused locals, or unused parameters (`noUnusedLocals`,
`noUnusedParameters`, `noFallthroughCasesInSwitch`). Run `npm run build` to
verify a change compiles before committing.

## Project structure

```
src/
  main.tsx                     # React entry point; mounts <App /> in StrictMode
  App.tsx                      # tab "router": useState<TabId> switches screens
  index.css                    # Tailwind layers + reusable component classes
  vite-env.d.ts
  types/
    index.ts                   # ALL shared types (TabId, Task, Event, ...)
  data/
    sampleData.ts              # all mock content the UI renders
  hooks/
    useDateTime.ts             # live clock + Thai/Buddhist-era date strings
  components/
    StatusBar.tsx              # faux phone status bar
    BottomNav.tsx              # 5-tab bottom navigation
    screens/
      HomeScreen.tsx
      ScheduleScreen.tsx
      HealthScreen.tsx
      FinanceScreen.tsx
      AIAssistantScreen.tsx

public/icons/                  # generated PWA icons (do not hand-edit)
scripts/gen-icons.mjs          # dependency-free PNG/ICO generator
android/                       # Capacitor-generated native Android project
.github/workflows/build-android.yml   # CI: builds & uploads debug APK

index.html                     # HTML shell (Thai lang, Sarabun font, PWA meta)
vite.config.ts                 # Vite + PWA manifest / workbox config
tailwind.config.js             # design tokens (colors, shadows, animations)
capacitor.config.json          # Capacitor app id, splash, status bar
tsconfig*.json                 # TS project references (app / node)
```

## Conventions

- **One default-exported component per file.** Screens live in
  `src/components/screens/` and are PascalCase-named.
- **Navigation is plain state, not a router library.** `App.tsx` holds
  `useState<TabId>` and conditionally renders the active screen. `TabId`
  (a string union in `src/types/index.ts`) is the single source of truth that
  drives `BottomNav`'s `NAV_ITEMS`, `App`'s `SCREEN_TITLES`, and the render
  branches.
- **Shared types go in `src/types/index.ts`** — don't redefine domain types
  locally.
- **Styling is Tailwind-first.** Before adding ad-hoc values:
  - Reuse **design tokens** from `tailwind.config.js`: colors (`primary`,
    `primary-light`, `background`, `card`, `text-main`, `text-sub`, `success`,
    `warning`, `danger`), custom shadows (`soft`, `card`, `float`, `nav`),
    radii (`2.5xl`, `3xl`, `4xl`), and animations (`fade-in`, `slide-up`,
    `pop`, etc.).
  - Reuse **component classes** defined in `src/index.css` (`.phone-frame`,
    `.card`, `.card-sm`, `.btn-primary`, `.btn-ghost`, plus `glass` /
    `gradient-primary` / `chat-bubble-*` helpers used across screens).
- **Icons** come from `lucide-react` (imported by name, e.g. `import { Home }`).
- **UI copy is Thai.** Match the existing language for user-facing strings.
  Dates use the Buddhist-era year and Thai month/day names — see
  `useDateTime.ts` (`thaiYear = getFullYear() + 543`).

### Adding a new tab/screen

1. Add the id to the `TabId` union in `src/types/index.ts`.
2. Add a `NAV_ITEMS` entry (id, Thai label, lucide icon) in
   `components/BottomNav.tsx`.
3. Add a `SCREEN_TITLES` entry and a render branch in `App.tsx`.
4. Create the screen component under `components/screens/`.

## Mobile / PWA / Android notes

- The **PWA manifest and service-worker config live in `vite.config.ts`**
  (`VitePWA({...})`), not in a static manifest file. Theme color `#4F8CFF`,
  `display: standalone`, `lang: th`.
- Capacitor's `webDir` is `dist`, so **always `npm run build` before
  `npx cap sync android`** — `cap sync` copies the built web assets into the
  native project.
- **Icons are generated, not drawn by hand.** `scripts/gen-icons.mjs` writes
  `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`, and
  `favicon.ico` into `public/icons/` using only Node built-ins. To change the
  icon, edit the `drawIcon` function and rerun the script.
- Native/Android tweaks (splash screen, status bar, app id
  `com.dailylifeos.app`) are configured in `capacitor.config.json`.

## Git & CI

- Develop on feature branches (e.g. `claude/...`); do not commit straight to
  `main`.
- `.github/workflows/build-android.yml` builds a **debug APK** on push to
  `main` or `claude/daily-life-os-mobile-ui-q9g9nf` (and via
  `workflow_dispatch`), uploading it as the `daily-life-os-debug` artifact.
- Build outputs are gitignored: `node_modules/`, `dist/`, and the Android
  build dirs (`android/**/build/`, `android/.gradle/`, `android/local.properties`).
