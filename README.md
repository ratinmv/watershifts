# 🌊 Watershifts

**Hydrogeology Research & Education Platform**

A modern, responsive web application dedicated to hydrogeological research and education, featuring the work of Dr. Nafiseh Salehi Siavashani.

## 📋 Features

### Core Pages
- **Home** - Welcome and featured sections
- **About Me** - Dr. Nafiseh Salehi Siavashani's profile and expertise
- **Books & Articles** - Published research and academic works
- **Resources** - Curated reading materials and references
- **Media** - Videos and photography gallery
- **Support** - Contact and community support (members only)

### Authentication System
- **User Registration** - Create an account with email and password
- **User Login** - Secure login with session management
- **3-Day Sessions** - Automatic session expiration after 3 days
- **User Profiles** - Manage profile information and interests
- **Protected Pages** - Support page accessible only to logged-in users

### Technical Features
- Single Page Application (SPA) with hash-based routing
- Responsive design (mobile, tablet, desktop)
- Session persistence using localStorage
- Professional styling with custom design system
- No external dependencies (pure HTML, CSS, JavaScript)
- GitHub Pages compatible

## 🎨 Design Highlights

- **Color Scheme**: Professional blue palette with accent colors
- **Typography**: Clean, modern font stack
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Semantic HTML and WCAG compliance
- **Responsive**: Fully mobile-friendly layout

## 🔐 Security Notes

**For Demo/Development Only:**
- Passwords are hashed locally (not production-grade)
- User data stored in browser localStorage
- For production, implement proper backend authentication
- Use HTTPS and secure session management

## 📁 File Structure

```
watershifts-site/
├── index.html          # Main HTML file
├── styles.css          # Complete stylesheet
├── app.js              # Main application logic
├── auth.js             # Authentication & session management
├── _config.yml         # GitHub Pages configuration
└── README.md           # This file
```

## 🚀 Deployment to GitHub Pages

1. **Fork or create a new repository** named `USERNAME.github.io`

2. **Upload the files:**
   - Copy all files from `watershifts-site/` to your repository root

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose the `main` branch

4. **Access your site:**
   - Visit `https://USERNAME.github.io`

### Alternative: Deploy to a Project Repository

1. Create a repository (e.g., `watershifts`)
2. Upload files to the `docs/` folder
3. In Settings → Pages, select `docs/` as the source

Then access it at: `https://USERNAME.github.io/watershifts`

## 💾 Session Management

- **Duration**: 3 days (259,200,000 milliseconds)
- **Storage**: Browser localStorage
- **Auto-renewal**: Session extends on each login activity
- **Expiration**: Automatic logout after 3 days without login
- **Logout**: Manual logout through the UI button

### Session Info Available to Users
- Current session expiry time displayed in navbar
- Time remaining countdown (e.g., "2d 15h remaining")
- Automatic redirect to login if session expires

## 🎓 Content Management

### To Update Content:
1. Edit `app.js` to modify page content
2. Update author/researcher information in the `renderAbout()` function
3. Modify book/article lists in `renderBooks()` function
4. Update resource links in `renderResources()` function

### External Links:
- **Main Website**: https://sayareyema.com
- **YouTube Channel**: https://www.youtube.com/@sayareyema

## 🛠️ Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #2E5FA3;
    --accent-color: #1ABC9C;
    /* ... other colors */
}
```

### Logo
Change the logo emoji and icon in `index.html` and `renderNavbar()`:
```html
<div class="logo-icon">💧</div>
```

### Navigation Menu
Update menu items in the `renderNavbar()` function in `app.js`

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

© 2024 Watershifts. All rights reserved.

For more information, visit [sayareyema.com](https://sayareyema.com)

## 👤 Credits

**Founder & Researcher**: Dr. Nafiseh Salehi Siavashani  
**Platform**: Watershifts - Hydrogeology Research & Education

---

**Questions or Support?**
- Visit: https://sayareyema.com
- YouTube: https://www.youtube.com/@sayareyema
- Check the Support page after logging in
