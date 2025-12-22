import React, { useState } from 'react'
import Title from '../../Components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../Context/AppContext'
import { useEffect } from 'react'

const Dashboard = () => {
    const { currency, Token, user, toast, axios } = useAppContext()
    const [dashboardData, setDashboardDataData] = useState({
        bookings: [],
        totalBooking: 0,
        totalRevenue: 0
    })


    const fetchDashboardData = async () => {
        try {
            const token = Token
            console.log(token)
            const { data } = await axios.get('/api/bookings/hotel', { headers: { Authorization: `Bearer ${token}` } })
            console.log("API response:", data)
            if (data.success) {
                setDashboardDataData(data.dashboardData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {


        }
    }

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])



    return (
        <div className=''>
            <Title align='left' font="outfit" title='Dashboard' subtitle=' Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations' />
            <div className='flex gap-4 my-8 '>
                {/* {totalBookings} */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-2 md:p-4 pr-4 md:pr-8'>
                    <img src={assets.totalBookingIcon} alt="total-booking-icon" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-sm md:text-lg '>Total Booking</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBooking}</p>
                    </div>
                </div>
                {/* {totalRevenue} */}
                <div>
                    <div className='bg-primary/3 border border-primary/10 rounded flex p-2 md:p-4 pr-4 md:pr-8'>
                        <img src={assets.totalRevenueIcon} alt="total-booking-icon" className='max-sm:hidden h-10' />
                        <div className='flex flex-col sm:ml-4 font-medium'>
                            <p className='text-blue-500 text-sm md:text-lg'>Total Booking</p>
                            <p className='text-neutral-400 text-base'>{currency} {dashboardData.totalRevenue}</p>
                        </div>
                    </div>

                </div>

            </div>
            {/* {recent bookings} */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Booking</h2>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status </th>

                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {dashboardData.bookings.map((item, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.user.username}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                    {item.room.roomType}
                                </td>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    {currency} {item.totalPrice}
                                </td>
                                <td className='py-3 px-4 border-gray-300 border-t flex'>
                                    <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 text-green-600'
                                        : 'bg-amber-200 text-yellow-600'}`}>
                                        {item.isPaid ? 'completed' : 'pending'}
                                    </button>
                                </td>
                            </tr>

                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default Dashboard