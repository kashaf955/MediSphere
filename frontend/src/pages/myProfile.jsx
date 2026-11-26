import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const MyProfile = () => {
  const { token, user, backendUrl, loadUser } = useContext(AppContext)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setUserData({
      name: user.name || '',
      email: user.email || '',
      image: user.image || assets.profile_pic,
      phone: user.phone && user.phone !== '0000000000' ? user.phone : '',
      address: typeof user.address === 'string' && !String(user.address).includes('not specified') ? user.address : '',
      gender: user.gender && user.gender !== 'not specified' ? user.gender : 'Male',
      dob: user.dob || '',
    })
  }, [user])

  const save = async () => {
    setError('')
    setMessage('')
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        dob: userData.dob,
      }, { headers: { token } })
      if (data.success) {
        setMessage(data.message)
        setIsEdit(false)
        await loadUser(token)
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
      <img className='w-36 rounded-2xl object-cover shadow-md ring-4 ring-white' src={userData.image} alt='' />
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
      {error && <p className='text-sm text-red-500'>{error}</p>}
      {message && <p className='text-sm text-emerald-600'>{message}</p>}
      <div className='mt-10'>
        {isEdit
          ? <button type='button' className='rounded-full bg-primary px-8 py-2.5 text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5' onClick={save}>Save information</button>
          : <button type='button' className='rounded-full border border-primary px-8 py-2.5 text-primary transition hover:bg-primary hover:text-white' onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile
