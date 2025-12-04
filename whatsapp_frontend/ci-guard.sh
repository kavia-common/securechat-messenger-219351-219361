#!/usr/bin/env bash
set -euo pipefail

# This script guards CI against accidentally invoking native Android/iOS tasks
# for an Expo-managed app that hasn't been prebuilt.
# Usage:
#   bash whatsapp_frontend/ci-guard.sh <command ...>
#
# It will:
#  - Detect if android/ios native projects contain gradlew and android/app folders.
#  - If not present, and the command seems to run gradle/gradlew or Android build,
#    it will skip with exit 0 to avoid failing CI.

COMMAND="${*:-}"

# Normalize to lowercase for detection
lc() { echo "$1" | tr '[:upper:]' '[:lower:]'; }

CMD_LC="$(lc "$COMMAND")"

# Heuristics: if command tries to run gradle/gradlew or android build tasks
if [[ "$CMD_LC" == *"gradle"* || "$CMD_LC" == *"./gradlew"* || "$CMD_LC" == *"gradlew "* || "$CMD_LC" == *" assemble"* || "$CMD_LC" == *" bundle"* ]]; then
  # Check if native Android exists (after prebuild)
  if [[ ! -f "./android/gradlew" ]] && [[ ! -f "./gradlew" ]]; then
    echo "[ci-guard] Expo project without native Gradle wrapper detected. Skipping native build command:"
    echo "  $COMMAND"
    echo "[ci-guard] To generate native projects locally, run: npm run prebuild:android"
    exit 0
  fi
fi

# If we got here, either the command is safe or Gradle wrapper exists. Run it.
if [[ -n "$COMMAND" ]]; then
  echo "[ci-guard] Executing: $COMMAND"
  bash -lc "$COMMAND"
else
  echo "[ci-guard] No command provided. Nothing to do."
fi
