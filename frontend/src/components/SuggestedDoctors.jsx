import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const SuggestedDoctors = () => {
  const { token, user, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [suggestion, setSuggestion] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setSuggestion(null)
      setMessage('')
      return
    }
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/suggest-doctors`, {}, { headers: { token } })
        if (cancelled) return
        if (data.success) {
          setSuggestion(data)
          setMessage('')
        } else {
          setSuggestion(null)
          setMessage(data.message)
        }
      } catch (err) {
        if (cancelled) return
        setSuggestion(null)
        setMessage(err.response?.data?.message || 'Unable to suggest doctors')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token, backendUrl, user?.concern, user?.preferredSpeciality])

  if (!token) return null

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16'>
      <h1 className='font-brand text-3xl tracking-tight text-slate-900'>Suggested for you</h1>
      <p className='max-w-md text-center text-sm leading-6 text-slate-500'>
        {suggestion?.reason || (user?.name ? `Doctors picked from ${user.name}'s profile.` : 'Doctors picked from your profile.')}
      </p>
      {loading && !suggestion && <p className='text-sm text-slate-500'>Looking at your profile...</p>}
      {message && !suggestion && (
        <div className='flex flex-col items-center gap-3'>
          <p className='text-sm text-slate-500'>{message}</p>
          <button type='button' onClick={() => navigate('/my-profile')} className='rounded-full bg-primary px-8 py-3 text-sm text-white shadow-lg shadow-primary/25'>Add what you need help with</button>
        </div>
      )}
      {suggestion && suggestion.doctors.length === 0 && (
        <p className='text-sm text-slate-500'>No available doctors in {suggestion.speciality} right now.</p>
      )}
      {suggestion && suggestion.doctors.length > 0 && (
        <div className='mt-4 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {suggestion.doctors.map((doctor) => (
            <div onClick={() => { navigate(`/appointments/${doctor._id}`); scrollTo(0, 0) }} className='group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(26,29,46,0.55)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-24px_rgba(82,88,248,0.55)]' key={doctor._id}>
              <img src={doctor.image} alt={doctor.name} className='h-48 w-full bg-[#eef1ff] object-cover transition duration-500 group-hover:scale-[1.03]' />
              <div className='flex flex-col gap-1 px-4 py-4'>
                <div className='flex items-center gap-2 text-xs font-medium text-emerald-600'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                  <p>Available</p>
                </div>
                <p className='text-base font-medium text-slate-900'>{doctor.name}</p>
                <p className='text-sm text-slate-500'>{doctor.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SuggestedDoctors
