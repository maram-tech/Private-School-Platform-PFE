import { useEffect, useState } from 'react'
import { getAllTeachers } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await getAllTeachers()
        setTeachers(res.data.data || [])
      } catch (error) {
        console.error('Error fetching teachers:', error)
        setTeachers([])
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
  }, [])

  return (
    <DashboardShell title="Teachers" subtitle="Review the staff roster and contact details.">

          {loading ? (
            <div className="page-card"><p>Loading teachers...</p></div>
          ) : teachers.length === 0 ? (
            <div className="page-card"><p>No teachers found.</p></div>
          ) : (
            <section className="page-card page-table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
    </DashboardShell>
  )
}
