import DocumentCard from '../../components/DocumentCard';

export const metadata = {
  title: 'Нормативні документи',
  description: 'Нормативні документи порталу е-Здоров\'я'
}

interface Document {
  title: string;
  description?: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  filePath?: string;
  fileSize?: string;
}

// Резервні картки для майбутніх нормативних документів
const documents: Document[] = [
  // Рядок 1
  {
    title: 'Документ №1 (Резерв)',
    description: 'Місце для майбутнього файлу PDF',
    fileType: 'PDF',
  },
  {
    title: 'Документ №2 (Резерв)',
    description: 'Місце для майбутнього файлу DOCX',
    fileType: 'DOCX',
  },
  {
    title: 'Документ №3 (Резерв)',
    description: 'Місце для майбутнього зображення',
    fileType: 'IMG',
  },
  {
    title: 'Документ №4 (Резерв)',
    description: 'Місце для майбутнього файлу XLSX',
    fileType: 'XLSX',
  },
  // Рядок 2
  {
    title: 'Документ №5 (Резерв)',
    description: 'Місце для майбутнього файлу PDF',
    fileType: 'PDF',
  },
  {
    title: 'Документ №6 (Резерв)',
    description: 'Місце для майбутнього файлу DOCX',
    fileType: 'DOCX',
  },
  {
    title: 'Документ №7 (Резерв)',
    description: 'Місце для майбутнього зображення',
    fileType: 'IMG',
  },
  {
    title: 'Документ №8 (Резерв)',
    description: 'Місце для майбутнього файлу XLSX',
    fileType: 'XLSX',
  },
  // Рядок 3
  {
    title: 'Документ №9 (Резерв)',
    description: 'Місце для майбутнього файлу PDF',
    fileType: 'PDF',
  },
  {
    title: 'Документ №10 (Резерв)',
    description: 'Місце для майбутнього файлу DOCX',
    fileType: 'DOCX',
  },
  {
    title: 'Документ №11 (Резерв)',
    description: 'Місце для майбутнього зображення',
    fileType: 'IMG',
  },
  {
    title: 'Документ №12 (Резерв)',
    description: 'Місце для майбутнього файлу XLSX',
    fileType: 'XLSX',
  },
];

export default function RegulatoryPage() {
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
          <h1 className="text-5xl font-bold text-white text-center">Нормативні документи</h1>
        </div>
      </div>
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">Нормативні документи порталу е-Здоров'я</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {documents.map((doc, idx) => (
              <DocumentCard
                key={idx}
                title={doc.title}
                description={doc.description}
                fileType={doc.fileType}
                filePath={doc.filePath}
                fileSize={doc.fileSize}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
