# Serial Port Notifier

English | [日本語](README.ja.md)

Serial Port Notifier is a Visual Studio Code extension that notifies you when serial ports are added or removed.

## Features
- Detects serial port additions and removals.
- Shows notifications for add/remove events.
- Optional metadata display (manufacturer, VID, PID) when available.
- Configurable polling interval.
- Built-in localization (English, Japanese, Chinese, French, German).

## Requirements
- VS Code 1.90 or later.

## Extension Settings
- `serialPortNotifier.enabled`: Enable or disable monitoring.
- `serialPortNotifier.pollIntervalMs`: Polling interval in milliseconds (minimum 500).
- `serialPortNotifier.notifyOnAdd`: Show a notification when a serial port is added.
- `serialPortNotifier.notifyOnRemove`: Show a notification when a serial port is removed.

## Notes
- On first activation, existing ports are captured without notifications. Only changes after startup are notified.
- In Remote-SSH / WSL / Dev Containers, the extension runs on the remote side and monitors remote serial ports.

## License
MIT
