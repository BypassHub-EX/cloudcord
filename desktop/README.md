# CloudCord Desktop

CloudCord Desktop targets the installed Discord desktop `.exe` on Windows. It is not a website, not browser support, not a browser extension, and not only a CSS theme.

Discord desktop is an Electron app. CloudCord Desktop uses a Vencord/Sincord-style architecture with a Windows setup app, a desktop injector, a separate desktop runtime, plugins, patches, local bundled assets, backups, and repair/uninstall actions.

iOS and Android continue to use the mobile runtime. The desktop installer does not use the mobile React Native runtime as the desktop runtime, and it does not load `dist/cc.js` as the desktop runtime.

## Structure

- `runtime`: CloudCord Desktop renderer runtime, plugins, patches, and theme.
- `installer`: CloudCord Setup for Windows Discord desktop.
- `.github/workflows/desktop.yml`: Windows build workflow for runtime and installer.

## Build

```sh
cd desktop/runtime
pnpm install
pnpm typecheck
pnpm build
pnpm package

cd ../installer
pnpm install
pnpm typecheck
pnpm build
pnpm package
```

Expected installer artifact:

```text
desktop/installer/dist/CloudCordSetup.exe
```

## Install

Run `CloudCordSetup.exe`, confirm the detected Discord desktop path, then choose `Install CloudCord`.

The installer supports Discord Stable first and has detection paths ready for PTB and Canary:

- `%LOCALAPPDATA%\Discord`
- `%LOCALAPPDATA%\Discord\app-*`
- `%LOCALAPPDATA%\Discord\app-*\Discord.exe`
- `%APPDATA%\discord`
- `%LOCALAPPDATA%\DiscordPTB`
- `%LOCALAPPDATA%\DiscordCanary`

If Discord is not found, the setup app shows a clear error and does not modify folders.

## Uninstall

Run `CloudCordSetup.exe` and choose `Uninstall CloudCord`. The installer restores the latest backup and removes CloudCord files injected by the installer. It does not delete Discord user data, settings, credentials, or tokens.

## Repair

Run `CloudCordSetup.exe` and choose `Repair CloudCord`. Repair restores the latest backup when available and then installs CloudCord Desktop again while keeping backups.

## Logs And Backups

Logs:

```text
%APPDATA%\CloudCord\Logs
```

Backups:

```text
%APPDATA%\CloudCord\Backups
```

Every modified Discord desktop file or CloudCord-created desktop injection directory is backed up before install changes are written.

## Tester Notes

Test on a Windows machine with Discord Stable installed. Run install, start Discord, use the CloudCord button inside Discord, then test repair and uninstall. If it fails, send the setup window logs plus `%APPDATA%\CloudCord\Logs\desktop-installer.log`.

## Privacy

CloudCord Desktop does not read Discord tokens, collect credentials, add telemetry, hide from the user, or install hidden startup persistence.

## Credits

CloudCord Desktop follows the public desktop injection architecture used by projects such as Vencord and Sincord. No upstream Vencord or Sincord source code is copied into this tree.
