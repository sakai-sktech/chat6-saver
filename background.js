/* background.js – Manifest v3 Service-Worker */

//////////////////// 0. ヘルパー関数 ////////////////////
async function executeScriptOnTab(tabId, func) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: func,
  });
  return results[0]?.result;
}

const CONTEXT_MENU_ID = "save-raw-html";

//////////////////// 1. インストール時にコンテキストメニュー登録 ////////////////////
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Chat6 HTML を保存",
    contexts: ["action"]          // 拡張アイコンを右クリックした時だけ
  });
});

//////////////////// 2. 左クリック＝Markdown保存 ////////////////////
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const markdown = await executeScriptOnTab(tab.id, collectAsMarkdown);

    if (!markdown) {
      return notify("チャット内容が見つかりませんでした ❌");
    }

    await chrome.downloads.download({
      url: makeDataUrl(markdown),
      filename: makeFilename(".md"),
      saveAs: false
    });
    notify("Chat6 (Markdown) を保存しました ✔️");
  } catch (e) {
    console.error("Markdown保存中にエラーが発生しました:", e);
    notify("エラーが発生しました ❌");
  }
});

//////////////////// 3. 右クリック＝生 HTML 保存 ////////////////////
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  try {
    const getRawHtml = () => {
      // セレクタを func スコープ内で定義
      const mainContainerSelector = 'main [class*="p-WorkspaceGridBox-6"]';
      return document.querySelector(mainContainerSelector)?.outerHTML || null;
    };
    const html = await executeScriptOnTab(tab.id, getRawHtml);

    if (!html) {
      return notify("対象 DIV が見つかりませんでした ❌");
    }

    await chrome.downloads.download({
      url: makeDataUrl(html, /*markdown=*/false),
      filename: makeFilename(".txt"),
      saveAs: false
    });
    notify("Chat6 (HTML) を保存しました ✔️");
  } catch (e) {
    console.error("HTML保存中にエラーが発生しました:", e);
    notify("エラーが発生しました ❌");
  }
});

//////////////////// 4. ページ側で実行する関数（Markdown生成） ////////////////////
function collectAsMarkdown() {
  // セレクタをオブジェクトとして一箇所にまとめる
  const SELECTORS = {
    mainContainer: 'main [class*="p-WorkspaceGridBox-6"]',
    chatBlock: '[class*="p-WorkspaceChat"]',
    userQuestionBubble: '.p-WorkspaceMessageBubbleUser__inner',
    modelName: '.p-WorkspaceChatTitle p, .p-WorkspaceChatInformationInner p', // 複数の候補をカンマで繋ぐ
    assistantAnswerBubble: '.p-WorkspaceMessageBubbleAssistant__inner'
  };

  const grid = document.querySelector(SELECTORS.mainContainer);
  if (!grid) return null;

  // すべてのチャットブロックを取得
  const chats = [...grid.querySelectorAll(SELECTORS.chatBlock)];
  if (!chats.length) return null;

  let md = "";

  // 1) 最初のユーザーバブル → 質問
  const firstUserBubble = chats[0].querySelector(SELECTORS.userQuestionBubble);
  md += `# 質問：\n\n${firstUserBubble?.innerText.trim() || ""}\n\n# 回答：\n`;

  // 2) 以降のチャットをループ
  const answers = chats
    .map(chat => {
      const model = chat.querySelector(SELECTORS.modelName)?.innerText.trim();
      const answer = chat.querySelector(SELECTORS.assistantAnswerBubble)?.innerText.trim();
      // モデル名と回答が両方なければ無効なブロックとみなす
      return (model && answer) ? { model, answer } : null;
    })
    .filter(Boolean); // null を除去

  // 回答が一つもなければ最初の質問部分も不要なのでnullを返す
  if (answers.length === 0) {
    // Note: 質問のみの状態で保存したい場合はここのロジックを変更
    return null;
  }

  const answersMd = answers.map(({model, answer}) => `## ${model}\n\n${answer}\n`).join('\n');

  return md + answersMd;
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
