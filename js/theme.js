(function() {
    'use strict';

    var root = document.documentElement;
    var preference = null;
    var systemTheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var button;

    try {
        preference = window.localStorage.getItem('theme');
    } catch (error) {
        // Theme switching still works when browser storage is unavailable.
    }

    if (preference !== 'light' && preference !== 'dark') {
        preference = null;
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (button) {
            button.setAttribute('aria-pressed', String(theme === 'dark'));
        }
    }

    // Run before styles load so returning visitors do not see a light flash.
    applyTheme(preference || (systemTheme && systemTheme.matches ? 'dark' : 'light'));

    document.addEventListener('DOMContentLoaded', function() {
        button = document.getElementById('theme-toggle');
        if (!button) return;

        applyTheme(root.getAttribute('data-theme'));
        button.hidden = false;
        button.addEventListener('click', function() {
            preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(preference);
            try {
                window.localStorage.setItem('theme', preference);
            } catch (error) {
                // Keep the selected theme for this visit even without storage.
            }
        });
    });

    function followSystemTheme(event) {
        if (!preference) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    }

    if (systemTheme) {
        if (systemTheme.addEventListener) {
            systemTheme.addEventListener('change', followSystemTheme);
        } else if (systemTheme.addListener) {
            systemTheme.addListener(followSystemTheme);
        }
    }
})();
