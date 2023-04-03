import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats: React.FC = () => {
  const [chats, setChats] = useState<any>([]);
  const { currentUser } = useContext<any>(AuthContext);
  const {dispatch} = useContext<any>(ChatContext)

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  chats && console.log(Object.entries(chats));

  const handleSelect = (user: any) => {
    dispatch({type: "CHANGE_USER", payload: user} )
  }

  return (
    <div className="chats-wrapper">
      {chats && Object.entries(chats)?.sort((a: any,b: any) => b[1].date - a[1].date).map((chat: any) => (
        <div className="user-chat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img
            src={chat[1].userInfo?.photoURL}
            alt=""
          />
          <div className="user-chat-info">
            <span>{chat[1].userInfo?.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
