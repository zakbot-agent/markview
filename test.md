# Markview Test Document

This is a **test document** to verify that the *Markdown parser* renders correctly.

## Text Formatting

This is **bold text**, this is *italic text*, and this is ***bold italic***.
Here is some `inline code` in a paragraph.

## Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

greet("World");
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))
```

## Links and Images

Check out [GitHub](https://github.com) for more info.

Here is an image: ![Placeholder](https://via.placeholder.com/400x200)

## Lists

### Unordered List

- First item
- Second item
- Third item
- Fourth item

### Ordered List

1. Step one
2. Step two
3. Step three
4. Step four

### Task List

- [x] Setup project structure
- [x] Write markdown parser
- [ ] Add syntax highlighting
- [ ] Write documentation

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

> Another quote with **bold** and *italic* text.

## Tables

| Feature | Status | Notes |
|---------|:------:|------:|
| Headers | Done | All levels |
| Bold/Italic | Done | Combined too |
| Code blocks | Done | With lang labels |
| Tables | Done | With alignment |
| Task lists | Done | Checkboxes |

## Horizontal Rule

---

## Nested Content

Here is a paragraph with a [link](https://example.com), some **bold**, *italic*, and `code` all together.

### Sub-section

More content under a sub-section to test the table of contents sidebar navigation.

#### Deep Section

Even deeper nesting for TOC testing.

## Final Section

This document tests all supported Markdown features. Edit this file and watch the browser auto-refresh!
