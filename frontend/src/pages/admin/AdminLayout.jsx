import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/appointments', label: 'Appointments' },
  { to: '/admin/add-doctor', label: 'Add doctor' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
]

const AdminLayout = ({ children }) => {
  const { setAToken } = useContext(AppContext)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('aToken')
    setAToken('')
    navigate('/admin')
  }

  return (
    <div className='min-h-screen bg-[#f4f6fb] md:flex'>
      <aside className='border-b border-slate-200/80 bg-white md:min-h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0'>
        <div className='flex items-center justify-between px-5 py-5'>
          <img src={assets.logo} alt='MediSphere' className='h-12 w-32 cursor-pointer' onClick={() => navigate('/admin/dashboard')} />
        </div>
        <nav className='flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:px-3'>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `rounded-2xl px-4 py-2.5 text-sm whitespace-nowrap transition ${isActive ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
            >
              {label}
            </NavLink>
          ))}
          <button type='button' onClick={logout} className='rounded-2xl px-4 py-2.5 text-left text-sm whitespace-nowrap text-slate-600 transition hover:bg-slate-50 hover:text-primary'>
            Logout
          </button>
        </nav>
      </aside>
      <main className='flex-1 p-4 sm:p-8'>{children}</main>
    </div>
  )
}

export default AdminLayout
