# ProofOfMeme Customization Guide

## 🎨 Custom Assets

This guide shows how to replace the default assets with your own custom files.

### 📁 File Locations

All custom assets are located in the `public/` folder:

```
public/
├── images/
│   ├── background.png    # Replace with your background image
│   └── logo.png          # Replace with your logo
└── audio/
    └── background-music.mp3  # Replace with your background music
```

## 🖼️ Background Image

**File:** `public/images/background.png`

**Requirements:**
- Format: PNG
- Recommended size: 1920x1080 or larger
- Should work well with dark overlay
- File size: Under 2MB for fast loading

**How to replace:**
1. Delete the placeholder file: `public/images/background.png`
2. Add your own `background.png` file to `public/images/`
3. Refresh the browser

## 🏷️ Logo

**File:** `public/images/logo.png`

**Requirements:**
- Format: PNG with transparency
- Recommended size: 200x60 (width x height)
- Should look good on both light and dark backgrounds
- File size: Under 500KB

**How to replace:**
1. Delete the placeholder file: `public/images/logo.png`
2. Add your own `logo.png` file to `public/images/`
3. Refresh the browser

**Fallback:** If your logo doesn't load, the Bitcoin icon will be shown automatically.

## 🎵 Background Music

**File:** `public/audio/background-music.mp3`

**Requirements:**
- Format: MP3
- Recommended duration: 2-3 minutes (will loop automatically)
- File size: Under 5MB for fast loading
- Should be instrumental or ambient (no vocals recommended)

**How to replace:**
1. Delete the placeholder file: `public/audio/background-music.mp3`
2. Add your own `background-music.mp3` file to `public/audio/`
3. Refresh the browser

**Music Controls:**
- 🎵 Button in bottom-right corner
- Volume slider (0-100%)
- Play/Pause toggle
- Auto-loop when finished

## 🎛️ Additional Customization

### Colors
The main theme colors are defined in `tailwind.config.js`:
- Primary: Orange (#fb923c)
- Secondary: Yellow (#fbbf24)
- Background: Dark with blur effects

### Typography
The font is a modern sans-serif with gradient text effects for the main title.

## 🚀 Quick Start

1. **Replace all three files** with your custom assets
2. **Refresh the browser** to see changes
3. **Test the music controls** in the bottom-right corner
4. **Enjoy your customized ProofOfMeme!**

## 📱 Mobile Compatibility

All assets are optimized for mobile:
- Background image covers full screen
- Logo scales appropriately
- Music controls are accessible on all devices

## 🔧 Troubleshooting

**Background not showing?**
- Check file path: `/images/background.png`
- Ensure file is in `public/images/` folder
- Refresh browser cache (Ctrl+F5)

**Logo not showing?**
- Check file path: `/images/logo.png`
- Ensure PNG format with transparency
- Check file size (under 500KB)

**Music not playing?**
- Check file path: `/audio/background-music.mp3`
- Ensure MP3 format
- Click the music button to start (browser may block autoplay)

## 🎨 Design Tips

1. **Background:** Use high-contrast images that work with dark overlay
2. **Logo:** Simple designs work best with transparent backgrounds
3. **Music:** Choose ambient tracks that don't distract from the interface

Need help? Check the browser console for any error messages!
