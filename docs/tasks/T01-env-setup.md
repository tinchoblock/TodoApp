# T01 - Env setup (blocker, no code)

## Goal
Get the environment ready to build backend + frontend. Without this, `dotnet new` and `npm create vite` fail.

## Current context
- .NET Runtime 10.0.11 present but NO SDK (`dotnet --list-sdks` empty).
- Node v6.11.5 / npm 3.10.10 (Vite requires Node 18+, recommend 20 LTS).

## Steps
1. Install .NET SDK 10 (or 8 LTS):
   `winget install --id Microsoft.DotNet.SDK.10 -e --silent --accept-package-agreements --accept-source-agreements`
   Close and reopen the terminal after install.
2. Install Node 20 LTS:
   `winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements`
   Close and reopen the terminal.
3. Verify:
   `dotnet --list-sdks` (must list an SDK)
   `dotnet --version`
   `node --version` (>=20)
   `npm --version`

## Acceptance criteria
- [x] `dotnet --list-sdks` shows an SDK. (Done 2026-09-11: 10.0.401)
- [x] `node --version` >= v20. (Done 2026-09-11: v24.19.0, npm 11.17.0)

## Files touched
None (environment only).

## Next
T02-backend-scaffold.
