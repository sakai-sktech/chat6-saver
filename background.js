/* background.js – Manifest v3 Service-Worker */

//////////////////// 1. インストール時にコンテキストメニュー登録 ////////////////////
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-raw-html",
    title: "Chat6 HTML を保存",
    contexts: ["action"]          // 拡張アイコンを右クリックした時だけ
  });
});

//////////////////// 2. 左クリック＝Markdown保存 ////////////////////
chrome.action.onClicked.addListener(async (tab) => {
  const markdown = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: collectAsMarkdown       // ★下で定義
  }).then(r => r[0]?.result);

  if (!markdown) return notify("チャット内容が見つかりませんでした ❌");

  await chrome.downloads.download({
    url: makeDataUrl(markdown),
    filename: makeFilename(".md"),
    saveAs: false
  });
  notify("Chat6 (Markdown) を保存しました ✔️");
});

//////////////////// 3. 右クリック＝生 HTML 保存 ////////////////////
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "save-raw-html") return;

  const html = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => (
      document.querySelector('main [class*="p-WorkspaceGridBox-6"]')
      ?.outerHTML || null          // ブロックごと抜き取り
    )
  }).then(r => r[0]?.result);

  if (!html) return notify("対象 DIV が見つかりませんでした ❌");

  await chrome.downloads.download({
    url: makeDataUrl(html, /*markdown=*/false),
    filename: makeFilename(".txt"),
    saveAs: false
  });
  notify("Chat6 (HTML) を保存しました ✔️");
});

//////////////////// 4. ページ側で実行する関数（Markdown生成） ////////////////////
function collectAsMarkdown() {
  const grid = document.querySelector('main [class*="p-WorkspaceGridBox-6"]');
  if (!grid) return null;

  // すべてのチャットブロックを取得
  const chats = [...grid.querySelectorAll('[class*="p-WorkspaceChat"]')];
  if (!chats.length) return null;

  let md = "";

  // 1) 最初のユーザーバブル → 質問
  const firstUserBubble = chats[0]
    .querySelector('.p-WorkspaceMessageBubbleUser__inner');
  md += `# 質問：\n\n${firstUserBubble?.innerText.trim() || ""}\n\n# 回答：\n`;

  // 2) 以降のチャットをループ
  for (const chat of chats) {
    // モデル名は必須。無ければスキップ
    const model =
      chat.querySelector('.p-WorkspaceChatTitle p')?.innerText.trim() ||
      chat.querySelector('.p-WorkspaceChatInformationInner p')?.innerText.trim();
    if (!model) continue;

    // アシスタント回答ブロック全文を innerText で取得
    const assistantInner = chat.querySelector('.p-WorkspaceMessageBubbleAssistant__inner');
    if (!assistantInner) continue;
    const answer = assistantInner.innerText.trim();
    if (!answer) continue;

    md += `\n## ${model}\n\n${answer}\n`;
  }
  return md;
}

//////////////////// 5. 汎用ユーティリティ ////////////////////
function makeFilename(ext = ".md") {
  const d = new Date(), z = n => n.toString().padStart(2, "0");
  return `Chat6_${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}` +
         `${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}${ext}`;
}
function makeDataUrl(text, markdown = true) {
  const mime = markdown ? "text/markdown" : "text/plain";
  return `data:${mime};charset=utf-8,` + encodeURIComponent(text);
}
function notify(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon48.png",
    title: "Chat6 Saver",
    message
  });
}
