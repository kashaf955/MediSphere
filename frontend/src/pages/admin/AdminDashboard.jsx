import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import AdminLayout from './AdminLayout'
import { slotLabel, statusClass, statusOf } from '../doctor/appointmentDisplay'

const AdminDashboard = () => {
  const { aToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [dashData, setDashData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!aToken) {
      navigate('/admin')
      return
    }
    const load = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, { headers: { atoken: aToken } })
        if (data.success) setDashData(data.dashData)
        else setError(data.message)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard')
      }
    }
    load()
  }, [aToken, backendUrl, navigate])

  const cards = dashData ? [
    { label: 'Doctors', value: dashData.doctors },
    { label: 'Appointments', value: dashData.appointments },
    { label: 'Patients', value: dashData.patients },
  ] : []

  return (
    <AdminLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Dashboard</p>
      <p className='mt-1 text-sm text-slate-500'>Doctors, appointments, and the latest bookings.</p>
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
            <div className='flex items-center justify-between gap-3'>
              <p className='text-lg tracking-tight text-slate-900'>Patients</p>
              <button type='button' onClick={() => navigate('/admin/patients')} className='text-sm text-primary'>View all</button>
            </div>
            <div className='mt-4 flex flex-col gap-3'>
              {dashData.latestPatients.length === 0 && <p className='text-sm text-slate-500'>No patients yet.</p>}
              {dashData.latestPatients.map((patient) => (
                <div key={patient._id} className='flex flex-col gap-1 border-t border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <p className='font-medium text-slate-900'>{patient.name}</p>
                    <p className='text-sm text-slate-500'>{patient.email || 'No email'} · {patient.phone || 'No phone'}</p>
                  </div>
                  <p className='text-sm text-slate-500'>{`${patient.appointments} appointment${patient.appointments === 1 ? '' : 's'}`}</p>
                </div>
              ))}
            </div>
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
                      <p className='text-sm text-slate-500'>{item.docData?.name || 'Doctor'} · {slotLabel(item)}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard
