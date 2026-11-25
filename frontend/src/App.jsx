import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import MyProfile from './pages/myProfile'
import MyAppointments from './pages/myAppointments' 
import Appointments from './pages/Appointments'
import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAppointments from './pages/admin/AdminAppointments'
import AddDoctor from './pages/admin/AddDoctor'
import AdminDoctors from './pages/admin/AdminDoctors'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
const App = () => {
  const location = useLocation()
  const isPanel = location.pathname.startsWith('/doctor') || location.pathname.startsWith('/admin')
  return (
    <div className={isPanel ? '' : 'mx-4 sm:mx-[10%]'}>
      {!isPanel && <Navbar />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:speciality" element={<Doctors />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/appointments/:docId" element={<Appointments />} />
      <Route path="/doctor" element={<DoctorLogin />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/add-doctor" element={<AddDoctor />} />
      <Route path="/admin/doctors" element={<AdminDoctors />} />
    </Routes>
    {!isPanel && <Footer />}
    </div>
  )
}

export default App