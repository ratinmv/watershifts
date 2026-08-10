/**
 * WATERSHIFTS - Main Application
 * Single Page Application with hash-based routing
 */

class WatershiftsApp {
    constructor() {
        this.app = document.getElementById('app');
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
        window.addEventListener('hashchange', () => this.render());
        window.addEventListener('auth-changed', () => this.render());
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-nav]')) {
                const page = e.target.closest('[data-nav]').dataset.nav;
                window.location.hash = page;
                e.preventDefault();
            }
        });
    }

    getCurrentPage() {
        const hash = window.location.hash.slice(1) || 'home';
        return hash;
    }

    render() {
        this.currentPage = this.getCurrentPage();
        const isAuthenticated = authManager.isAuthenticated();
        const user = authManager.getCurrentUser();

        let content = '';

        switch (this.currentPage) {
            case 'about':
                content = this.renderAbout();
                break;
            case 'books':
                content = this.renderBooks();
                break;
            case 'resources':
                content = this.renderResources();
                break;
            case 'media':
                content = this.renderMedia();
                break;
            case 'support':
                if (!isAuthenticated) {
                    content = this.renderLoginFirst();
                } else {
                    content = this.renderSupport();
                }
                break;
            case 'login':
                if (isAuthenticated) {
                    window.location.hash = 'home';
                    return;
                }
                content = this.renderLogin();
                break;
            case 'signup':
                if (isAuthenticated) {
                    window.location.hash = 'home';
                    return;
                }
                content = this.renderSignup();
                break;
            case 'profile':
                if (!isAuthenticated) {
                    window.location.hash = 'login';
                    return;
                }
                content = this.renderProfile();
                break;
            default:
                content = this.renderHome();
        }

        this.app.innerHTML = this.renderNavbar() + content + this.renderFooter();
        this.attachEventHandlers();
    }

    renderNavbar() {
        const isAuthenticated = authManager.isAuthenticated();
        const user = authManager.getCurrentUser();
        const sessionExpiry = authManager.formatTimeRemaining();

        let authButtons = '';

        if (isAuthenticated) {
            authButtons = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="user-info">
                        <div>${user.fullName}</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">${sessionExpiry}</div>
                    </div>
                    <a href="#profile" class="btn btn-outline" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Profile</a>
                    <button class="btn btn-logout" id="logoutBtn" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Logout</button>
                </div>
            `;
        } else {
            authButtons = `
                <div class="auth-buttons">
                    <a href="#login" class="btn btn-outline">Sign In</a>
                    <a href="#signup" class="btn btn-primary">Sign Up</a>
                </div>
            `;
        }

        const supportLink = isAuthenticated ? `<a data-nav="support" class="navbar-menu-link">Support</a>` : '';

        return `
            <nav class="navbar">
                <div class="navbar-container">
                    <a class="navbar-brand" data-nav="home">
                        <div class="logo-icon">💧</div>
                        <span>Watershifts</span>
                    </a>
                    <ul class="navbar-menu">
                        <li><a data-nav="home">Home</a></li>
                        <li><a data-nav="about">About Me</a></li>
                        <li><a data-nav="books">Books & Articles</a></li>
                        <li><a data-nav="resources">Resources</a></li>
                        <li><a data-nav="media">Media</a></li>
                        ${supportLink}
                    </ul>
                    <div class="auth-buttons">${authButtons}</div>
                </div>
            </nav>
        `;
    }

    renderHome() {
        const isAuthenticated = authManager.isAuthenticated();
        const user = authManager.getCurrentUser();

        return `
            <div class="page-container">
                <div class="hero">
                    <h1>Welcome to Watershifts</h1>
                    <p>Exploring Hydrogeology, Research, and Water Science with Dr. Nafiseh Salehi Siavashani</p>
                    <a href="#about" class="btn btn-primary">Learn More</a>
                    ${isAuthenticated ? `<p style="margin-top: 1rem; font-size: 0.95rem;">Hello, ${user.fullName}! 👋</p>` : ''}
                </div>

                <h2 style="margin-bottom: 2rem; color: var(--primary-color); font-size: 2rem;">Featured Sections</h2>

                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">👤 About Me</div>
                        <div class="card-content">
                            Discover the expertise and passion of Dr. Nafiseh Salehi Siavashani, a dedicated hydrogeologist and researcher.
                        </div>
                        <a href="#about" class="card-link">Read More →</a>
                    </div>

                    <div class="card">
                        <div class="card-header">📚 Books & Articles</div>
                        <div class="card-content">
                            Explore published works on hydrogeology, fractals in geology, and water science research.
                        </div>
                        <a href="#books" class="card-link">View Collection →</a>
                    </div>

                    <div class="card">
                        <div class="card-header">🔬 Resources</div>
                        <div class="card-content">
                            Access curated resources for reading, learning, and staying updated on hydrogeology topics.
                        </div>
                        <a href="#resources" class="card-link">Explore →</a>
                    </div>

                    <div class="card">
                        <div class="card-header">🎥 Videos & Photos</div>
                        <div class="card-content">
                            Watch scientific videos and explore photography from research and field work.
                        </div>
                        <a href="#media" class="card-link">View Gallery →</a>
                    </div>

                    <div class="card">
                        <div class="card-header">💬 Community</div>
                        <div class="card-content">
                            Connect with others interested in hydrogeology and water science research.
                        </div>
                        <a href="#${isAuthenticated ? 'support' : 'signup'}" class="card-link">Join Us →</a>
                    </div>

                    <div class="card">
                        <div class="card-header">🌐 Connect</div>
                        <div class="card-content">
                            Follow on social media and stay updated with the latest research and publications.
                        </div>
                        <a href="https://www.youtube.com/@sayareyema" target="_blank" class="card-link">Visit Channel →</a>
                    </div>
                </div>
            </div>
        `;
    }

    renderAbout() {
        return `
            <div class="page-container">
                <div class="about-container">
                    <div class="about-image"><img url="https://yt3.googleusercontent.com/PrBzqWYlPMkbMHUxAN0qA_ApRol9tZSAbeINewTRSlpB-NcDl4pkD8ZcQ1zDXnfv1TNDbvZraw=s160-c-k-c0x00ffffff-no-rj"><img></div>
                    <div class="about-text">
                        <h2>Dr. Nafiseh Salehi Siavashani</h2>
                        <p><strong>Hydrogeologist & Researcher</strong></p>
                        <p>
                            Dr. Nafiseh Salehi Siavashani is a dedicated hydrogeologist with extensive expertise in groundwater 
                            science, water resource management, and geological research. Her work focuses on understanding 
                            hydrogeological processes in plains and the application of fractal geometry to geological systems.
                        </p>
                        <p>
                            With a commitment to advancing water science and sharing knowledge, Dr. Salehi Siavashani continues 
                            to contribute to the field through research, publications, and educational content.
                        </p>
                        <div class="about-highlights">
                            <div class="highlight-item">
                                <strong>🎓 Education</strong>
                                Advanced degree in Hydrogeology
                            </div>
                            <div class="highlight-item">
                                <strong>🔬 Focus</strong>
                                Groundwater & Fractal Geology
                            </div>
                            <div class="highlight-item">
                                <strong>📊 Expertise</strong>
                                Water Resource Management
                            </div>
                            <div class="highlight-item">
                                <strong>✍️ Active</strong>
                                Publishing & Teaching
                            </div>
                        </div>
                    </div>
                </div>

                <hr style="margin: 3rem 0; border: none; border-top: 2px solid var(--border-color);">

                <div style="background: var(--light-bg); padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Research Areas</h3>
                    <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <li>✓ Hydrogeology of Plains</li>
                        <li>✓ Fractal Geometry in Geology</li>
                        <li>✓ Groundwater Flow Systems</li>
                        <li>✓ Water Resource Management</li>
                        <li>✓ Geological Mapping</li>
                        <li>✓ Environmental Hydrology</li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderBooks() {
        const books = [
            {
                title: "Hydrogeology of Plains",
                author: "Dr. Nafiseh Salehi Siavashani",
                description: "A comprehensive guide to understanding hydrogeological processes in plains regions. Explores groundwater systems, flow patterns, and practical applications.",
                type: "Book",
                year: "2023",
                source: "sayareyema.com"
            },
            {
                title: "Fractals in Geology: Applications and Analysis",
                author: "Dr. Nafiseh Salehi Siavashani",
                description: "An in-depth exploration of fractal geometry applications in geological sciences. Includes case studies and mathematical frameworks for geological analysis.",
                type: "Research Paper",
                year: "2023",
                source: "sayareyema.com"
            },
            {
                title: "Water Systems and Environmental Impact",
                author: "Dr. Nafiseh Salehi Siavashani",
                description: "Examines the relationship between water systems and environmental sustainability. Provides insights into water management and conservation strategies.",
                type: "Article",
                year: "2023",
                source: "sayareyema.com"
            },
            {
                title: "Groundwater Mapping and Analysis",
                author: "Dr. Nafiseh Salehi Siavashani",
                description: "Technical guide on modern approaches to groundwater mapping using advanced geological and technological methods.",
                type: "Technical Guide",
                year: "2022",
                source: "sayareyema.com"
            }
        ];

        let booksHTML = '<div class="resources-container">';
        books.forEach(book => {
            booksHTML += `
                <div class="resource-item">
                    <div class="resource-title">${book.title}</div>
                    <div class="resource-description">${book.description}</div>
                    <div class="resource-meta">
                        <span class="resource-tag">${book.type}</span>
                        <span class="resource-tag">${book.year}</span>
                        <span class="resource-tag">${book.source}</span>
                    </div>
                    <a href="https://sayareyema.com" target="_blank" class="external-link">Read More</a>
                </div>
            `;
        });
        booksHTML += '</div>';

        return `
            <div class="page-container">
                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">Books & Articles</h1>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 3rem;">
                    Publications and research materials by Dr. Nafiseh Salehi Siavashani
                </p>
                ${booksHTML}
                <div style="background: var(--light-bg); padding: 2rem; border-radius: 10px; margin-top: 2rem;">
                    <p style="text-align: center;">
                        <strong>Want to explore more?</strong><br>
                        Visit <a href="https://sayareyema.com" target="_blank" style="color: var(--primary-color); font-weight: 600;">sayareyema.com</a> for the complete collection.
                    </p>
                </div>
            </div>
        `;
    }

    renderResources() {
        const resources = [
            {
                title: "Hydrogeology Journal",
                description: "Curated articles and research papers on hydrogeological science and groundwater management.",
                tags: ["Reading", "Academic", "Hydrogeology"],
                link: "https://sayareyema.com"
            },
            {
                title: "Groundwater Research Database",
                description: "Comprehensive database of groundwater studies and geological surveys for plains regions.",
                tags: ["Reading", "Data", "Research"],
                link: "https://sayareyema.com"
            },
            {
                title: "Fractals & Geometry Collection",
                description: "Mathematical and geological resources on fractal geometry applications in earth sciences.",
                tags: ["Reading", "Mathematics", "Geology"],
                link: "https://sayareyema.com"
            },
            {
                title: "Water Science Blog",
                description: "Regular updates and insights on water science, environmental issues, and hydrogeological discoveries.",
                tags: ["Blog", "Updates", "Education"],
                link: "https://sayareyema.com"
            },
            {
                title: "Case Studies & Reports",
                description: "Field research reports and case studies from various hydrogeological investigations.",
                tags: ["Reports", "Case Studies", "Field Work"],
                link: "https://sayareyema.com"
            },
            {
                title: "Educational Webinars",
                description: "Recorded webinars and lectures on hydrogeology, water management, and geological research.",
                tags: ["Learning", "Video", "Education"],
                link: "https://sayareyema.com"
            }
        ];

        let resourcesHTML = '<div class="resources-container">';
        resources.forEach(resource => {
            const tagsHTML = resource.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('');
            resourcesHTML += `
                <div class="resource-item">
                    <div class="resource-title">${resource.title}</div>
                    <div class="resource-description">${resource.description}</div>
                    <div class="resource-meta">${tagsHTML}</div>
                    <a href="${resource.link}" target="_blank" class="external-link">Access Resource</a>
                </div>
            `;
        });
        resourcesHTML += '</div>';

        return `
            <div class="page-container">
                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">Resources for Reading</h1>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 3rem;">
                    Interesting and educational resources on hydrogeology and water science
                </p>
                ${resourcesHTML}
            </div>
        `;
    }

    renderMedia() {
        return `
            <div class="page-container">
                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">Videos & Photos</h1>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 3rem;">
                    Scientific videos and photographs from the Sayareyema YouTube channel
                </p>

                <div style="background: var(--light-bg); padding: 2rem; border-radius: 10px; margin-bottom: 3rem; text-align: center;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Subscribe to Our Channel</h3>
                    <p style="margin-bottom: 1.5rem;">
                        Watch scientific videos on hydrogeology, water science, and geological research.
                    </p>
                    <a href="https://www.youtube.com/@sayareyema" target="_blank" class="btn btn-primary">
                        Visit YouTube Channel
                    </a>
                </div>

                <h3 style="color: var(--primary-color); margin-bottom: 2rem;">Featured Videos</h3>
                <div class="media-grid">
                    ${this.generateMediaItem('Hydrogeology Basics', '🎥')}
                    ${this.generateMediaItem('Water Systems Overview', '🎥')}
                    ${this.generateMediaItem('Field Research Methods', '🎥')}
                    ${this.generateMediaItem('Geological Mapping', '🎥')}
                    ${this.generateMediaItem('Water Analysis', '🎥')}
                    ${this.generateMediaItem('Field Work Gallery', '📷')}
                </div>

                <div style="margin-top: 3rem; background: var(--light-bg); padding: 2rem; border-radius: 10px;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">📸 Photo Collections</h3>
                    <p>Explore high-quality photographs from field research, geological surveys, and water systems studies.</p>
                    <a href="https://www.youtube.com/@sayareyema" target="_blank" class="external-link" style="margin-top: 1rem;">View Gallery</a>
                </div>
            </div>
        `;
    }

    generateMediaItem(title, icon) {
        return `
            <div class="media-item">
                <div class="media-placeholder">${icon}</div>
                <div class="media-overlay">
                    <div class="play-button" style="cursor: pointer;">▶</div>
                </div>
                <div class="media-title">${title}</div>
            </div>
        `;
    }

    renderLogin() {
        return `
            <div class="page-container">
                <div class="form-container">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary-color);">Sign In</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" placeholder="you@example.com" required>
                            <div class="form-error" id="loginEmailError"></div>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" placeholder="••••••" required>
                            <div class="form-error" id="loginPasswordError"></div>
                        </div>
                        <div id="loginMessage"></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Sign In</button>
                    </form>
                    <p style="text-align: center;">
                        Don't have an account? <a href="#signup" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">Sign up here</a>
                    </p>
                </div>
            </div>
        `;
    }

    renderSignup() {
        return `
            <div class="page-container">
                <div class="form-container">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary-color);">Create Account</h2>
                    <form id="signupForm">
                        <div class="form-group">
                            <label for="fullName">Full Name</label>
                            <input type="text" id="fullName" placeholder="Your Full Name" required>
                            <div class="form-error" id="fullNameError"></div>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" placeholder="you@example.com" required>
                            <div class="form-error" id="signupEmailError"></div>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" placeholder="••••••" required>
                            <small style="color: #888;">Minimum 6 characters</small>
                            <div class="form-error" id="signupPasswordError"></div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="••••••" required>
                            <div class="form-error" id="confirmPasswordError"></div>
                        </div>
                        <div id="signupMessage"></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Create Account</button>
                    </form>
                    <p style="text-align: center;">
                        Already have an account? <a href="#login" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">Sign in here</a>
                    </p>
                </div>
            </div>
        `;
    }

    renderProfile() {
        const user = authManager.getCurrentUser();
        return `
            <div class="page-container">
                <div class="form-container">
                    <h2 style="color: var(--primary-color); margin-bottom: 2rem;">My Profile</h2>
                    
                    <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <h3 style="color: var(--primary-color);">Account Information</h3>
                        <p><strong>Name:</strong> ${user.fullName}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Session Expires:</strong> ${authManager.formatTimeRemaining()}</p>
                    </div>

                    <form id="profileForm">
                        <div class="form-group">
                            <label for="profileBio">Bio</label>
                            <textarea id="profileBio" placeholder="Tell us about your interests in hydrogeology..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="profileInterests">Interests (comma-separated)</label>
                            <input type="text" id="profileInterests" placeholder="e.g., Hydrogeology, Water Systems, Research">
                        </div>
                        <div id="profileMessage"></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Update Profile</button>
                    </form>
                </div>
            </div>
        `;
    }

    renderSupport() {
        const user = authManager.getCurrentUser();
        return `
            <div class="page-container">
                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">Support & Contact</h1>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 3rem;">
                    Get help and connect with our community
                </p>

                <div class="support-container">
                    <div class="support-info">
                        <div class="support-card">
                            <h3>📧 Email Support</h3>
                            <p>For inquiries and support, reach out to us at our main contact email or through sayareyema.com</p>
                        </div>
                        <div class="support-card">
                            <h3>🌐 Website</h3>
                            <p>Visit <a href="https://sayareyema.com" target="_blank" style="color: var(--primary-color); font-weight: 600;">sayareyema.com</a> for more information and resources.</p>
                        </div>
                        <div class="support-card">
                            <h3>📺 YouTube Channel</h3>
                            <p>Subscribe to our <a href="https://www.youtube.com/@sayareyema" target="_blank" style="color: var(--primary-color); font-weight: 600;">YouTube channel</a> for video tutorials and updates.</p>
                        </div>
                        <div class="support-card">
                            <h3>👤 Your Account</h3>
                            <p><strong>Logged in as:</strong> ${user.fullName}<br>
                            <strong>Session:</strong> ${authManager.formatTimeRemaining()}</p>
                        </div>
                    </div>

                    <div>
                        <div class="form-container">
                            <h3 style="color: var(--primary-color); margin-bottom: 1.5rem;">Send Us a Message</h3>
                            <form id="supportForm">
                                <div class="form-group">
                                    <label for="supportSubject">Subject</label>
                                    <input type="text" id="supportSubject" placeholder="What do you need help with?" required>
                                </div>
                                <div class="form-group">
                                    <label for="supportMessage">Message</label>
                                    <textarea id="supportMessage" placeholder="Describe your inquiry..." required></textarea>
                                </div>
                                <div id="supportMessage2"></div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div style="background: #D4EDDA; color: #155724; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; border-left: 4px solid #27AE60;">
                    <strong>✓ Active Supporter</strong><br>
                    Thank you for being part of the Watershifts community, ${user.fullName}! Your support helps us continue our research and education efforts.
                </div>
            </div>
        `;
    }

    renderLoginFirst() {
        return `
            <div class="page-container">
                <div style="text-align: center; padding: 3rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 1rem;">Support Available for Members</h2>
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">
                        Sign in or create an account to access the support page and connect with our community.
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <a href="#login" class="btn btn-outline" style="background: var(--primary-color); color: white; border: none;">Sign In</a>
                        <a href="#signup" class="btn btn-primary">Create Account</a>
                    </div>
                </div>
            </div>
        `;
    }

    renderFooter() {
        return `
            <footer>
                <div class="footer-content">
                    <h3 style="margin-bottom: 1rem;">Watershifts</h3>
                    <p style="margin-bottom: 1.5rem;">Hydrogeology Research & Education Platform</p>
                    <div class="footer-links">
                        <a href="https://sayareyema.com" target="_blank">Sayareyema</a>
                        <a href="https://www.youtube.com/@sayareyema" target="_blank">YouTube</a>
                        <a href="#about">About</a>
                        <a href="#resources">Resources</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div class="footer-social">
                        <div class="social-icon" title="YouTube">▶</div>
                        <div class="social-icon" title="Email">✉</div>
                        <div class="social-icon" title="Research">📊</div>
                    </div>
                    <p style="margin-top: 2rem; opacity: 0.9; font-size: 0.9rem;">
                        © 2024 Watershifts. All rights reserved. | 
                        <a href="#privacy" style="color: white; text-decoration: none;">Privacy</a> | 
                        <a href="#terms" style="color: white; text-decoration: none;">Terms</a>
                    </p>
                </div>
            </footer>
        `;
    }

    attachEventHandlers() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.logout();
                window.location.hash = 'home';
                window.dispatchEvent(new Event('auth-changed'));
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                try {
                    const email = document.getElementById('loginEmail').value;
                    const password = document.getElementById('loginPassword').value;
                    const result = authManager.login(email, password);
                    
                    const messageDiv = document.getElementById('loginMessage');
                    messageDiv.innerHTML = `<div class="form-success">${result.message}</div>`;
                    
                    setTimeout(() => {
                        window.location.hash = 'home';
                        window.dispatchEvent(new Event('auth-changed'));
                    }, 1500);
                } catch (error) {
                    document.getElementById('loginMessage').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
                }
            });
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                try {
                    const fullName = document.getElementById('fullName').value;
                    const email = document.getElementById('signupEmail').value;
                    const password = document.getElementById('signupPassword').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;

                    if (password !== confirmPassword) {
                        throw new Error('Passwords do not match');
                    }

                    const result = authManager.register(email, password, fullName);
                    
                    const messageDiv = document.getElementById('signupMessage');
                    messageDiv.innerHTML = `<div class="form-success">${result.message}</div>`;
                    
                    setTimeout(() => {
                        window.location.hash = 'login';
                    }, 1500);
                } catch (error) {
                    document.getElementById('signupMessage').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
                }
            });
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            const user = authManager.getCurrentUser();
            document.getElementById('profileBio').value = user.profile.bio || '';
            document.getElementById('profileInterests').value = user.profile.interests.join(', ') || '';

            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                try {
                    const bio = document.getElementById('profileBio').value;
                    const interests = document.getElementById('profileInterests').value
                        .split(',')
                        .map(i => i.trim())
                        .filter(i => i);

                    const result = authManager.updateProfile(bio, interests);
                    
                    const messageDiv = document.getElementById('profileMessage');
                    messageDiv.innerHTML = `<div class="form-success">${result.message}</div>`;
                } catch (error) {
                    document.getElementById('profileMessage').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
                }
            });
        }

        // Support form
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const subject = document.getElementById('supportSubject').value;
                const message = document.getElementById('supportMessage').value;
                
                const messageDiv = document.getElementById('supportMessage2');
                messageDiv.innerHTML = `<div class="form-success">Thank you! Your message has been received. We'll get back to you soon.</div>`;
                
                supportForm.reset();
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WatershiftsApp();
});
