import React, { useContext, useState } from 'react';
import Clip from '../img/clip.svg'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {db, storage} from "../firebase"
import {v4 as uuid} from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import firebase from "firebase/compat/app"

const ChatInput = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState<File | null>(null);

    const [progressUpload, setProgressUpload] = useState(0);

    const {currentUser} = useContext<any>(AuthContext)
    const {data} = useContext<any>(ChatContext)
    console.log(data);

    const handleSelectedFile = (files: any) => {
        if (files && files[0].size < 10000000) {
          setImg(files[0])
    
          console.log(files[0])
        } else {
        //   message.error('File size to large')
        }
      }


    const handleSend = async() => {
        if(img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          
                    setProgressUpload(progress) // to show progress upload
          
                    switch (snapshot.state) {
                      case 'paused':
                        console.log('Upload is paused')
                        break
                      case 'running':
                        console.log('Upload is running')
                        break
                    }
                  },
                (error: Error) => {
                  console.log(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "chats", data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            img: downloadURL,
                        })
                    })
                  });
                }
              );

        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        })

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        })

        setText("")
        setImg(null)
        
    }

    return (
        <div className='chat-input-wrapper'>
            <input type="text" placeholder='Type comething...' onChange={e => setText(e.target.value)} value={text} />
            <div className="send">
                <input type="file" id='file' style={{display: "none"}} onChange={e => handleSelectedFile(e.target.files) } />
                <label htmlFor="file">
                    <img src={Clip} alt="" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatInput;