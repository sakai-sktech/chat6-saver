# Chat6 Saver 🗂️📑

Save any **ChatGPT “Workspace Grid 6”** conversation block as ready‑to‑share Markdown & raw HTML with **one click**.  
Developed for personal workflow automation, now open‑sourced under the MIT License.

[Chat6_Saver_Guide.md](./Chat6_Saver_Guide.md) — full technical write‑up & best‑practice notes.

---

## ✨ Features
| Action | Result | File Format |
|--------|--------|-------------|
| **Left‑click** extension icon | Extract *question + six model answers*, convert to Markdown and download | `Chat6_YYYYMMDDHHMMSS.md` |
| **Right‑click › “Chat6 HTML を保存”** | Save the original HTML block for future re‑parsing | `Chat6_YYYYMMDDHHMMSS.txt` |
| Works on both **Chrome** and **Microsoft Edge** (Manifest v3) | | |
| No background page — lightweight **Service Worker** only | | |

---

## 🚀 Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/your‑name/chat6‑saver.git
   cd chat6‑saver
   ```

2. **Load unpacked extension**

   | Browser | Steps |
   |---------|-------|
   | Chrome  | `chrome://extensions` → developer mode → “Load unpacked” → select repo folder |
   | Edge    | `edge://extensions` → developer mode → “Load unpacked” → select repo folder |

3. Pin the ★ **Chat6 Saver** icon to the toolbar.

4. Open any ChatGPT page that shows a **6‑column Workspace Grid** and hit:
   * **Left‑click** → Markdown saved<br>
   * **Right‑click** → “Chat6 HTML を保存” → raw HTML saved

> **Tip:** Files drop into your default *Downloads* directory.  
> Use the timestamped filename to match conversation order.

---

## 🔧 Configuration

| File | What to edit | Typical change |
|------|--------------|----------------|
| `manifest.json` | `host_permissions` | Add extra domains if UI moves |
| `background.js` | CSS selectors near top of `collectAsMarkdown()` | Adapt if ChatGPT changes class names |
| `icon*.png` | Toolbar icon | Replace with your own branding |

Extending functionality? See **[Chat6_Saver_Guide.md](./Chat6_Saver_Guide.md)** for DOM‑parsing strategy, MV3 permission pitfalls, and future‑idea sketches (JSON export, clipboard copy, options UI etc.).

---

## 🛠️ Development Guidelines

* Keep **selectors shallow & resilient** (`[class*="p-WorkspaceGridBox-6"]` rather than IDs).
* Guard every DOM query with `if (!el) return;` to survive UI updates.
* Prefer **`innerText` bulk grab** first, refine later.
* Use **`data:text/markdown`** URLs so filenames stay `.md`.
* Edge/Chrome share the same engine — test once, run everywhere.

For the rationale behind each rule (and the story of how DeepSeek’s `<ul><li>` broke the first iteration 🫠) → read the guide!

---

## 📄 License

```
MIT License

Copyright (c) 2025 Yoichiro Sakai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[…MIT boilerplate continues…]
```

See [LICENSE](./LICENSE) for the full text.

---

Enjoy—and feel free to open issues or PRs! 🙌
