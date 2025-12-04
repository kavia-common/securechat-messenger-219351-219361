# CI Notes (Expo Managed App)

This project uses the Expo managed workflow. There is intentionally no native Android/iOS project unless you run a prebuild locally.

In CI:
- Do NOT run Gradle or any native Android/iOS tasks.
- Use the guard script to skip native steps:
  bash whatsapp_frontend/ci-guard.sh

Recommended CI steps:
- npm ci
- npm run lint
- npm run typecheck (if available)
- Optional web smoke (does not require native): npm run start:web:ci

If you see an error like:
  Error: bash: line 1: ./gradlew: No such file or directory
It means CI attempted to run Android Gradle tasks. Remove/skip those steps and use the guard script above.
