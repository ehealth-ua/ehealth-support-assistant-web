"use client"
import { useTranslations } from '../../../lib/useTranslations';

export default function HelpdeskPage() {
  const { t } = useTranslations();
  const content = t.helpdesk;

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
          <h1 className="text-5xl font-bold text-white text-center">{content?.title || 'Helpdesk Team'}</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <div className="prose prose-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{content?.missionTitle || 'Наша місія'}</h2>
            <p className="text-gray-700 mb-6">
              {content?.missionText1 || 'Забезпечувати якісну, сервіс орієнтовану технічну підтримку користувачів продуктів екосистеми eHealth та бути надійним партнером для всіх рівнів супроводу програмного забезпечення й інфраструктури.'}
            </p>
            <p className="text-gray-700 mb-6">
              {content?.missionText2 || 'Ми працюємо для того, щоб кожен користувач отримував швидку, професійну та зрозумілу допомогу.'}
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mb-4">{content?.tasksTitle || 'Наші основні завдання'}</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content?.task1Title || '1. Прийом і реєстрація звернень'}</h3>
            <p className="text-gray-700 mb-2">{content?.task1Intro || 'Ми опрацьовуємо вхідні заявки від:'}</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {content?.task1Items?.map((item: string, idx: number) => (
                <li key={idx} className="text-gray-700">{item}</li>
              )) || (
                <>
                  <li className="text-gray-700">користувачів інформаційних порталів, що перебувають на супроводі ДП «е Здоров'я»</li>
                  <li className="text-gray-700">розробників медичних інформаційних систем (МІС)</li>
                  <li className="text-gray-700">користувачів адміністративної панелі НСЗУ</li>
                </>
              )}
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content?.task2Title || '2. Первинна оцінка та уточнення інформації'}</h3>
            <p className="text-gray-700 mb-4">
              {content?.task2Text || 'Фахівці служби підтримки аналізують звернення, уточнюють деталі та визначають оптимальний шлях вирішення проблеми.'}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content?.task3Title || '3. Маршрутизація звернень'}</h3>
            <p className="text-gray-700 mb-2">{content?.task3Intro || 'За потреби заявка передається:'}</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {content?.task3Items?.map((item: string, idx: number) => (
                <li key={idx} className="text-gray-700">{item}</li>
              )) || (
                <>
                  <li className="text-gray-700">до технічного відділу</li>
                  <li className="text-gray-700">до бізнес аналітиків (L2)</li>
                  <li className="text-gray-700">до інших відповідальних команд екосистеми eHealth</li>
                </>
              )}
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">{content?.task4Title || '4. Супровід до повного вирішення'}</h3>
            <p className="text-gray-700 mb-6">
              {content?.task4Text || 'Ми супроводжуємо кожне звернення на всіх етапах — від моменту реєстрації до остаточного вирішення питання, інформуючи користувача про статус і прогрес.'}
            </p>

            <p className="text-gray-700">
              {content?.websiteLabel || 'Наш сайт'}:{' '}
              <a 
                href="https://e-health-ua.atlassian.net/servicedesk/customer/portals" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#0066cc', textDecoration: 'underline' }}
              >
                https://e-health-ua.atlassian.net/servicedesk/customer/portals
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
