import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { specialityData } from '../assets/assets';

const Doctors = () => {
  const {speciality} = useParams();
  const {doctors} = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();
  const applyFilter = () => {
    let filtered = doctors;
    if(speciality) {
      filtered = filtered.filter((item) => item.speciality === speciality);
    }
    setFilteredDoctors(filtered);
  };
  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);
  return (
    <div className='flex flex-col gap-4' style={{minHeight: 'calc(100vh - 100px)'}}>
      <div className='flex items-center justify-between'>
      <p>Browse through the doctors with {speciality} speciality</p>
      </div>
      <div className='flex flex-wrap gap-2'>
        {specialityData.map((item) => (
          <button
            key={item.speciality}
            type="button"
            onClick={() => { navigate(`/doctors/${item.speciality}`); scrollTo(0, 0) }}
            className={`cursor-pointer rounded-md border px-4 py-2 text-sm hover:border-primary hover:text-primary ${speciality === item.speciality ? 'border-primary bg-primary/10 text-primary' : ''}`}
          >
            {item.speciality}
          </button>
        ))}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
          filteredDoctors.map((item, index) => (  
              <div onClick={() => navigate(`/appointments/${item._id}`)} className='flex flex-col overflow-hidden rounded-lg border-2 border-gray-200 cursor-pointer' key={index}>
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
          ))
        }
      </div>
    </div>
  )
}

export default Doctors