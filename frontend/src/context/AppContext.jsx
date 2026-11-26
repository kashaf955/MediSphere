import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AppContext = createContext();

const normalizeDoctor = (doctor) => ({
    ...doctor,
    speciality: doctor.specialization || doctor.speciality,
    experience: typeof doctor.experience === "number" ? `${doctor.experience} Years` : doctor.experience,
    address: typeof doctor.address === "string" ? { line1: doctor.address, line2: "" } : (doctor.address || { line1: "", line2: "" }),
})

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
    const [doctors, setDoctors] = useState([])
    const [doctorsLoaded, setDoctorsLoaded] = useState(false)
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "")
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "")
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [user, setUser] = useState(null)

    const loadDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
            if (data.success) setDoctors(data.doctors.map(normalizeDoctor))
        } catch (error) {
            console.log(error)
        } finally {
            setDoctorsLoaded(true)
        }
    }

    const loadUser = async (activeToken) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token: activeToken } })
            if (data.success) setUser(data.user)
        } catch (error) {
            localStorage.removeItem("token")
            setToken("")
            setUser(null)
        }
    }

    useEffect(() => {
        loadDoctors()
    }, [])

    useEffect(() => {
        if (token) loadUser(token)
        else setUser(null)
    }, [token])

    const value = {
        doctors,
        doctorsLoaded,
        loadDoctors,
        backendUrl,
        dToken,
        setDToken,
        aToken,
        setAToken,
        token,
        setToken,
        user,
        setUser,
        loadUser,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
