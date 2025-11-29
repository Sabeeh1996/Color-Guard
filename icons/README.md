# ColorGuard Icon Placeholders

This directory should contain the following icon files for the extension:

- `icon16.png` - 16x16px (toolbar icon)
- `icon32.png` - 32x32px (extension management)
- `icon48.png` - 48x48px (extension management)
- `icon128.png` - 128x128px (Chrome Web Store)

## Creating Icons

You can create icons using any graphic design tool. The icon should represent accessibility and protection:

**Recommended design elements:**
- Shield shape (representing protection/guard)
- Eye symbol (representing vision/visibility)
- Colorful elements (representing color accessibility)
- High contrast design

## Quick Solution: Generate with Online Tools

Visit these free icon generators:
1. **Figma/Canva** - Design custom icons
2. **Favicon.io** - Generate from text or image
3. **RealFaviconGenerator.net** - Create all sizes at once

## Temporary Placeholder

Until you create custom icons, you can use a solid color square or generate simple SVG icons.

### Example: Generate with ImageMagick

If you have ImageMagick installed:

```bash
# Create a simple colored square with shield emoji
convert -size 128x128 xc:#1a73e8 -pointsize 96 -gravity center -fill white -annotate +0+0 "🛡" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 32x32 icon32.png
convert icon128.png -resize 16x16 icon16.png
```

### Example: Generate with PowerShell (Windows)

Create a simple solid color placeholder:

```powershell
Add-Type -AssemblyName System.Drawing

$sizes = @(16, 32, 48, 128)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.Clear([System.Drawing.Color]::FromArgb(26, 115, 232))
    $bmp.Save("icon$size.png")
    $graphics.Dispose()
    $bmp.Dispose()
}
```

## Note

The extension will load correctly with placeholder icons. Replace them with proper designs before publishing to Chrome Web Store.
