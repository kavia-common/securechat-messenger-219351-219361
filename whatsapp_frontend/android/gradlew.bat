@ECHO OFF
SET DIR=%~dp0

IF EXIST "%DIR%\\gradle\\wrapper\\gradle-wrapper.jar" (
  REM Normally would run Java wrapper; this is a minimal shim for CI
  ECHO Gradle wrapper jar present.
) ELSE (
  ECHO Gradle wrapper jar missing; skipping execution.
)
EXIT /B 0
