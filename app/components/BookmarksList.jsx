'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function BookmarksList({ initialBookmarks }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // ✅ Stable Optimistic Delete
  const handleDelete = async (id) => {
    // Optimistic UI update
    setBookmarks((prev) => prev.filter(b => b.id !== id))

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Delete failed:", error)

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      setBookmarks(data)
    }
  }

  // ✅ Realtime
  useEffect(() => {
    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const userId = session.user.id

      const channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setBookmarks((prev) => {
              if (payload.eventType === 'INSERT') {
                return [payload.new, ...prev]
              }

              if (payload.eventType === 'DELETE') {
                return prev.filter(b => b.id !== payload.old.id)
              }

              if (payload.eventType === 'UPDATE') {
                return prev.map(b =>
                  b.id === payload.new.id ? payload.new : b
                )
              }

              return prev
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    setupRealtime()
  }, [])

  return (
    <div className="space-y-4">
      {bookmarks?.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
          No bookmarks yet. Start adding your favorites.
        </div>
      )}

      {bookmarks?.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-lg font-semibold text-lg text-gray-900">
              Title: {bookmark.title}
            </p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm hover:underline break-all font-semibold text-lg text-gray-900"
            >
              URL: {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => handleDelete(bookmark.id)}
            className="bg-red-50 text-red-600 px-4 py-1 rounded-lg hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
