import React from 'react'
import Hero from '../components/Hero'
import SpecialityMenu from '../components/specialityMenu'
import TopDotors from '../components/TopDotors'
import SuggestedDoctors from '../components/SuggestedDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
        <Hero />
        <SpecialityMenu />
        <SuggestedDoctors />
        <TopDotors />
        <Banner />
    </div>
  )
}

export default Home