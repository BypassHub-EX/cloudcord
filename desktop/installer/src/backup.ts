import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { DiscordInstall } from "./discordPaths";

export type BackupManifest = {
  id: string;
  createdAt: string;
  channel: string;
  discordAppDir: string;
  resources: string;
  injectedApp: string;
  injectedAppExisted: boolean;
  cloudcordDir: string;
  cloudcordDirExisted: boolean;
};

export function cloudCordRoot(): string {
  const appData = process.env.APPDATA;
  if (!appData) {
    throw new Error("%APPDATA% is not available.");
  }
  return path.join(appData, "CloudCord");
}

export function backupRoot(): string {
  return path.join(cloudCordRoot(), "Backups");
}

export function logsRoot(): string {
  return path.join(cloudCordRoot(), "Logs");
}

export async function appendLog(message: string): Promise<void> {
  await mkdir(logsRoot(), { recursive: true });
  const line = `[${new Date().toISOString()}] ${message}\n`;
  await writeFile(path.join(logsRoot(), "desktop-installer.log"), line, { flag: "a" });
}

export async function createBackup(install: DiscordInstall): Promise<BackupManifest> {
  await mkdir(backupRoot(), { recursive: true });
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`;
  const dir = path.join(backupRoot(), id);
  await mkdir(dir, { recursive: true });
  const cloudcordDir = path.join(install.resources, "cloudcord");
  const manifest: BackupManifest = {
    id,
    createdAt: new Date().toISOString(),
    channel: install.channel,
    discordAppDir: install.appDir,
    resources: install.resources,
    injectedApp: install.injectedApp,
    injectedAppExisted: existsSync(install.injectedApp),
    cloudcordDir,
    cloudcordDirExisted: existsSync(cloudcordDir)
  };
  if (manifest.injectedAppExisted) {
    await cp(install.injectedApp, path.join(dir, "app"), { recursive: true });
  }
  if (manifest.cloudcordDirExisted) {
    await cp(cloudcordDir, path.join(dir, "cloudcord"), { recursive: true });
  }
  await writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  await writeFile(path.join(backupRoot(), "latest.json"), JSON.stringify(manifest, null, 2));
  await appendLog(`Created backup ${id}`);
  return manifest;
}

export async function readLatestBackup(): Promise<BackupManifest | null> {
  const latest = path.join(backupRoot(), "latest.json");
  if (!existsSync(latest)) {
    return null;
  }
  return JSON.parse(await readFile(latest, "utf8")) as BackupManifest;
}

export async function restoreBackup(manifest: BackupManifest): Promise<void> {
  const dir = path.join(backupRoot(), manifest.id);
  if (existsSync(manifest.injectedApp)) {
    await rm(manifest.injectedApp, { recursive: true, force: true });
  }
  if (manifest.injectedAppExisted) {
    await cp(path.join(dir, "app"), manifest.injectedApp, { recursive: true });
  }
  if (existsSync(manifest.cloudcordDir)) {
    await rm(manifest.cloudcordDir, { recursive: true, force: true });
  }
  if (manifest.cloudcordDirExisted) {
    await cp(path.join(dir, "cloudcord"), manifest.cloudcordDir, { recursive: true });
  }
  await appendLog(`Restored backup ${manifest.id}`);
}
