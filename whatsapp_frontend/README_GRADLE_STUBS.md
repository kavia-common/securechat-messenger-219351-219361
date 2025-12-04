# Gradle Stub Files for CI

This Expo-managed app includes stub Gradle wrapper files to prevent CI from failing when it mistakenly runs native Android tasks:

- gradlew / gradlew.bat: No-op wrappers that exit 0.
- build.gradle and settings.gradle: Minimal stub files.

These stubs are ONLY for CI convenience. For real native builds:
1) Run: npm ci
2) Generate native projects: npm run prebuild:android
3) The prebuild will create a real Gradle wrapper. You should then remove or overwrite these stubs as needed.
