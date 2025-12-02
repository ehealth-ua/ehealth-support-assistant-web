export const metadata = {
  title: 'FAQ',
  description: 'Часто задавані питання'
}

export default function FaqPage() {
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
          <h1 className="text-5xl font-bold text-white text-center">Часто задавані питання</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <div className="prose prose-lg max-w-3xl mx-auto">
            <p className="text-gray-600">
              Часто задавані питання та відповіді на них розташовуються тут.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
