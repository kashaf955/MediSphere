import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
const TopDotors = () => {

    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16'>
         <h1 className='font-brand text-3xl tracking-tight text-slate-900'>Top Doctors to Book</h1>
         <p className='max-w-md text-center text-sm leading-6 text-slate-500'>Browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
         <div className='mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
            {doctors.slice(0, 10).map((item) => (
                <div onClick={() => { navigate(`/appointments/${item._id}`); scrollTo(0, 0) }} className='group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-28px_rgba(26,29,46,0.55)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-24px_rgba(82,88,248,0.55)]' key={item._id}>
                    <img src={item.image} alt={item.name} className='w-full bg-[#eef1ff] object-cover transition duration-500 group-hover:scale-[1.03]' />
                    <div className='flex flex-col gap-1 px-4 py-4'>
                        <div className='flex items-center gap-2 text-xs font-medium text-emerald-600'>
                            <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                            <p>Available</p>
                        </div>
                        <p className='text-base font-medium text-slate-900'>{item.name}</p>
                        <p className='text-sm text-slate-500'>{item.speciality}</p>
                    </div>
                </div>
            ))}
         </div>
         <button onClick={() =>{ navigate('/doctors'); scrollTo(0, 0)}} className='mt-4 rounded-full bg-white px-8 py-3 text-sm text-slate-600 shadow-[0_10px_30px_-18px_rgba(26,29,46,0.45)] ring-1 ring-slate-200 transition duration-300 hover:-translate-y-0.5 hover:text-primary'>View all doctors</button>
    </div>
  )
}

export default TopDotors