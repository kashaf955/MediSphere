import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative mt-6 mb-4 flex h-auto flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#6d73ff] via-primary to-[#343ad4] px-5 py-8 shadow-[0_28px_60px_-32px_rgba(82,88,248,0.85)] sm:px-6 md:h-[calc(100dvh-8.75rem)] md:flex-row md:py-0 md:pl-10 md:pr-0 lg:pl-20'>
        <div className='pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl'></div>
        {/* Left Side */}
        <div className='relative z-10 flex flex-col items-center justify-center gap-3 text-center md:w-[42%] md:items-start md:py-6 md:pr-4 md:text-left'>
            <h1 className='font-brand text-3xl font-medium leading-tight tracking-tight text-white lg:text-4xl'>
                Book Appointment <br className='hidden sm:block' /> With Trusted Doctors
            </h1>
            <div className='flex flex-col items-center gap-3 text-sm text-white/90 md:flex-row'>
                <img className='w-24 sm:w-28' src={assets.group_profiles} alt="" />
                <p className='text-center text-sm leading-6 md:text-left'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            </div>
            <Link to="/doctors" className='inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-medium text-slate-700 shadow-lg shadow-slate-900/15 transition duration-300 hover:-translate-y-0.5'>
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
