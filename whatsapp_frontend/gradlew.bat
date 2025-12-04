@echo off
REM Stub gradle wrapper for Expo-managed app CI.
REM Prevents CI failures when gradlew.bat is invoked.
echo [gradlew stub] Expo-managed app: skipping native Gradle build.
echo [gradlew stub] To build native, run "npm run prebuild:android" locally to generate a real Gradle wrapper.
exit /B 0
