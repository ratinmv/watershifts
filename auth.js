/**
 * WATERSHIFTS - Authentication & Session Management
 * Handles user authentication, registration, and 3-day session persistence
 */

class AuthManager {
    constructor() {
        this.SESSION_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        this.STORAGE_KEY = 'watershifts_user';
        this.SESSION_KEY = 'watershifts_session';
        this.users = JSON.parse(localStorage.getItem('watershifts_users')) || [];
        this.currentUser = this.validateSession();
    }

    /**
     * Register a new user
     */
    register(email, password, fullName) {
        if (!email || !password || !fullName) {
            throw new Error('All fields are required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (this.users.some(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: Date.now().toString(),
            email,
            password: this.hashPassword(password),
            fullName,
            createdAt: new Date().toISOString(),
            profile: {
                bio: '',
                interests: []
            }
        };

        this.users.push(newUser);
        localStorage.setItem('watershifts_users', JSON.stringify(this.users));

        return { success: true, message: 'Registration successful! Please log in.' };
    }

    /**
     * Login user
     */
    login(email, password) {
        const user = this.users.find(u => u.email === email);

        if (!user || !this.verifyPassword(password, user.password)) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            profile: user.profile
        };

        const sessionData = {
            user: this.currentUser,
            loginTime: Date.now(),
            expiresAt: Date.now() + this.SESSION_DURATION
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));

        return {
            success: true,
            message: `Welcome back, ${user.fullName}!`,
            user: this.currentUser
        };
    }

    /**
     * Logout user
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.STORAGE_KEY);
        return { success: true, message: 'Logged out successfully' };
    }

    /**
     * Validate existing session
     */
    validateSession() {
        const sessionData = JSON.parse(localStorage.getItem(this.SESSION_KEY));

        if (!sessionData) {
            return null;
        }

        // Check if session has expired
        if (Date.now() > sessionData.expiresAt) {
            this.logout();
            return null;
        }

        // Extend session if still valid
        sessionData.expiresAt = Date.now() + this.SESSION_DURATION;
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));

        return sessionData.user;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Get session expiry time
     */
    getSessionExpiry() {
        const sessionData = JSON.parse(localStorage.getItem(this.SESSION_KEY));
        if (!sessionData) return null;
        return new Date(sessionData.expiresAt);
    }

    /**
     * Get time remaining in session
     */
    getTimeRemaining() {
        const expiryTime = this.getSessionExpiry();
        if (!expiryTime) return 0;
        
        const remaining = expiryTime - Date.now();
        return remaining > 0 ? remaining : 0;
    }

    /**
     * Format time remaining
     */
    formatTimeRemaining() {
        const ms = this.getTimeRemaining();
        if (ms === 0) return 'Session expired';

        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        return `${minutes}m remaining`;
    }

    /**
     * Simple password hashing (for demo purposes)
     * In production, use bcrypt or similar
     */
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'hash_' + Math.abs(hash).toString(16);
    }

    /**
     * Verify password
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Update user profile
     */
    updateProfile(bio, interests) {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        this.users[userIndex].profile = { bio, interests };
        this.currentUser.profile = { bio, interests };

        localStorage.setItem('watershifts_users', JSON.stringify(this.users));
        
        const sessionData = JSON.parse(localStorage.getItem(this.SESSION_KEY));
        sessionData.user = this.currentUser;
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));

        return { success: true, message: 'Profile updated successfully' };
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Check session validity periodically (every minute)
setInterval(() => {
    if (authManager.isAuthenticated()) {
        const remaining = authManager.getTimeRemaining();
        if (remaining === 0) {
            authManager.logout();
            if (window.location.hash !== '#home') {
                window.location.hash = '#home';
            }
            window.dispatchEvent(new Event('auth-changed'));
        }
    }
}, 60000);
