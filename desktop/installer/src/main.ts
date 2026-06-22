import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { detectDiscord } from "./discordPaths";
import { getInstallerState, install, repair, uninstall } from "./installer";
import { appendLog, logsRoot } from "./backup";
import { setupHtml } from "./ui";

async function createPreload(): Promise<string> {
  const preloadPath = path.join(app.getPath("userData"), "preload.js");
  await mkdir(path.dirname(preloadPath), { recursive: true });
  await writeFile(preloadPath, [
    "const { contextBridge, ipcRenderer } = require(\"electron\");",
    "contextBridge.exposeInMainWorld(\"cloudCordSetup\", {",
    "  state: () => ipcRenderer.invoke(\"state\"),",
    "  install: () => ipcRenderer.invoke(\"install\"),",
    "  uninstall: () => ipcRenderer.invoke(\"uninstall\"),",
    "  repair: () => ipcRenderer.invoke(\"repair\"),",
    "  openDiscord: () => ipcRenderer.invoke(\"openDiscord\"),",
    "  openLogs: () => ipcRenderer.invoke(\"openLogs\")",
    "});"
  ].join("\n"));
  return preloadPath;
}

async function createWindow(): Promise<void> {
  const preload = await createPreload();
  const win = new BrowserWindow({
    width: 760,
    height: 620,
    resizable: true,
    title: "CloudCord Setup",
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(setupHtml())}`);
}

ipcMain.handle("state", async () => getInstallerState());
ipcMain.handle("install", async () => install());
ipcMain.handle("uninstall", async () => uninstall());
ipcMain.handle("repair", async () => repair());
ipcMain.handle("openDiscord", async () => {
  const discord = detectDiscord();
  if (!discord) {
    throw new Error("Discord was not found.");
  }
  await appendLog(`Opened Discord at ${discord.exe}`);
  await shell.openPath(discord.exe);
  return "Discord opened.";
});
ipcMain.handle("openLogs", async () => {
  await mkdir(logsRoot(), { recursive: true });
  await appendLog("Opened logs folder");
  await shell.openExternal(pathToFileURL(logsRoot()).toString());
  return "Logs folder opened.";
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  app.quit();
});
