import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
const TopDotors = () => {

    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16 md:mx:10'>
         <h1 className='font-brand text-2xl font-bold leading-tight text-gray-800'>Top Doctors To Book Appointment</h1>
         <p className='text-sm font-normal text-gray-800'>Browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>  
         <div className='w-full grid grid-cols-auto md:grid-cols-2 lg:grid-cols-5 gap-8 mt-8 px-4 sm:px-0'>
            {doctors.slice(0, 10).map((item, index) => (
                <div onClick={() =>navigate(`/appointment/${item._id}`)} className='flex flex-col overflow-hidden rounded-lg border-2 border-gray-200' key={index}>
                    <img src={item.image} alt={item.name} className='w-full bg-blue-50 object-cover' />
                    <div className='flex flex-col gap-1 px-4 py-3'>
                        <div className='flex items-center gap-2 text-sm text-green-500'>
                            <span className='h-2 w-2 rounded-full bg-green-500'></span>
                            <p>Available</p>
                        </div>
                        <p className='font-bold text-base text-gray-900'>{item.name}</p>
                        <p className='text-sm text-gray-600'>{item.speciality}</p>
                    </div>
                </div>
            ))}
         </div>
         <button onClick={() =>{ navigate('/doctors'); scrollTo(0, 0)}} className='flex items-center gap-2 rounded-full bg-blue-50 px-8 py-3 text-sm text-[#595959] transition-all duration-300 hover:scale-105'>View All Doctors</button>
    </div>
  )
}

export default TopDotors