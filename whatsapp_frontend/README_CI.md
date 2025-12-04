# CI Notes (Expo Managed App)

This project uses the Expo managed workflow. There is intentionally no native Android/iOS project unless you run a prebuild locally.

In CI:
- Do NOT run Gradle or any native Android/iOS tasks directly.
- Use the guard script to skip native steps safely:
  bash whatsapp_frontend/ci-guard.sh "<command that may invoke gradle>"

Examples:
- bash whatsapp_frontend/ci-guard.sh "./gradlew assembleDebug"
- bash whatsapp_frontend/ci-guard.sh "gradle build"

Recommended CI steps:
- npm ci
- npm run lint
- npm run typecheck (if available)
- Optional web smoke (does not require native): npm run start:web:ci

If you see an error like:
  Error: bash: line 1: ./gradlew: No such file or directory
It means CI attempted to run Android Gradle tasks for an Expo-managed app that hasn't been prebuilt. Remove or guard those steps as shown above.

Generating native projects (not for CI by default):
- Run locally: npm run prebuild:android or npm run prebuild:ios
- After this, native tooling like Gradle will exist (android/gradlew), and the guard will allow commands through unmodified.
