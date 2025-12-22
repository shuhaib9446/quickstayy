import React from 'react'
import Hero from '../Components/Hero'
import Fdestination from '../Components/Fdestination'
import ExclusiveOffers from '../Components/ExclusiveOffers'
import Testimonial from '../Components/Testimonial'
import NewsLetter from '../Components/NewsLetter'
import Footer from '../Components/Footer'
import RecommendedHotels from '../Components/RecommendedHotels'

const Home = () => {
  return (
    <>
        <Hero/>
        <RecommendedHotels/> 
        <Fdestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <NewsLetter/>
        
    </>
  )
}

export default Home