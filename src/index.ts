#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import { startServer } from "./server";

interface CLIOptions {
  target: string;
  port: number;
  theme: "dark" | "light";
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    target: ".",
    port: 3467,
    theme: "dark",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--port" && args[i + 1]) {
      options.port = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === "--theme" && args[i + 1]) {
      const t = args[i + 1];
      if (t === "dark" || t === "light") {
        options.theme = t;
      }
      i++;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith("--")) {
      options.target = arg;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
markview - Live Markdown preview in the browser

Usage:
  markview [file.md]          Preview a single Markdown file
  markview [directory]        Preview all .md files in directory (file picker)
  markview .                  Preview all .md files in current directory

Options:
  --port <number>    Port to serve on (default: 3467)
  --theme <name>     Theme: dark or light (default: dark)
  -h, --help         Show this help message

Examples:
  markview README.md
  markview README.md --port 4000
  markview . --theme light
  markview /path/to/docs/
`);
}

function main(): void {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  const resolved = path.resolve(options.target);

  if (!fs.existsSync(resolved)) {
    console.error(`Error: "${resolved}" does not exist.`);
    process.exit(1);
  }

  const stat = fs.statSync(resolved);

  if (stat.isDirectory()) {
    startServer({
      mode: "directory",
      targetPath: resolved,
      port: options.port,
      theme: options.theme,
    });
    return;
  }

  if (stat.isFile() && resolved.endsWith(".md")) {
    startServer({
      mode: "file",
      targetPath: resolved,
      port: options.port,
      theme: options.theme,
    });
    return;
  }

  console.error(`Error: "${resolved}" is not a Markdown file or directory.`);
  process.exit(1);
}

main();
