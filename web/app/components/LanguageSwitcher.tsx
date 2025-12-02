"use client"
import { useState, useEffect } from 'react'

const LOCALE_COOKIE = 'NEXT_LOCALE'

function setLocaleCookie(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
}

function getLocaleFromCookie(): string | null {
  const m = document.cookie.match(new RegExp('(?:^|; )' + LOCALE_COOKIE + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>('uk')

  useEffect(() => {
    const c = getLocaleFromCookie()
    if (c) setLocale(c)
  }, [])

  const change = (l: string) => {
    setLocale(l)
    setLocaleCookie(l)
    // reload page so server components can pick up the cookie
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => change('uk')} className={`px-2 py-1 rounded ${locale === 'uk' ? 'bg-sky-600 text-white' : 'text-sky-700'}`}>
        UA
      </button>
      <button onClick={() => change('en')} className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-sky-600 text-white' : 'text-sky-700'}`}>
        EN
      </button>
    </div>
  )
}
