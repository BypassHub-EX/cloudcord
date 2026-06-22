export type DesktopPatch = {
  id: string;
  name: string;
  enabled: boolean;
};

const patches: DesktopPatch[] = [
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

export function getDesktopPatches(): DesktopPatch[] {
  return patches.map(patch => ({ ...patch }));
}
