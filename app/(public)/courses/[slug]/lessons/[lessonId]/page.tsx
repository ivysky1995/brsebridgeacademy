import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: { slug: string; lessonId: string }
}

export default async function PublicLessonPage({ params }: Props) {
  const supabase = await createClient()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, is_free, is_published')
    .eq('id', params.lessonId)
    .single()

  if (!lesson || !lesson.is_published) notFound()

  // Nếu là free lesson → redirect sang /learn/[lessonId] (authenticated layout cũng xử lý được)
  // Nếu không free → yêu cầu đăng nhập
  if (lesson.is_free) {
    redirect(`/learn/${params.lessonId}`)
  } else {
    redirect(`/login?redirectTo=/learn/${params.lessonId}`)
  }
}