CI guidance for whatsapp_frontend

- This project uses Expo managed workflow and does not include native Android/iOS directories. Gradle is intentionally not present.
- To run in CI, avoid invoking any Gradle/Android native tasks. Use web or Metro-based commands:
  - Install deps: npm ci
  - Lint: npm run lint
  - Start web (non-interactive): npm run start:web:ci
- For native builds, generate native projects via: npm run prebuild:android (not executed in CI by default).
