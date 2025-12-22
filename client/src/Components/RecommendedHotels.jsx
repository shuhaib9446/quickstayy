import React from 'react'
import HotelCard from './Hotelcard.jsx'
import Title from './Title'
import { useAppContext } from '../Context/AppContext'
import { useState,useEffect } from 'react'

const RecommendedHotels = () => {
    const {rooms, searchedCities } = useAppContext()
    const [recommended, setRecommended] = useState([])

 const filterHotels = () => {
  // If no city searched → show all hotels
  if (!Array.isArray(searchedCities) || searchedCities.length === 0) {
    setRecommended(rooms)
    return
  }

  const filteredHotels = rooms.filter(room =>
    searchedCities.includes(room.hotel.city)
  )

  setRecommended(filteredHotels)
}
    useEffect(() => {
        filterHotels()
    }, [rooms, searchedCities])


    return recommended.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title='Recommended Hotels' subtitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.' />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
          
        </div>
    )
}

export default RecommendedHotels