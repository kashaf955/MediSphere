import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { slotLabel, statusClass, statusOf } from '../pages/doctor/appointmentDisplay'
import SuggestedDoctors from './SuggestedDoctors'

const photo = (src) => (!src || String(src).includes('placeholder.com') ? assets.profile_pic : src)

const PatientHome = () => {
  const { token, user, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    let cancelled = false
    const load = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
        if (cancelled) return
        if (data.success) setAppointments(data.appointments)
        else setError(data.message)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Unable to load your appointments')
      }
    }
    load()
    return () => { cancelled = true }
  }, [token, backendUrl])

  const upcoming = appointments.filter((item) => !item.cancelled && !item.isCompleted)
  const doctors = []
  const seen = new Set()
  appointments.forEach((item) => {
    if (!item.docId || seen.has(item.docId)) return
    seen.add(item.docId)
    doctors.push(item)
  })

  return (
    <div className='py-8'>
      <div className='flex flex-col gap-4 rounded-[1.75rem] bg-gradient-to-br from-[#6d73ff] via-primary to-[#343ad4] px-6 py-8 text-white shadow-[0_28px_60px_-32px_rgba(82,88,248,0.85)] sm:flex-row sm:items-center sm:justify-between sm:px-8'>
        <div className='flex items-center gap-4'>
          <img src={photo(user?.image)} alt='' className='h-16 w-16 rounded-2xl object-cover ring-4 ring-white/30' />
          <div>
            <p className='text-sm text-white/80'>Welcome back</p>
            <h1 className='font-brand text-3xl tracking-tight'>{user?.name || 'Your care'}</h1>
          </div>
        </div>
        <button type='button' onClick={() => navigate('/doctors')} className='w-fit rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-700'>Book a doctor</button>
      </div>

      <div className='mt-6 grid gap-4 sm:grid-cols-3'>
        {[
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Appointments', value: appointments.length },
          { label: 'Your doctors', value: doctors.length },
        ].map((card) => (
          <div key={card.label} className='rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
            <p className='text-xs tracking-[0.16em] text-slate-400'>{card.label.toUpperCase()}</p>
            <p className='mt-2 text-3xl tracking-tight text-slate-900'>{card.value}</p>
          </div>
        ))}
      </div>

      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}

      <div className='mt-10'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='font-brand text-2xl tracking-tight text-slate-900'>Your appointments</h2>
          <button type='button' onClick={() => navigate('/my-appointments')} className='text-sm text-primary'>View all</button>
        </div>
        <div className='mt-4 flex flex-col gap-3'>
          {appointments.length === 0 && <p className='text-sm text-slate-500'>You have no appointments yet. Book a doctor to see them here.</p>}
          {appointments.slice(0, 4).map((item) => {
            const status = statusOf(item)
            return (
              <button type='button' key={item._id} onClick={() => navigate('/my-appointments')} className='flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left'>
                <div className='flex items-center gap-3'>
                  <img src={item.docData?.image} alt='' className='h-12 w-12 rounded-xl bg-[#eef1ff] object-cover' />
                  <div>
                    <p className='font-medium text-slate-900'>{item.docData?.name}</p>
                    <p className='text-xs text-slate-500'>{item.docData?.specialization} · {slotLabel(item)}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className='mt-10'>
        <h2 className='font-brand text-2xl tracking-tight text-slate-900'>Your doctors</h2>
        {doctors.length === 0 && <p className='mt-3 text-sm text-slate-500'>Doctors you book will show up here.</p>}
        {doctors.length > 0 && (
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {doctors.map((item) => (
              <button type='button' key={item.docId} onClick={() => navigate(`/appointments/${item.docId}`)} className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-primary'>
                <img src={item.docData?.image} alt='' className='h-14 w-14 rounded-xl bg-[#eef1ff] object-cover' />
                <div>
                  <p className='font-medium text-slate-900'>{item.docData?.name}</p>
                  <p className='text-xs text-slate-500'>{item.docData?.specialization}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <SuggestedDoctors />
    </div>
  )
}

export default PatientHome
