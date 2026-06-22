# CloudCord Desktop Runtime

CloudCord Desktop Runtime is the renderer-side runtime for the installed Discord desktop app. It is separate from the iOS and Android mobile runtime and does not load `dist/cc.js` as the desktop runtime.

## Build

```sh
pnpm install
pnpm typecheck
pnpm build
pnpm package
```

Outputs:

- `dist/cloudcord-desktop.js`
- `dist/cloudcord-desktop.min.js`
- `dist/cloudcord-desktop.css`

The runtime exposes a small CloudCord settings/about surface inside Discord when loaded by the desktop installer injection.
