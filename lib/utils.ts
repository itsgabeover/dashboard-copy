import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
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
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  return (value / total) * 100
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
