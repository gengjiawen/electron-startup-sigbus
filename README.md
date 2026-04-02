# Electron 41 Startup SIGBUS Repro

This is a standalone Electron Forge repro for the startup crash reported in `electron/electron#50393`.

## Why this bundle is copied

The crash reproduces reliably with the copied `out/main/index.js`, but even small edits to that file often make the crash disappear. For that reason, this repro keeps the crashing main-process bundle as-is and strips away the rest of the original application instead of rewriting the entrypoint by hand.

## Reproduce

```bash
pnpm install
pnpm start
```

This repro includes a local `.npmrc` with `node-linker=hoisted`, because Electron Forge rejects pnpm's default isolated linker layout.

If you installed dependencies before that config existed, remove `node_modules` and run `pnpm install` again once.

If you want the direct process result instead of the Forge wrapper:

```bash
pnpm run repro:bin
```

If you want the signal printed explicitly:

```bash
pnpm run repro:check
```

## Expected

The app should launch normally.

## Actual

On the affected machine, Electron exits during startup with `SIGBUS` before a usable window appears.

## Verified Environment

- Electron: `41.1.0`
- Tooling: `@electron-forge/cli 7.11.1`
- Repro command: `node_modules/electron/dist/Electron.app/Contents/MacOS/Electron out/main/index.js`
