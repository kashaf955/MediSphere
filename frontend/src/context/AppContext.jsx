import { createContext, useState } from "react";
import { doctors } from "../assets/assets";
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')

    const value = {
        doctors,
        backendUrl,
        dToken,
        setDToken,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
