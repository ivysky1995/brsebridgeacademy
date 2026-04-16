'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Update last_active_date and handle daily login XP
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const today = new Date().toISOString().slice(0, 10)

    const { data: profile } = await supabase
      .from('profiles')
      .select('last_active_date, xp_points, streak_count')
      .eq('id', user.id)
      .single()

    if (profile) {
      const lastActive = profile.last_active_date?.slice(0, 10)
      const isNewDay = lastActive !== today

      if (isNewDay) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        const newStreak = lastActive === yesterday ? (profile.streak_count ?? 0) + 1 : 1

        await supabase
          .from('profiles')
          .update({
            last_active_date: today,
            xp_points: (profile.xp_points ?? 0) + 10,
            streak_count: newStreak,
          })
          .eq('id', user.id)
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
