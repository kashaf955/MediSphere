import React, { useContext } from 'react'
import Hero from '../components/Hero'
import SpecialityMenu from '../components/specialityMenu'
import TopDotors from '../components/TopDotors'
import Banner from '../components/Banner'
import PatientHome from '../components/PatientHome'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const { token } = useContext(AppContext)
  if (token) return <PatientHome />
  return (
    <div>
        <Hero />
        <SpecialityMenu />
        <TopDotors />
        <Banner />
    </div>
  )
}

export default Home