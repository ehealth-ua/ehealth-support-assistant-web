"use client"
import { useState, useEffect } from 'react'

// Import translations statically
import ukTranslations from '../i18n/uk.json'
import enTranslations from '../i18n/en.json'

const translations: { [key: string]: typeof ukTranslations } = {
  uk: ukTranslations,
  en: enTranslations
}

const LOCALE_STORAGE_KEY = 'ehealth_locale'

function getLocaleFromStorage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || 'uk'
  }
  return 'uk'
}

function getLocaleFromCookie(): string {
  if (typeof document !== 'undefined') {
    const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)
    return m ? decodeURIComponent(m[1]) : 'uk'
  }
  return 'uk'
}

export function useTranslations() {
  const [locale, setLocale] = useState<string>('uk')
  const [t, setT] = useState(translations.uk)

  useEffect(() => {
    // Try localStorage first, then cookie
    const storedLocale = getLocaleFromStorage() || getLocaleFromCookie()
    setLocale(storedLocale)
    setT(translations[storedLocale] || translations.uk)
  }, [])

  return { t, locale }
}

// Helper function to get nested translation value
export function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return path // Return the key if not found
    }
  }
  return typeof result === 'string' ? result : path
}
