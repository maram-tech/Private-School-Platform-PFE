import { useState } from 'react'
import { createAssignment, getCourseAssignments, submitAssignment, getAssignmentSubmissions } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Assignments() {
  const [courseId, setCourseId] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [createForm, setCreateForm] = useState({ courseId: '', title: '', description: '', dueDate: '' })
  const [submitForm, setSubmitForm] = useState({ assignmentId: '', studentId: '', content: '', fileUrl: '' })
  const [error, setError] = useState('')

  const loadAssignments = async () => {
    try {
      const res = await getCourseAssignments(courseId)
      setAssignments(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load assignments.')
    }
  }

  const loadSubmissions = async () => {
    try {
      const res = await getAssignmentSubmissions(assignmentId)
      setSubmissions(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load submissions.')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createAssignment(createForm)
      setCreateForm({ courseId: '', title: '', description: '', dueDate: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create assignment.')
    }
  }

  const handleSubmitAssignment = async (e) => {
    e.preventDefault()
    try {
      await submitAssignment(submitForm.assignmentId, {
        studentId: Number(submitForm.studentId),
        content: submitForm.content,
        fileUrl: submitForm.fileUrl
      })
      setSubmitForm({ assignmentId: '', studentId: '', content: '', fileUrl: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit assignment.')
    }
  }

  return (
    <DashboardShell title="Assignments" subtitle="Create assignments and manage submissions.">
      <div className="space-y-4">

          <section className="page-card">
            <form onSubmit={handleCreate} className="page-card">
              <h3>Create Assignment</h3>
              <input className="form-input" placeholder="Course ID" value={createForm.courseId} onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })} />
              <input className="form-input" placeholder="Title" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} />
              <input className="form-input" placeholder="Description" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
              <input className="form-input" type="datetime-local" value={createForm.dueDate} onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })} />
              <button className="btn btn-primary" type="submit">Create</button>
            </form>
          </section>

          <section className="page-card">
            <h3>Assignments by Course</h3>
            <div className="page-card">
              <input className="form-input" placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
              <button className="btn btn-primary" onClick={loadAssignments}>Load</button>
            </div>
            <table className="data-table"><thead><tr><th>Title</th><th>Due Date</th></tr></thead><tbody>{assignments.map((a) => <tr key={a.id}><td>{a.title}</td><td>{new Date(a.dueDate).toLocaleString()}</td></tr>)}</tbody></table>
          </section>

          <section className="page-card">
            <form onSubmit={handleSubmitAssignment} className="page-card">
              <h3>Submit Assignment</h3>
              <input className="form-input" placeholder="Assignment ID" value={submitForm.assignmentId} onChange={(e) => setSubmitForm({ ...submitForm, assignmentId: e.target.value })} />
              <input className="form-input" placeholder="Student ID" value={submitForm.studentId} onChange={(e) => setSubmitForm({ ...submitForm, studentId: e.target.value })} />
              <input className="form-input" placeholder="Content" value={submitForm.content} onChange={(e) => setSubmitForm({ ...submitForm, content: e.target.value })} />
              <input className="form-input" placeholder="File URL" value={submitForm.fileUrl} onChange={(e) => setSubmitForm({ ...submitForm, fileUrl: e.target.value })} />
              <button className="btn btn-primary" type="submit">Submit</button>
            </form>
          </section>

          <section className="page-card">
            <h3>Submissions by Assignment</h3>
            <div className="page-card">
              <input className="form-input" placeholder="Assignment ID" value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} />
              <button className="btn btn-primary" onClick={loadSubmissions}>Load</button>
            </div>
            <table className="data-table"><thead><tr><th>Student</th><th>Submitted At</th><th>Content</th></tr></thead><tbody>{submissions.map((s) => <tr key={s.id}><td>{s.student?.name || s.studentId}</td><td>{new Date(s.submittedAt).toLocaleString()}</td><td>{s.content || '-'}</td></tr>)}</tbody></table>
            {error && <p className="field-error">{error}</p>}
          </section>
      </div>
    </DashboardShell>
  )
}
