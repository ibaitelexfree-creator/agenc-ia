export const getApiBaseUrl = () => {
    // In Capacitor, we can't use relative URLs like /api
    // We must use the absolute URL of the production server or local dev server
    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isCapacitor = window.location.protocol === 'capacitor:' || window.location.protocol === 'file:';

        // If we are on localhost in a browser, use the current origin
        if (isLocalhost && !isCapacitor) {
            return window.location.origin;
        }

        // In Capacitor or if NEXT_PUBLIC_APP_URL is explicitly set
        if (process.env.NEXT_PUBLIC_APP_URL) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
            const isAppUrlLocal = appUrl.includes('localhost') || appUrl.includes('127.0.0.1');
            if (!isAppUrlLocal || isLocalhost || isCapacitor) {
                return appUrl;
            }
        }

        // Fallback for production if no env var is found
        if (!isCapacitor) {
            return window.location.origin;
        }
        return 'https://getxobelaeskola.cloud';
    }

    // In standard web environment, use relative paths
    return '';
};

export const apiUrl = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const base = getApiBaseUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Fix common path errors: remove /academy/ prefix if it was incorrectly added
    const fixedPath = cleanPath.replace(/^\/api\/academy\//, '/api/');

    return `${base}${fixedPath}`;
};
