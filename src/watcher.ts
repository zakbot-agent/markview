import * as fs from "fs";
import * as path from "path";

type ChangeCallback = (filePath: string) => void;

export class FileWatcher {
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private callback: ChangeCallback;
  private debounceMs: number;

  constructor(callback: ChangeCallback, debounceMs: number = 150) {
    this.callback = callback;
    this.debounceMs = debounceMs;
  }

  watchFile(filePath: string): void {
    if (this.watchers.has(filePath)) return;

    try {
      const watcher = fs.watch(filePath, (_event) => {
        const existing = this.debounceTimers.get(filePath);
        if (existing) clearTimeout(existing);

        const timer = setTimeout(() => {
          this.debounceTimers.delete(filePath);
          this.callback(filePath);
        }, this.debounceMs);

        this.debounceTimers.set(filePath, timer);
      });

      this.watchers.set(filePath, watcher);
    } catch {
      // File might have been deleted
    }
  }

  watchDirectory(dirPath: string): void {
    const mdFiles = this.findMarkdownFiles(dirPath);
    for (const file of mdFiles) {
      this.watchFile(file);
    }

    try {
      const dirWatcher = fs.watch(dirPath, (_event, filename) => {
        if (filename && filename.endsWith(".md")) {
          const fullPath = path.join(dirPath, filename);
          if (fs.existsSync(fullPath)) {
            this.watchFile(fullPath);
          }
          const existing = this.debounceTimers.get(fullPath);
          if (existing) clearTimeout(existing);
          const timer = setTimeout(() => {
            this.debounceTimers.delete(fullPath);
            this.callback(fullPath);
          }, this.debounceMs);
          this.debounceTimers.set(fullPath, timer);
        }
      });
      this.watchers.set(dirPath, dirWatcher);
    } catch {
      // Directory might not be watchable
    }
  }

  findMarkdownFiles(dirPath: string): string[] {
    const files: string[] = [];
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith(".md")) {
          files.push(path.join(dirPath, entry.name));
        }
      }
    } catch {
      // Directory might not be readable
    }
    return files;
  }

  close(): void {
    for (const [, watcher] of this.watchers) {
      watcher.close();
    }
    this.watchers.clear();
    for (const [, timer] of this.debounceTimers) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}
