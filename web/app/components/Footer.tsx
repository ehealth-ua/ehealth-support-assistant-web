import HelpdeskLink from './HelpdeskLink'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-600 mb-4">
          <p>Якщо у користувача виникли запитання:</p>
        </div>
        <HelpdeskLink size="md" />
        <p className="text-xs text-gray-500 mt-4">© {new Date().getFullYear()} eHealth Portal</p>
      </div>
    </footer>
  )
}
