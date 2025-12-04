#!/usr/bin/env bash
set -euo pipefail

# This project uses Expo managed workflow; native Gradle is not present unless prebuild is run.
# Exit early if a CI job attempts to call Gradle in this workspace.

if [ -f "./gradlew" ] || [ -d "android/app" ]; then
  echo "[ci-guard] Native project detected. Proceeding with native tasks."
  exit 0
fi

echo "[ci-guard] Expo managed app detected. Skipping Gradle/native tasks (no ./gradlew present)."
# Exit 0 to indicate success without running Gradle
exit 0
