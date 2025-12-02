export default function RegistersStatusPage() {
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
          <h1 className="text-5xl font-bold text-white">Реєстри - Статус</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow-lg">
          <iframe 
            src="https://ekoppho.instatus.com" 
            className="w-full h-full" 
            title="System Status" 
            frameBorder="0"
          />
        </div>
      </div>
    </>
  )
}