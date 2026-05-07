import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export const isDev = process.env.NODE_ENV === "development"? true : false