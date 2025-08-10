# Vimal Kumar Yadav - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and modern design patterns. Features multiple themes, smooth animations, and auto-scrolling navigation.

## Features

✨ **Multi-Theme Support**: 6 beautiful themes (Light, Dark, Blue, Purple, Green, Orange)
📱 **Responsive Design**: Optimized for all devices and screen sizes
🎨 **Modern UI**: Clean design with smooth animations and transitions
📷 **Profile Photo**: Customizable profile photo with editing capability
🔗 **Auto-Scroll Navigation**: Smooth scrolling between sections
⚡ **Fast Loading**: Optimized performance with modern build tools
🎯 **Professional Sections**: Hero, About, Experience, Skills, Education, Contact

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Font Awesome, Devicons
- **Deployment**: GitHub Pages

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vimalkumaryadav/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Visit `http://localhost:5000`

## Customization

### Personal Information
Edit `client/src/data/portfolioData.ts` to update:
- Personal details (name, email, phone, location)
- Professional experience
- Skills and technologies
- Education information
- Social media links

### Profile Photo
- Replace the placeholder in `portfolioData.personal.photo`
- Supported formats: JPG, PNG, WebP
- Recommended size: 300x300px (square aspect ratio)

### Themes
The website includes 6 pre-built themes:
- **Light**: Clean and professional
- **Dark**: Modern dark mode
- **Blue**: Corporate and trustworthy
- **Purple**: Creative and innovative
- **Green**: Natural and eco-friendly
- **Orange**: Energetic and vibrant

### Color Customization
Modify theme colors in `client/src/index.css`:
```css
[data-theme="custom"] {
  --primary-color: hsl(your-hue, saturation%, lightness%);
  --secondary-color: hsl(your-hue, saturation%, lightness%);
  /* ... other color variables */
}
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Fork this repository** to your GitHub account

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Select "GitHub Actions" as the source

3. **Update personal information**:
   - Edit `client/src/data/portfolioData.ts`
   - Commit and push changes

4. **Automatic deployment**:
   - Every push to `main` branch triggers deployment
   - Your site will be available at: `https://yourusername.github.io/portfolio`

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build:client
   ```

2. **Deploy to GitHub Pages**:
   - Upload the `client/dist` folder to your repository's `gh-pages` branch
   - Or use GitHub Desktop/command line to push the built files

### Custom Domain (Optional)

1. **Add CNAME file** in `client/public/CNAME`:
   ```
   yourdomain.com
   ```

2. **Configure DNS** with your domain provider:
   - Point your domain to: `yourusername.github.io`

## Project Structure

```
portfolio/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── data/          # Portfolio data
│   │   ├── pages/         # Route pages
│   │   └── index.css      # Global styles & themes
│   └── public/            # Static assets
├── server/                # Backend (optional)
├── .github/workflows/     # GitHub Actions
└── README.md
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance

- ⚡ First Contentful Paint: < 1.5s
- ⚡ Largest Contentful Paint: < 2.5s
- ⚡ Cumulative Layout Shift: < 0.1
- ⚡ First Input Delay: < 100ms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this template for your own portfolio!

## Support

Having issues? Check these common solutions:

**Build fails**: Ensure Node.js 18+ is installed
**Images not loading**: Check file paths and formats
**Styles not applying**: Clear browser cache
**Deployment issues**: Verify GitHub Pages settings

For additional help, open an issue on GitHub.

---

**Live Demo**: [View Portfolio](https://vimalkumaryadav.github.io/portfolio)
**Author**: Vimal Kumar Yadav
**Last Updated**: January 2025