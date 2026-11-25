import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import DoctorLayout from './DoctorLayout'
import { slotLabel, statusClass, statusOf } from './appointmentDisplay'

const DoctorDashboard = () => {
  const { dToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [dashData, setDashData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!dToken) {
      navigate('/doctor')
      return
    }
    const load = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: { dtoken: dToken } })
        if (data.success) setDashData(data.dashData)
        else setError(data.message)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard')
      }
    }
    load()
  }, [dToken, backendUrl, navigate])

  const cards = dashData ? [
    { label: 'Earnings', value: `$${dashData.earnings}` },
    { label: 'Appointments', value: dashData.appointments },
    { label: 'Patients', value: dashData.patients },
  ] : []

  return (
    <DoctorLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Dashboard</p>
      <p className='mt-1 text-sm text-slate-500'>Earnings, appointments, and the patients waiting on you.</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      {!dashData && !error && <p className='mt-8 text-sm text-slate-500'>Loading dashboard...</p>}
      {dashData && (
        <>
          <div className='mt-6 grid gap-4 sm:grid-cols-3'>
            {cards.map((card) => (
              <div key={card.label} className='rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
                <p className='text-xs tracking-[0.16em] text-slate-400'>{card.label.toUpperCase()}</p>
                <p className='mt-3 text-3xl tracking-tight text-slate-900'>{card.value}</p>
              </div>
            ))}
          </div>
          <div className='mt-8 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:p-6'>
            <p className='text-lg tracking-tight text-slate-900'>Latest appointments</p>
            <div className='mt-4 flex flex-col gap-3'>
              {dashData.latestAppointments.length === 0 && <p className='text-sm text-slate-500'>No appointments yet.</p>}
              {dashData.latestAppointments.map((item) => {
                const status = statusOf(item)
                return (
                  <div key={item._id} className='flex flex-col gap-2 border-t border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='font-medium text-slate-900'>{item.userData?.name || 'Patient'}</p>
                      <p className='text-sm text-slate-500'>{slotLabel(item)}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </DoctorLayout>
  )
}

export default DoctorDashboard
