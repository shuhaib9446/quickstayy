import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext()
export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$"
    const navigate = useNavigate()
    const { user } = useUser()
    const auth = useAuth();
    const Token = auth.getToken();


    const [showHotelReg, setShowHotelReg] = useState(false)
    const [isOwner, setIsOwner] = useState(true)
    const [searchedCities, setSearchedCities] = useState([])
    const [rooms, setRooms] = useState([])


    const fetchRooms=async()=>{
        try {
            const {data}=await axios.get('/api/rooms')
            if(data.success){
                setRooms(data.rooms)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }



    const fetchUser = async () => {
        try {
            //  const getToken = await getToken(); // make sure this resolves to a string
            if (!Token) {
                throw new Error("No token available");
            }


            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${Token}` },
 })
            if (data.success) {
                setIsOwner(data.role === 'hotelOwner')
                setSearchedCities(data.recentSearchedCities)

            } else {
                //retry fetching user details after 5 seconds
                setTimeout(() => {
                    fetchUser()
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUser()
        }
    }, [user])


      useEffect(() => {
         fetchRooms()
    }, [])

    const value = {
        currency, navigate, user,Token, isOwner, setIsOwner, showHotelReg, setShowHotelReg, axios, searchedCities,rooms,setRooms

    }
    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)

