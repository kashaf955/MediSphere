import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import myProfile from './pages/myProfile'
import myAppointments from './pages/myAppointments' 
import Appointments from './pages/Appointments'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-profile" element={<myProfile />} />
      <Route path="/my-appointments" element={<myAppointments />} />
      <Route path="/appointments/:docId" element={<Appointments />} />
    </Routes>
    </div>
  )
}

export default App