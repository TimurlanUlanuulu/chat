import React, { useContext } from 'react';
import More from '../img/more.svg';
import Video from '../img/video.svg';
import AddFriend from '../img/add-friend.svg';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
    const {data} = useContext<any>(ChatContext)
    return (
        <div className='chat-wrapper'>
            <div className="chat-info">
                <span>{data.user?.displayName}</span>
                <div className="chat-icons">
                    <img src={Video} alt="" />
                    <img src={AddFriend} alt="" />
                    <img src={More} alt="" />
                </div>
            </div>
            <Messages/>
            <ChatInput/>
        </div>
    );
};

export default Chat;