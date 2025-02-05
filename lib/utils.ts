import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/types/policy"

/**
 * Merge class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number, currency: Currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

/**
 * Format a date string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Truncate a string to a specified length
 */
export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
}

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  return (value / total) * 100
}

/**
 * Debounce function
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout) {
      clearTimeout(timeout)
    }

    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
  }
}

/**
 * Check if an object is empty
 */
export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * Generate a random string
 */
export const generateRandomString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

/**
 * Parse JSON safely
 */
export const safeJSONParse = (str: string): unknown => {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error("Failed to parse JSON:", e)
    return null
  }
}

/**
 * Get query params from URL
 */
export const getQueryParams = (url: string): Record<string, string> => {
  const params = new URLSearchParams(new URL(url).search)
  const result: Record<string, string> = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if running on client-side
 */
export const isClient = typeof window !== 'undefined'

/**
 * Check if running on server-side
 */
export const isServer = typeof window === 'undefined'

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/**
 * Convert snake_case to camelCase
 */
export const snakeToCamel = (str: string): string =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )

/**
 * Convert camelCase to snake_case
 */
export const camelToSnake = (str: string): string =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

/**
 * Flatten an array
 */
export const flattenArray = <T>(arr: T[]): T[] =>
  arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flattenArray(next) : next), [] as T[])

export const utils = {
  cn,
  formatCurrency,
  formatDate,
  capitalizeFirstLetter,
  truncateString,
  calculatePercentage,
  debounce,
  isEmptyObject,
  generateRandomString,
  safeJSONParse,
  getQueryParams,
  deepClone,
  isClient,
  isServer,
  isValidEmail,
  snakeToCamel,
  camelToSnake,
  flattenArray
}

export default utils

