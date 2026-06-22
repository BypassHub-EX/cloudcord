import type { DiscordInstall } from "./discordPaths";
import { appendLog } from "./backup";
import { installCloudCord } from "./inject";
import { uninstallCloudCord } from "./uninject";

export async function repairCloudCord(install: DiscordInstall): Promise<{ success: boolean; message: string }> {
  try {
    await uninstallCloudCord();
  } catch (error) {
    await appendLog(`Repair continued without uninstall: ${error instanceof Error ? error.message : String(error)}`);
  }
  const result = await installCloudCord(install);
  await appendLog("Repaired CloudCord Desktop");
  return {
    success: true,
    message: `CloudCord Desktop repaired. Backup ${result.backupId} created.`
  };
}
