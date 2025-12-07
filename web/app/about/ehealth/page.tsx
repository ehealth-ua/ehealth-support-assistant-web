"use client"
import { useTranslations } from '../../../lib/useTranslations';

export default function EhealthPage() {
  const { t } = useTranslations();
  const content = t.ehealth;

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
          <h1 className="text-5xl font-bold text-white text-center">{content?.title || 'ДП е-Здоров\'я'}</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <div className="prose prose-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{content?.missionTitle || 'Наша місія'}</h2>
            <p className="text-gray-700 mb-6">
              {content?.missionText || 'Ми стимулюємо розвиток якісних пацієнтоцентричних цифрових сервісів у сфері eHealth та сприяємо розбудові медичного ІТ-ринку в Україні.'}
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mb-4">{content?.workDirectionsTitle || 'Напрями роботи'}</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              {content?.workDirections?.map((item: string, idx: number) => (
                <li key={idx} className="text-gray-700">{item}</li>
              )) || (
                <>
                  <li className="text-gray-700">Адміністрування та розробка систем, реєстрів і сайтів</li>
                  <li className="text-gray-700">Розробка програмного забезпечення</li>
                  <li className="text-gray-700">Аналіз інфраструктури ІТ-підприємства</li>
                  <li className="text-gray-700">Консалтинг та навчання у сфері eHealth</li>
                  <li className="text-gray-700">Управління даними та аналітика</li>
                  <li className="text-gray-700">Кібербезпека, захист даних та безпекові тестування</li>
                  <li className="text-gray-700">Побудова архітектури для навантажених систем</li>
                  <li className="text-gray-700">Розвиток телемедичних сервісів в Україні</li>
                  <li className="text-gray-700">Проєктне управління та бізнес-аналіз у сфері електронного урядування</li>
                </>
              )}
            </ul>

            <h2 className="text-2xl font-bold text-blue-600 mb-4">{content?.goalsTitle || 'Наші цілі'}</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              {content?.goals?.map((item: string, idx: number) => (
                <li key={idx} className="text-gray-700">{item}</li>
              )) || (
                <>
                  <li className="text-gray-700">Цифровізувати систему охорони здоров'я та усунути бюрократію</li>
                  <li className="text-gray-700">Розробити людиноцентричні електронні сервіси в Україні</li>
                  <li className="text-gray-700">Впроваджувати філософію "бережливого використання коштів платників податків" в управлінні проєктами</li>
                  <li className="text-gray-700">Створювати продукти національного масштабу, які матимуть вплив на майбутні покоління</li>
                  <li className="text-gray-700">Сприяти розвитку бізнес-середовища для створення нових медичних електронних сервісів</li>
                  <li className="text-gray-700">Створити простір для інновацій у медицині</li>
                </>
              )}
            </ul>

            <p className="text-gray-700">
              {content?.websiteLabel || 'Наш сайт'}:{' '}
              <a 
                href="https://ezdorovya.ua/systems-and-registers-administration" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#0066cc', textDecoration: 'underline' }}
              >
                https://ezdorovya.ua/systems-and-registers-administration
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
