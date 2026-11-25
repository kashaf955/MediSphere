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
import Navbar from './components/Navbar'
import Footer from './components/Footer'
const App = () => {
  const location = useLocation()
  const isDoctorPanel = location.pathname.startsWith('/doctor')
  return (
    <div className={isDoctorPanel ? '' : 'mx-4 sm:mx-[10%]'}>
      {!isDoctorPanel && <Navbar />}
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
    </Routes>
    {!isDoctorPanel && <Footer />}
    </div>
  )
}

export default App