import { createContext } from 'react';

// Split into its own file (rather than living in ToastContext.jsx) so that
// file can export only the ToastProvider component — keeps Vite's Fast
// Refresh working correctly during development.
export const ToastContext = createContext(null);
