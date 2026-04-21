import { useEffect, useState } from 'react'
import { getAllClasses } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClasses()
        setClasses(res.data.data || [])
      } catch (error) {
        console.error('Error fetching classes:', error)
        setClasses([])
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  return (
    <DashboardShell title="Classes" subtitle="See the active class list and teacher assignments.">
      {loading ? (
        <div className="page-card"><p>Loading classes...</p></div>
      ) : classes.length === 0 ? (
        <div className="page-card"><p>No classes found.</p></div>
      ) : (
        <section className="page-card page-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Room</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((kelas) => (
                <tr key={kelas.id}>
                  <td>{kelas.name}</td>
                  <td>{kelas.room}</td>
                  <td>{kelas.teacher?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </DashboardShell>
  )
}
