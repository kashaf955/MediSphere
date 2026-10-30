import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const specialityMenu = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16'>
        <h1 className='font-brand text-3xl tracking-tight text-slate-900'>Find by Speciality</h1>
        <p className='max-w-md text-center text-sm leading-6 text-slate-500'>Browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        <div className='mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6'>
            {specialityData.map((item, index) => (
                <Link to={`/doctors/${item.speciality}`} key={index} onClick={() => scrollTo(0, 0)} className='group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <img src={item.image} alt={item.speciality} className='h-24 w-24 object-cover drop-shadow-[0_12px_18px_rgba(82,88,248,0.28)] transition duration-300 group-hover:-translate-y-1' />
                        <h4 className='text-center text-sm text-slate-700 transition group-hover:text-primary'>{item.speciality}</h4>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default specialityMenu