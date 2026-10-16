import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='mt-16'>
        <div className='grid gap-10 border-t border-gray-200 py-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16'>
            {/* ------ top section ------ */}
            <div>
                <img src={assets.logo} alt="medisphere" className='mb-4 h-14 w-36' />
                <p className='max-w-md text-sm leading-6 text-gray-600'>Your trusted partner in healthcare. We are here to help you find the best doctors and book appointments.</p>
            </div>
            {/* ------ middle section ------ */}
            <div>
                <p className='font-brand mb-4 text-lg text-gray-900'>Quick Links</p>
                <ul className='flex flex-col gap-2 text-sm text-gray-600'>
                    <li><Link to='/' className='hover:text-primary'>Home</Link></li>
                    <li><Link to='/about' className='hover:text-primary'>About Us</Link></li>
                    <li><Link to='/contact' className='hover:text-primary'>Contact Us</Link></li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/* ------ bottom section ------ */}
            <div>
                <p className='font-brand mb-4 text-lg text-gray-900'>Get In Touch</p>
                <ul className='flex flex-col gap-2 text-sm text-gray-600'>
                    <li>Email: info@doctorapp.com</li>
                    <li>Phone: +1234567890</li>
                    <li>Address: 123 Main St, Anytown, USA</li>
                </ul>
            </div>
        </div>
        {/* ------ copyright section ------ */}
        <div className='border-t border-gray-200 py-5'>
             <p className='text-center text-sm text-gray-500'>Copyright © 2026 DoctorApp. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer
