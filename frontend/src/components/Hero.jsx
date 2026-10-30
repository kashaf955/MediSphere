import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative mt-6 mb-4 flex h-auto flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#6d73ff] via-primary to-[#343ad4] px-5 py-8 shadow-[0_28px_60px_-32px_rgba(82,88,248,0.85)] sm:px-6 md:h-[calc(100dvh-8rem)] md:flex-row md:items-center md:py-0 md:pl-10 md:pr-0 lg:pl-20'>
        <div className='pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl'></div>
        {/* Left Side */}
        <div className='relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-3 text-center md:items-start md:py-10 md:pr-8 md:text-left'>
            <h1 className='font-brand text-3xl font-medium leading-[1.15] tracking-tight text-white lg:text-4xl'>
                <span className='block'>Book Appointment</span>
                <span className='block'>With Trusted Doctors</span>
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
        <div className='mt-6 flex h-72 w-full shrink-0 items-end justify-center sm:h-80 md:mt-0 md:h-full md:w-auto md:justify-end'>
            <img className='h-full w-auto max-w-full object-contain object-bottom md:mr-6 md:h-[min(38rem,90%)]' src={assets.header_img} alt="" />
        </div>
    </div>
  )
}

export default Hero
