const vscode = require("vscode");
const { SerialPort } = require("serialport");

let pollTimer = null;
let lastPorts = new Set();
let outputChannel = null;
let isInitialized = false;

function getConfig() {
  const config = vscode.workspace.getConfiguration("serialPortNotifier");
  return {
    enabled: config.get("enabled", true),
    pollIntervalMs: Math.max(500, config.get("pollIntervalMs", 2000)),
    notifyOnAdd: config.get("notifyOnAdd", true),
    notifyOnRemove: config.get("notifyOnRemove", true)
  };
}

async function listPorts() {
  const ports = await SerialPort.list();
  return ports
    .map((p) => ({
      path: p.path,
      manufacturer: p.manufacturer,
      vendorId: p.vendorId,
      productId: p.productId
    }))
    .filter((p) => p.path)
    .sort((a, b) => a.path.localeCompare(b.path));
}

function formatPort(port) {
  const extras = [];
  if (port.manufacturer) {
    extras.push(port.manufacturer);
  }
  if (port.vendorId) {
    extras.push(`VID:${port.vendorId}`);
  }
  if (port.productId) {
    extras.push(`PID:${port.productId}`);
  }
  if (extras.length === 0) {
    return port.path;
  }
  return `${port.path} (${extras.join(", ")})`;
}

function log(message) {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(
      vscode.l10n.t("Serial Port Notifier")
    );
  }
  outputChannel.appendLine(message);
}

async function pollOnce() {
  let ports;
  try {
    ports = await listPorts();
  } catch (error) {
    log(vscode.l10n.t("Failed to list serial ports: {0}", String(error)));
    return;
  }

  const current = new Map(ports.map((p) => [p.path, p]));
  if (!isInitialized) {
    lastPorts = new Set(current.keys());
    isInitialized = true;
    return;
  }
  const added = ports.filter((p) => !lastPorts.has(p.path));
  const removed = Array.from(lastPorts).filter((p) => !current.has(p));

  if (added.length || removed.length) {
    const addedText = added.length ? added.map(formatPort).join(", ") : "-";
    const removedText = removed.length ? removed.join(", ") : "-";
    log(vscode.l10n.t("Detected change. Added: {0}, Removed: {1}", addedText, removedText));
  }

  const { notifyOnAdd, notifyOnRemove } = getConfig();
  if (notifyOnAdd && added.length) {
    vscode.window.showInformationMessage(
      vscode.l10n.t(
        "Serial ports added: {0}",
        added.map(formatPort).join(", ")
      )
    );
  }
  if (notifyOnRemove && removed.length) {
    vscode.window.showWarningMessage(
      vscode.l10n.t("Serial ports removed: {0}", removed.join(", "))
    );
  }

  lastPorts = new Set(current.keys());
}

function startPolling() {
  const config = getConfig();
  if (!config.enabled) {
    log(vscode.l10n.t("Serial Port Notifier is disabled."));
    return;
  }

  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  pollOnce();
  pollTimer = setInterval(pollOnce, config.pollIntervalMs);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  isInitialized = false;
}

function handleConfigChange(event) {
  if (!event.affectsConfiguration("serialPortNotifier")) {
    return;
  }
  stopPolling();
  startPolling();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  outputChannel = vscode.window.createOutputChannel(
    vscode.l10n.t("Serial Port Notifier")
  );

  startPolling();

  context.subscriptions.push(
    outputChannel,
    vscode.workspace.onDidChangeConfiguration(handleConfigChange)
  );
}

function deactivate() {
  stopPolling();
}

module.exports = {
  activate,
  deactivate
};
