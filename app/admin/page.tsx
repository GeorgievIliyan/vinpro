'use client'

import { useState } from 'react'
import { copyToClipboard } from '@/lib/utils'

const AdminPage = () => {

  const [password, setPassword] = useState<string | null>('')
  const [username, setUsername] = useState<string | null>('')
  const [msg, setMsg] = useState('')

  const createAccount = async () => {
    try {
      const response = await fetch('/api/create-account', { method: 'POST' })
      const data = await response.json()
      if (response.status === 200) {
        setMsg('success')
        setPassword(data.password)
        setUsername(data.username)
      } else {
        setMsg(data.error ?? 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      setMsg('Request failed')
    }
  }

  return (
    <div>
      <h1 className='text-center font-semibold'>Admin panel</h1>
      <p className='text-green-400'>Message: {msg}</p>
      <button className='text-white bg-blue-500 py-1 px-3' onClick={() => createAccount()}>Create account</button>
      <p>username: {username}</p>
      <p>password: {password}</p>

      <button className='bg-blue-500 text-white py-2 px-1' onClick={() => copyToClipboard(`Username: ${username}, Password: ${password}`)}>Copy to clipboard</button>
    </div>
  )
}

export default AdminPage