# WhatsApp Frontend (Expo Managed)

This app uses the Expo managed workflow. There is intentionally no native Android/iOS project unless you run a prebuild.

Local development:
- Ensure backend runs at http://localhost:3001.
- The app defaults to:
  - API_BASE_URL=http://localhost:3001
  - WS_URL=ws://localhost:3001/ws/chat
  These are defined in src/config/index.ts.

CI Guidance:
- Do not run Gradle/Android native tasks by default. Use the provided ci-guard.sh to safely skip native steps:
  bash whatsapp_frontend/ci-guard.sh
- Recommended CI steps:
  - npm ci
  - npm run lint
  - npm run typecheck (if available)
  - Optional: web checks (e.g., npm run start:web:ci)

Generating native projects (not for CI by default):
- Run: npm run prebuild:android or npm run prebuild:ios
- After this, native tooling like Gradle will exist locally.
