import React, { useContext, useState } from "react";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext<any>(AuthContext);
  const { dispatch } = useContext<any>(ChatContext);

  const handleSearch = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", username));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e: any) => {
    if ((e.key = "Enter")) {
      handleSearch();
    }
  };

  const handleSelect = async (u: any) => {
    const combinedId =
      currentUser.uid > user!.uid
        ? currentUser.uid + user!.uid
        : user!.uid + currentUser.uid;
    console.log(combinedId);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user!.uid,
            displayName: user!.displayName,
            photoURL: user!.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user!.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      dispatch({ type: "CHANGE_USER", payload: u });
      setUser(null);
      setUsername("");
    } catch (error) {
      setErr(true);
      console.log(error);
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-form">
        <input
          type="text"
          placeholder="Find user"
          onKeyDown={handleKey}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className="user-chat" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="user-chat-info">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
