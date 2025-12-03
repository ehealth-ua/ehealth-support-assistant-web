"use client"
import HelpdeskLink from './HelpdeskLink'
import { useTranslations } from '../../lib/useTranslations'

export default function Footer() {
  const { t } = useTranslations()

  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-600 mb-4">
          <p>{t.footer?.supportContact || t.supportContact}</p>
        </div>
        <HelpdeskLink size="md">
          {t.footer?.helpdeskButton || t.helpdeskButton}
        </HelpdeskLink>
        <p className="text-xs text-gray-500 mt-4">© {new Date().getFullYear()} {t.footer?.copyright || t.copyright}</p>
      </div>
    </footer>
  )
}
