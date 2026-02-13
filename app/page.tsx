import { createClientForServer } from '@/app/utils/supabase/server'
import { signinWithGoogle, signOut } from '@/app/utils/actions'

export default async function Home() {
  const supabase = await createClientForServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 space-y-6 text-center">

        <h1 className="text-4xl font-bold tracking-tight font-semibold text-lg text-gray-900">
          Smart Bookmark
        </h1>

        {!user ? (
          <>
            <p className="text-gray-500">
              Save and organize your favorite links in real-time.
            </p>

            <form action={signinWithGoogle}>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium"
              >
                Continue with Google
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3">
              <img
                src={user.user_metadata?.avatar_url}
                alt="avatar"
                className="w-20 h-20 rounded-full shadow-md"
              />

              <div>
                <p className="font-semibold font-semibold text-lg text-gray-900">
                  {user.user_metadata?.full_name}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <a
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Dashboard
              </a>

              <form action={signOut}>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
