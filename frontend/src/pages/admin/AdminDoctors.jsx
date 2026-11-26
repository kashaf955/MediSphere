import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import AdminLayout from './AdminLayout'

const AdminDoctors = () => {
  const { aToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, { headers: { atoken: token } })
      if (data.success) setDoctors(data.doctors)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load doctors')
    }
  }

  useEffect(() => {
    if (!aToken) {
      navigate('/admin')
      return
    }
    load(aToken)
  }, [aToken, backendUrl, navigate])

  const remove = async (doctor) => {
    if (!window.confirm(`Delete ${doctor.name}? This also removes their appointments.`)) return
    setBusyId(doctor._id)
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/delete-doctor`, { docId: doctor._id }, { headers: { atoken: aToken } })
      if (data.success) await load(aToken)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete doctor')
    } finally {
      setBusyId('')
    }
  }

  const toggle = async (docId) => {
    setBusyId(docId)
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { atoken: aToken } })
      if (data.success) await load(aToken)
      else setError(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update availability')
    } finally {
      setBusyId('')
    }
  }

  return (
    <AdminLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Doctors</p>
      <p className='mt-1 text-sm text-slate-500'>The email on each card is that doctor’s dashboard login at /doctor. Starting password is Doctor@123.</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      <div className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {doctors.length === 0 && !error && <p className='text-sm text-slate-500'>No doctors yet.</p>}
        {doctors.map((doctor) => (
          <div key={doctor._id} className='overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
            <img src={doctor.image} alt={doctor.name} className='h-44 w-full bg-[#eef1ff] object-cover' />
            <div className='p-4'>
              <p className='font-medium text-slate-900'>{doctor.name}</p>
              <p className='text-sm text-slate-500'>{doctor.email}</p>
              <p className='text-sm text-slate-500'>{doctor.specialization}</p>
              <p className='mt-1 text-sm text-slate-500'>{doctor.degree} · {doctor.experience} years · ${doctor.fees}</p>
              <div className='mt-4 flex flex-wrap gap-2'>
                <button
                  type='button'
                  disabled={busyId === doctor._id}
                  onClick={() => toggle(doctor._id)}
                  className={`rounded-full px-4 py-2 text-sm disabled:opacity-60 ${doctor.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  {doctor.available ? 'Available' : 'Unavailable'}
                </button>
                <button type='button' onClick={() => navigate(`/admin/doctors/${doctor._id}`)} className='rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-primary hover:text-primary'>Edit</button>
                <button
                  type='button'
                  disabled={busyId === doctor._id}
                  onClick={() => remove(doctor)}
                  className='rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-60'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminDoctors
