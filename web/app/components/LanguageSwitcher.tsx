"use client"
import { useState, useEffect } from 'react'

const LOCALE_STORAGE_KEY = 'ehealth_locale'

function setLocaleStorage(locale: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

function getLocaleFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCALE_STORAGE_KEY)
  }
  return null
}

// Also set cookie for server-side rendering compatibility
function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>('uk')

  useEffect(() => {
    const stored = getLocaleFromStorage()
    if (stored) {
      setLocale(stored)
    }
  }, [])

  const change = (l: string) => {
    setLocale(l)
    setLocaleStorage(l)
    setLocaleCookie(l)
    // reload page so components can pick up the new locale
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => change('uk')} 
        className={`px-2 py-1 rounded ${locale === 'uk' ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-100'}`}
      >
        UA
      </button>
      <button 
        onClick={() => change('en')} 
        className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-100'}`}
      >
        EN
      </button>
    </div>
  )
}
