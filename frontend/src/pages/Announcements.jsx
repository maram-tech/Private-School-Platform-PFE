import { useEffect, useState } from 'react'
import { getAnnouncements, createAnnouncement } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [error, setError] = useState('')
  const { user } = useAuth()

  const load = async () => {
    try {
      const res = await getAnnouncements()
      setAnnouncements(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load announcements.')
    }
  }

  useEffect(() => { load() }, [])

  const publish = async (e) => {
    e.preventDefault()
    try {
      await createAnnouncement(form)
      setForm({ title: '', content: '' })
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to publish announcement.')
    }
  }

  return (
    <DashboardShell title="Announcements" subtitle="Publish and read school announcements.">
      <div className="space-y-4">

          {user?.role === 'ADMIN' && (
            <section className="page-card">
              <form onSubmit={publish} className="page-card">
                <input className="form-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className="form-input" placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                <button className="btn btn-primary" type="submit">Publish</button>
              </form>
            </section>
          )}

          <section className="page-card page-table-card">
            <table className="data-table"><thead><tr><th>Title</th><th>Content</th><th>Date</th></tr></thead><tbody>{announcements.map((a) => <tr key={a.id}><td>{a.title}</td><td>{a.content}</td><td>{new Date(a.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
            {error && <p className="field-error">{error}</p>}
          </section>
      </div>
    </DashboardShell>
  )
}
