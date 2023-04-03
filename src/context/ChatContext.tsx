import { onAuthStateChanged } from 'firebase/auth';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { createContext } from 'react';
import {auth} from "../firebase"
import { AuthContext } from './AuthContext';

interface ChatValue{
    data: any,
    dispatch: any
}

export const ChatContext = createContext<ChatValue>({data: "", dispatch: ""});

interface ChatProps{
    children: any
}

export const ChatContextProvider: React.FC<ChatProps> = ({children}) => {
    const {currentUser} = useContext(AuthContext);
    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    }

    const chatReducer = (state: typeof INITIAL_STATE, action: any) => {
        switch(action.type){
            case "CHANGE_USER": 
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid
                    ? currentUser.uid + action.payload.uid
                    : action.payload.uid + currentUser.uid
                };
            default:
                return state;
        }

    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
    

    return (
    <ChatContext.Provider value={{data: state, dispatch}}>
        {children}
    </ChatContext.Provider>

    )

};