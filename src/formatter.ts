export function getStyles(theme: "dark" | "light"): string {
  const isDark = theme === "dark";

  const bg = isDark ? "#0d1117" : "#ffffff";
  const fg = isDark ? "#e6edf3" : "#1f2328";
  const mutedFg = isDark ? "#8b949e" : "#656d76";
  const borderColor = isDark ? "#30363d" : "#d1d9e0";
  const codeBg = isDark ? "#161b22" : "#f6f8fa";
  const codeBlockBg = isDark ? "#161b22" : "#f6f8fa";
  const linkColor = isDark ? "#58a6ff" : "#0969da";
  const sidebarBg = isDark ? "#010409" : "#f6f8fa";
  const sidebarBorder = isDark ? "#30363d" : "#d1d9e0";
  const blockquoteBorder = isDark ? "#3b434b" : "#d0d7de";
  const tableBorder = isDark ? "#30363d" : "#d1d9e0";
  const tableStripeBg = isDark ? "#161b22" : "#f6f8fa";
  const hoverBg = isDark ? "#161b22" : "#eef1f5";
  const checkboxBorder = isDark ? "#484f58" : "#afb8c1";

  return `
    :root {
      color-scheme: ${isDark ? "dark" : "light"};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: ${fg};
      background: ${bg};
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar / Table of Contents */
    #toc-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 280px;
      background: ${sidebarBg};
      border-right: 1px solid ${sidebarBorder};
      overflow-y: auto;
      padding: 20px 0;
      z-index: 10;
    }

    #toc-sidebar h2 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${mutedFg};
      padding: 0 20px 12px;
      border-bottom: 1px solid ${sidebarBorder};
      margin-bottom: 8px;
    }

    #toc-sidebar ul {
      list-style: none;
      padding: 0;
    }

    #toc-sidebar li a {
      display: block;
      padding: 4px 20px;
      color: ${mutedFg};
      text-decoration: none;
      font-size: 14px;
      line-height: 1.5;
      border-left: 2px solid transparent;
      transition: all 0.15s;
    }

    #toc-sidebar li a:hover {
      color: ${fg};
      background: ${hoverBg};
      border-left-color: ${linkColor};
    }

    #toc-sidebar li a.active {
      color: ${fg};
      border-left-color: ${linkColor};
      font-weight: 500;
    }

    #toc-sidebar li.toc-h2 a { padding-left: 20px; }
    #toc-sidebar li.toc-h3 a { padding-left: 36px; font-size: 13px; }
    #toc-sidebar li.toc-h4 a { padding-left: 52px; font-size: 13px; }

    /* Main content */
    #content {
      margin-left: 280px;
      flex: 1;
      max-width: 900px;
      padding: 40px 48px;
    }

    /* Typography */
    #content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
      font-weight: 600;
      line-height: 1.25;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    #content h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 1px solid ${borderColor}; }
    #content h2 { font-size: 1.5em; padding-bottom: 0.3em; border-bottom: 1px solid ${borderColor}; }
    #content h3 { font-size: 1.25em; }
    #content h4 { font-size: 1em; }
    #content h5 { font-size: 0.875em; }
    #content h6 { font-size: 0.85em; color: ${mutedFg}; }

    #content p {
      margin-bottom: 16px;
    }

    #content a {
      color: ${linkColor};
      text-decoration: none;
    }

    #content a:hover {
      text-decoration: underline;
    }

    #content strong { font-weight: 600; }
    #content em { font-style: italic; }

    #content code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
      background: ${codeBg};
      padding: 0.2em 0.4em;
      border-radius: 6px;
    }

    #content pre {
      background: ${codeBlockBg};
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin-bottom: 16px;
      border: 1px solid ${borderColor};
    }

    #content pre code {
      background: none;
      padding: 0;
      font-size: 85%;
      line-height: 1.45;
    }

    #content pre .lang-label {
      display: block;
      font-size: 12px;
      color: ${mutedFg};
      margin-bottom: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    /* Lists */
    #content ul, #content ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }

    #content li {
      margin-bottom: 4px;
    }

    #content li > ul, #content li > ol {
      margin-bottom: 0;
    }

    /* Task lists */
    #content .task-list {
      list-style: none;
      padding-left: 0;
    }

    #content .task-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    #content .task-list input[type="checkbox"] {
      margin-top: 5px;
      appearance: none;
      width: 16px;
      height: 16px;
      min-width: 16px;
      border: 1px solid ${checkboxBorder};
      border-radius: 3px;
      background: transparent;
      cursor: default;
    }

    #content .task-list input[type="checkbox"]:checked {
      background: ${linkColor};
      border-color: ${linkColor};
      position: relative;
    }

    #content .task-list input[type="checkbox"]:checked::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* Blockquote */
    #content blockquote {
      border-left: 4px solid ${blockquoteBorder};
      padding: 0 16px;
      color: ${mutedFg};
      margin-bottom: 16px;
    }

    /* Tables */
    #content table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
      overflow: auto;
    }

    #content table th, #content table td {
      border: 1px solid ${tableBorder};
      padding: 6px 13px;
      text-align: left;
    }

    #content table th {
      font-weight: 600;
      background: ${tableStripeBg};
    }

    #content table tr:nth-child(2n) {
      background: ${tableStripeBg};
    }

    /* Horizontal rule */
    #content hr {
      border: none;
      border-top: 1px solid ${borderColor};
      margin: 24px 0;
    }

    /* Images */
    #content img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
    }

    /* File picker */
    .file-picker {
      list-style: none;
      padding: 0;
    }

    .file-picker li {
      margin-bottom: 4px;
    }

    .file-picker a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 15px;
      color: ${linkColor};
      text-decoration: none;
      transition: background 0.15s;
    }

    .file-picker a:hover {
      background: ${hoverBg};
    }

    .file-picker .icon {
      font-size: 18px;
    }

    /* Notification */
    #reload-indicator {
      position: fixed;
      top: 12px;
      right: 12px;
      background: ${linkColor};
      color: #fff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 100;
      pointer-events: none;
    }

    #reload-indicator.show {
      opacity: 1;
    }

    /* Print styles */
    @media print {
      #toc-sidebar { display: none; }
      #content {
        margin-left: 0;
        max-width: 100%;
        padding: 20px;
      }
      #reload-indicator { display: none; }
      body { background: white; color: black; }
      #content a { color: black; text-decoration: underline; }
      #content pre, #content code { border: 1px solid #ddd; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      #toc-sidebar {
        display: none;
      }
      #content {
        margin-left: 0;
        padding: 20px 16px;
      }
    }
  `;
}
