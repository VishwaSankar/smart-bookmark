'use server'

import { createClientForServer } from '../utils/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = (provider) => async () => {
  const supabase = await createClientForServer()

const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: auth_callback_url,
      },
    })

  if (error) {
    console.error('Error signing in:', error)
    return
  }

  redirect(data.url)
}

const signinWithGoogle = signInWith('google')

const signOut = async () => {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  redirect('/')
}

export const addBookmark = async (formData) => {
  const supabase = await createClientForServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const title = formData.get('title')
  const url = formData.get('url')

  await supabase.from('bookmarks').insert({
    title,
    url,
    user_id: user.id,
  })
}



export const deleteBookmark = async (formData) => {
  const supabase = await createClientForServer()
  const id = formData.get('id')

  await supabase.from('bookmarks').delete().eq('id', id)

}


export { signinWithGoogle, signOut, addBookmark, deleteBookmark }
