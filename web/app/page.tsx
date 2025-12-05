import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { getTranslations } from '../lib/i18n'

interface Registry {
  slug: string
  title: string
  description: string
  links?: { label: string; url: string; image?: string }[]
}

async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'config', 'notebooks.json')
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

export const metadata = {
  title: 'eHealth Portal',
  description: 'Головна сторінка порталу eHealth'
}

export default async function HomePage() {
  const c = cookies().get('NEXT_LOCALE')
  const locale = c?.value ?? 'uk'
  const t = await getTranslations(locale)
  const registries = await loadRegistries()

  // Function to get translated registry title
  const getRegistryTitle = (registry: Registry) => {
    const translatedTitle = t.registryCards?.[registry.slug as keyof typeof t.registryCards]
    return translatedTitle || registry.title
  }

  return (
    <>
      <div
        className="w-full h-32 bg-cover bg-top relative"
        style={{
          backgroundImage: "url('/images/Hero_ezdorovya.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">{t.siteTitle}</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">{t.medicalRegistries}</h2>

          {registries.length === 0 ? (
            <p className="text-red-600 text-center">{t.registersNotFound}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {registries.map((r) => {
                const img = (r.links && r.links.length > 0 && r.links[0].image) ? r.links[0].image : '/images/helpdesk.webp'
                return (
                  <div
                    key={r.slug}
                    className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:scale-105"
                  >
                    <Link href={`/registers/${r.slug}`} className="block">
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <Image
                          src={img}
                          alt={getRegistryTitle(r)}
                          fill
                          className="object-cover absolute inset-0"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <span className="text-lg font-semibold text-blue-600">{getRegistryTitle(r)}</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
