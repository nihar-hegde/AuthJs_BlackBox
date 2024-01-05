/**
 * An array of routes that are accessibly to the public.
 * These routes do not need authentication
 * @type {string[]}
 * */

export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication.
 * These routes  will redirect already logged in users to /settings
 * @type {string[]}
 * */

export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * The prefix for API authentication routes
 * Rutes that starts with this prefix are used for API
 * @type {string}
 * */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
