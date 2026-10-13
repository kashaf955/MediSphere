import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const specialityMenu = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16'>
        <h1 className='font-brand text-2xl font-bold leading-tight text-primary'>Find By Speciality</h1>
        <p className='text-sm font-normal text-gray-800'>Browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-9 mt-8'>
            {specialityData.map((item, index) => (
                <Link to={`/doctors/${item.speciality}`} key={index}>
                    <div key={item.id} className='flex flex-col items-center justify-center gap-3'>
                        <img src={item.image} alt={item.name} className='w-25 h-25 object-cover' />
                        <h4 className='font-brand text-base font-bold leading-tight text-primary'>{item.speciality}</h4>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default specialityMenu