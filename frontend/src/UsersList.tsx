import React, { useEffect, useState } from 'react'
import { fetchUsers } from './api'

function UsersList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error)
  }, [])

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.full_name} ({user.role})</li>
      ))}
    </ul>
  )
}

export default UsersList
