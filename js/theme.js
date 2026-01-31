(function() {
    const THEME_KEY = 'theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    function getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    }

    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY);
    }

    function getEffectiveTheme() {
        return getSavedTheme() || getSystemPreference();
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (theme === DARK) {
                navbar.classList.remove('navbar-light', 'bg-light');
                navbar.classList.add('navbar-dark', 'bg-dark');
            } else {
                navbar.classList.remove('navbar-dark', 'bg-dark');
                navbar.classList.add('navbar-light', 'bg-light');
            }
        }

        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = theme === DARK ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-bs-theme') || getEffectiveTheme();
        const next = current === DARK ? LIGHT : DARK;
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-bs-theme', getEffectiveTheme());

    // Set up toggle button and navbar classes after DOM loads
    document.addEventListener('DOMContentLoaded', function() {
        applyTheme(getEffectiveTheme());

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!getSavedTheme()) {
            applyTheme(e.matches ? DARK : LIGHT);
        }
    });
})();
