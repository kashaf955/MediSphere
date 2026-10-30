import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='pt-12 text-center text-2xl tracking-[0.18em] text-slate-400'>
        <p>ABOUT <span className='text-slate-800'>US</span></p>
      </div>
      <div className='my-10 flex flex-col gap-12 md:flex-row'>
        <img className='w-full rounded-3xl object-cover shadow-[0_24px_50px_-30px_rgba(26,29,46,0.55)] md:max-w-[360px]' src={assets.about_image} alt='About MediSphere' />
        <div className='flex flex-col justify-center gap-6 text-sm leading-7 text-slate-600 md:w-2/4'>
          <p>Welcome to MediSphere, your trusted partner in managing your healthcare needs conveniently and efficiently. At MediSphere, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>MediSphere is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you are booking your first appointment or managing ongoing care, MediSphere is here to support you every step of the way.</p>
          <b className='tracking-wide text-slate-900'>Our Vision</b>
          <p>Our vision at MediSphere is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>
      <div className='my-4 text-xl tracking-[0.14em] text-slate-400'>
        <p>WHY <span className='text-slate-800'>CHOOSE US</span></p>
      </div>
      <div className='mb-20 flex flex-col overflow-hidden rounded-3xl shadow-[0_20px_50px_-36px_rgba(26,29,46,0.6)] md:flex-row'>
        <div className='flex flex-1 cursor-pointer flex-col gap-5 border border-slate-200 bg-white px-10 py-10 text-[15px] leading-7 text-slate-600 transition duration-300 hover:border-primary hover:bg-primary hover:text-white sm:py-16 md:px-12'>
          <b className='tracking-wide'>EFFICIENCY</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='flex flex-1 cursor-pointer flex-col gap-5 border border-slate-200 bg-white px-10 py-10 text-[15px] leading-7 text-slate-600 transition duration-300 hover:border-primary hover:bg-primary hover:text-white sm:py-16 md:px-12'>
          <b className='tracking-wide'>CONVENIENCE</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='flex flex-1 cursor-pointer flex-col gap-5 border border-slate-200 bg-white px-10 py-10 text-[15px] leading-7 text-slate-600 transition duration-300 hover:border-primary hover:bg-primary hover:text-white sm:py-16 md:px-12'>
          <b className='tracking-wide'>PERSONALIZATION</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
