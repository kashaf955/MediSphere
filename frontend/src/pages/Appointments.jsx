import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointments = () => {
  const { docId } = useParams()
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    setDocInfo(doctors.find((doc) => doc._id === docId) || null)
    setBooked(false)
    setSlotTime('')
    setSlotIndex(0)
  }, [doctors, docId])

  useEffect(() => {
    if (!docInfo) return
    const slots = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)
      if (i === 0) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      const timeSlots = []
      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      slots.push(timeSlots)
    }
    setDocSlots(slots)
  }, [docInfo])

  if (!docInfo) {
    return <p className='py-10 text-gray-600'>Doctor not found.</p>
  }

  const relatedDoctors = doctors.filter((doc) => doc.speciality === docInfo.speciality && doc._id !== docInfo._id)

  return (
    <div>
      <div className='flex flex-col gap-4 pt-6 sm:flex-row'>
        <div>
          <img className='w-full rounded-3xl bg-primary shadow-[0_24px_50px_-30px_rgba(82,88,248,0.8)] sm:max-w-72' src={docInfo.image} alt={docInfo.name} />
        </div>
        <div className='mx-2 mt-[-80px] flex-1 rounded-3xl border border-slate-200/80 bg-white p-8 py-7 shadow-[0_20px_50px_-32px_rgba(26,29,46,0.45)] sm:mx-0 sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl tracking-tight text-slate-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='mt-1 flex items-center gap-2 text-sm text-slate-500'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button type='button' className='rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='mt-4 flex items-center gap-1 text-sm font-medium text-slate-900'>
              About <img src={assets.info_icon} alt='' />
            </p>
            <p className='mt-1 max-w-[700px] text-sm leading-6 text-slate-500'>{docInfo.about}</p>
          </div>
          <p className='mt-4 text-slate-500'>
            Appointment fee: <span className='font-medium text-slate-800'>${docInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className='mt-6 font-medium text-slate-700 sm:ml-72 sm:pl-4'>
        <p className='text-lg tracking-tight text-slate-800'>Booking slots</p>
        <div className='mt-4 flex w-full items-center gap-3 overflow-x-scroll'>
          {docSlots.map((item, index) => (
            <button
              type='button'
              onClick={() => {
                setSlotIndex(index)
                setSlotTime('')
                setBooked(false)
              }}
              className={`min-w-16 rounded-full py-6 text-center text-sm transition ${slotIndex === index ? 'bg-primary text-white shadow-md shadow-primary/30' : 'border border-slate-200 bg-white text-slate-600'}`}
              key={index}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </button>
          ))}
        </div>
        <div className='mt-4 flex w-full items-center gap-3 overflow-x-scroll'>
          {docSlots[slotIndex]?.map((item, index) => (
            <button
              type='button'
              onClick={() => {
                setSlotTime(item.time)
                setBooked(false)
              }}
              className={`shrink-0 rounded-full px-5 py-2 text-sm transition ${item.time === slotTime ? 'bg-primary text-white shadow-md shadow-primary/25' : 'border border-slate-200 bg-white text-slate-500'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>
        <button
          type='button'
          onClick={() => slotTime && setBooked(true)}
          className='my-6 rounded-full bg-primary px-14 py-3 text-sm text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5'
        >
          Book an appointment
        </button>
        {booked && (
          <p className='mb-6 text-sm font-normal text-green-600'>
            Appointment selected for {daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]} {docSlots[slotIndex][0].datetime.getDate()} at {slotTime.toLowerCase()}.
          </p>
        )}
      </div>

      <div className='flex flex-col items-center gap-4 py-16 text-gray-900'>
        <h1 className='text-3xl tracking-tight text-slate-900'>Related Doctors</h1>
        <p className='text-center text-sm text-slate-500'>Simply browse through our extensive list of trusted doctors.</p>
        <div className='grid w-full grid-cols-1 gap-4 gap-y-6 px-3 pt-5 sm:grid-cols-2 sm:px-0 md:grid-cols-3 lg:grid-cols-5'>
          {relatedDoctors.slice(0, 5).map((item) => (
            <div
              onClick={() => {
                navigate(`/appointments/${item._id}`)
                scrollTo(0, 0)
              }}
              className='group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(26,29,46,0.55)] transition duration-300 hover:-translate-y-1.5'
              key={item._id}
            >
              <img className='bg-[#eef1ff] transition duration-500 group-hover:scale-[1.03]' src={item.image} alt={item.name} />
              <div className='p-4'>
                <div className='flex items-center gap-2 text-xs font-medium text-emerald-600'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                  <p>Available</p>
                </div>
                <p className='text-base font-medium text-slate-900'>{item.name}</p>
                <p className='text-sm text-slate-500'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Appointments
