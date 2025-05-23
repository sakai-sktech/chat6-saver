# Chat6 Saver ― Chrome / Edge Extension Guide  
*“The complete record and best practices for automating ‘manual copy-paste’ into a single click”*

---

## 0. Goal and Concept

| Feature | Purpose | Implementation Points |
|---------|---------|----------------------|
| **① Raw HTML Save**<br>Right-click ≫ *Save Chat6 HTML* | Backup for re-parsing if the site specification changes | Save as `.txt` via data:URL (`text/plain`) |
| **② Markdown Conversion Save**<br>Left-click (default) | Automatically generate a human-readable report | Traverse the DOM and assemble **Question + 6 Model Answers** into Markdown |

> **Design Philosophy**  
> *Keep raw data* and *use ready-made processed data* in one package.  
> Both are handled by a **single Service Worker**, with UI as simply left/right icon clicks.

---

## 1. Project Structure

```
chat6-saver/
├─ manifest.json
├─ background.js
├─ icon16.png / 48 / 128
└─ README.md
```

### 1.1 manifest.json (Key Points Extracted)

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

| Common Pitfall | Why Needed? |
|----------------|-------------|
| `"action"` block | Without it, `chrome.action` is `undefined` |
| `"downloads"` permission | `chrome.downloads.download()` becomes undefined |
| `"host_permissions"` or `"activeTab"` | Permission to access DOM |
| `text/markdown` MIME | To preserve `.md` files |

---

## 2. background.js ― Excerpt

```js
chrome.action.onClicked.addListener(tab => saveMarkdown(tab));
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "save-raw-html",
    title: "Save Chat6 HTML",
    contexts: ["action"]
  })
);
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-raw-html") saveRawHTML(tab);
});
```

※ For the full code, see the main text.

---

## 3. DOM Parsing Design ― Best Practices

### 3.1 Robust Selectors

| Tips | Example |
|------|---------|
| Look for feature name classes | `[class*="p-WorkspaceGridBox-6"]` |
| Keep hierarchy shallow | `main … .p-WorkspaceChat` |
| Ignore dynamic IDs | Don’t read `div.jsx-*` |
| Use querySelectorAll | Get 6 blocks as an array |
| Null checks | Avoid failures after updates |

### 3.2 innerText: Bulk vs Individual

Bulk innerText ensures nothing is missed; individual extraction is easier to format but may miss content.

---

## 4. MV3 Pitfalls

| Symptom | Cause | Solution |
|---------|-------|----------|
| Cannot access contents | Lack of permissions | host_permissions |
| onClicked undefined | Missing action block | Fix manifest |
| .md is saved as .txt | text/plain MIME | Use text/markdown |

---

## 5. Future Expansion Ideas
* JSON mode
* Clipboard copy
* Options screen
* Dashboard analytics

---

## 6. Final Checklist
- [x] Fixed manifest
- [x] Save as text/markdown
- [x] Bulk innerText extraction
- [x] Left/right click functionality

