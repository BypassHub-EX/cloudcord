import { CLOUDCORD_NAME, CLOUDCORD_REPO } from "../../utils/constants";
import { getDesktopPatches } from "../../patches";
import { createCoreSettings } from "./settings";

export function mountCloudCordCore(details: { version: string; installedAt: string }): HTMLElement {
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
    createCoreSettings("Enabled patches", getDesktopPatches().filter(patch => patch.enabled).map(patch => patch.name).join(", "))
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
