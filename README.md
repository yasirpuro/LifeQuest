# LifeQuest

LifeQuest is a gamified productivity app for building habits, completing quests, and tracking progress.

## Production setup

1. Copy [.env.example](.env.example) to `.env.local`.
2. Fill in the required values for Supabase and Firebase.
3. Build and deploy with the production environment enabled.

### Required environment variables

- `VITE_APP_ENV`
- `VITE_APP_NAME`
- `VITE_APP_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Release notes

- Production defaults are defined in [src/config/runtimeConfig.ts](src/config/runtimeConfig.ts).
- The app uses the release metadata from [manifest.production.json](manifest.production.json).
- The PWA manifest is available in [public/manifest.json](public/manifest.json).
- Privacy policy: [docs/privacy-policy.html](docs/privacy-policy.html)
- Terms of service: [docs/terms-of-service.html](docs/terms-of-service.html)
- Play Console checklist: [docs/PLAY_CONSOLE_CHECKLIST.md](docs/PLAY_CONSOLE_CHECKLIST.md)
- Play Store release notes: [docs/PLAY_STORE_RELEASE_NOTES.md](docs/PLAY_STORE_RELEASE_NOTES.md)
