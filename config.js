// Global configuration helper for EA Builder
(function () {
    const existingConfig = window.EA_CONFIG || {};

    function normalizeUrl(url) {
        if (!url) return '';
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    function safeGetStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('Local storage unavailable:', error);
            return null;
        }
    }

    function safeSetStorage(key, value) {
        try {
            if (value) {
                localStorage.setItem(key, value);
            } else {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn('Cannot persist configuration:', error);
        }
    }

    const DEFAULT_CONFIG = {
        /**
         * Optional map for automatic overrides, e.g.
         * { 'example.github.io': 'https://example.netlify.app' }
         */
        hostOverrides: {},
        /**
          * Default API base URL. Leave blank when the site and APIs share the same origin (Netlify).
          */
        apiBaseUrl: '',
        /**
         * Toggle whether UI should warn when API base is missing on non-local hosts.
         */
        warnWhenApiMissing: true
    };

    const mergedConfig = Object.assign({}, DEFAULT_CONFIG, existingConfig);

    function resolveHostOverride() {
        const overrides = mergedConfig.hostOverrides || {};
        const override = overrides[window.location.hostname];
        return normalizeUrl(override);
    }

    function resolveStoredBase() {
        return normalizeUrl(safeGetStorage('ea_api_base_url'));
    }

    function resolveBaseUrl() {
        const stored = resolveStoredBase();
        if (stored) return stored;

        const hostOverride = resolveHostOverride();
        if (hostOverride) return hostOverride;

        return normalizeUrl(mergedConfig.apiBaseUrl);
    }

    mergedConfig.getApiBaseUrl = resolveBaseUrl;

    mergedConfig.saveApiBaseUrl = function (url) {
        const normalized = normalizeUrl(url);
        safeSetStorage('ea_api_base_url', normalized);
        return normalized;
    };

    mergedConfig.clearApiBaseUrl = function () {
        safeSetStorage('ea_api_base_url', '');
    };

    mergedConfig.getStoredApiBaseUrl = function () {
        return resolveStoredBase();
    };

    mergedConfig.getApiUrl = function (path) {
        const cleanedPath = path.startsWith('/') ? path : `/${path}`;
        const base = resolveBaseUrl();
        if (!base) {
            return cleanedPath;
        }
        return `${base}${cleanedPath}`;
    };

    window.EA_CONFIG = mergedConfig;
})();
