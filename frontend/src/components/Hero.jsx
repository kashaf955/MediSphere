import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='mt-4 mb-4 flex h-auto flex-col overflow-hidden rounded-lg bg-primary px-5 py-8 sm:px-6 md:h-[calc(100dvh-8.75rem)] md:flex-row md:py-0 md:pl-10 md:pr-0 lg:pl-20'>
        {/* Left Side */}
        <div className='flex flex-col items-center justify-center gap-4 text-center md:w-[42%] md:items-start md:py-8 md:pr-4 md:text-left'>
            <h1 className='font-brand text-3xl font-bold leading-tight text-white md:text-3xl lg:text-4xl'>
                Book Appointment <br className='hidden sm:block' /> With Trusted Doctors
            </h1>
            <div className='flex flex-col items-center gap-3 text-sm font-light text-white md:flex-row'>
                <img className='w-24 sm:w-28' src={assets.group_profiles} alt="" />
                <p className='text-center text-sm font-normal md:text-left'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            </div>
            <Link to="/doctors" className='flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm text-[#595959] transition-all duration-300 hover:scale-105'>
                Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
            </Link>
        </div>
        {/* Right Side */}
        <div className='mt-6 flex w-full items-end justify-center md:mt-0 md:w-[58%] md:justify-end'>
            <img className='h-90 max-h-64 w-full object-contain object-bottom sm:max-h-80 md:mr-4 md:h-full md:max-h-full' src={assets.header_img} alt="" />
        </div>
    </div>
  )
}

export default Hero
