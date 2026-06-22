const storageKey = "cloudcord.desktop.localBackup";

function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function createCloudSyncSettings(): HTMLElement {
  const section = document.createElement("section");
  section.className = "cc-desktop-section";
  const title = document.createElement("h2");
  title.textContent = "Cloud Sync";
  const text = document.createElement("p");
  text.textContent = "Remote sync is not enabled. This desktop plugin provides local backup and import for CloudCord Desktop settings.";
  const actions = document.createElement("div");
  actions.className = "cc-desktop-actions";
  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.textContent = "Export Local Backup";
  exportButton.addEventListener("click", () => {
    const payload = {
      name: "CloudCord Desktop Local Backup",
      createdAt: new Date().toISOString(),
      settings: localStorage.getItem(storageKey)
    };
    downloadJson("cloudcord-desktop-backup.json", payload);
  });
  const importButton = document.createElement("button");
  importButton.type = "button";
  importButton.textContent = "Import Local Backup";
  importButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      const parsed = JSON.parse(await file.text()) as { settings?: string | null };
      localStorage.setItem(storageKey, parsed.settings ?? "");
    });
    input.click();
  });
  actions.append(exportButton, importButton);
  section.append(title, text, actions);
  return section;
}
