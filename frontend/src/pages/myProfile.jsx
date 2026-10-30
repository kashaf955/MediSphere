import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: 'Edward Vincent',
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Church Road, London',
    },
    gender: 'Male',
    dob: '2000-01-20',
  })
  const [isEdit, setIsEdit] = useState(false)

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
            : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {isEdit
            ? <p>
                <input className='field' onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} type='text' />
                <input className='field' onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} type='text' />
              </p>
            : <p className='text-gray-500'>{userData.address.line1}<br />{userData.address.line2}</p>
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
              </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {isEdit
            ? <input className='field max-w-40' type='date' onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {isEdit
          ? <button type='button' className='rounded-full bg-primary px-8 py-2.5 text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5' onClick={() => setIsEdit(false)}>Save information</button>
          : <button type='button' className='rounded-full border border-primary px-8 py-2.5 text-primary transition hover:bg-primary hover:text-white' onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile
