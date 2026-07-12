import { createContext } from 'react';

// Split into its own file (rather than living in AuthContext.jsx) so that
// file can export only the AuthProvider component — keeps Vite's Fast
// Refresh working correctly during development.
export const AuthContext = createContext(null);
