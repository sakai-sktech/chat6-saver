# Chat6 Saver 🗂️📑

**Chat6-Saver** は、[天秤AI](https://tenbin.ai/)（最大6つのLLMに同時質問できるWebサービス）で表示された「質問」と「各モデルの回答」を、**Markdown形式とHTML形式で一括保存できるChrome拡張機能**です。

天秤AIで得られた複数モデルの回答は、単なる目視比較だけでなく、レポート作成や後からの再利用が求められる場面が多くあります。というか、自分がそうやって使いたいと思ったことが開発のきっかけです。

> Webで「天秤AI」と検索することで、詳細な機能や使い方も調べられます。便利なサービスを展開されているGMO様に感謝申し上げます。

[Chat6_Saver_Guide.md](./Chat6_Saver_Guide.md) — 技術的な詳細やベストプラクティスはこちら。

---

## ✨ 機能一覧
| 操作 | 結果 | ファイル形式 |
|------|------|--------------|
| **拡張機能アイコンを左クリック** | *質問＋6つのモデル回答*を抽出し、Markdownに変換してダウンロード | `Chat6_YYYYMMDDHHMMSS.md` |
| **右クリック › 「Chat6 HTML を保存」** | 元のHTMLブロックを保存し、再解析用に利用可能 | `Chat6_YYYYMMDDHHMMSS.txt` |
| **Chrome**と**Microsoft Edge**（Manifest v3）両対応 | | |
| バックグラウンドページなし — 軽量な**Service Worker**のみ | | |

---

## 🚀 クイックスタート

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/your‑name/chat6‑saver.git
   cd chat6‑saver
   ```

2. **パッケージ化されていない拡張機能を読み込む**

   | ブラウザ | 手順 |
   |----------|------|
   | Chrome   | `chrome://extensions` → デベロッパーモード → 「パッケージ化されていない拡張機能を読み込む」→ リポジトリフォルダを選択 |
   | Edge     | `edge://extensions` → デベロッパーモード → 「パッケージ化されていない拡張機能を読み込む」→ リポジトリフォルダを選択 |

3. ★ **Chat6 Saver** アイコンをツールバーにピン留めしてください。

4. 天秤AIで回答させたいLLMを選択して質問してください。回答が全て表示されたら以下を実行：
   * **左クリック** → Markdownが保存されます<br>
   * **右クリック** → 「Chat6 HTML を保存」→ 生HTMLが保存されます

> **ヒント:** ファイルはデフォルトの*ダウンロード*ディレクトリに保存されます。  
> タイムスタンプ付きファイル名で会話の順番が分かります。

---

## 🔧 設定

| ファイル | 編集箇所 | 変更例 |
|----------|----------|--------|
| `manifest.json` | `host_permissions` | UIが移動した場合はドメインを追加 |
| `background.js` | `collectAsMarkdown()`の冒頭付近のCSSセレクタ | ChatGPTのクラス名が変わった場合に対応 |
| `icon*.png` | ツールバーアイコン | 独自のブランドアイコンに差し替え |

機能拡張の方法は**[Chat6_Saver_Guide.md](./Chat6_Saver_Guide.md)**を参照してください（DOM解析戦略、MV3の権限注意点、今後のアイデア例：JSONエクスポート、クリップボードコピー、オプションUIなど）。

---

## 🛠️ 開発ガイドライン

* **セレクタは浅く・堅牢に**（例：`[class*="p-WorkspaceGridBox-6"]`、IDは避ける）。
* すべてのDOMクエリは`if (!el) return;`でガードし、UI変更に強くする。
* まず**`innerText`で一括取得**、必要に応じて細かく調整。
* **`data:text/markdown`** URLを使い、拡張子を`.md`に固定。
* Edge/Chromeは同じエンジンなので、一度テストすれば両方で動作。

各ルールの理由や、DeepSeekの出力内の`<ul><li>`が初期実装を壊した話🫠はガイドを参照！

---

## 📄 ライセンス

```
MIT License

Copyright (c) 2025 Yoichiro Sakai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[…MITの定型文が続きます…]
```

全文は [LICENSE](./LICENSE) をご覧ください。

---

ご利用ありがとうございます！IssueやPRも歓迎します🙌