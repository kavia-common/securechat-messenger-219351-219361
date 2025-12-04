# Skip Gradle in CI

This repository includes an Expo-managed React Native app at:
  whatsapp_frontend/

Do NOT run Gradle tasks in CI for this app unless you have explicitly generated native projects via `npm run prebuild:android`.

Use the guard script to bypass native steps:
  bash whatsapp_frontend/ci-guard.sh
