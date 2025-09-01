# CantSee - Braille Website

A revolutionary website designed specifically for blind people with complete darkness theme and Braille translation.

## Features

- 🌑 **Complete Dark Mode** - 100% black design
- 🔤 **Real-time Braille Translator** - English ↔ Braille conversion
- 🎵 **Audio Navigation** - Sound effects on hover
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Railway/Vercel Ready** - Easy deployment

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server  
npm start
```

## Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `package.json` and deploy
3. Set PORT environment variable (Railway does this automatically)

### Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically build and deploy
3. Static files are served directly

## File Structure

```
├── index.html          # Main page
├── translator.html     # Braille translator page
├── styles.css          # All styles
├── script.js          # Main page functionality
├── translator.js      # Translator functionality
├── package.json       # Node.js configuration
├── railway.json       # Railway deployment config
└── vercel.json        # Vercel deployment config
```

## Browser Support

- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Screen readers compatible

---

Made with ❤️ and complete darkness by CantSee Team
