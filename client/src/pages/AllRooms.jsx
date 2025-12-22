import React, { useMemo, useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useSearchParams } from 'react-router-dom'
import StarRating from '../Components/StarRating'
import { useAppContext } from '../Context/AppContext'


const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex gap-3 items-center  cursor-pointer mt-2 text-sm'>
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const CheckBox2 = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex gap-3 items-center  cursor-pointer mt-2 text-sm'>
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className='flex gap-3 items-center  cursor-pointer mt-2 text-sm'>
            <input type="radio" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const AllRooms = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { rooms, navigate, currency } = useAppContext()
    const [openFilter, setOpenFilter] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
    })
    const [selectedSortBy, setSelectedSortBy] = useState('')


    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite"
    ]
    const priceRange = [
        " 0 to 500",
        " 500 to 1000",
        " 1000 to 2000",
        " 2000 to 3000"
    ]
    const sortBy = [
        "Price Low to High",
        "Price High to Low",
        "Newest First"

    ]

    //Handle changes for filters and sorting
    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilter = { ...prevFilters }
            if (checked) {
                updatedFilter[type].push(value)
            } else {
                updatedFilter[type] = updatedFilter[type].filter(item => item !== value)
            }
            return updatedFilter
        })
    }

    const handleSortChange = (sortOption) => {
        setSelectedSortBy(sortOption)
    }


    //function to check if a room matches the selected room types
    const matchRoomType = (room) => {
        return  selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes (room.RoomType)
    }

    //function to check if a room matches the selected  price ranges
    const matchesPriceRange = (room) => {
        return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
            const [min, max] = range.split('to').map(Number)
            return room.PricePerNight >= min && room.PricePerNight <= max
        })
    }

    //function to check if a room matches the selected sort option
    const sortRooms = (a, b) => {
        console.log("sorting", selectedSortBy)
        if (selectedSortBy === 'Price Low to High') {
            return a.PricePerNight - b.PricePerNight
        }

        if (selectedSortBy === "Price High to Low") {
            return b.PricePerNight - a.PricePerNight
        }
        if (selectedSortBy === "Newest First") {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return 0
    }
 
    //Filter Destination
    const filterDestination = (room) => {
        const destination = searchParams.get('destination')
        if (!destination) return true
        return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
    }

    //filter and sort rooms based on the  selected filters and sort option
    const filteredRooms = useMemo(() => {
        return rooms.filter(room => matchRoomType(room) && matchesPriceRange(room) && filterDestination(room)).sort(sortRooms)
    }, [rooms, selectedFilters, selectedSortBy, searchParams])
    // clear all rooms
    const clearFilters = () => {
        setSelectedFilters({
            roomType: [], 
            priceRange: [],
        })
        setSelectedSortBy('')
        setSearchParams({})
    }


return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 '>

        <div className=''>
            <div className='flex flex-col  text-left'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories</p>
            </div>
            {filteredRooms.map((room, i) => (
                <div key={i} className='flex flex-col md:flex-row items-start py-10 gap-8 border-b border-gray-300 last:pb-30 last:border-0'>
                    <img onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}
                        src={room.images[0]} alt="hotel-img" title='View Room Details'
                        className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                    <div className='md:w-1/2 flex flex-col gap-2'>
                        <p className='text-gray-500'>{room.hotel.city}</p>
                        <p className='text-gray-800 text-3xl font-playfair cursor-pointer' onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }}>{room.hotel.name}</p>
                        <div className='flex items-center'>
                            <StarRating />
                            <p className='ml-2'>200+ Reviews</p>
                        </div>
                        <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                            <img src={assets.locationIcon} alt="location-icon" />
                            <span>{room.hotel.address}</span>
                        </div>
                        <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                            {room.Amenities.map((item, index) =>
                                <div key={index} className='flex items-center  gap-2 px-2 py-2  rounded-lg bg-[#F5F5FF]/70' >
                                    <img src={facilityIcons[item]} alt={item} className='w-6 h-6' />
                                    <p className='text-xs'>{item}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className='text-xl font-medium text-gray-700'>${room.PricePerNight}/ Night</p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
        {/* {filter} */}
        <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>

            <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilter && "border-b"}`}>
                <p className='text-base font-medium text-gray-800 '>FILTERS</p>
                <div className='text-xs cursor-pointer'>
                    <span onClick={() => setOpenFilter(!openFilter)} className='lg:hidden'>{openFilter ? "Hide" : "show"}</span>
                    <span className='hidden lg:block'>CLEAR</span>
                </div>
            </div>
            <div className={`${openFilter ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                <div className='px-3 py-3'>
                    <p className='font-medium text-gray-800'>Popular filter</p>
                    {roomTypes.map((room, index) => (

                        <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)}
                         onChange={(checked)=>handleFilterChange(checked,room,'roomType')}/>
                    ))}
                </div>
                <div className='px-3 py-3'>
                    <p className='font-medium text-gray-800'>Price Range</p>
                    {priceRange.map((range, index) => (

                        <CheckBox2 key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)}
                         onChange={(checked)=>handleFilterChange(checked,range,'priceRange')}/>
                    ))}
                </div>

                <div className='px-3 py-3'>
                    <p className='font-medium text-gray-800'>Sort By</p>
                    {sortBy.map((room, index) => (

                        <RadioButton key={index} label={room} selected={selectedSortBy===room} onChange={()=>handleSortChange(room)}/>
                    ))}
                </div>
            </div>

        </div>
    </div>
)
}


export default AllRooms