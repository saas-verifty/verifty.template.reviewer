/**
 * API Endpoints Configuration
 * Centralized location for all API endpoint definitions
 */

export const API_ENDPOINTS = {
  // Example endpoints
  examples: {
    list: '/examples',
    get: (id: string) => `/examples/${id}`,
    create: '/examples',
    update: (id: string) => `/examples/${id}`,
    delete: (id: string) => `/examples/${id}`,
  },

  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Add more endpoint groups as needed
  // users: {
  //   list: '/users',
  //   get: (id: string) => `/users/${id}`,
  // },
} as const

export type APIEndpoints = typeof API_ENDPOINTS
