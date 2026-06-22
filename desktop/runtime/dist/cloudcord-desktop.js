"use strict";
var CloudCordDesktop = (() => {
  // src/utils/constants.ts
  var CLOUDCORD_NAME = "CloudCord Desktop";
  var CLOUDCORD_VERSION = "0.1.0";
  var CLOUDCORD_REPO = "https://github.com/xohus/cloudcord";
  var DESKTOP_RUNTIME_ID = "cloudcord-desktop";

  // src/patches/index.ts
  var patches = [
    {
      id: "cloudcord-settings-entry",
      name: "CloudCord settings entry",
      enabled: true
    },
    {
      id: "cloudcord-theme-loader",
      name: "CloudCord desktop theme loader",
      enabled: true
    }
  ];
  function getDesktopPatches() {
    return patches.map((patch) => ({ ...patch }));
  }

  // src/plugins/cloudcordCore/settings.tsx
  function createCoreSettings(labelText, valueText) {
    const item = document.createElement("div");
    item.className = "cc-desktop-setting";
    const label = document.createElement("span");
    label.className = "cc-desktop-setting-label";
    label.textContent = labelText;
    const value = document.createElement("span");
    value.className = "cc-desktop-setting-value";
    value.textContent = valueText;
    item.append(label, value);
    return item;
  }

  // src/plugins/cloudcordCore/index.tsx
  function mountCloudCordCore(details) {
    const section = document.createElement("section");
    section.className = "cc-desktop-section";
    const title = document.createElement("h1");
    title.textContent = "CloudCord Core";
    const body = document.createElement("div");
    body.className = "cc-desktop-grid";
    body.append(
      createCoreSettings("Runtime", CLOUDCORD_NAME),
      createCoreSettings("Version", details.version),
      createCoreSettings("Installed state", "Runtime loaded in Discord desktop"),
      createCoreSettings("Loaded at", new Date(details.installedAt).toLocaleString()),
      createCoreSettings("Enabled patches", getDesktopPatches().filter((patch) => patch.enabled).map((patch) => patch.name).join(", "))
    );
    const link = document.createElement("a");
    link.className = "cc-desktop-link";
    link.href = CLOUDCORD_REPO;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = CLOUDCORD_REPO;
    section.append(title, body, link);
    return section;
  }

  // src/plugins/cloudSync/settings.tsx
  var storageKey = "cloudcord.desktop.localBackup";
  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
  function createCloudSyncSettings() {
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
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
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
        const parsed = JSON.parse(await file.text());
        localStorage.setItem(storageKey, parsed.settings ?? "");
      });
      input.click();
    });
    actions.append(exportButton, importButton);
    section.append(title, text, actions);
    return section;
  }

  // src/plugins/cloudSync/index.tsx
  function mountCloudSync() {
    return createCloudSyncSettings();
  }

  // src/index.ts
  var state = {
    installedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  function ensureRoot() {
    let root = document.getElementById(DESKTOP_RUNTIME_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = DESKTOP_RUNTIME_ID;
      document.documentElement.appendChild(root);
    }
    return root;
  }
  function showPanel() {
    const root = ensureRoot();
    root.innerHTML = "";
    const panel = document.createElement("section");
    panel.className = "cc-desktop-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", CLOUDCORD_NAME);
    const close = document.createElement("button");
    close.className = "cc-desktop-close";
    close.type = "button";
    close.textContent = "Close";
    close.addEventListener("click", () => {
      root.innerHTML = "";
    });
    panel.append(mountCloudCordCore({ version: CLOUDCORD_VERSION, installedAt: state.installedAt }), mountCloudSync(), close);
    root.append(panel);
  }
  function addLauncher() {
    if (document.getElementById("cloudcord-desktop-launcher")) {
      return;
    }
    const button = document.createElement("button");
    button.id = "cloudcord-desktop-launcher";
    button.className = "cc-desktop-launcher";
    button.type = "button";
    button.textContent = "CloudCord";
    button.addEventListener("click", showPanel);
    document.body.append(button);
  }
  function boot() {
    window.CloudCordDesktop = {
      name: CLOUDCORD_NAME,
      version: CLOUDCORD_VERSION,
      id: DESKTOP_RUNTIME_ID,
      installedAt: state.installedAt,
      openSettings: showPanel
    };
    addLauncher();
    document.documentElement.classList.add("cloudcord-desktop-theme");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
