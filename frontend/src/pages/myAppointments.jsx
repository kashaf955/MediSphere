import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { slotLabel } from './doctor/appointmentDisplay'

const MyAppointments = () => {
  const { token, backendUrl, loadDoctors } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) setAppointments(data.appointments)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load appointments')
    }
  }

  useEffect(() => {
    if (!token) return
    load()
  }, [token])

  const update = async (path, appointmentId) => {
    setBusyId(appointmentId)
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/${path}`, { appointmentId }, { headers: { token } })
      if (data.success) {
        await load()
        if (path === 'cancel-appointment') await loadDoctors()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update appointment')
    } finally {
      setBusyId('')
    }
  }

  if (!token) {
    return (
      <div className='py-16'>
        <p className='text-2xl tracking-tight text-slate-900'>My appointments</p>
        <p className='mt-2 text-sm text-slate-500'>Login to see the appointments you booked.</p>
        <button type='button' onClick={() => navigate('/login', { state: { from: '/my-appointments' } })} className='mt-6 rounded-full bg-primary px-8 py-3 text-sm text-white'>Login</button>
      </div>
    )
  }

  return (
    <div>
      <p className='mt-10 text-2xl tracking-tight text-slate-900'>My appointments</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      <div className='mt-6 flex flex-col gap-4'>
        {appointments.length === 0 && !error && <p className='text-sm text-slate-500'>You have no appointments yet.</p>}
        {appointments.map((item) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:flex sm:gap-6' key={item._id}>
            <div>
              <img className='w-32 rounded-2xl bg-[#eef1ff]' src={item.docData?.image} alt={item.docData?.name} />
            </div>
            <div className='flex-1 text-sm text-slate-600'>
              <p className='font-medium text-slate-900'>{item.docData?.name}</p>
              <p>{item.docData?.specialization}</p>
              <p className='mt-2 text-xs tracking-wide text-slate-400'>ADDRESS</p>
              <p className='text-xs leading-5'>{item.docData?.address}</p>
              <p className='mt-2 text-xs'><span className='font-medium text-slate-700'>Date & Time </span>{slotLabel(item)}</p>
              {item.cancelled && <p className='mt-2 text-xs text-red-500'>Cancelled</p>}
            </div>
            <div className='flex flex-col justify-end gap-2'>
              {!item.cancelled && !item.payment && (
                <button type='button' disabled={busyId === item._id} onClick={() => update('pay-appointment', item._id)} className='rounded-full border border-slate-200 py-2 text-center text-sm text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white sm:min-w-48'>Pay Online</button>
              )}
              {!item.cancelled && item.payment && (
                <button type='button' className='rounded-full border border-emerald-200 bg-emerald-50 py-2 text-center text-sm text-emerald-600 sm:min-w-48'>Paid</button>
              )}
              {!item.cancelled && (
                <button type='button' disabled={busyId === item._id} onClick={() => update('cancel-appointment', item._id)} className='rounded-full border border-slate-200 py-2 text-center text-sm text-slate-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white sm:min-w-48'>Cancel appointment</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
