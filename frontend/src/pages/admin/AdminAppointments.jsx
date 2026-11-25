import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import AdminLayout from './AdminLayout'
import { slotLabel, statusClass, statusOf } from '../doctor/appointmentDisplay'

const AdminAppointments = () => {
  const { aToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, { headers: { atoken: token } })
      if (data.success) setAppointments(data.appointments)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load appointments')
    }
  }

  useEffect(() => {
    if (!aToken) {
      navigate('/admin')
      return
    }
    load(aToken)
  }, [aToken, backendUrl, navigate])

  const cancel = async (appointmentId) => {
    setBusyId(appointmentId)
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, { headers: { atoken: aToken } })
      if (data.success) await load(aToken)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel appointment')
    } finally {
      setBusyId('')
    }
  }

  return (
    <AdminLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Appointments</p>
      <p className='mt-1 text-sm text-slate-500'>Every booking across MediSphere.</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      <div className='mt-6 flex flex-col gap-4'>
        {appointments.length === 0 && !error && <p className='text-sm text-slate-500'>No appointments yet.</p>}
        {appointments.map((item) => {
          const status = statusOf(item)
          return (
            <div key={item._id} className='grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5'>
              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <p className='font-medium text-slate-900'>{item.userData?.name || 'Patient'}</p>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
                  {item.payment && <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600'>Paid</span>}
                </div>
                <p className='mt-1 text-sm text-slate-500'>{item.docData?.name || 'Doctor'} · {item.docData?.specialization || ''}</p>
                <p className='mt-1 text-sm text-slate-500'>{slotLabel(item)} · ${item.amount}</p>
              </div>
              {!item.cancelled && (
                <button type='button' disabled={busyId === item._id} onClick={() => cancel(item._id)} className='rounded-full border border-slate-200 px-6 py-2 text-sm text-slate-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-60'>
                  Cancel
                </button>
              )}
            </div>
          )
        })}
      </div>
    </AdminLayout>
  )
}

export default AdminAppointments
