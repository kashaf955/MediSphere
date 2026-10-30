import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='mt-20'>
        <div className='grid gap-10 border-t border-slate-200 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16'>
            <div>
                <img src={assets.logo} alt="medisphere" className='mb-5 h-14 w-36' />
                <p className='max-w-md text-sm leading-7 text-slate-500'>Your trusted partner in healthcare. We are here to help you find the best doctors and book appointments.</p>
            </div>
            <div>
                <p className='mb-4 text-xs font-medium tracking-[0.18em] text-slate-400'>QUICK LINKS</p>
                <ul className='flex flex-col gap-2.5 text-sm text-slate-600'>
                    <li><Link to='/' className='transition hover:text-primary'>Home</Link></li>
                    <li><Link to='/about' className='transition hover:text-primary'>About Us</Link></li>
                    <li><Link to='/contact' className='transition hover:text-primary'>Contact Us</Link></li>
                    <li className='text-slate-400'>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='mb-4 text-xs font-medium tracking-[0.18em] text-slate-400'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2.5 text-sm leading-6 text-slate-600'>
                    <li>info@doctorapp.com</li>
                    <li>+1234567890</li>
                    <li>123 Main St, Anytown, USA</li>
                </ul>
            </div>
        </div>
        <div className='border-t border-slate-200 py-5'>
             <p className='text-center text-xs tracking-wide text-slate-400'>Copyright © 2026 MediSphere. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer
