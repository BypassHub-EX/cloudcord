import { CLOUDCORD_NAME, CLOUDCORD_VERSION, DESKTOP_RUNTIME_ID } from "./utils/constants";
import { mountCloudCordCore } from "./plugins/cloudcordCore";
import { mountCloudSync } from "./plugins/cloudSync";

declare global {
  interface Window {
    CloudCordDesktop?: {
      name: string;
      version: string;
      id: string;
      installedAt: string;
      openSettings: () => void;
    };
  }
}

const state = {
  installedAt: new Date().toISOString()
};

function ensureRoot(): HTMLElement {
  let root = document.getElementById(DESKTOP_RUNTIME_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = DESKTOP_RUNTIME_ID;
    document.documentElement.appendChild(root);
  }
  return root;
}

function showPanel(): void {
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

function addLauncher(): void {
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

function boot(): void {
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
