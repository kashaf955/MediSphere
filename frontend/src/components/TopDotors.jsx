import React from 'react'
import { doctors } from '../assets/assets'
const TopDotors = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16 md:mx:10'>
         <h1 className='font-brand text-2xl font-bold leading-tight text-gray-800'>Top Doctors To Book Appointment</h1>
         <p className='text-sm font-normal text-gray-800'>Browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>  
         <div className='w-full grid grid-cols-auto md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-4 sm:px-0'>
            {doctors.slice(0, 10).map((item, index) => (
                <div className='flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-gray-200 p-4' key={index}>
                    <img src={item.image} alt={item.name} className=' bg-blue-50 w-full h-full object-cover' />
                    <div className='p-4'>
                        <div className='flex items-center justify-between'>
                            <p className='flex items-center gap-2'>
                                <span className='w-2 h-2 rounded-full bg-green-500'></span>
                                <p>Avaiable</p>
                            </p>
                        </div>
                        <p>{item.name}</p>
                        <p>{item.speciality}</p>
                    </div>
                </div>
            ))}
         </div>
         <button className='flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm text-[#595959] transition-all duration-300 hover:scale-105'>View All Doctors</button>
    </div>
  )
}

export default TopDotors