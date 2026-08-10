# Watershifts

A polished, responsive static website for GitHub Pages.

## Features
- Watershifts branded home page and custom SVG logo
- About page for Dr. Nafiseh Salehi Siavashani
- Books & articles section, including "Hydrogeology of Plains and Fractals in Geology"
- Sayareyema source links
- Scientific video/media section
- Photo wall
- Interactive hydrogeology glossary
- Daily science question
- Sign up / sign in / log out
- Three-day browser session
- Support page visible only while signed in
- Responsive mobile navigation
- No build step: plain HTML/CSS/JS

## GitHub Pages
Upload `index.html`, `styles.css`, `app.js`, and `assets/` to the root of a GitHub repository. Enable GitHub Pages from the repository's Pages settings and deploy from the main branch/root.

## Important authentication note
GitHub Pages is static hosting and has no server-side database or authentication service. Therefore this implementation provides a fully working **browser-local account/session system** using Web Crypto SHA-256 password hashes and localStorage. Accounts are not shared between browsers/devices and this must not be used for sensitive/private accounts.

The session expires after 3 days or immediately on logout.

For production multi-device authentication, connect the same UI to a real authentication/backend provider.
