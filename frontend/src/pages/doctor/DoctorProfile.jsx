import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import DoctorLayout from './DoctorLayout'

const addressText = (address) => {
  if (!address) return ''
  if (typeof address === 'object') return [address.line1, address.line2].filter(Boolean).join(', ')
  try {
    const parsed = JSON.parse(address)
    if (parsed && typeof parsed === 'object') return [parsed.line1, parsed.line2].filter(Boolean).join(', ')
  } catch {
    return String(address)
  }
  return String(address)
}

const DoctorProfile = () => {
  const { dToken, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!dToken) {
      navigate('/doctor')
      return
    }
    const load = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dtoken: dToken } })
        if (data.success) {
          setProfile({
            ...data.profile,
            address: addressText(data.profile.address),
            available: Boolean(data.profile.available),
          })
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile')
      }
    }
    load()
  }, [dToken, backendUrl, navigate])

  const save = async () => {
    setMessage('')
    setError('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, {
        fees: profile.fees,
        address: profile.address,
        available: profile.available,
        about: profile.about,
      }, { headers: { dtoken: dToken } })
      if (data.success) {
        setIsEdit(false)
        setMessage(data.message)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile')
    }
  }

  return (
    <DoctorLayout>
      <p className='text-3xl tracking-tight text-slate-900'>Profile</p>
      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}
      {message && <p className='mt-4 text-sm text-emerald-600'>{message}</p>}
      {!profile && !error && <p className='mt-8 text-sm text-slate-500'>Loading profile...</p>}
      {profile && (
        <div className='mt-6 flex max-w-2xl flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)]'>
          <div className='flex items-center gap-4'>
            <img src={profile.image} alt={profile.name} className='h-24 w-24 rounded-2xl bg-[#eef1ff] object-cover' />
            <div>
              <p className='text-2xl tracking-tight text-slate-900'>{profile.name}</p>
              <p className='text-sm text-slate-500'>{profile.degree} · {profile.specialization}</p>
              <p className='text-sm text-slate-500'>{profile.experience} years · {profile.email}</p>
            </div>
          </div>
          <div>
            <p className='text-xs tracking-[0.16em] text-slate-400'>ABOUT</p>
            {isEdit
              ? <textarea className='field min-h-28' value={profile.about} onChange={(e) => setProfile((prev) => ({ ...prev, about: e.target.value }))} />
              : <p className='mt-2 text-sm leading-6 text-slate-600'>{profile.about}</p>
            }
          </div>
          <div>
            <p className='text-xs tracking-[0.16em] text-slate-400'>APPOINTMENT FEE</p>
            {isEdit
              ? <input className='field max-w-40' type='number' value={profile.fees} onChange={(e) => setProfile((prev) => ({ ...prev, fees: e.target.value }))} />
              : <p className='mt-2 text-sm text-slate-600'>${profile.fees}</p>
            }
          </div>
          <div>
            <p className='text-xs tracking-[0.16em] text-slate-400'>ADDRESS</p>
            {isEdit
              ? <input className='field' type='text' value={profile.address} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} />
              : <p className='mt-2 text-sm text-slate-600'>{profile.address}</p>
            }
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={profile.available} disabled={!isEdit} onChange={(e) => setProfile((prev) => ({ ...prev, available: e.target.checked }))} />
            Available for appointments
          </label>
          <div>
            {isEdit
              ? <button type='button' onClick={save} className='rounded-full bg-primary px-8 py-2.5 text-white shadow-lg shadow-primary/25'>Save information</button>
              : <button type='button' onClick={() => setIsEdit(true)} className='rounded-full border border-primary px-8 py-2.5 text-primary transition hover:bg-primary hover:text-white'>Edit</button>
            }
          </div>
        </div>
      )}
    </DoctorLayout>
  )
}

export default DoctorProfile
