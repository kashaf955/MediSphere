import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { assets } from '../assets/assets'

const Appointments = () => {
  const { docId } = useParams()
  const { doctors, doctorsLoaded, token, user, backendUrl, loadDoctors } = useContext(AppContext)
  const navigate = useNavigate()
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', gender: 'Male', dob: '', address: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDocInfo(doctors.find((doc) => doc._id === docId) || null)
    setMessage('')
    setError('')
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
        time: currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      slots.push(timeSlots)
    }
    setDocSlots(slots)
  }, [docInfo])

  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      name: user.name || '',
      phone: user.phone && user.phone !== '0000000000' ? user.phone : prev.phone,
      gender: user.gender && user.gender !== 'not specified' ? user.gender : prev.gender,
      dob: user.dob || prev.dob,
      address: typeof user.address === 'string' && !user.address.includes('not specified') ? user.address : prev.address,
    }))
  }, [user])

  const slotDateOf = (slot) => {
    const date = slot.datetime
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
  }

  const isTaken = (slot) => {
    const booked = docInfo?.slots_booked?.[slotDateOf(slot)]
    return Array.isArray(booked) && booked.includes(slot.time)
  }

  const bookAppointment = async (event) => {
    event.preventDefault()
    if (!slotTime) {
      setError('Choose a time slot first')
      return
    }
    if (!token) {
      navigate('/login', { state: { from: `/appointments/${docId}` } })
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    const slot = docSlots[slotIndex].find((item) => item.time === slotTime)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, {
        docId,
        slotDate: slotDateOf(slot),
        slotTime,
        ...form,
      }, { headers: { token } })
      if (data.success) {
        setMessage(data.message)
        await loadDoctors()
        navigate('/my-appointments')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to book appointment')
    } finally {
      setSaving(false)
    }
  }
  if (!doctorsLoaded) {
    return <p className='py-10 text-gray-600'>Loading doctor...</p>
  }

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
                setError('')
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
              disabled={isTaken(item)}
              onClick={() => {
                setSlotTime(item.time)
                setError('')
              }}
              className={`shrink-0 rounded-full px-5 py-2 text-sm transition ${isTaken(item) ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-300 line-through' : item.time === slotTime ? 'bg-primary text-white shadow-md shadow-primary/25' : 'border border-slate-200 bg-white text-slate-500'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>
        {!token && (
          <button
            type='button'
            onClick={() => slotTime && navigate('/login', { state: { from: `/appointments/${docId}` } })}
            className='my-6 rounded-full bg-primary px-14 py-3 text-sm text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5'
          >
            Login to book
          </button>
        )}
        {token && (
          <form onSubmit={bookAppointment} className='mt-6 grid max-w-xl gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 font-normal'>
            <p className='text-lg font-medium text-slate-800'>Patient details</p>
            <p className='text-sm text-slate-500'>These details are saved with the appointment.</p>
            <div>
              <p className='text-xs tracking-wide text-slate-500'>Full name</p>
              <input className='field' value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            </div>
            <div>
              <p className='text-xs tracking-wide text-slate-500'>Phone</p>
              <input className='field' value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
            </div>
            <div>
              <p className='text-xs tracking-wide text-slate-500'>Gender</p>
              <select className='field' value={form.gender} onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>
            <div>
              <p className='text-xs tracking-wide text-slate-500'>Date of birth</p>
              <input className='field' type='date' value={form.dob} onChange={(e) => setForm((prev) => ({ ...prev, dob: e.target.value }))} required />
            </div>
            <div>
              <p className='text-xs tracking-wide text-slate-500'>Address</p>
              <input className='field' value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} required />
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            {message && <p className='text-sm text-emerald-600'>{message}</p>}
            <button type='submit' disabled={saving || !slotTime} className='rounded-full bg-primary px-8 py-3 text-sm text-white shadow-lg shadow-primary/30 disabled:opacity-60'>
              {saving ? 'Booking...' : slotTime ? 'Book appointment' : 'Select a time first'}
            </button>
          </form>
        )}
        {!token && error && <p className='mb-6 text-sm font-normal text-red-500'>{error}</p>}
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
