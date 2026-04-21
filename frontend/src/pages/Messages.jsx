import { useEffect, useState } from 'react'
import { getInboxMessages, sendMessage } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Messages() {
  const [inbox, setInbox] = useState([])
  const [form, setForm] = useState({ recipientId: '', content: '' })
  const [error, setError] = useState('')
  const loadInbox = async () => {
    try {
      const res = await getInboxMessages()
      setInbox(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load inbox.')
    }
  }

  useEffect(() => { loadInbox() }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await sendMessage({ recipientId: Number(form.recipientId), content: form.content })
      setForm({ recipientId: '', content: '' })
      await loadInbox()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send message.')
    }
  }

  return (
    <DashboardShell title="Messages" subtitle="Teacher-parent communication and inbox.">
      <div className="space-y-4">

          <section className="page-card">
            <form onSubmit={handleSend} className="page-card">
              <input className="form-input" placeholder="Recipient User ID" value={form.recipientId} onChange={(e) => setForm({ ...form, recipientId: e.target.value })} />
              <input className="form-input" placeholder="Message" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <button className="btn btn-primary" type="submit">Send</button>
            </form>
          </section>

          <section className="page-card page-table-card">
            <table className="data-table"><thead><tr><th>From</th><th>Role</th><th>Message</th><th>Date</th></tr></thead><tbody>{inbox.map((m) => <tr key={m.id}><td>{m.sender?.name || m.senderId}</td><td>{m.sender?.role || '-'}</td><td>{m.content}</td><td>{new Date(m.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
            {error && <p className="field-error">{error}</p>}
          </section>
      </div>
    </DashboardShell>
  )
}
