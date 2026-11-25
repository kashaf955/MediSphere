import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorLogin = () => {
  const { backendUrl, setDToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
      if (data.success) {
        localStorage.setItem('dToken', data.token)
        setDToken(data.token)
        navigate('/doctor/dashboard')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login')
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex min-h-screen items-center bg-[#f4f6fb] px-4 py-10'>
      <div className='m-auto flex w-full max-w-md flex-col items-start gap-3 rounded-3xl border border-slate-200/80 bg-white p-8 text-sm text-slate-600 shadow-[0_24px_60px_-32px_rgba(26,29,46,0.45)] sm:p-10'>
        <img src={assets.logo} alt='MediSphere' className='mb-2 h-12 w-32' />
        <p className='text-3xl tracking-tight text-slate-900'>Doctor login</p>
        <p className='mb-2 text-slate-500'>Sign in to open your dashboard</p>
        <div className='w-full'>
          <p className='text-xs tracking-wide text-slate-500'>Email</p>
          <input className='field' type='email' onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>
        <div className='w-full'>
          <p className='text-xs tracking-wide text-slate-500'>Password</p>
          <input className='field' type='password' onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>
        {error && <p className='text-sm text-red-500'>{error}</p>}
        <button type='submit' className='mt-3 w-full rounded-full bg-primary py-3 text-base text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5'>Login</button>
      </div>
    </form>
  )
}

export default DoctorLogin
