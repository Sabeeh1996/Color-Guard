# Contributing to ColorGuard

First off, thank you for considering contributing to ColorGuard! It's people like you who make ColorGuard such a great tool for accessibility.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by respect, inclusivity, and professionalism. By participating, you are expected to uphold these values.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome diverse perspectives and experiences
- **Be collaborative**: Work together towards common goals
- **Be constructive**: Provide helpful feedback and accept it gracefully

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/Sabeeh1996/Color-Guard/issues) to avoid duplicates.

When you create a bug report, include:
- **Clear title**: Descriptive summary of the issue
- **Steps to reproduce**: Detailed steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots
- **Environment**: Browser version, OS, extension version
- **Console logs**: Any error messages from DevTools console

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/Sabeeh1996/Color-Guard/issues). When creating an enhancement suggestion, include:

- **Clear title**: Descriptive summary of the enhancement
- **Detailed description**: Explain the feature and its benefits
- **Use cases**: Describe scenarios where this would be useful
- **Mockups**: If applicable, include visual mockups or diagrams
- **Alternatives**: Mention any alternative solutions you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guidelines
3. **Test thoroughly** on multiple websites
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Open a pull request** with a detailed description

## Development Setup

### Prerequisites

- Google Chrome (v88+) or Chromium-based browser
- Git
- Code editor (VS Code recommended)

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Color-Guard.git
   cd Color-Guard
   ```

2. **Load the extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `Color Guard` folder

3. **Make changes**
   - Edit the source files
   - Reload the extension in `chrome://extensions/` after changes
   - Test on various websites

### Testing

Test your changes on diverse websites:
- **Content-heavy**: Wikipedia, Medium, Reddit
- **Web apps**: Gmail, GitHub, Twitter
- **E-commerce**: Amazon, eBay
- **Media**: YouTube, Netflix (where applicable)

**Test scenarios**:
- Toggle modes rapidly to check for memory leaks
- Test keyboard shortcuts
- Test on pages with complex layouts
- Test with DevTools console for errors
- Test whitelist/blacklist functionality

### File Structure

```
Color Guard/
├── manifest.json          # Extension configuration
├── service-worker.js      # Background script
├── contentScript.js       # Main content script
├── overlay.js             # Overlay module
├── overlay.css            # Overlay styles
├── popup.html/js          # Popup UI
├── options.html/js        # Options page
├── icons/                 # Extension icons
└── docs/                  # Documentation files
```

## Submitting Changes

### Commit Messages

Follow these guidelines for commit messages:

- **Format**: `<type>: <subject>`
- **Types**:
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation changes
  - `style:` Code style changes (formatting, no logic change)
  - `refactor:` Code refactoring
  - `test:` Adding or updating tests
  - `chore:` Maintenance tasks

**Examples**:
```
feat: Add tritanopia color-blind mode
fix: Resolve edge detection on dynamic content
docs: Update installation instructions
refactor: Simplify CSS filter application logic
```

### Pull Request Process

1. **Update documentation** for any user-facing changes
2. **Add tests** if applicable
3. **Ensure no console errors** in DevTools
4. **Update README.md** with new features or changes
5. **Link related issues** in PR description

**PR Description Template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
Describe how you tested these changes

## Screenshots
If applicable, add screenshots

## Related Issues
Fixes #123
```

## Style Guidelines

### JavaScript Style

- **ES6+**: Use modern JavaScript features
- **Semicolons**: Use semicolons
- **Quotes**: Single quotes for strings
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: JSDoc style for functions
- **Indentation**: 2 spaces

**Example**:
```javascript
/**
 * Apply CSS filter to document
 * @param {Object} settings - User settings
 * @returns {boolean} Success status
 */
function applyFilter(settings) {
  const filterValue = `contrast(${settings.contrast})`;
  document.documentElement.style.filter = filterValue;
  return true;
}
```

### CSS Style

- **BEM notation** where applicable
- **Kebab-case** for class names
- **Mobile-first** approach
- **Comments** for complex selectors

### Documentation

- Use **Markdown** for all documentation
- Keep lines under **80-100 characters**
- Use **clear headings** and structure
- Include **code examples** where helpful

## Community

### Get Help

- 📖 **Read the docs**: Check [README.md](./README.md) and [Wiki](https://github.com/Sabeeh1996/Color-Guard/wiki)
- 💬 **Join discussions**: [GitHub Discussions](https://github.com/Sabeeh1996/Color-Guard/discussions)
- 📧 **Email**: sabeeh.colorguard@gmail.com

### Recognition

Contributors will be:
- Listed in the [Contributors section](https://github.com/Sabeeh1996/Color-Guard/graphs/contributors)
- Acknowledged in release notes for significant contributions
- Appreciated in our README for ongoing contributions

---

## Questions?

Don't hesitate to ask! Open an issue or discussion if you have questions about contributing.

**Thank you for making the web more accessible! 🎉**
