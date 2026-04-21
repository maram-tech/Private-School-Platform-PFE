import { useEffect, useState } from 'react'
import { getAllCourses, createCourse, addCourseMaterial, getCourseMaterials } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [materials, setMaterials] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [courseForm, setCourseForm] = useState({ title: '', description: '', classId: '' })
  const [materialForm, setMaterialForm] = useState({ courseId: '', title: '', fileUrl: '' })
  const [error, setError] = useState('')

  const loadCourses = async () => {
    try {
      const res = await getAllCourses()
      setCourses(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load courses.')
    }
  }

  useEffect(() => { loadCourses() }, [])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createCourse({ ...courseForm, classId: courseForm.classId ? Number(courseForm.classId) : undefined })
      setCourseForm({ title: '', description: '', classId: '' })
      await loadCourses()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create course.')
    }
  }

  const handleAddMaterial = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await addCourseMaterial(materialForm.courseId, { title: materialForm.title, fileUrl: materialForm.fileUrl })
      setMaterialForm({ courseId: '', title: '', fileUrl: '' })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add material.')
    }
  }

  const loadMaterials = async () => {
    setError('')
    try {
      const res = await getCourseMaterials(selectedCourseId)
      setMaterials(res.data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load materials.')
    }
  }

  return (
    <DashboardShell title="Courses" subtitle="Manage courses and learning materials.">
      <div className="space-y-4">

          <section className="page-card page-table-card">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Class</th><th>Teacher</th></tr></thead>
              <tbody>{courses.map((c) => <tr key={c.id}><td>{c.title}</td><td>{c.class?.name || '-'}</td><td>{c.teacher?.name || '-'}</td></tr>)}</tbody>
            </table>
          </section>

          <section className="page-card">
            <form onSubmit={handleCreateCourse} className="page-card">
              <h3>Create Course</h3>
              <input className="form-input" placeholder="Title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
              <input className="form-input" placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
              <input className="form-input" placeholder="Class ID (optional)" value={courseForm.classId} onChange={(e) => setCourseForm({ ...courseForm, classId: e.target.value })} />
              <button className="btn btn-primary" type="submit">Create Course</button>
            </form>
          </section>

          <section className="page-card">
            <form onSubmit={handleAddMaterial} className="page-card">
              <h3>Add Material</h3>
              <input className="form-input" placeholder="Course ID" value={materialForm.courseId} onChange={(e) => setMaterialForm({ ...materialForm, courseId: e.target.value })} />
              <input className="form-input" placeholder="Material Title" value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} />
              <input className="form-input" placeholder="File URL" value={materialForm.fileUrl} onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })} />
              <button className="btn btn-primary" type="submit">Upload Material</button>
            </form>
          </section>

          <section className="page-card">
            <h3>Course Materials</h3>
            <div className="page-card">
              <input className="form-input" placeholder="Course ID" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} />
              <button className="btn btn-primary" onClick={loadMaterials}>Load Materials</button>
            </div>
            <div className="page-table-card">
              <table className="data-table">
                <thead><tr><th>Title</th><th>File URL</th><th>Created</th></tr></thead>
                <tbody>{materials.map((m) => <tr key={m.id}><td>{m.title}</td><td>{m.fileUrl}</td><td>{new Date(m.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
              </table>
            </div>
            {error && <p className="field-error">{error}</p>}
          </section>
      </div>
    </DashboardShell>
  )
}
