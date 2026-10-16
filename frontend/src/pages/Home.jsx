import React from 'react'
import Hero from '../components/Hero'
import SpecialityMenu from '../components/specialityMenu'
import TopDotors from '../components/TopDotors'
import Banner from '../components/Banner'

const Home = () => {
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