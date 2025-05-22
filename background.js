chrome.action.onClicked.addListener(async (tab) => {
  try {
    // ページ内にスクリプト注入して必要情報だけ抽出
    const [{ result: markdown }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 1. チャット大枠
        const gridBox = document.querySelector('main [class*="p-WorkspaceGridBox-6"]');
        if (!gridBox) return null;

        // 2. 各チャット枠
        const chats = Array.from(gridBox.querySelectorAll('[class*="p-WorkspaceChat"]'));
        let question = "";
        let markdown = "";

        chats.forEach((chat, idx) => {
          // モデル名（必須）
          const modelName = chat.querySelector('.p-WorkspaceChatTitle p')?.innerText.trim()
            || chat.querySelector('.p-WorkspaceChatInformationInner p')?.innerText.trim()
            || null;
          if (!modelName) return;

          // 1つ目のチャットだけ質問文を抽出
          if (idx === 0) {
            const userQs = Array.from(chat.querySelectorAll('.p-WorkspaceMessageBubbleUser__inner p')).map(e => e.innerText.trim());
            question = userQs.join('\n\n');
            markdown += `# 質問：\n\n${question}\n\n# 回答：\n`;
          }

          // 回答部分（アシスタントバブルのpタグを連結）
          const answerBlocks = Array.from(chat.querySelectorAll('.p-WorkspaceMessageBubbleAssistant__inner p'));
          let answer = answerBlocks.map(e => e.innerText.trim()).join('\n\n');

          if (!answer.trim()) return; // 回答が空ならスキップ

          markdown += `\n## ${modelName}\n\n${answer}\n`;
        });

        return markdown;
      }
    });

    if (!markdown) {
      notify("チャット内容が見つかりませんでした ❌");
      return;
    }

    // .md拡張子で保存
    const downloadId = await chrome.downloads.download({
      url: makeDataUrl(markdown),
      filename: makeFilename('.md'), // ここで必ず .md
      saveAs: false,
    });

    notify("Chat6 (Markdown) を保存しました ✔️");
  } catch (err) {
    console.error("Chat6 Saver error:", err);
    notify("エラー発生: " + (err.message || err));
  }
});

// ユーティリティ群
function makeFilename(ext = '.md') {
  const d = new Date();
  const z = (n) => n.toString().padStart(2, "0");
  return (
    `Chat6_${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}` +
    `${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}${ext}`
  );
}
function makeDataUrl(text) {
  return "data:text/plain;charset=utf-8," + encodeURIComponent(text);
}
function notify(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon48.png",
    title: "Chat6 Saver",
    message,
  });
}
