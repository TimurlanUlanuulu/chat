import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

interface MessageProps {
    message: any
}

const Message: React.FC<MessageProps> = ({message}) => {
    const {currentUser} = useContext<any>(AuthContext)
    const {data} = useContext<any>(ChatContext)

    const ref = useRef<any>();

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: "smooth"})
    },[message])
    
    return (
        <div ref={ref} className={`message-wrapper ${message.senderId === currentUser.uid ? "owner" : ""}`}>
            <div className="message-info">
                <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
                <span>just now</span>
            </div>
            <div className="message-content">
                <p>{message.text}</p>
            {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
};

export default Message;