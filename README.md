# Chat6 Saver 🗂️📑

**Chat6-Saver** is a Chrome extension that lets you **save both the question and all model answers shown in [TenbinAI](https://tenbin.ai/)** (a web service for asking up to 6 LLMs simultaneously) as Markdown and HTML files in one click.

TenbinAI’s multi-model answers are useful not only for visual comparison, but also for report writing and later reuse. This tool was developed to meet those needs.

> For more about TenbinAI, search “天秤AI” on the web.

[Chat6_Saver_Guide.md](./Chat6_Saver_Guide.md) — see here for technical details and best practices.

---

## ✨ Features
| Action | Result | File Format |
|--------|--------|-------------|
| **Left-click extension icon** | Extract *question + six model answers*, convert to Markdown and download | `Chat6_YYYYMMDDHHMMSS.md` |
| **Right-click › “Save Chat6 HTML”** | Save the original HTML block for future re-parsing | `Chat6_YYYYMMDDHHMMSS.txt` |
| Works on both **Chrome** and **Microsoft Edge** (Manifest v3) | | |
| No background page — lightweight **Service Worker** only | | |

---

## 🚀 Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/your‑name/chat6‑saver.git
   cd chat6‑saver
   ```

2. **Load unpacked extension**

   | Browser | Steps |
   |---------|-------|
   | Chrome  | `chrome://extensions` → developer mode → “Load unpacked” → select repo folder |
   | Edge    | `edge://extensions` → developer mode → “Load unpacked” → select repo folder |

3. Pin the ★ **Chat6 Saver** icon to your toolbar.

4. Open any TenbinAI page showing a **6-column Workspace Grid** and:
   * **Left-click** → Markdown is saved<br>
   * **Right-click** → “Save Chat6 HTML” → raw HTML is saved

> **Tip:** Files are saved to your default *Downloads* directory.  
> The timestamped filename helps you match conversation order.

---

## 🔧 Configuration

| File | What to edit | Typical change |
|------|--------------|----------------|
| `manifest.json` | `host_permissions` | Add extra domains if UI moves |
| `background.js` | CSS selectors near top of `collectAsMarkdown()` | Adapt if TenbinAI changes class names |
| `icon*.png` | Toolbar icon | Replace with your own branding |

Want to extend functionality? See **[Chat6_Saver_Guide.md](./Chat6_Saver_Guide.md)** for DOM parsing strategy, MV3 permission tips, and future ideas (JSON export, clipboard copy, options UI, etc.).

---

## 🛠️ Development Guidelines

* **Keep selectors shallow & resilient** (e.g. `[class*="p-WorkspaceGridBox-6"]` rather than IDs).
* Guard every DOM query with `if (!el) return;` to survive UI updates.
* Prefer **bulk `innerText` grab** first, refine later.
* Use **`data:text/markdown`** URLs so filenames stay `.md`.
* Edge/Chrome share the same engine — test once, run everywhere.

For the rationale behind each rule (and the story of how DeepSeek’s `<ul><li>` broke the first iteration 🫠) → read the guide!

---

## 📄 License

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
