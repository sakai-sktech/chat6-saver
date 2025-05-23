# Chat6 Saver ― Chrome / Edge 拡張機能ガイド  
*「“手作業コピペ” を１クリック自動化するまでの全記録とベストプラクティス」*

---

## 0. ゴールとコンセプト

| 機能 | 目的 | 実装ポイント |
|------|------|--------------|
| **① Raw HTML 保存**<br>右クリック ≫ *Chat6 HTML を保存* | サイト仕様が変わった時の再解析用バックアップ | data:URL で `.txt` 保存（`text/plain`） |
| **② Markdown 変換保存**<br>左クリック（デフォルト） | 人間がすぐ読めるレポートを自動生成 | DOM を走査して **質問 + 6 モデル回答** を Markdown 組み立て → `text/markdown` で `.md` 保存 |

> **設計哲学**  
> *生データを残す* と *加工済みをすぐ使う* をワンパッケージに。  
> どちらも **Service Worker １本** で完結させ、UI はアイコン左/右クリックだけ。

---

## 1. プロジェクト構成

```
chat6-saver/
├─ manifest.json
├─ background.js
├─ icon16.png / 48 / 128
└─ README.md
```

### 1.1 manifest.json（要点だけ抜粋）

```jsonc
{
  "manifest_version": 3,
  "name": "Chat6 Saver",
  "version": "0.2.0",
  "action": { "default_title": "Chat6 Saver" },

  "background": { "service_worker": "background.js" },

  "permissions": [
    "contextMenus",
    "downloads",
    "notifications",
    "scripting",
    "activeTab"
  ],

  "host_permissions": [
    "https://chat.openai.com/*",
    "https://chatgpt.com/*"
  ]
}
```

| よく詰まる所 | なぜ必要？ |
|--------------|-----------|
| `"action"` ブロック | 無いと `chrome.action` が `undefined` になる |
| `"downloads"` 権限 | `chrome.downloads.download()` が未定義化 |
| `"host_permissions"` or `"activeTab"` | DOM へアクセスする権限 |
| `text/markdown` MIME | `.md` を維持できる |

---

## 2. background.js ― 抜粋

```js
chrome.action.onClicked.addListener(tab => saveMarkdown(tab));
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "save-raw-html",
    title: "Chat6 HTML を保存",
    contexts: ["action"]
  })
);
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-raw-html") saveRawHTML(tab);
});
```

※ 以降フルコードは本文参照。

---

## 3. DOM パース設計 ― ベストプラクティス

### 3.1 壊れにくいセレクタ

| コツ | 例 |
|------|----|
| 機能名クラスを見る | `[class*="p-WorkspaceGridBox-6"]` |
| 階層は浅く | `main … .p-WorkspaceChat` |
| 動的 ID を無視 | `div.jsx-*` は読まない |
| querySelectorAll | 6 ブロックを配列取得 |
| null チェック | 改修でも落とさない |

### 3.2 innerText 一括 vs 個別

innerText 一括は漏れなし、個別は整形しやすいが抜けやすい。

---

## 4. MV3 ハマりポイント

| 症状 | 原因 | 解決 |
|------|------|------|
| Cannot access contents | 権限不足 | host_permissions |
| onClicked undefined | action ブロック不足 | manifest 修正 |
| .md が .txt | text/plain MIME | text/markdown |

---

## 5. 今後の拡張アイデア
* JSON モード
* クリップボードコピー
* オプション画面
* ダッシュボード解析

---

## 6. まとめチェックリスト
- [x] manifest 修正
- [x] text/markdown で保存
- [x] innerText 一括取得
- [x] 左右クリック機能
