# Skip Gradle for Expo Managed App

This repository contains an Expo-managed React Native app under whatsapp_frontend with no native Gradle wrapper by default.

To avoid CI failures:
- Do not invoke ./gradlew for whatsapp_frontend unless you have run a prebuild locally.
- Check for whatsapp_frontend/SKIP_GRADLE_CHECK or run whatsapp_frontend/ci-guard.sh to conditionally skip native tasks.

Backend integration:
- Backend: http://localhost:3001
- SignalR Hub: ws://localhost:3001/ws/chat
- CORS: Backend already allows common local origins.
