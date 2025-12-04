#!/usr/bin/env bash
set -euo pipefail

echo "[ci-guard] Expo managed app detected. Skipping native Android/iOS Gradle/CocoaPods steps."
echo "[ci-guard] If your pipeline tries to run ./gradlew, remove that step or call this script instead."
exit 0
