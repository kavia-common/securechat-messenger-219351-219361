# Skip Gradle in CI (Expo)

This workspace contains an Expo-managed app at whatsapp_frontend. There is no Gradle wrapper unless you run a prebuild locally.

- CI must not invoke ./gradlew or Gradle tasks for this app by default.
- Use the guard script if your CI template still attempts native builds:
  bash whatsapp_frontend/ci-guard.sh "<native or gradle command>"

If you really need native builds in CI:
1) Run: npm ci
2) Generate native projects: npm run prebuild:android
3) Proceed with Gradle tasks (android/gradlew will exist).
