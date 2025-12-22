import React, { useState } from 'react'
import Title from '../../Components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'
import { Form } from 'react-router-dom'

const AddRooms = () => {

  const { axios, Token } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,

  })
  const [input, setInput] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free wifi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    //check if all inputs are filled
    if (!input.roomType || !input.pricePerNight || input.amenities.length === 0) {

      toast.error("please fill in all the details")
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('roomType', input.roomType)
      formData.append('pricePerNight', input.pricePerNight)
      // converting amenities to array & keeping only enabled amenities
      const amenities = Object.keys(input.amenities).filter(key => input.amenities[key])
      formData.append('amenities', JSON.stringify(amenities))

      //adding images to formData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append('images', images[key])
      })
      const token = await Token; // resolves to a string
      console.log("token:",Token)
      const { data } = await axios.post('/api/rooms/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (data.success) {
        toast.success(data.message)
        setInput({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
            'Free Wifi': false,
          }
        })


        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        })

      } else {
        toast.error(data.message)
      }
    }
    catch (error) {
      toast.error(error.message)

    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={onSubmitHandler}>
      <Title align='left' font='outfit' title='Add Room' subtitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.' />
      {/* {updating are for images} */}
      <p className='text-gray-800 mt-10'>Images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 '>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" className='max-h-14 cursor-pointer opacity-80' />
            <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
          </label>
        ))}
      </div>
      <div className='w-full flex  max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Types</p>
          <select value={input.roomType} onChange={e => setInput({ ...input, roomType: e.target.value })}
            className='border border-gray-300 mt-1 opacity-70 rounded p-2 w-full'>
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Price <span>/night</span>
          </p>
          <input type='number' placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={input.pricePerNight}
            onChange={e => setInput({ ...input, pricePerNight: e.target.value })} />
        </div>
      </div>
      <div >
        <p className='mt-4 text-gray-800'>
          Amenities
        </p>
        <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
          {Object.keys(input.amenities).map((amenity, index) => (
            <div key={index}>
              <input type="checkbox" id={`amenities${index + 1}`} checked={input.amenities[amenity]} onChange={() => setInput({
                ...input, amenities:
                  { ...input.amenities, [amenity]: !input.amenities[amenity] }
              })} />
              <label htmlFor={`amenities${index + 1}`} className='px-3'>{amenity}</label>
            </div>
          ))}
        </div>
      </div>

      <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer ' disabled={loading} >
        Add Room
      </button>
    </form>
  )
}

export default AddRooms