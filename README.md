# markview

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)

> Live Markdown preview in the browser with hot reload

## Features

- CLI tool
- TypeScript support

## Tech Stack

**Runtime:**
- TypeScript

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

```bash
cd markview
npm install
```

Or install globally:

```bash
npm install -g markview
```

## Usage

### CLI

```bash
markview
```

### Available Scripts

| Script | Command |
|--------|---------|
| `npm run build` | `tsc` |
| `npm run start` | `node dist/index.js` |

## Project Structure

```
├── src
│   ├── formatter.ts
│   ├── index.ts
│   ├── renderer.ts
│   ├── server.ts
│   └── watcher.ts
├── package.json
├── README.md
├── test.md
└── tsconfig.json
```

## License

This project is licensed under the **MIT** license.

## Author

**Zakaria Kone**
