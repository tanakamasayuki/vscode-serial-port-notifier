# Serial Port Notifier

[English](README.md) | 日本語

Serial Port Notifier は、シリアルポートの追加・削除を通知する Visual Studio Code 拡張です。

## 特長
- シリアルポートの増減を検知します。
- 追加/削除時に通知を表示します。
- 取得できる場合はメーカー名、VID、PID を表示します。
- ポーリング間隔を設定できます。
- 多言語対応（英語、日本語、中国語、フランス語、ドイツ語）。

## 動作条件
- VS Code 1.90 以上。

## 設定
- `serialPortNotifier.enabled`: 監視の有効/無効。
- `serialPortNotifier.pollIntervalMs`: ポーリング間隔（ミリ秒、最小 500）。
- `serialPortNotifier.notifyOnAdd`: シリアルポート追加時に通知。
- `serialPortNotifier.notifyOnRemove`: シリアルポート削除時に通知。

## 注意
- 起動直後は既存ポートを通知せず、起動後の増減のみ通知します。
- Remote-SSH / WSL / Dev Containers ではリモート側のシリアルポートを監視します。

## ライセンス
MIT
