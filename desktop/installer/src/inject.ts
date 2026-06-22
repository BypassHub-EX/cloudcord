import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { DiscordInstall } from "./discordPaths";
import { appendLog, createBackup } from "./backup";

export type InstallResult = {
  success: boolean;
  message: string;
  discordPath: string;
  backupId: string;
};

function runtimeSource(): string {
  const packaged = process.resourcesPath ? path.join(process.resourcesPath, "runtime") : "";
  if (packaged && existsSync(path.join(packaged, "cloudcord-desktop.js"))) {
    return packaged;
  }
  return path.resolve(__dirname, "../../runtime/dist");
}

function injectionIndex(): string {
  return [
    "const path = require(\"node:path\");",
    "const electron = require(\"electron\");",
    "const originalBrowserWindow = electron.BrowserWindow;",
    "const preload = path.join(__dirname, \"..\", \"cloudcord\", \"preload.js\");",
    "class CloudCordBrowserWindow extends originalBrowserWindow {",
    "  constructor(options = {}) {",
    "    const nextOptions = { ...options, webPreferences: { ...(options.webPreferences || {}) } };",
    "    nextOptions.webPreferences.preload = preload;",
    "    super(nextOptions);",
    "  }",
    "}",
    "electron.BrowserWindow = CloudCordBrowserWindow;",
    "require(\"../app.asar\");"
  ].join("\n");
}

function preloadScript(): string {
  return [
    "const fs = require(\"node:fs\");",
    "const path = require(\"node:path\");",
    "const base = __dirname;",
    "function inject() {",
    "  const css = fs.readFileSync(path.join(base, \"cloudcord-desktop.css\"), \"utf8\");",
    "  const js = fs.readFileSync(path.join(base, \"cloudcord-desktop.js\"), \"utf8\");",
    "  const style = document.createElement(\"style\");",
    "  style.id = \"cloudcord-desktop-css\";",
    "  style.textContent = css;",
    "  document.documentElement.appendChild(style);",
    "  const script = document.createElement(\"script\");",
    "  script.id = \"cloudcord-desktop-js\";",
    "  script.textContent = js;",
    "  document.documentElement.appendChild(script);",
    "}",
    "if (document.readyState === \"loading\") {",
    "  document.addEventListener(\"DOMContentLoaded\", inject, { once: true });",
    "} else {",
    "  inject();",
    "}"
  ].join("\n");
}

export async function installCloudCord(install: DiscordInstall): Promise<InstallResult> {
  const source = runtimeSource();
  const js = path.join(source, "cloudcord-desktop.js");
  const css = path.join(source, "cloudcord-desktop.css");
  if (!existsSync(js) || !existsSync(css)) {
    throw new Error(`CloudCord Desktop runtime is missing at ${source}. Build the runtime first.`);
  }
  if (!existsSync(install.appAsar)) {
    throw new Error(`Discord app.asar was not found at ${install.appAsar}.`);
  }
  const backup = await createBackup(install);
  const cloudcordDir = path.join(install.resources, "cloudcord");
  await mkdir(install.injectedApp, { recursive: true });
  await mkdir(cloudcordDir, { recursive: true });
  await cp(js, path.join(cloudcordDir, "cloudcord-desktop.js"));
  await cp(css, path.join(cloudcordDir, "cloudcord-desktop.css"));
  const min = path.join(source, "cloudcord-desktop.min.js");
  if (existsSync(min)) {
    await cp(min, path.join(cloudcordDir, "cloudcord-desktop.min.js"));
  }
  await writeFile(path.join(cloudcordDir, "preload.js"), preloadScript());
  await writeFile(path.join(install.injectedApp, "index.js"), injectionIndex());
  await writeFile(path.join(install.injectedApp, "package.json"), JSON.stringify({ name: "cloudcord-discord-desktop-injection", main: "index.js" }, null, 2));
  await readFile(path.join(install.injectedApp, "index.js"), "utf8");
  await appendLog(`Installed CloudCord Desktop into ${install.appDir}`);
  return {
    success: true,
    message: "CloudCord Desktop installed.",
    discordPath: install.exe,
    backupId: backup.id
  };
}
