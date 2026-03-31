import { getStyles } from "./formatter";

export function renderPage(opts: {
  title: string;
  theme: "dark" | "light";
  mode: "file" | "directory";
  initialContent?: string;
  files?: string[];
}): string {
  const styles = getStyles(opts.theme);

  if (opts.mode === "directory" && opts.files) {
    return renderDirectoryPage(opts.title, styles, opts.files);
  }

  return renderFilePage(opts.title, styles, opts.initialContent || "");
}

function renderDirectoryPage(title: string, styles: string, files: string[]): string {
  const fileListHtml = files
    .map((f) => `<li><a href="/view/${encodeURIComponent(f)}"><span class="icon">&#128196;</span> ${escapeHtml(f)}</a></li>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - markview</title>
  <style>${styles}</style>
</head>
<body>
  <div id="content" style="margin-left:0;max-width:700px;margin:40px auto;">
    <h1>&#128196; Markdown Files</h1>
    <p style="margin-bottom:24px;color:#8b949e;">Select a file to preview:</p>
    <ul class="file-picker">
      ${fileListHtml}
    </ul>
  </div>
</body>
</html>`;
}

function renderFilePage(title: string, styles: string, _initialContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - markview</title>
  <style>${styles}</style>
</head>
<body>
  <nav id="toc-sidebar">
    <h2>Table of Contents</h2>
    <ul id="toc-list"></ul>
  </nav>
  <div id="content"></div>
  <div id="reload-indicator">Updated</div>

  <script>
  (function() {
    // ---- Markdown Parser ----
    function parseMarkdown(src) {
      var lines = src.split('\\n');
      var html = '';
      var i = 0;
      var inList = false;
      var listType = '';
      var inBlockquote = false;

      function inline(text) {
        // Images
        text = text.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1">');
        // Links
        text = text.replace(/\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');
        // Bold + italic
        text = text.replace(/\\*\\*\\*(.+?)\\*\\*\\*/g, '<strong><em>$1</em></strong>');
        // Bold
        text = text.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        // Italic
        text = text.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        // Inline code
        text = text.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
        return text;
      }

      function closeList() {
        if (inList) {
          html += '</' + listType + '>';
          inList = false;
          listType = '';
        }
      }

      function closeBlockquote() {
        if (inBlockquote) {
          html += '</blockquote>';
          inBlockquote = false;
        }
      }

      while (i < lines.length) {
        var line = lines[i];

        // Code blocks
        var codeMatch = line.match(/^\`\`\`(\\w*)/);
        if (codeMatch) {
          closeList();
          closeBlockquote();
          var lang = codeMatch[1] || '';
          var codeLines = [];
          i++;
          while (i < lines.length && !lines[i].match(/^\`\`\`\\s*$/)) {
            codeLines.push(lines[i]);
            i++;
          }
          i++; // skip closing backticks
          var codeContent = codeLines.join('\\n').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          var langLabel = lang ? '<span class="lang-label">' + lang + '</span>' : '';
          html += '<pre>' + langLabel + '<code>' + codeContent + '</code></pre>';
          continue;
        }

        // Horizontal rule
        if (/^(---|\\_\\_\\_|\\*\\*\\*)\\s*$/.test(line.trim())) {
          closeList();
          closeBlockquote();
          html += '<hr>';
          i++;
          continue;
        }

        // Headers
        var headerMatch = line.match(/^(#{1,6})\\s+(.+)/);
        if (headerMatch) {
          closeList();
          closeBlockquote();
          var level = headerMatch[1].length;
          var text = headerMatch[2];
          var id = text.toLowerCase().replace(/[^\\w\\s-]/g, '').replace(/\\s+/g, '-');
          html += '<h' + level + ' id="' + id + '">' + inline(text) + '</h' + level + '>';
          i++;
          continue;
        }

        // Table
        if (line.match(/^\\|.+\\|/) && i + 1 < lines.length && lines[i+1].match(/^\\|[\\s\\-:|]+\\|/)) {
          closeList();
          closeBlockquote();
          // Parse header
          var headers = line.split('|').filter(function(c){ return c.trim() !== ''; }).map(function(c){ return c.trim(); });
          i++; // skip separator
          // Parse alignment
          var aligns = lines[i].split('|').filter(function(c){ return c.trim() !== ''; }).map(function(c){
            var t = c.trim();
            if (t.startsWith(':') && t.endsWith(':')) return 'center';
            if (t.endsWith(':')) return 'right';
            return 'left';
          });
          i++;
          html += '<table><thead><tr>';
          for (var h = 0; h < headers.length; h++) {
            html += '<th style="text-align:' + (aligns[h]||'left') + '">' + inline(headers[h]) + '</th>';
          }
          html += '</tr></thead><tbody>';
          while (i < lines.length && lines[i].match(/^\\|.+\\|/)) {
            var cells = lines[i].split('|').filter(function(c){ return c.trim() !== ''; }).map(function(c){ return c.trim(); });
            html += '<tr>';
            for (var c = 0; c < cells.length; c++) {
              html += '<td style="text-align:' + (aligns[c]||'left') + '">' + inline(cells[c]) + '</td>';
            }
            html += '</tr>';
            i++;
          }
          html += '</tbody></table>';
          continue;
        }

        // Task list
        var taskMatch = line.match(/^\\s*-\\s+\\[([ xX])\\]\\s+(.*)/);
        if (taskMatch) {
          closeBlockquote();
          if (!inList || listType !== 'ul') {
            closeList();
            html += '<ul class="task-list">';
            inList = true;
            listType = 'ul';
          }
          var checked = taskMatch[1] !== ' ' ? ' checked disabled' : ' disabled';
          html += '<li><input type="checkbox"' + checked + '><span>' + inline(taskMatch[2]) + '</span></li>';
          i++;
          continue;
        }

        // Unordered list
        var ulMatch = line.match(/^\\s*[-*+]\\s+(.*)/);
        if (ulMatch && !taskMatch) {
          closeBlockquote();
          if (!inList || listType !== 'ul') {
            closeList();
            html += '<ul>';
            inList = true;
            listType = 'ul';
          }
          html += '<li>' + inline(ulMatch[1]) + '</li>';
          i++;
          continue;
        }

        // Ordered list
        var olMatch = line.match(/^\\s*\\d+\\.\\s+(.*)/);
        if (olMatch) {
          closeBlockquote();
          if (!inList || listType !== 'ol') {
            closeList();
            html += '<ol>';
            inList = true;
            listType = 'ol';
          }
          html += '<li>' + inline(olMatch[1]) + '</li>';
          i++;
          continue;
        }

        // Blockquote
        var bqMatch = line.match(/^>\\s?(.*)/);
        if (bqMatch) {
          closeList();
          if (!inBlockquote) {
            html += '<blockquote>';
            inBlockquote = true;
          }
          html += '<p>' + inline(bqMatch[1]) + '</p>';
          i++;
          continue;
        }

        // Empty line
        if (line.trim() === '') {
          closeList();
          closeBlockquote();
          i++;
          continue;
        }

        // Paragraph
        closeList();
        closeBlockquote();
        html += '<p>' + inline(line) + '</p>';
        i++;
      }

      closeList();
      closeBlockquote();
      return html;
    }

    // ---- TOC Generation ----
    function buildToc() {
      var headings = document.querySelectorAll('#content h1, #content h2, #content h3, #content h4');
      var tocList = document.getElementById('toc-list');
      if (!tocList) return;
      tocList.innerHTML = '';
      headings.forEach(function(h) {
        var level = parseInt(h.tagName.charAt(1));
        var li = document.createElement('li');
        li.className = 'toc-h' + level;
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        tocList.appendChild(li);
      });
    }

    // ---- Render ----
    function render(markdown) {
      var content = document.getElementById('content');
      if (content) {
        content.innerHTML = parseMarkdown(markdown);
        buildToc();
      }
    }

    // ---- SSE live reload ----
    var evtSource = new EventSource('/sse');
    evtSource.addEventListener('update', function(e) {
      render(e.data);
      var indicator = document.getElementById('reload-indicator');
      if (indicator) {
        indicator.classList.add('show');
        setTimeout(function() { indicator.classList.remove('show'); }, 1500);
      }
    });

    evtSource.addEventListener('init', function(e) {
      render(e.data);
    });

    // Fetch initial content
    fetch('/raw').then(function(r){ return r.text(); }).then(render);
  })();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
