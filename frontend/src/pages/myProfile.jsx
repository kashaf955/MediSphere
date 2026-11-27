import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets, specialityData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { slotLabel, statusClass, statusOf } from './doctor/appointmentDisplay'

const MyProfile = () => {
  const { token, user, backendUrl, loadUser } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [userData, setUserData] = useState(null)
  const [completing, setCompleting] = useState(Boolean(location.state?.complete))
  const [isEdit, setIsEdit] = useState(Boolean(location.state?.complete))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!user) return
    setUserData({
      name: user.name || '',
      email: user.email || '',
      image: !user.image || user.image.includes('placeholder.com') ? assets.profile_pic : user.image,
      phone: user.phone && user.phone !== '0000000000' ? user.phone : '',
      address: typeof user.address === 'string' && !String(user.address).includes('not specified') ? user.address : '',
      gender: user.gender && user.gender !== 'not specified' ? user.gender : 'Male',
      dob: user.dob || '',
      concern: user.concern || '',
      preferredSpeciality: user.preferredSpeciality || '',
    })
  }, [user])

  useEffect(() => {
    if (!token) return
    const loadAppointments = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
        if (data.success) setAppointments(data.appointments)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load appointments')
      }
    }
    loadAppointments()
  }, [token, backendUrl])

  const save = async () => {
    setError('')
    setMessage('')
    try {
      const body = new FormData()
      body.append('name', userData.name)
      body.append('phone', userData.phone)
      body.append('address', userData.address)
      body.append('gender', userData.gender)
      body.append('dob', userData.dob)
      body.append('concern', userData.concern)
      body.append('preferredSpeciality', userData.preferredSpeciality)
      if (imageFile) body.append('image', imageFile)
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, body, { headers: { token } })
      if (data.success) {
        setMessage(data.message)
        setIsEdit(false)
        setImageFile(null)
        setPreview('')
        const next = completing ? (location.state?.from || '/my-profile') : ''
        setCompleting(false)
        await loadUser(token)
        if (next && next !== '/my-profile') navigate(next, { replace: true })
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile')
    }
  }

  if (!token) {
    return (
      <div className='py-16'>
        <p className='text-2xl tracking-tight text-slate-900'>My profile</p>
        <button type='button' onClick={() => navigate('/login', { state: { from: '/my-profile' } })} className='mt-6 rounded-full bg-primary px-8 py-3 text-sm text-white'>Login</button>
      </div>
    )
  }

  if (!userData) return <p className='py-10 text-sm text-slate-500'>Loading profile...</p>

  return (
    <div className='flex max-w-lg flex-col gap-2 pt-8 text-sm'>
      {completing && (
        <div className='mb-4 rounded-3xl border border-primary/20 bg-[#eef1ff] px-5 py-4'>
          <p className='text-lg tracking-tight text-slate-900'>Complete your profile</p>
          <p className='mt-1 text-slate-500'>Add your phone, address, birthday, photo, and what you need help with. You can also skip and finish this later.</p>
        </div>
      )}
      {isEdit
        ? <label className='relative w-36 cursor-pointer'>
            <img className='h-36 w-36 rounded-2xl object-cover shadow-md ring-4 ring-white' src={preview || userData.image} alt='' />
            <span className='absolute inset-x-0 bottom-0 rounded-b-2xl bg-slate-900/60 py-1.5 text-center text-xs text-white'>Change photo</span>
            <input type='file' accept='image/*' hidden onChange={(e) => {
              const file = e.target.files?.[0] || null
              setImageFile(file)
              setPreview(file ? URL.createObjectURL(file) : '')
            }} />
          </label>
        : <img className='h-36 w-36 rounded-2xl object-cover shadow-md ring-4 ring-white' src={userData.image} alt='' />
      }
      {isEdit
        ? <input className='field mt-4 max-w-60 text-2xl' type='text' value={userData.name} onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />
        : <p className='mt-4 text-3xl tracking-tight text-slate-900'>{userData.name}</p>
      }
      <hr className='my-2 h-px border-none bg-slate-200' />
      <div>
        <p className='mt-3 text-xs tracking-[0.16em] text-slate-400'>CONTACT INFORMATION</p>
        <div className='mt-3 grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {isEdit
            ? <input className='field max-w-52' type='text' value={userData.phone} onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} />
            : <p className='text-blue-400'>{userData.phone || 'Not provided'}</p>
          }
          <p className='font-medium'>Address:</p>
          {isEdit
            ? <input className='field' value={userData.address} onChange={(e) => setUserData((prev) => ({ ...prev, address: e.target.value }))} type='text' />
            : <p className='text-gray-500'>{userData.address || 'Not provided'}</p>
          }
        </div>
      </div>
      <div>
        <p className='mt-3 text-xs tracking-[0.16em] text-slate-400'>BASIC INFORMATION</p>
        <div className='mt-3 grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit
            ? <select className='field max-w-28' onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {isEdit
            ? <input className='field max-w-40' type='date' onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
            : <p className='text-gray-400'>{userData.dob || 'Not provided'}</p>
          }
        </div>
      </div>
      <div>
        <p className='mt-3 text-xs tracking-[0.16em] text-slate-400'>WHAT YOU NEED HELP WITH</p>
        <div className='mt-3 flex flex-col gap-2.5 text-neutral-700'>
          {isEdit
            ? <textarea className='field min-h-24' placeholder='Describe the symptoms or concern' value={userData.concern} onChange={(e) => setUserData((prev) => ({ ...prev, concern: e.target.value }))} />
            : <p className='text-gray-500'>{userData.concern || 'Not provided'}</p>
          }
          <p className='font-medium'>Preferred speciality</p>
          {isEdit
            ? <select className='field max-w-60' value={userData.preferredSpeciality} onChange={(e) => setUserData((prev) => ({ ...prev, preferredSpeciality: e.target.value }))}>
                <option value=''>No preference</option>
                {specialityData.map((item) => <option key={item.speciality} value={item.speciality}>{item.speciality}</option>)}
              </select>
            : <p className='text-gray-400'>{userData.preferredSpeciality || 'No preference'}</p>
          }
        </div>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
      {message && <p className='text-sm text-emerald-600'>{message}</p>}
      <div className='mt-10 flex flex-wrap gap-3'>
        {isEdit
          ? <button type='button' className='rounded-full bg-primary px-8 py-2.5 text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5' onClick={save}>{completing ? 'Save profile' : 'Save information'}</button>
          : <button type='button' className='rounded-full border border-primary px-8 py-2.5 text-primary transition hover:bg-primary hover:text-white' onClick={() => setIsEdit(true)}>Edit</button>
        }
        {completing && (
          <button type='button' className='rounded-full border border-slate-200 px-8 py-2.5 text-slate-600 transition hover:border-slate-400' onClick={() => navigate(location.state?.from || '/', { replace: true })}>Skip for now</button>
        )}
      </div>
      {!completing && (
        <div className='mt-8'>
          <p className='text-xs tracking-[0.16em] text-slate-400'>APPOINTMENTS</p>
          <div className='mt-3 flex flex-col gap-3'>
            {appointments.length === 0 && <p className='text-sm text-slate-500'>No appointments yet.</p>}
            {appointments.map((item) => {
              const status = statusOf(item)
              return (
                <div key={item._id} className='flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3'>
                  <div>
                    <p className='font-medium text-slate-900'>{item.docData?.name}</p>
                    <p className='text-xs text-slate-500'>{slotLabel(item)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>{status}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfile
