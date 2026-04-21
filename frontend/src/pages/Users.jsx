import { useEffect, useState } from 'react'
import { getAllUsers } from '../services/auth.service'
import DashboardShell from '../components/DashboardShell'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers()
        setUsers(res.data.users || [])
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <DashboardShell title="Users" subtitle="Manage users and review account roles.">
      {loading ? (
        <div className="page-card"><p>Loading users...</p></div>
      ) : users.length === 0 ? (
        <div className="page-card"><p>No users found.</p></div>
      ) : (
        <section className="page-card page-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </DashboardShell>
  )
}
