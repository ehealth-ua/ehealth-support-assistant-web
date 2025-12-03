"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslations } from '../../lib/useTranslations'

interface Registry {
  slug: string
  title: string
}

export default function Header() {
  const [registries, setRegistries] = useState<Registry[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { t } = useTranslations()

  useEffect(() => {
    // Load registries from config
    fetch('/api/registries')
      .then(res => res.json())
      .then(data => setRegistries(data))
      .catch(err => console.error('Failed to load registries:', err))
  }, [])

  // Function to get translated registry title
  const getRegistryTitle = (registry: Registry) => {
    const translatedTitle = t.registryCards?.[registry.slug as keyof typeof t.registryCards]
    return translatedTitle || registry.title
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/Logo for Header.webp"
              alt="e-Health Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-xl font-bold">{t.header?.siteTitle || t.siteTitle}</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {/* Головна with dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('home')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/" className="px-3 py-2 hover:text-blue-600">{t.header?.home || t.home}</Link>
              <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <Link href="/about/ehealth" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">{t.header?.aboutEHealth || "ДП е-Здоров'я"}</Link>
                <Link href="/about/helpdesk" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">{t.header?.helpdeskTeam || "Helpdesk team"}</Link>
              </div>
            </div>

            {/* Реєстри with dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('registries')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/registers" className="px-3 py-2 hover:text-blue-600">{t.header?.registries || t.registries}</Link>
              <div className="absolute left-0 mt-0 w-64 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {registries.map(r => (
                  <Link 
                    key={r.slug}
                    href={`/registers/${r.slug}`} 
                    className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm"
                  >
                    {getRegistryTitle(r)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Документація with dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('docs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/documentation" className="px-3 py-2 hover:text-blue-600">{t.header?.documentation || t.documentation}</Link>
              <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <Link href="/documentation/guidelines" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">{t.header?.guidelines || "Загальні настанови"}</Link>
                <Link href="/documentation/regulatory" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">{t.header?.regulatory || "Нормативні документи"}</Link>
                <Link href="/documentation/faq" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">{t.header?.faq || "FAQ"}</Link>
              </div>
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
