export function createCoreSettings(labelText: string, valueText: string): HTMLElement {
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
