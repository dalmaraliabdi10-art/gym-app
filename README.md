# gym-app

Personlig gymapp — iOS + webb från en gemensam Expo-kodbas.

**Funktioner:**
- Klickbar SVG-kroppsfigur (front/back) → övningsförslag per muskel
- Träningspass-loggning (sets/reps/vikt)
- Övningsbibliotek med form-tips
- Progress-grafer (vikt över tid, totalvolym/vecka)
- Vilo-timer mellan sets
- Offline-först med molnsync via Supabase

## Stack
- **Expo SDK 54** (React Native + Expo Router) — TypeScript
- **Supabase** (Postgres + Auth + Row Level Security)
- **react-native-svg** för body figure
- **@tanstack/react-query** för data fetching

## Setup

```bash
# 1. Installera beroenden
npm install

# 2. Kopiera env-mall och fyll i Supabase-nycklar
cp .env.example .env.local
# Redigera .env.local med dina värden från supabase.com → Settings → API

# 3. Starta dev-server
npm run web      # Webb (öppna http://localhost:8081)
npm run ios      # iOS-simulator (kräver Xcode)
```

## Branch-strategi

```
main          ← produktion (skyddad, kräver PR från develop)
└── develop   ← integration (alla färdiga features)
    ├── feature/<namn>
    └── bugfix/<namn>
```

## iOS-bygge (sidoladdning via Xcode + dev mode)

1. `npx expo prebuild -p ios` (genererar /ios/-mappen)
2. Öppna `ios/gymapp.xcworkspace` i Xcode
3. Välj din enhet → Build (⌘R)
4. På iPhone: Settings → Privacy & Security → Developer Mode → ON

Free Apple ID = certifikatet löper ut var 7:e dag. Bygg om vid behov.

## Säkerhet

- Alla Supabase-tabeller har Row Level Security aktiv
- `.env.local` är gitignored — ingen hemlig data i repot
- `expo-secure-store` lagrar session-token i iOS Keychain
- Magic link-auth (ingen lösenordshantering)
