import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='pt-12 text-center text-2xl tracking-[0.18em] text-slate-400'>
        <p>CONTACT <span className='text-slate-800'>US</span></p>
      </div>
      <div className='my-10 mb-28 flex flex-col justify-center gap-12 text-sm md:flex-row'>
        <img className='w-full rounded-3xl object-cover shadow-[0_24px_50px_-30px_rgba(26,29,46,0.55)] md:max-w-[360px]' src={assets.contact_image} alt='Contact MediSphere' />
        <div className='flex flex-col items-start justify-center gap-6'>
          <p className='text-xs font-medium tracking-[0.18em] text-slate-400'>OUR OFFICE</p>
          <p className='leading-7 text-slate-600'>123 Main St<br />Anytown, USA</p>
          <p className='leading-7 text-slate-600'>Tel: +1234567890<br />Email: info@doctorapp.com</p>
          <p className='text-xs font-medium tracking-[0.18em] text-slate-400'>CAREERS AT MEDISPHERE</p>
          <p className='text-slate-500'>Learn more about our teams and job openings.</p>
          <button type='button' className='rounded-full border border-slate-900 px-8 py-3 text-sm tracking-wide text-slate-900 transition duration-300 hover:bg-slate-900 hover:text-white'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
