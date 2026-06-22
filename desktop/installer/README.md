# CloudCord Installer

CloudCord Installer builds `CloudCordSetup.exe`, a Windows Electron setup and manager for the installed Discord desktop app.

## Commands

```sh
pnpm install
pnpm typecheck
pnpm build
pnpm package
```

Output:

```text
dist/CloudCordSetup.exe
```

## Behavior

The setup app detects Discord Stable first, shows the detected Discord path, and exposes these actions:

- Install CloudCord
- Uninstall CloudCord
- Repair CloudCord
- Open Discord
- Open Logs

The installer writes logs to `%APPDATA%\CloudCord\Logs` and backups to `%APPDATA%\CloudCord\Backups`.

CloudCord Desktop runtime files are bundled locally into the installer package and copied into Discord desktop during install. The installer does not fetch a remote runtime, read tokens, collect credentials, add telemetry, or hide from the user.
