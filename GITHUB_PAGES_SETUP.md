# GitHub Pages Setup Guide

Your GitHub Pages website has been created! Follow these steps to enable it:

## Enable GitHub Pages

1. Go to your repository: https://github.com/Sabeeh1996/Color-Guard

2. Click on **Settings** (top navigation)

3. In the left sidebar, click **Pages**

4. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` and `/docs` folder
   - Click **Save**

5. Wait 1-2 minutes for deployment

6. Your site will be live at: **https://sabeeh1996.github.io/Color-Guard/**

## What's Included

### Website Features
- ✅ Professional landing page with hero section
- ✅ Features showcase with icons
- ✅ "How It Works" section with 3-step guide
- ✅ Installation instructions
- ✅ Support and sponsorship section
- ✅ FAQ section
- ✅ Responsive design (mobile-friendly)
- ✅ Smooth animations and transitions
- ✅ Social media links
- ✅ Footer with multiple resource links

### Files Created
- `docs/index.html` - Main landing page
- `docs/styles.css` - Beautiful styling with gradient hero
- `docs/script.js` - Interactive features and animations
- `docs/_config.yml` - Jekyll configuration

## Optional Enhancements

### Add a Screenshot
1. Take a screenshot of your extension in action
2. Save it as `screenshot.png` in the `docs/` folder
3. Commit and push: 
   ```bash
   git add docs/screenshot.png
   git commit -m "Add extension screenshot"
   git push
   ```

### Add Google Analytics (Optional)
Edit `docs/_config.yml` and add your tracking ID:
```yaml
google_analytics: UA-XXXXXXXXX-X
```

### Custom Domain (Optional)
1. Add a file named `CNAME` in the `docs/` folder
2. Content: your-domain.com
3. Configure DNS with your domain provider

## Testing

After enabling GitHub Pages:
1. Visit https://sabeeh1996.github.io/Color-Guard/
2. Test all navigation links
3. Test on mobile devices
4. Share the link!

## Troubleshooting

**404 Error?**
- Wait 2-3 minutes after enabling Pages
- Check that branch is set to `main` and folder to `/docs`
- Refresh your browser cache (Ctrl+Shift+R)

**CSS Not Loading?**
- Check that all files are in the `docs/` folder
- Verify file names are lowercase
- Clear browser cache

**Need Help?**
Open an issue on GitHub: https://github.com/Sabeeh1996/Color-Guard/issues
