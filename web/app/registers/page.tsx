import fs from 'fs';
import path from 'path';
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
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Status Grid Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registriesWithStatus.map((registry) => {
              const registryName = t.registryCards?.[registry.slug as keyof typeof t.registryCards] || registry.title;
              return (
                <div key={registry.slug} className="space-y-2">
                  <h3 className="text-xl font-semibold text-center text-blue-600">{registryName}</h3>
                  <div className="w-full h-[42vh] min-h-[280px] border rounded overflow-hidden shadow-lg">
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
      </div>
    </>
  );
}