import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import DoctorLayout from './DoctorLayout'
import { slotLabel, statusClass, statusOf } from './appointmentDisplay'

const DoctorAppointments = () => {
  const { dToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { dtoken: token } })
      if (data.success) setAppointments(data.appointments)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load appointments')
    }
  }

  useEffect(() => {
    if (!dToken) {
      navigate('/doctor')
      return
    }
    load(dToken)
  }, [dToken, backendUrl, navigate])

  const update = async (path, appointmentId) => {
    setBusyId(appointmentId)
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/${path}`, { appointmentId }, { headers: { dtoken: dToken } })
      if (data.success) await load(dToken)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update appointment')
    } finally {
      setBusyId('')
    }
  }

  return (
    <DoctorLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Appointments</p>
      <p className='mt-1 text-sm text-slate-500'>Complete a visit or cancel a booking.</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      <div className='mt-6 flex flex-col gap-4'>
        {appointments.length === 0 && !error && <p className='text-sm text-slate-500'>No appointments yet.</p>}
        {appointments.map((item) => {
          const status = statusOf(item)
          const open = !item.cancelled && !item.isCompleted
          return (
            <div key={item._id} className='grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5'>
              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <p className='font-medium text-slate-900'>{item.userData?.name || 'Patient'}</p>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
                  {item.payment && <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600'>Paid</span>}
                </div>
                <p className='mt-1 text-sm text-slate-500'>{slotLabel(item)}</p>
                <p className='mt-1 text-sm text-slate-500'>Fee ${item.amount}</p>
              </div>
              {open && (
                <div className='flex flex-col gap-2 sm:min-w-40'>
                  <button type='button' disabled={busyId === item._id} onClick={() => update('complete-appointment', item._id)} className='rounded-full bg-primary py-2 text-sm text-white shadow-md shadow-primary/25 disabled:opacity-60'>Complete</button>
                  <button type='button' disabled={busyId === item._id} onClick={() => update('cancel-appointment', item._id)} className='rounded-full border border-slate-200 py-2 text-sm text-slate-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-60'>Cancel</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DoctorLayout>
  )
}

export default DoctorAppointments
