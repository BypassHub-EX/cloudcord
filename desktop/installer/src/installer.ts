import { detectDiscord } from "./discordPaths";
import { installCloudCord } from "./inject";
import { uninstallCloudCord } from "./uninject";
import { repairCloudCord } from "./repair";
import { appendLog, logsRoot, readLatestBackup } from "./backup";

export type InstallerState = {
  found: boolean;
  channel: string | null;
  discordPath: string | null;
  appDir: string | null;
  installed: boolean;
  logsPath: string;
  error: string | null;
};

export async function getInstallerState(): Promise<InstallerState> {
  const discord = detectDiscord();
  const backup = await readLatestBackup();
  return {
    found: Boolean(discord),
    channel: discord?.channel ?? null,
    discordPath: discord?.exe ?? null,
    appDir: discord?.appDir ?? null,
    installed: Boolean(backup),
    logsPath: logsRoot(),
    error: discord ? null : "Discord Stable, PTB, or Canary was not found in %LOCALAPPDATA%."
  };
}

export async function install(): Promise<string> {
  const discord = detectDiscord();
  if (!discord) {
    throw new Error("Discord was not found. Install Discord Stable first, then run CloudCord Setup again.");
  }
  const result = await installCloudCord(discord);
  await appendLog(result.message);
  return `${result.message} Backup ${result.backupId}.`;
}

export async function uninstall(): Promise<string> {
  const result = await uninstallCloudCord();
  await appendLog(result.message);
  return result.message;
}

export async function repair(): Promise<string> {
  const discord = detectDiscord();
  if (!discord) {
    throw new Error("Discord was not found. Repair needs an installed Discord desktop app.");
  }
  const result = await repairCloudCord(discord);
  await appendLog(result.message);
  return result.message;
}
