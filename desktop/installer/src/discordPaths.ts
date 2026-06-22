import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export type DiscordChannel = "stable" | "ptb" | "canary";

export type DiscordInstall = {
  channel: DiscordChannel;
  root: string;
  appDir: string;
  exe: string;
  resources: string;
  appAsar: string;
  injectedApp: string;
};

const channelFolders: Array<{ channel: DiscordChannel; folder: string }> = [
  { channel: "stable", folder: "Discord" },
  { channel: "ptb", folder: "DiscordPTB" },
  { channel: "canary", folder: "DiscordCanary" }
];

function appVersionValue(name: string): number[] {
  return name.replace(/^app-/, "").split(".").map(part => Number.parseInt(part, 10) || 0);
}

function compareAppFolders(a: string, b: string): number {
  const left = appVersionValue(a);
  const right = appVersionValue(b);
  const width = Math.max(left.length, right.length);
  for (let index = 0; index < width; index += 1) {
    const diff = (right[index] ?? 0) - (left[index] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return b.localeCompare(a);
}

function findChannel(root: string, channel: DiscordChannel): DiscordInstall | null {
  if (!existsSync(root)) {
    return null;
  }
  const apps = readdirSync(root)
    .filter(name => name.startsWith("app-"))
    .filter(name => {
      const appPath = path.join(root, name);
      return statSync(appPath).isDirectory() && existsSync(path.join(appPath, "Discord.exe"));
    })
    .sort(compareAppFolders);
  for (const appName of apps) {
    const appDir = path.join(root, appName);
    const resources = path.join(appDir, "resources");
    const appAsar = path.join(resources, "app.asar");
    if (existsSync(appAsar)) {
      return {
        channel,
        root,
        appDir,
        exe: path.join(appDir, "Discord.exe"),
        resources,
        appAsar,
        injectedApp: path.join(resources, "app")
      };
    }
  }
  return null;
}

export function detectDiscord(): DiscordInstall | null {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    return null;
  }
  for (const entry of channelFolders) {
    const found = findChannel(path.join(localAppData, entry.folder), entry.channel);
    if (found) {
      return found;
    }
  }
  return null;
}

export function getDiscordUserDataPath(): string | null {
  const appData = process.env.APPDATA;
  return appData ? path.join(appData, "discord") : null;
}
