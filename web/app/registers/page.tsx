import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getTranslations } from '../../lib/i18n';

interface Registry {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  heroImage?: string;
  statusUrl?: string;
}

async function loadRegistries(): Promise<Registry[]> {
  const file = path.join(process.cwd(), 'config', 'notebooks.json');
  try {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function RegistersPage() {
  const c = cookies().get('NEXT_LOCALE');
  const locale = c?.value ?? 'uk';
  const t = await getTranslations(locale);

  const registries = await loadRegistries();
  
  // Filter registries with statusUrl for the status grid (first two for testing)
  const registriesWithStatus = registries
    .filter(r => r.statusUrl)
    .slice(0, 2); // Show only first 2 for testing: EKOPFO and Endoprosthesis

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
          <h1 className="text-5xl font-bold text-white">{t.registers?.title || 'Реєстри - Статус'}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Status Grid Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t.registers?.statusTitle || 'Статус систем'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registriesWithStatus.map((registry) => {
              const registryName = t.registryCards?.[registry.slug as keyof typeof t.registryCards] || registry.title;
              return (
                <div key={registry.slug} className="space-y-2">
                  <h3 className="text-xl font-semibold">{registryName}</h3>
                  <div className="w-full h-[60vh] min-h-[400px] border rounded overflow-hidden shadow-lg">
                    <iframe 
                      src={registry.statusUrl} 
                      className="w-full h-full" 
                      title={`${registryName} Status`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Registries Catalog Section */}
        <section>
          <h2 className="text-2xl font-semibold mt-6">{t.catalogTitle}</h2>
          {registries.length === 0 ? (
            <p className="text-red-600">{t.registersNotFound}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {registries.map((r) => (
                <Link key={r.slug} href={`/registers/${r.slug}`} className="block border rounded p-4 hover:shadow">
                  <h3 className="font-semibold">{t.registryCards?.[r.slug as keyof typeof t.registryCards] || r.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{r.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}