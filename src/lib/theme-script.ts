// Plain (non-"use client") module so the Server Component root layout receives the real
// string. Importing a value from a "use client" file on the server yields a client reference.

export const THEME_STORAGE_KEY = "carsouq.theme";

/**
 * Applies an explicitly chosen theme as early as possible. "System" mode needs no script:
 * globals.css follows prefers-color-scheme whenever <html> has neither `.light` nor `.dark`.
 */
export const themeInitScript = `(function(){try{var m=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var c=document.documentElement.classList;c.toggle("dark",d);c.toggle("light",!d);}catch(e){}})();`;
