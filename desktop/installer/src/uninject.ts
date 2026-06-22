import { appendLog, readLatestBackup, restoreBackup } from "./backup";

export async function uninstallCloudCord(): Promise<{ success: boolean; message: string }> {
  const backup = await readLatestBackup();
  if (!backup) {
    throw new Error("No CloudCord Desktop backup was found.");
  }
  await restoreBackup(backup);
  await appendLog("Uninstalled CloudCord Desktop");
  return {
    success: true,
    message: `CloudCord Desktop uninstalled using backup ${backup.id}.`
  };
}
