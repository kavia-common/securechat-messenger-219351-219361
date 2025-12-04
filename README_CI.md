# CI guidance for whatsapp_frontend (Expo managed)

This project uses the Expo managed workflow and does not include native Android/iOS directories by default. Gradle is intentionally not present until a prebuild is performed.

What to run in CI:
- Install dependencies: npm ci
- Lint: npm run lint
- Type checks (if configured): npm run typecheck
- Web/Metro-based commands only (no native builds): npm run start:web:ci or other non-interactive checks

Do NOT run native/Gradle tasks by default:
- Avoid ./gradlew or any Gradle/Android tasks in CI for this app.
- If you must build native, first generate native projects locally: npm run prebuild:android (or npm run prebuild:ios) — not recommended in CI for this repository.

Backend integration notes:
- Ensure the backend is running on http://localhost:3001.
- Frontend defaults:
  - API_BASE_URL = http://localhost:3001
  - WS_URL = ws://localhost:3001/ws/chat
  These are defined in src/config/index.ts. You can override via Expo extras if needed.

End-to-end validation checklist (local):
1) Register/Login (email + password) — /api/Auth/register, /api/Auth/login
2) List contacts — GET /api/Contacts
3) Add contact and ensure direct conversation is created — POST /api/Conversations/direct
4) List conversations — GET /api/Conversations
5) Fetch messages — GET /api/Messages/{conversationId}?limit&offset
6) Send/receive text:
   - via SignalR hub ws://localhost:3001/ws/chat
   - fallback via REST POST /api/Messages/send
7) Upload media — POST /api/Messages/send-media (multipart with fields: file, conversationId); files served via /uploads
8) Register Expo push token — POST /api/Users/push-token with { expoPushToken }
