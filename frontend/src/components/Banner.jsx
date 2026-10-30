import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className='relative mb-16 mt-28 flex overflow-visible rounded-[1.75rem] bg-gradient-to-br from-[#6d73ff] via-primary to-[#343ad4] px-6 shadow-[0_28px_60px_-32px_rgba(82,88,248,0.75)] sm:px-10 md:px-14 lg:px-12'>
        {/* ------ left side ------ */}
        <div className='relative z-10 flex-1 py-6 sm:py-8 md:pr-6 lg:py-10 lg:pl-5'>
            <div className='font-brand text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl lg:text-5xl'>
                <p>Book an Appointment</p>
                <p className='mt-3 text-white/95'>With 100+ verified doctors</p>
            </div>
            <button
              onClick={() => { navigate('/login'); scrollTo(0, 0) }}
              className='mt-6 inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-700 shadow-lg shadow-slate-900/15 transition duration-300 hover:-translate-y-0.5'
            >
              Create Account
            </button>
        </div>
        {/* ------ right side ------ */}
        <div className='relative hidden md:block md:w-[240px] lg:w-[370px]'>
            <img className='pointer-events-none absolute bottom-0 right-0 h-[130%] w-auto max-w-none' src={assets.appointment_img} alt="" />
        </div>
    </div>
  )
}

export default Banner
