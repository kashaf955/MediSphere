import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {
  const { doctors } = useContext(AppContext)
  const [appointments, setAppointments] = useState(() =>
    doctors.slice(0, 3).map((doctor, index) => ({
      ...doctor,
      dateTime: ['25 July 2024 | 8:30 PM', '12 August 2024 | 10:00 AM', '3 September 2024 | 4:30 PM'][index],
      paid: false,
    }))
  )

  return (
    <div>
      <p className='mt-10 text-2xl tracking-tight text-slate-900'>My appointments</p>
      <div className='mt-6 flex flex-col gap-4'>
        {appointments.map((item) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(26,29,46,0.45)] sm:flex sm:gap-6' key={item._id}>
            <div>
              <img className='w-32 rounded-2xl bg-[#eef1ff]' src={item.image} alt={item.name} />
            </div>
            <div className='flex-1 text-sm text-slate-600'>
              <p className='font-medium text-slate-900'>{item.name}</p>
              <p>{item.speciality}</p>
              <p className='mt-2 text-xs tracking-wide text-slate-400'>ADDRESS</p>
              <p className='text-xs leading-5'>{item.address.line1}</p>
              <p className='text-xs leading-5'>{item.address.line2}</p>
              <p className='mt-2 text-xs'><span className='font-medium text-slate-700'>Date & Time </span>{item.dateTime}</p>
            </div>
            <div className='flex flex-col justify-end gap-2'>
              {!item.paid && (
                <button
                  type='button'
                  onClick={() => setAppointments((prev) => prev.map((appt) => appt._id === item._id ? { ...appt, paid: true } : appt))}
                  className='rounded-full border border-slate-200 py-2 text-center text-sm text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white sm:min-w-48'
                >
                  Pay Online
                </button>
              )}
              {item.paid && (
                <button type='button' className='rounded-full border border-emerald-200 bg-emerald-50 py-2 text-center text-sm text-emerald-600 sm:min-w-48'>Paid</button>
              )}
              <button
                type='button'
                onClick={() => setAppointments((prev) => prev.filter((appt) => appt._id !== item._id))}
                className='rounded-full border border-slate-200 py-2 text-center text-sm text-slate-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white sm:min-w-48'
              >
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
