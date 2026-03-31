import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { FileWatcher } from "./watcher";
import { renderPage } from "./renderer";

interface ServerOptions {
  mode: "file" | "directory";
  targetPath: string;
  port: number;
  theme: "dark" | "light";
}

export function startServer(opts: ServerOptions): void {
  const sseClients: Set<http.ServerResponse> = new Set();
  const watcher = new FileWatcher((filePath: string) => {
    // Notify all SSE clients
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const escaped = content.replace(/\n/g, "\\n").replace(/\r/g, "");
      for (const client of sseClients) {
        client.write(`event: update\ndata: ${escaped}\n\n`);
      }
    } catch {
      // File might have been deleted
    }
  });

  // Set up watching
  if (opts.mode === "file") {
    watcher.watchFile(opts.targetPath);
  } else {
    watcher.watchDirectory(opts.targetPath);
  }

  // Track currently viewed file for SSE
  let currentFile = opts.mode === "file" ? opts.targetPath : "";

  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${opts.port}`);
    const pathname = url.pathname;

    // Directory mode: file picker
    if (opts.mode === "directory" && pathname === "/") {
      const files = watcher.findMarkdownFiles(opts.targetPath).map((f) =>
        path.relative(opts.targetPath, f)
      );
      const html = renderPage({
        title: path.basename(opts.targetPath),
        theme: opts.theme,
        mode: "directory",
        files,
      });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    // Directory mode: view specific file
    if (opts.mode === "directory" && pathname.startsWith("/view/")) {
      const fileName = decodeURIComponent(pathname.slice(6));
      const filePath = path.join(opts.targetPath, fileName);

      if (!fs.existsSync(filePath) || !filePath.startsWith(opts.targetPath)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
        return;
      }

      currentFile = filePath;
      watcher.watchFile(filePath);

      const html = renderPage({
        title: fileName,
        theme: opts.theme,
        mode: "file",
        initialContent: fs.readFileSync(filePath, "utf-8"),
      });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    // Single file mode: main page
    if (pathname === "/") {
      const html = renderPage({
        title: path.basename(opts.targetPath),
        theme: opts.theme,
        mode: "file",
        initialContent: fs.readFileSync(opts.targetPath, "utf-8"),
      });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    // Raw markdown content
    if (pathname === "/raw") {
      const file = currentFile || opts.targetPath;
      try {
        const content = fs.readFileSync(file, "utf-8");
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(content);
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      }
      return;
    }

    // SSE endpoint
    if (pathname === "/sse") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      // Send initial content
      const file = currentFile || opts.targetPath;
      try {
        const content = fs.readFileSync(file, "utf-8");
        const escaped = content.replace(/\n/g, "\\n").replace(/\r/g, "");
        res.write(`event: init\ndata: ${escaped}\n\n`);
      } catch {
        // Ignore
      }

      sseClients.add(res);

      req.on("close", () => {
        sseClients.delete(res);
      });
      return;
    }

    // 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  server.listen(opts.port, () => {
    const target =
      opts.mode === "file"
        ? path.basename(opts.targetPath)
        : opts.targetPath;
    console.log(`\n  markview is running!\n`);
    console.log(`  Preview: http://localhost:${opts.port}`);
    console.log(`  Target:  ${target}`);
    console.log(`  Theme:   ${opts.theme}`);
    console.log(`  Mode:    ${opts.mode}\n`);
    console.log(`  Press Ctrl+C to stop.\n`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\nShutting down...");
    watcher.close();
    for (const client of sseClients) {
      client.end();
    }
    server.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
