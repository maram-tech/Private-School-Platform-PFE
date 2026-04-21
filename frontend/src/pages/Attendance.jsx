import { useState } from 'react'
import { markAttendance, getStudentAttendance, justifyAbsence } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Attendance() {
  const [studentId, setStudentId] = useState('')
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ studentId: '', date: '', status: 'PRESENT', justification: '' })
  const [justifyForm, setJustifyForm] = useState({ id: '', justification: '' })
  const [error, setError] = useState('')

  const loadAttendance = async () => {
    setError('')
    try {
      const res = await getStudentAttendance(studentId)
      setRecords(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load attendance.')
    }
  }

  const submitAttendance = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await markAttendance(form)
      setForm({ studentId: '', date: '', status: 'PRESENT', justification: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save attendance.')
    }
  }

  const submitJustification = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await justifyAbsence(justifyForm.id, { justification: justifyForm.justification })
      setJustifyForm({ id: '', justification: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to justify absence.')
    }
  }

  return (
    <DashboardShell title="Attendance" subtitle="Track daily attendance and absence history.">
      <div className="space-y-4">

          <section className="page-card">
            <form onSubmit={submitAttendance} className="page-card">
              <input className="form-input" placeholder="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
              <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>
              <input className="form-input" placeholder="Justification (optional)" value={form.justification} onChange={(e) => setForm({ ...form, justification: e.target.value })} />
              <button className="btn btn-primary" type="submit">Save Attendance</button>
            </form>
          </section>

          <section className="page-card">
            <div className="page-card">
              <input className="form-input" placeholder="Student ID to view history" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
              <button className="btn btn-primary" onClick={loadAttendance}>Load History</button>
            </div>
            <div className="page-table-card">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Status</th><th>Justification</th></tr></thead>
                <tbody>{records.map((r) => <tr key={r.id}><td>{new Date(r.date).toLocaleDateString()}</td><td>{r.status}</td><td>{r.justification || '-'}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="page-card">
            <form onSubmit={submitJustification} className="page-card">
              <h3>Justify Absence</h3>
              <input className="form-input" placeholder="Attendance Record ID" value={justifyForm.id} onChange={(e) => setJustifyForm({ ...justifyForm, id: e.target.value })} />
              <input className="form-input" placeholder="Justification" value={justifyForm.justification} onChange={(e) => setJustifyForm({ ...justifyForm, justification: e.target.value })} />
              <button className="btn btn-primary" type="submit">Save Justification</button>
            </form>
            {error && <p className="field-error">{error}</p>}
          </section>
      </div>
    </DashboardShell>
  )
}
