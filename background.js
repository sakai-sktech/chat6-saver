// background.js  ― Manifest v3 (Service Worker) 版
// --------------------------------------------------
// クリック → ページでチャット DIV を抽出 → data:URL で TXT をダウンロード
// --------------------------------------------------

chrome.action.onClicked.addListener(async (tab) => {
  try {
    /* 1) ページにスクリプトを注入して DIV を取得 ------------------------ */
    const [{ result: html }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // クラス名は一部一致で検索（必要なら調整してください）
        const el = document.querySelector('[class*="p-WorkspaceGridBox-6"]');
        return el ? el.outerHTML : null;
      },
    });

    if (!html) {
      notify("対象 DIV が見つかりませんでした ❌");
      return;
    }

    /* 2) data:URL を生成してダウンロード --------------------------------- */
    const downloadId = await chrome.downloads.download({
      url: makeDataUrl(html),     // Blob を使わず data: URL で渡す
      filename: makeFilename(),   // 例: Chat6_20250522193045.txt
      saveAs: false,              // ダイアログを出さず既定フォルダーへ
    });

    console.log("Download started, id:", downloadId);
    notify("Chat6 を保存しました ✔️");
  } catch (err) {
    console.error("Chat6 Saver error:", err);
    notify("エラー発生: " + (err.message || err));
  }
});

/* ---------- ユーティリティ関数 ---------- */

// 通知ポップアップ
function notify(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon48.png",   // フォルダー直下に置いたアイコン
    title: "Chat6 Saver",
    message,
  });
}

// ダウンロード用ファイル名 (YYYYMMDDHHMMSS)
function makeFilename() {
  const d = new Date();
  const z = (n) => n.toString().padStart(2, "0");
  return (
    `Chat6_${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}` +
    `${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}.txt`
  );
}

// 文字列 → data:text/plain;charset=utf-8 URL
function makeDataUrl(text) {
  return "data:text/plain;charset=utf-8," + encodeURIComponent(text);
}

