export function setupHtml(): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:;">
<title>CloudCord Setup</title>
<style>
html,body{height:100%;margin:0;background:#0f141b;color:#eef7ff;font-family:Segoe UI,system-ui,sans-serif}
body{display:grid;place-items:stretch}
main{display:grid;grid-template-rows:auto auto 1fr;gap:16px;padding:22px}
h1{margin:0;font-size:24px;line-height:1.2}
.sub{margin:6px 0 0;color:#aabccc;font-size:13px}
.state{display:grid;gap:8px;border:1px solid rgba(112,186,255,.22);border-radius:8px;background:#151d27;padding:14px}
.row{display:grid;grid-template-columns:140px 1fr;gap:10px;font-size:13px}
.label{color:#8fb4d4;font-weight:700}
.value{overflow-wrap:anywhere}
.actions{display:flex;flex-wrap:wrap;gap:10px}
button{border:1px solid rgba(112,186,255,.42);border-radius:8px;background:#126dca;color:#f3f9ff;font-weight:700;font-size:13px;padding:10px 12px}
button.secondary{background:#1b2a3a}
button:disabled{opacity:.55}
pre{margin:0;border:1px solid rgba(112,186,255,.18);border-radius:8px;background:#0a0f15;color:#cfe7ff;padding:14px;overflow:auto;white-space:pre-wrap;font-size:12px;line-height:1.45}
</style>
</head>
<body>
<main>
<header>
<h1>CloudCord Setup</h1>
<p class="sub">Installer and manager for CloudCord Desktop on the installed Discord desktop app.</p>
</header>
<section class="state">
<div class="row"><span class="label">Discord</span><span id="discord" class="value">Detecting...</span></div>
<div class="row"><span class="label">Channel</span><span id="channel" class="value">Detecting...</span></div>
<div class="row"><span class="label">CloudCord</span><span id="installed" class="value">Detecting...</span></div>
<div class="row"><span class="label">Logs</span><span id="logsPath" class="value">Detecting...</span></div>
</section>
<section class="actions">
<button id="install">Install CloudCord</button>
<button id="uninstall" class="secondary">Uninstall CloudCord</button>
<button id="repair" class="secondary">Repair CloudCord</button>
<button id="openDiscord" class="secondary">Open Discord</button>
<button id="openLogs" class="secondary">Open Logs</button>
</section>
<pre id="logs"></pre>
</main>
<script>
const api = window.cloudCordSetup;
const output = document.getElementById("logs");
function write(line){output.textContent += "[" + new Date().toLocaleTimeString() + "] " + line + "\\n"; output.scrollTop = output.scrollHeight;}
async function refresh(){
  const state = await api.state();
  document.getElementById("discord").textContent = state.discordPath || state.error || "Not found";
  document.getElementById("channel").textContent = state.channel || "Unavailable";
  document.getElementById("installed").textContent = state.installed ? "Backup available" : "Not installed";
  document.getElementById("logsPath").textContent = state.logsPath;
}
async function run(name, fn){
  write(name + " started.");
  try {
    write(await fn());
  } catch (error) {
    write(error && error.message ? error.message : String(error));
  }
  await refresh();
}
document.getElementById("install").addEventListener("click", () => run("Install", api.install));
document.getElementById("uninstall").addEventListener("click", () => run("Uninstall", api.uninstall));
document.getElementById("repair").addEventListener("click", () => run("Repair", api.repair));
document.getElementById("openDiscord").addEventListener("click", () => run("Open Discord", api.openDiscord));
document.getElementById("openLogs").addEventListener("click", () => run("Open Logs", api.openLogs));
refresh().then(() => write("Ready."));
</script>
</body>
</html>`;
}
