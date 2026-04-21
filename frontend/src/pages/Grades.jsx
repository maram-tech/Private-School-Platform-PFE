import { useState } from 'react'
import { createGrade, getStudentGrades, getStudentAverage } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Grades() {
  const [studentId, setStudentId] = useState('')
  const [grades, setGrades] = useState([])
  const [average, setAverage] = useState(null)
  const [form, setForm] = useState({ studentId: '', subject: '', score: '', maxScore: 20, comments: '' })
  const [error, setError] = useState('')

  const loadGrades = async () => {
    setError('')
    try {
      const [gRes, aRes] = await Promise.all([
        getStudentGrades(studentId),
        getStudentAverage(studentId)
      ])
      setGrades(gRes.data.data || [])
      setAverage(aRes.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load grades.')
    }
  }

  const submitGrade = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createGrade({ ...form, studentId: Number(form.studentId), score: Number(form.score), maxScore: Number(form.maxScore) })
      setForm({ studentId: '', subject: '', score: '', maxScore: 20, comments: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create grade.')
    }
  }

  return (
    <DashboardShell title="Grades" subtitle="Enter and review grades by student.">
      <div className="space-y-4">

          <section className="page-card">
            <form onSubmit={submitGrade} className="page-card">
              <input className="form-input" placeholder="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
              <input className="form-input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <input className="form-input" type="number" placeholder="Score" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
              <input className="form-input" type="number" placeholder="Max Score" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })} />
              <input className="form-input" placeholder="Comments" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
              <button className="btn btn-primary" type="submit">Save Grade</button>
            </form>
          </section>

          <section className="page-card">
            <div className="page-card">
              <input className="form-input" placeholder="Student ID to view" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
              <button className="btn btn-primary" onClick={loadGrades}>Load Grades</button>
              {average?.average !== undefined && <p>Average: {average.average ?? 'N/A'} | Percentage: {average.percentage ?? 'N/A'}</p>}
              {error && <p className="field-error">{error}</p>}
            </div>
            <div className="page-table-card">
              <table className="data-table">
                <thead><tr><th>Subject</th><th>Score</th><th>Max</th><th>Date</th></tr></thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id}><td>{g.subject}</td><td>{g.score}</td><td>{g.maxScore}</td><td>{new Date(g.recordedAt).toLocaleDateString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
      </div>
    </DashboardShell>
  )
}
