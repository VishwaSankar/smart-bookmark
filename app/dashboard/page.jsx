import { createClientForServer } from '@/app/utils/supabase/server'
import { addBookmark } from '@/app/utils/actions'
import { redirect } from 'next/navigation'
import BookmarksList from '../components/BookmarksList'

export default async function Dashboard() {
  const supabase = await createClientForServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <div className="flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold font-semibold text-lg text-gray-900 ">Smart Bookmark</h1>

        <div className="flex items-center gap-3">
          <img
            src={user.user_metadata?.avatar_url}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-600">
            {user.user_metadata?.full_name}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8">

        {/* Add Bookmark Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 font-semibold text-lg text-gray-900">
            Add New Bookmark
          </h2>

          <form action={addBookmark} className="space-y-4">
            <input
              name="title"
              placeholder="Bookmark title"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-lg text-gray-900"
              required
            />

            <input
              name="url"
              placeholder="https://example.com"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-lg text-gray-900"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Add Bookmark
            </button>
          </form>
        </div>

        {/* Bookmarks */}
        <BookmarksList initialBookmarks={bookmarks} />

      </div>
    </div>
  )
}
