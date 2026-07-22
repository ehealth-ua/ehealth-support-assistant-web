import notebooks from "../../../config/notebooks.json";
import RegisterDetailClient from "./RegisterDetailClient";

type NotebookItem = { slug: string };

// Server-only export: enumerates the slugs to pre-render for static export.
export function generateStaticParams() {
  const items = Array.isArray(notebooks) ? (notebooks as NotebookItem[]) : [];
  return items.map((n) => ({ slug: n.slug }));
}

export default function RegisterDetail({ params }: { params: { slug: string } }) {
  return <RegisterDetailClient slug={params.slug} />;
}
