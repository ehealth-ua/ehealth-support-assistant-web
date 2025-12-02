import Image from 'next/image'

export default function RegisterCard({
  title,
  image,
  url
}: {
  title: string
  image: string
  url: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="w-1/2 h-32 relative bg-gray-200 mx-auto rounded overflow-hidden">
        <Image
          src={image}
          alt={`${title} image`}
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="p-4 text-center">
        <h4 className="font-semibold text-lg line-clamp-2">{title}</h4>
      </div>
    </a>
  )
}
