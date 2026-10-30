import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { specialityData } from '../assets/assets'

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (speciality) {
      setFilteredDoctors(doctors.filter((item) => item.speciality === speciality))
    } else {
      setFilteredDoctors(doctors)
    }
  }, [speciality, doctors])

  return (
    <div className='pt-6'>
      <p className='text-sm text-slate-500'>Browse through the doctors specialist.</p>
      <div className='mt-6 flex flex-col items-start gap-6 sm:flex-row'>
        <div className='flex w-full flex-col gap-2 text-sm sm:w-56'>
          {specialityData.map((item) => (
            <button
              key={item.speciality}
              type='button'
              onClick={() => {
                navigate(speciality === item.speciality ? '/doctors' : `/doctors/${item.speciality}`)
                scrollTo(0, 0)
              }}
              className={`cursor-pointer rounded-full border px-4 py-2 text-left transition ${speciality === item.speciality ? 'border-primary bg-primary text-white shadow-md shadow-primary/25' : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'}`}
            >
              {item.speciality}
            </button>
          ))}
        </div>
        <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredDoctors.map((item) => (
            <div
              onClick={() => {
                navigate(`/appointments/${item._id}`)
                scrollTo(0, 0)
              }}
              className='group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(26,29,46,0.55)] transition duration-300 hover:-translate-y-1.5'
              key={item._id}
            >
              <img src={item.image} alt={item.name} className='w-full bg-[#eef1ff] object-cover transition duration-500 group-hover:scale-[1.03]' />
              <div className='flex flex-col gap-1 px-4 py-4'>
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

export default Doctors
