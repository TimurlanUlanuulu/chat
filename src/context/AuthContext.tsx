import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import {auth} from "../firebase"


interface AuthValue{
    currentUser?: any
}

export const AuthContext = createContext<AuthValue>({});


interface AuthProps{
    children: any
}

export const AuthContextProvider: React.FC<AuthProps> = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})



    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user!);
            console.log("Asd", user);
        });

        return () => {
            unsub();
        }

    }, []);

    return (
    <AuthContext.Provider value={{currentUser}}>
        {children}
    </AuthContext.Provider>

    )

};