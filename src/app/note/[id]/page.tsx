import { NotePageClient } from "@/components/note-page-client"

interface NotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params

  return <NotePageClient noteId={id} />
} 