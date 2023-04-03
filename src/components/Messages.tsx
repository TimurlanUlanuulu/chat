import React, { useContext, useEffect, useState } from 'react';
import Message from "./Message"
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import {db} from "../firebase"

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<any>([])
    const {data} = useContext<any>(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => {
            unSub()
        }
    }, [data.chatId])

    return (
        <div className='messages-wrapper'>
            {messages.map((mess: any) => (
                <Message message={mess} key={mess.uid} />
            ))}            
        </div>
    );
};

export default Messages;