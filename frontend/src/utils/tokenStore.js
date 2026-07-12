// Session-scoped token storage.
// Deliberately sessionStorage, the token disappears when
// the tab closes rather than persisting indefinitely. 
const TOKEN_KEY = 'dealership_token';

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};
