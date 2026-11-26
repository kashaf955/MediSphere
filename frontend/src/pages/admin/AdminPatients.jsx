import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import AdminLayout from './AdminLayout'

const detail = (value) => value || 'Not provided'

const AdminPatients = () => {
  const { aToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!aToken) {
      navigate('/admin')
      return
    }
    const load = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/patients`, { headers: { atoken: aToken } })
        if (data.success) setPatients(data.patients)
        else setError(data.message)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load patients')
      }
    }
    load()
  }, [aToken, backendUrl, navigate])

  return (
    <AdminLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Patients</p>
      <p className='mt-1 text-sm text-slate-500'>Registered accounts and patients who already have a booking.</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      <div className='mt-6 grid gap-4 lg:grid-cols-2'>
        {patients.length === 0 && !error && <p className='text-sm text-slate-500'>No patients yet.</p>}
        {patients.map((patient) => (
          <div key={patient._id} className='rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-lg text-slate-900'>{patient.name}</p>
                <p className='text-sm text-slate-500'>{detail(patient.email)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${patient.registered ? 'bg-indigo-50 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                {patient.registered ? 'Registered' : 'From booking'}
              </span>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-y-2 text-sm text-slate-600'>
              <p>Phone</p><p>{detail(patient.phone)}</p>
              <p>Gender</p><p>{detail(patient.gender)}</p>
              <p>Birthday</p><p>{detail(patient.dob)}</p>
              <p>Address</p><p>{detail(patient.address)}</p>
              <p>Appointments</p><p>{patient.appointments}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminPatients
