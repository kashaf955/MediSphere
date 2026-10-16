import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className='relative mb-16 mt-28 flex rounded-lg bg-primary px-6 sm:px-10 md:px-14 lg:px-12'>
        {/* ------ left side ------ */}
        <div className='relative z-10 flex-1 py-6 sm:py-8 md:pr-6 lg:py-10 lg:pl-5'>
            <div className='font-brand text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-5xl'>
                <p>Book an Appointment</p>
                <p className='mt-3'>With 100+ verified doctors</p>
            </div>
            <button
              onClick={() => { navigate('/login'); scrollTo(0, 0) }}
              className='mt-6 inline-flex items-center rounded-full bg-white px-8 py-3 text-sm text-[#595959] transition-all duration-300 hover:scale-105'
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
