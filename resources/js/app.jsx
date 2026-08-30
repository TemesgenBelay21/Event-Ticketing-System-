import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

// Note: this uses Webpack's dynamic require (via Laravel Mix), not Vite's
// import.meta.glob. The Blade `@routes` directive (Ziggy) already defines
// a global `route()` helper, so no separate import is needed for it.
createInertiaApp({
    resolve: (name) => require(`./Pages/${name}.jsx`).default,
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});
